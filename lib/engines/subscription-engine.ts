import {
  PrismaClient,
  Subscription,
  SubscriptionFrequency,
  SubscriptionStatus,
} from '@prisma/client';
import { addDays, addWeeks, addMonths, isBefore, isAfter } from 'date-fns';
import { OrderEngine } from './order-engine';

const prisma = new PrismaClient();

/**
 * Subscription Engine - Manages recurring orders
 * Handles auto-generation of subscription orders before weekly cutoff
 */

export class SubscriptionEngine {
  /**
   * Create a new subscription
   */
  static async createSubscription(data: {
    customerId: string;
    name: string;
    description?: string;
    frequency: SubscriptionFrequency;
    items: Array<{
      productId: string;
      quantity: number;
      isFlexible?: boolean;
    }>;
    basePrice: number;
    deliveryFee?: number;
    startDate: Date;
    addressId?: string;
    preferredDeliveryDay?: string;
    allowEdits?: boolean;
    allowSkip?: boolean;
  }): Promise<Subscription> {
    // Calculate next order date
    const nextOrderDate = this.calculateNextOrderDate(
      data.startDate,
      data.frequency
    );

    const subscription = await prisma.subscription.create({
      data: {
        customerId: data.customerId,
        name: data.name,
        description: data.description,
        frequency: data.frequency,
        status: 'ACTIVE',
        basePrice: data.basePrice,
        deliveryFee: data.deliveryFee || 0,
        startDate: data.startDate,
        nextOrderDate,
        addressId: data.addressId,
        preferredDeliveryDay: data.preferredDeliveryDay,
        allowEdits: data.allowEdits ?? true,
        allowSkip: data.allowSkip ?? true,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            isFlexible: item.isFlexible || false,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    await this.logAudit('SUBSCRIPTION_CREATED', subscription.id, {
      frequency: data.frequency,
    });

    return subscription;
  }

  /**
   * Generate orders for all active subscriptions
   * Run this daily, checks if order should be created for upcoming cycle
   */
  static async generateUpcomingOrders(): Promise<{
    created: number;
    errors: Array<{ subscriptionId: string; error: string }>;
  }> {
    const now = new Date();
    const cutoffDate = this.getOrderCutoffDate();

    // Get subscriptions that need orders generated
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        nextOrderDate: {
          lte: cutoffDate,
          gte: now,
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
            addresses: true,
          },
        },
        skipDates: true,
      },
    });

    const results = {
      created: 0,
      errors: [] as Array<{ subscriptionId: string; error: string }>,
    };

