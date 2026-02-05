import { PrismaClient, SubstitutionStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Substitution Engine - Manages item substitutions when products are unavailable
 * Critical for market-sourced items in Ghana context
 */

export class SubstitutionEngine {
  /**
   * Create a substitution proposal
   */
  static async proposeSubstitution(data: {
    orderId: string;
    orderItemId: string;
    originalProductId: string;
    substituteProductId: string;
    substituteQuantity: number;
    reason?: string;
  }) {
    // Get original item details
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: data.orderItemId },
      include: { product: true },
    });

    if (!orderItem) {
      throw new Error('Order item not found');
    }

    // Get substitute product details
    const substituteProduct = await prisma.product.findUnique({
      where: { id: data.substituteProductId },
    });

    if (!substituteProduct) {
      throw new Error('Substitute product not found');
    }

    // Calculate prices
    const originalPrice = orderItem.unitPrice * orderItem.quantity;
    const substitutePrice = substituteProduct.basePrice * data.substituteQuantity;
    const priceDifference = substitutePrice - originalPrice;

    // Create substitution
    const substitution = await prisma.substitution.create({
      data: {
        orderId: data.orderId,
        orderItemId: data.orderItemId,
        originalProductId: data.originalProductId,
        substituteProductId: data.substituteProductId,
        originalQuantity: orderItem.quantity,
        substituteQuantity: data.substituteQuantity,
        originalPrice,
        substitutePrice,
        priceDifference,
        reason: data.reason,
        status: 'PENDING',
      },
      include: {
        originalProduct: true,
        substituteProduct: true,
      },
    });

    // Update order status to SUBSTITUTION_REQUIRED
    await prisma.order.update({
      where: { id: data.orderId },
      data: { status: 'SUBSTITUTION_REQUIRED' },
    });

    // Log audit
    await this.logAudit('SUBSTITUTION_PROPOSED', substitution.id, {
      orderId: data.orderId,
      original: orderItem.product.name,
      substitute: substituteProduct.name,
      priceDifference,
    });

    // TODO: Send notification to customer
    await this.notifyCustomer(substitution);

    return substitution;
  }

  /**
   * Customer approves substitution
   */
  static async approveSubstitution(
    substitutionId: string,
    customerResponse?: string
  ) {
    const substitution = await prisma.substitution.findUnique({
      where: { id: substitutionId },
      include: {
        order: true,
        orderItem: true,
      },
    });

    if (!substitution) {
      throw new Error('Substitution not found');
    }

    if (substitution.status !== 'PENDING') {
      throw new Error('Substitution already processed');
    }

    // Update substitution status
    await prisma.substitution.update({
      where: { id: substitutionId },
      data: {
        status: 'APPROVED',
        respondedAt: new Date(),
        customerResponse,
      },
    });

    // Update order item
    await prisma.orderItem.update({
      where: { id: substitution.orderItemId },
      data: {
        productId: substitution.substituteProductId!,
        quantity: substitution.substituteQuantity!,
        unitPrice: substitution.substitutePrice! / substitution.substituteQuantity!,
        totalPrice: substitution.substitutePrice!,
        isSourced: true,
        sourcedQty: substitution.substituteQuantity!,
      },
    });

    // Update order total if price changed
    if (substitution.priceDifference !== 0) {
      await prisma.order.update({
        where: { id: substitution.orderId },
        data: {
          subtotal: {
            increment: substitution.priceDifference,
          },
          total: {
            increment: substitution.priceDifference,
          },
        },
      });
    }

    // Check if all substitutions are resolved
    await this.checkOrderSubstitutionsComplete(substitution.orderId);

    await this.logAudit('SUBSTITUTION_APPROVED', substitutionId, {
      orderId: substitution.orderId,
      priceDifference: substitution.priceDifference,
    });

    return substitution;
  }

  /**
   * Customer rejects substitution
   */
  static async rejectSubstitution(
    substitutionId: string,
    customerResponse?: string
  ) {
    const substitution = await prisma.substitution.findUnique({
      where: { id: substitutionId },
      include: { order: true },
    });

    if (!substitution) {
      throw new Error('Substitution not found');
    }

    if (substitution.status !== 'PENDING') {
      throw new Error('Substitution already processed');
    }

    // Update substitution status
    await prisma.substitution.update({
      where: { id: substitutionId },
      data: {
        status: 'REJECTED',
        respondedAt: new Date(),
        customerResponse,
      },
    });

    // Remove item from order (customer doesn't want substitute)
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: substitution.orderItemId },
    });

    if (orderItem) {
      // Update order total
      await prisma.order.update({
        where: { id: substitution.orderId },
        data: {
          subtotal: {
            decrement: orderItem.totalPrice,
          },
          total: {
            decrement: orderItem.totalPrice,
          },
        },
      });

      // Mark item as unavailable
      await prisma.orderItem.update({
        where: { id: substitution.orderItemId },
        data: {
          unavailable: true,
          isSourced: false,
        },
      });
    }

    // Check if all substitutions are resolved
    await this.checkOrderSubstitutionsComplete(substitution.orderId);

    await this.logAudit('SUBSTITUTION_REJECTED', substitutionId, {
      orderId: substitution.orderId,
      reason: customerResponse,
    });

    return substitution;
  }

  /**
   * Get suggested substitutes for a product
   */
  static async getSuggestedSubstitutes(productId: string, limit: number = 5) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    // Find similar products in same category
    const suggestions = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        isActive: true,
        type: product.type,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { basePrice: 'asc' }, // Prefer similar price
      ],
      take: limit,
    });

    return suggestions;
  }

  /**
   * Get pending substitutions for customer approval
   */
  static async getPendingSubstitutions(customerId: string) {
    return prisma.substitution.findMany({
      where: {
        status: 'PENDING',
        order: {
          customerId,
        },
      },
      include: {
        order: true,
        originalProduct: true,
        substituteProduct: true,
        orderItem: true,
      },
      orderBy: {
        proposedAt: 'desc',
      },
    });
  }

  /**
   * Get substitution statistics
   */
  static async getSubstitutionStats(dateFrom?: Date) {
    const where = dateFrom ? { proposedAt: { gte: dateFrom } } : {};

    const [total, byStatus] = await Promise.all([
      prisma.substitution.count({ where }),
      prisma.substitution.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
    ]);

    const approvalRate =
      total > 0
        ? ((byStatus.find((s) => s.status === 'APPROVED')?._count || 0) /
            total) *
          100
        : 0;

    return {
      total,
      byStatus: byStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count;
          return acc;
        },
        {} as Record<SubstitutionStatus, number>
      ),
      approvalRate,
    };
  }

  /**
   * Auto-approve substitutions with zero price difference
   * (for institutional customers who trust the process)
   */
  static async autoApproveZeroDifferenceSubstitutions(orderId: string) {
    const substitutions = await prisma.substitution.findMany({
      where: {
        orderId,
        status: 'PENDING',
        priceDifference: 0,
      },
    });

    const results = await Promise.all(
      substitutions.map((sub) =>
        this.approveSubstitution(sub.id, 'Auto-approved (same price)')
      )
    );

    return results;
  }

  /**
   * Check if all substitutions in order are resolved
   */
  private static async checkOrderSubstitutionsComplete(orderId: string) {
    const pendingSubstitutions = await prisma.substitution.count({
      where: {
        orderId,
        status: 'PENDING',
      },
    });

    if (pendingSubstitutions === 0) {
      // All substitutions resolved, check if ready for packing
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) return;

      const allItemsHandled = order.items.every(
        (item) => item.isSourced || item.unavailable
      );

      if (allItemsHandled) {
        // Move to ready for packing
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'READY_FOR_PACKING' },
        });

        await this.logAudit('ORDER_READY_FOR_PACKING', orderId, {
          reason: 'All substitutions resolved',
        });
      }
    }
  }

  /**
   * Notify customer of substitution
   */
  private static async notifyCustomer(substitution: any) {
    // TODO: Implement actual notification
    // - Email
    // - SMS
    // - WhatsApp
    // - Push notification

    console.log('Substitution notification sent:', {
      orderId: substitution.orderId,
      original: substitution.originalProduct.name,
      substitute: substitution.substituteProduct.name,
      priceDifference: substitution.priceDifference,
    });
  }

  /**
   * Log audit trail
   */
  private static async logAudit(
    action: string,
    entityId: string,
    metadata: Record<string, any>
  ) {
    await prisma.auditLog.create({
      data: {
        action,
        entity: 'SUBSTITUTION',
        entityId,
        metadata,
      },
    });
  }

  /**
   * Bulk create substitutions from shopping list
   */
  static async bulkProposeSubstitutions(
    substitutions: Array<{
      orderId: string;
      orderItemId: string;
      originalProductId: string;
      substituteProductId: string;
      substituteQuantity: number;
      reason?: string;
    }>
  ) {
    const results = await Promise.all(
      substitutions.map((sub) => this.proposeSubstitution(sub))
    );

    return results;
  }
}

export default SubstitutionEngine;
