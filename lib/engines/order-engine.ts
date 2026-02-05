import { PrismaClient, OrderStatus, Order, OrderItem, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Order Engine - Manages order lifecycle and state transitions
 * Implements the BFNG order state machine
 */

export type OrderWithDetails = Order & {
  items: OrderItem[];
  customer: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  address: {
    street: string;
    area: string;
    city: string;
    region: string;
  };
};

/**
 * Valid state transitions for the order state machine
 */
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  RECEIVED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['AWAITING_PAYMENT', 'PAID', 'CANCELLED'],
  AWAITING_PAYMENT: ['PAID', 'FAILED', 'CANCELLED'],
  PAID: ['IN_SOURCING', 'REFUNDED', 'CANCELLED'],
  IN_SOURCING: ['SUBSTITUTION_REQUIRED', 'READY_FOR_PACKING', 'FAILED'],
  SUBSTITUTION_REQUIRED: ['IN_SOURCING', 'READY_FOR_PACKING', 'CANCELLED'],
  READY_FOR_PACKING: ['PACKED', 'FAILED'],
  PACKED: ['OUT_FOR_DELIVERY', 'FAILED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED'],
  DELIVERED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
  FAILED: ['REFUNDED'],
  REFUNDED: [],
};

export class OrderEngine {
  /**
   * Create a new order
   */
  static async createOrder(data: {
    customerId: string;
    addressId: string;
    items: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
    }>;
    deliveryFee?: number;
    discount?: number;
    customerNotes?: string;
    subscriptionId?: string;
  }): Promise<Order> {
    // Calculate totals
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const deliveryFee = data.deliveryFee || 0;
    const discount = data.discount || 0;
    const total = subtotal + deliveryFee - discount;

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Get current week number
    const now = new Date();
    const weekNumber = this.getWeekNumber(now);
    const buyingCycleDate = this.getNextBuyingCycleDate(now);

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: data.customerId,
        addressId: data.addressId,
        status: 'RECEIVED',
        subtotal,
        deliveryFee,
        discount,
        total,
        weekNumber,
        buyingCycleDate,
        customerNotes: data.customerNotes,
        subscriptionId: data.subscriptionId,
        isSubscriptionOrder: !!data.subscriptionId,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Log audit
    await this.logAudit('ORDER_CREATED', order.id, { orderNumber });

    return order;
  }

  /**
   * Transition order to a new status
   */
  static async transitionStatus(
    orderId: string,
    newStatus: OrderStatus,
    metadata?: Record<string, any>
  ): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Validate transition
    if (!this.canTransition(order.status, newStatus)) {
      throw new Error(
        `Invalid transition from ${order.status} to ${newStatus}`
      );
    }

    // Prepare update data
    const updateData: Prisma.OrderUpdateInput = {
      status: newStatus,
    };

    // Set timestamps based on status
    const now = new Date();
    switch (newStatus) {
      case 'CONFIRMED':
        updateData.confirmedAt = now;
        break;
      case 'PAID':
        updateData.paidAt = now;
        break;
      case 'PACKED':
        updateData.packedAt = now;
        break;
      case 'DELIVERED':
        updateData.deliveredAt = now;
        break;
      case 'COMPLETED':
        updateData.completedAt = now;
        break;
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    // Log transition
    await this.logAudit('STATUS_TRANSITION', orderId, {
      from: order.status,
      to: newStatus,
      ...metadata,
    });

    // Trigger side effects
    await this.handleStatusSideEffects(updatedOrder, metadata);

    return updatedOrder;
  }

  /**
   * Confirm an order
   */
  static async confirmOrder(orderId: string): Promise<Order> {
    const order = await this.transitionStatus(orderId, 'CONFIRMED');

    // If customer allows postpaid, skip to PAID
    const customer = await prisma.customer.findUnique({
      where: { id: order.customerId },
    });

    if (customer?.allowPostpaid) {
      return this.transitionStatus(orderId, 'PAID', { postpaid: true });
    }

    // Otherwise, await payment
    return this.transitionStatus(orderId, 'AWAITING_PAYMENT');
  }

  /**
   * Mark items as sourced or unavailable
   */
  static async updateSourcingStatus(
    orderId: string,
    itemUpdates: Array<{
      itemId: string;
      isSourced: boolean;
      sourcedQty?: number;
      unavailable?: boolean;
    }>
  ): Promise<void> {
    await prisma.$transaction(
      itemUpdates.map((update) =>
        prisma.orderItem.update({
          where: { id: update.itemId },
          data: {
            isSourced: update.isSourced,
            sourcedQty: update.sourcedQty,
            unavailable: update.unavailable,
          },
        })
      )
    );

    // Check if all items are handled
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return;

    const allSourced = order.items.every((item) => item.isSourced);
    const hasUnavailable = order.items.some((item) => item.unavailable);

    if (hasUnavailable) {
      await this.transitionStatus(orderId, 'SUBSTITUTION_REQUIRED');
    } else if (allSourced) {
      await this.transitionStatus(orderId, 'READY_FOR_PACKING');
    }
  }

  /**
   * Get orders for weekly bulk buying
   */
  static async getOrdersForBulkBuying(buyingDate: Date) {
    return prisma.order.findMany({
      where: {
        buyingCycleDate: buyingDate,
        status: {
          in: ['PAID', 'IN_SOURCING'],
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: {
          include: {
            user: true,
          },
        },
        address: true,
      },
    });
  }

  /**
   * Get aggregated shopping list for bulk buying
   */
  static async getBulkShoppingList(buyingDate: Date) {
    const orders = await this.getOrdersForBulkBuying(buyingDate);

    // Aggregate items by product
    const aggregated = new Map<
      string,
      {
        product: any;
        totalQuantity: number;
        orderCount: number;
        orders: string[];
      }
    >();

    for (const order of orders) {
      for (const item of order.items) {
        const key = item.productId;
        const existing = aggregated.get(key);

        if (existing) {
          existing.totalQuantity += item.quantity;
          existing.orderCount += 1;
          existing.orders.push(order.orderNumber);
        } else {
          aggregated.set(key, {
            product: item.product,
            totalQuantity: item.quantity,
            orderCount: 1,
            orders: [order.orderNumber],
          });
        }
      }
    }

    return Array.from(aggregated.values());
  }

  /**
   * Check if transition is valid
   */
  static canTransition(from: OrderStatus, to: OrderStatus): boolean {
    return VALID_TRANSITIONS[from]?.includes(to) || false;
  }

  /**
   * Generate unique order number
   */
  static async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Get count of orders today
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `BFNG${year}${month}${day}${sequence}`;
  }

  /**
   * Get ISO week number
   */
  static getWeekNumber(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }

  /**
   * Get next Thursday (buying cycle date)
   */
  static getNextBuyingCycleDate(from: Date): Date {
    const date = new Date(from);
    const day = date.getDay();
    const thursday = 4;

    // If today is Thursday and before cutoff (say, 2 PM), use today
    // Otherwise, get next Thursday
    const daysUntilThursday = ((thursday - day + 7) % 7) || 7;

    if (day === thursday && date.getHours() < 14) {
      return date;
    }

    date.setDate(date.getDate() + daysUntilThursday);
    date.setHours(9, 0, 0, 0); // 9 AM Thursday
    return date;
  }

  /**
   * Handle side effects after status change
   */
  private static async handleStatusSideEffects(
    order: Order,
    metadata?: Record<string, any>
  ): Promise<void> {
    switch (order.status) {
      case 'CONFIRMED':
        // Send confirmation email/SMS
        // TODO: Implement notification service
        break;

      case 'AWAITING_PAYMENT':
        // Generate payment link
        // TODO: Implement Paystack integration
        break;

      case 'PAID':
        // Move to sourcing queue
        await this.transitionStatus(order.id, 'IN_SOURCING');
        break;

      case 'READY_FOR_PACKING':
        // Notify packing team
        break;

      case 'PACKED':
        // Create delivery assignment
        await prisma.delivery.create({
          data: {
            orderId: order.id,
            addressId: order.addressId,
            status: 'PENDING',
            scheduledDate: order.requestedDeliveryDate,
          },
        });
        await this.transitionStatus(order.id, 'OUT_FOR_DELIVERY');
        break;

      case 'DELIVERED':
        // Mark as completed
        await this.transitionStatus(order.id, 'COMPLETED');
        break;

      case 'COMPLETED':
        // Calculate vendor commissions
        await this.calculateVendorCommissions(order.id);
        break;
    }
  }

  /**
   * Calculate and record vendor commissions
   */
  private static async calculateVendorCommissions(
    orderId: string
  ): Promise<void> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                vendor: true,
              },
            },
          },
        },
      },
    });

    if (!order) return;

    for (const item of order.items) {
      if (item.product.vendor && item.product.commissionRate) {
        const commissionAmount =
          item.totalPrice * (item.product.commissionRate / 100);

        await prisma.vendorCommission.create({
          data: {
            vendorId: item.product.vendorId!,
            orderId: order.id,
            amount: commissionAmount,
            rate: item.product.commissionRate,
            status: 'PENDING',
          },
        });
      }
    }
  }

  /**
   * Log audit trail
   */
  private static async logAudit(
    action: string,
    entityId: string,
    metadata: Record<string, any>
  ): Promise<void> {
    await prisma.auditLog.create({
      data: {
        action,
        entity: 'ORDER',
        entityId,
        metadata,
      },
    });
  }

  /**
   * Get order statistics
   */
  static async getOrderStats(customerId?: string) {
    const where = customerId ? { customerId } : {};

    const [total, byStatus, revenue] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.order.aggregate({
        where: {
          ...where,
          status: 'COMPLETED',
        },
        _sum: {
          total: true,
        },
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count;
          return acc;
        },
        {} as Record<OrderStatus, number>
      ),
      totalRevenue: revenue._sum.total || 0,
    };
  }
}

export default OrderEngine;
