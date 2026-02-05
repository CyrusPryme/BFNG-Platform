import { OrderStatus, SubstitutionStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export class OrderStateMachine {
  private static transitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.RECEIVED]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.AWAITING_PAYMENT, OrderStatus.CANCELLED],
    [OrderStatus.AWAITING_PAYMENT]: [OrderStatus.PAID, OrderStatus.CANCELLED],
    [OrderStatus.PAID]: [OrderStatus.IN_SOURCING, OrderStatus.CANCELLED],
    [OrderStatus.IN_SOURCING]: [OrderStatus.SUBSTITUTION_REQUIRED, OrderStatus.READY_FOR_PACKING],
    [OrderStatus.SUBSTITUTION_REQUIRED]: [OrderStatus.READY_FOR_PACKING, OrderStatus.CANCELLED],
    [OrderStatus.READY_FOR_PACKING]: [OrderStatus.PACKED],
    [OrderStatus.PACKED]: [OrderStatus.OUT_FOR_DELIVERY],
    [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED, OrderStatus.FAILED],
    [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.CANCELLED]: [OrderStatus.REFUNDED],
    [OrderStatus.FAILED]: [OrderStatus.CANCELLED],
    [OrderStatus.REFUNDED]: []
  }

  static canTransition(from: OrderStatus, to: OrderStatus): boolean {
    return this.transitions[from]?.includes(to) || false
  }

  static async transitionOrder(orderId: string, newStatus: OrderStatus, userId?: string, notes?: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, substitutions: true }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    if (!this.canTransition(order.status, newStatus)) {
      throw new Error(`Cannot transition from ${order.status} to ${newStatus}`)
    }

    const updateData: any = {
      status: newStatus,
      updatedAt: new Date(),
      internalNotes: notes ? `${order.internalNotes || ''}\n[${new Date().toISOString()}] ${notes}` : order.internalNotes
    }

    // Add timestamp fields based on status
    switch (newStatus) {
      case OrderStatus.CONFIRMED:
        updateData.confirmedAt = new Date()
        break
      case OrderStatus.PAID:
        updateData.paidAt = new Date()
        break
      case OrderStatus.PACKED:
        updateData.packedAt = new Date()
        break
      case OrderStatus.DELIVERED:
        updateData.deliveredAt = new Date()
        break
      case OrderStatus.COMPLETED:
        updateData.completedAt = new Date()
        break
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        customer: { include: { user: true } },
        items: { include: { product: true } },
        address: true
      }
    })

    // Log the state change
    await prisma.auditLog.create({
      data: {
        userId: userId || 'system',
        action: 'ORDER_STATUS_CHANGE',
        entity: 'Order',
        entityId: orderId,
        changes: {
          from: order.status,
          to: newStatus
        },
        metadata: {
          orderNumber: order.orderNumber,
          notes
        }
      }
    })

    // Trigger side effects based on new status
    await this.handleStatusSideEffects(updatedOrder, newStatus)

    return updatedOrder
  }

  private static async handleStatusSideEffects(order: any, status: OrderStatus) {
    switch (status) {
      case OrderStatus.CONFIRMED:
        // Send confirmation notification
        await this.sendOrderConfirmation(order)
        break
      
      case OrderStatus.IN_SOURCING:
        // Notify shoppers that sourcing has begun
        await this.notifyShoppers(order)
        break
      
      case OrderStatus.SUBSTITUTION_REQUIRED:
        // Notify customer about required substitutions
        await this.notifyCustomerForSubstitutions(order)
        break
      
      case OrderStatus.OUT_FOR_DELIVERY:
        // Notify customer about delivery
        await this.notifyCustomerForDelivery(order)
        break
      
      case OrderStatus.DELIVERED:
        // Schedule completion if no issues
        setTimeout(() => {
          this.transitionOrder(order.id, OrderStatus.COMPLETED)
        }, 24 * 60 * 60 * 1000) // Auto-complete after 24 hours
        break
    }
  }

  private static async sendOrderConfirmation(order: any) {
    // TODO: Implement email/SMS/WhatsApp notification
    console.log(`Order confirmation sent for ${order.orderNumber}`)
  }

  private static async notifyShoppers(order: any) {
    // TODO: Notify market shoppers
    console.log(`Shoppers notified for order ${order.orderNumber}`)
  }

  private static async notifyCustomerForSubstitutions(order: any) {
    // TODO: Send substitution approval request
    console.log(`Substitution request sent for order ${order.orderNumber}`)
  }

  private static async notifyCustomerForDelivery(order: any) {
    // TODO: Send delivery notification
    console.log(`Delivery notification sent for order ${order.orderNumber}`)
  }

  // Weekly bulk buying logic
  static async processWeeklyBulkBuying() {
    const today = new Date()
    const thursday = new Date(today)
    thursday.setDate(today.getDate() + ((4 - today.getDay() + 7) % 7)) // Next Thursday
    
    // Get all paid orders for this week's bulk buying
    const orders = await prisma.order.findMany({
      where: {
        status: OrderStatus.PAID,
        buyingCycleDate: thursday,
        isSubscriptionOrder: false
      },
      include: {
        items: { include: { product: true } },
        customer: { include: { user: true } }
      }
    })

    // Transition all to IN_SOURCING
    for (const order of orders) {
      await this.transitionOrder(order.id, OrderStatus.IN_SOURCING, 'system', 'Weekly bulk buying started')
    }

    return orders
  }

  // Check for unavailable items and create substitutions
  static async checkUnavailableItems(orderId: string, unavailableItemIds: string[]) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } }
    })

    if (!order) throw new Error('Order not found')

    // Mark items as unavailable
    await prisma.orderItem.updateMany({
      where: {
        id: { in: unavailableItemIds },
        orderId
      },
      data: { unavailable: true }
    })

    // Find substitution suggestions
    const substitutions = []
    for (const itemId of unavailableItemIds) {
      const orderItem = order.items.find(item => item.id === itemId)
      if (orderItem && orderItem.product.allowSubstitution) {
        const suggestions = await this.findSubstitutionSuggestions(orderItem.product.id)
        
        for (const suggestion of suggestions) {
          const substitution = await prisma.substitution.create({
            data: {
              orderId,
              orderItemId: itemId,
              originalProductId: orderItem.productId,
              substituteProductId: suggestion.id,
              originalQuantity: orderItem.quantity,
              originalPrice: orderItem.unitPrice,
              substitutePrice: suggestion.basePrice,
              priceDifference: suggestion.basePrice - orderItem.unitPrice,
              reason: 'Item unavailable',
              status: SubstitutionStatus.PENDING
            }
          })
          substitutions.push(substitution)
        }
      }
    }

    // If substitutions were created, transition to SUBSTITUTION_REQUIRED
    if (substitutions.length > 0) {
      await this.transitionOrder(orderId, OrderStatus.SUBSTITUTION_REQUIRED, 'system', 'Substitutions required')
    } else {
      // If no substitutions, move to ready for packing
      await this.transitionOrder(orderId, OrderStatus.READY_FOR_PACKING, 'system', 'All items sourced')
    }

    return substitutions
  }

  private static async findSubstitutionSuggestions(productId: string) {
    const originalProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true }
    })

    if (!originalProduct) return []

    // Find similar products in same category
    const suggestions = await prisma.product.findMany({
      where: {
        categoryId: originalProduct.categoryId,
        id: { not: productId },
        isActive: true,
        basePrice: {
          gte: originalProduct.basePrice * 0.8, // Within 20% price range
          lte: originalProduct.basePrice * 1.2
        }
      },
      orderBy: { basePrice: 'asc' },
      take: 3
    })

    return suggestions
  }

  // Handle customer response to substitutions
  static async handleSubstitutionResponse(substitutionId: string, approved: boolean, customerResponse?: string) {
    const substitution = await prisma.substitution.findUnique({
      where: { id: substitutionId },
      include: { order: true }
    })

    if (!substitution) throw new Error('Substitution not found')

    const updateData: any = {
      status: approved ? SubstitutionStatus.APPROVED : SubstitutionStatus.REJECTED,
      respondedAt: new Date(),
      customerResponse
    }

    await prisma.substitution.update({
      where: { id: substitutionId },
      data: updateData
    })

    // If approved, update the order item
    if (approved && substitution.substituteProductId) {
      await prisma.orderItem.update({
        where: { id: substitution.orderItemId },
        data: {
          productId: substitution.substituteProductId,
          unitPrice: substitution.substitutePrice || 0,
          totalPrice: (substitution.substitutePrice || 0) * (substitution.substituteQuantity || 0)
        }
      })
    }

    // Check if all substitutions are resolved
    const order = await prisma.order.findUnique({
      where: { id: substitution.orderId },
      include: { substitutions: true }
    })

    if (order && order.substitutions.every(s => s.status !== SubstitutionStatus.PENDING)) {
      await this.transitionOrder(order.id, OrderStatus.READY_FOR_PACKING, 'system', 'All substitutions resolved')
    }

    return substitution
  }
}