    for (const subscription of subscriptions) {
      try {
        // Check if this date is marked for skip
        const isSkipped = subscription.skipDates.some(
          (skip) =>
            skip.skipDate.toDateString() ===
            subscription.nextOrderDate?.toDateString()
        );

        if (isSkipped) {
          // Move to next cycle without creating order
          await this.advanceSubscription(subscription.id);
          continue;
        }

        // Check if order already exists for this cycle
        const existingOrder = await prisma.order.findFirst({
          where: {
            subscriptionId: subscription.id,
            buyingCycleDate: OrderEngine.getNextBuyingCycleDate(now),
          },
        });

        if (existingOrder) {
          continue; // Order already created
        }

        // Get current product prices
        const items = await Promise.all(
          subscription.items.map(async (item) => {
            const product = await prisma.product.findUnique({
              where: { id: item.productId },
            });

            if (!product || !product.isActive) {
              throw new Error(`Product ${item.productId} not available`);
            }

            return {
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: product.basePrice,
            };
          })
        );

        // Determine delivery address
        const addressId =
          subscription.addressId ||
          subscription.customer.addresses.find((a) => a.isDefault)?.id;

        if (!addressId) {
          throw new Error('No delivery address available');
        }

        // Create order
        const order = await OrderEngine.createOrder({
          customerId: subscription.customerId,
          addressId,
          items,
          deliveryFee: subscription.deliveryFee,
          subscriptionId: subscription.id,
        });

        results.created++;

        // Advance subscription to next cycle
        await this.advanceSubscription(subscription.id);
      } catch (error) {
        results.errors.push({
          subscriptionId: subscription.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    await this.logAudit('BATCH_ORDER_GENERATION', 'system', {
      created: results.created,
      errors: results.errors.length,
    });

    return results;
  }

  /**
   * Advance subscription to next cycle
   */
  static async advanceSubscription(subscriptionId: string): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) return;

    const nextOrderDate = this.calculateNextOrderDate(
      subscription.nextOrderDate || new Date(),
      subscription.frequency
    );

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { nextOrderDate },
    });
  }

  /**
   * Calculate next order date based on frequency
   */
  static calculateNextOrderDate(
    from: Date,
    frequency: SubscriptionFrequency
  ): Date {
    // Orders are generated 2 days before buying cycle to allow for customer edits
    const orderGenerationOffset = -2;

    let nextDate: Date;

    switch (frequency) {
      case 'WEEKLY':
        nextDate = addWeeks(from, 1);
        break;
      case 'BIWEEKLY':
        nextDate = addWeeks(from, 2);
        break;
      case 'MONTHLY':
        nextDate = addMonths(from, 1);
        break;
      default:
        nextDate = addWeeks(from, 1);
    }

    // Adjust to Tuesday before Thursday buying cycle
    return addDays(OrderEngine.getNextBuyingCycleDate(nextDate), orderGenerationOffset);
  }

  /**
   * Get cutoff date for order generation
   * Orders should be generated before Wednesday night (cutoff)
   */
  static getOrderCutoffDate(): Date {
    const now = new Date();
    const buyingDate = OrderEngine.getNextBuyingCycleDate(now);

    // Generate orders 1 day before buying date (Wednesday)
    return addDays(buyingDate, -1);
  }

  /**
   * Pause subscription
   */
  static async pauseSubscription(subscriptionId: string): Promise<void> {
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'PAUSED',
        pausedAt: new Date(),
      },
    });

    await this.logAudit('SUBSCRIPTION_PAUSED', subscriptionId, {});
  }

  /**
   * Resume subscription
   */
  static async resumeSubscription(subscriptionId: string): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) return;

    const nextOrderDate = this.calculateNextOrderDate(
      new Date(),
      subscription.frequency
    );

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'ACTIVE',
        pausedAt: null,
        nextOrderDate,
      },
    });

    await this.logAudit('SUBSCRIPTION_RESUMED', subscriptionId, {});
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string): Promise<void> {
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    });

    await this.logAudit('SUBSCRIPTION_CANCELLED', subscriptionId, {});
  }

  /**
   * Skip a specific date
   */
  static async skipDate(
    subscriptionId: string,
    skipDate: Date,
    reason?: string
  ): Promise<void> {
    await prisma.subscriptionSkip.create({
      data: {
        subscriptionId,
        skipDate,
        reason,
      },
    });

    await this.logAudit('SUBSCRIPTION_SKIP_ADDED', subscriptionId, {
      skipDate,
    });
  }

  /**
   * Update subscription items
   */
  static async updateItems(
    subscriptionId: string,
    items: Array<{
      productId: string;
      quantity: number;
      isFlexible?: boolean;
    }>
  ): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription?.allowEdits) {
      throw new Error('Subscription does not allow edits');
    }

    // Delete existing items and create new ones
    await prisma.$transaction([
      prisma.subscriptionItem.deleteMany({
        where: { subscriptionId },
      }),
      prisma.subscriptionItem.createMany({
        data: items.map((item) => ({
          subscriptionId,
          productId: item.productId,
          quantity: item.quantity,
          isFlexible: item.isFlexible || false,
        })),
      }),
    ]);

    // Recalculate base price
    const products = await prisma.product.findMany({
      where: {
        id: { in: items.map((i) => i.productId) },
      },
    });

    const basePrice = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product?.basePrice || 0) * item.quantity;
    }, 0);

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { basePrice },
    });

    await this.logAudit('SUBSCRIPTION_ITEMS_UPDATED', subscriptionId, {
      itemCount: items.length,
    });
  }

  /**
   * Get subscription analytics
   */
  static async getSubscriptionMetrics() {
    const [total, active, byFrequency, revenue] = await Promise.all([
      prisma.subscription.count(),
      prisma.subscription.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.subscription.groupBy({
        by: ['frequency', 'status'],
        _count: true,
      }),
      prisma.order.aggregate({
        where: {
          isSubscriptionOrder: true,
          status: 'COMPLETED',
        },
        _sum: {
          total: true,
        },
      }),
    ]);

    // Calculate churn rate (last 30 days)
    const thirtyDaysAgo = addDays(new Date(), -30);
    const cancelled = await prisma.subscription.count({
      where: {
        status: 'CANCELLED',
        cancelledAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const churnRate = total > 0 ? (cancelled / total) * 100 : 0;

    return {
      total,
      active,
      byFrequency,
      totalRevenue: revenue._sum.total || 0,
      churnRate,
    };
  }

  /**
   * Check subscription health and send alerts
   */
  static async checkSubscriptionHealth(): Promise<void> {
    // Find subscriptions about to expire
    const thirtyDaysFromNow = addDays(new Date(), 30);
    const expiring = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lte: thirtyDaysFromNow,
          gte: new Date(),
        },
      },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
      },
    });

    // TODO: Send renewal reminders

    // Find subscriptions with failed order generations
    const problematic = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        nextOrderDate: {
          lt: new Date(),
        },
      },
    });

    if (problematic.length > 0) {
      await this.logAudit('SUBSCRIPTION_HEALTH_CHECK', 'system', {
        expiring: expiring.length,
        problematic: problematic.length,
      });
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
        entity: 'SUBSCRIPTION',
        entityId,
        metadata,
      },
    });
  }
}

export default SubscriptionEngine;
