import { SubscriptionFrequency, SubscriptionStatus, OrderStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { OrderStateMachine } from './order-state-machine'

export class SubscriptionEngine {
  static async createSubscription(data: {
    customerId: string
    name: string
    description?: string
    frequency: SubscriptionFrequency
    basePrice: number
    deliveryFee: number
    startDate: Date
    endDate?: Date
    preferredDeliveryDay?: string
    addressId?: string
    items: Array<{
      productId: string
      quantity: number
      isFlexible?: boolean
    }>
  }) {
    const subscription = await prisma.subscription.create({
      data: {
        ...data,
        nextOrderDate: this.calculateNextOrderDate(data.frequency, data.startDate),
        items: {
          create: data.items
        }
      },
      include: {
        items: { include: { product: true } },
        customer: { include: { user: true } }
      }
    })

    // Log subscription creation
    await prisma.auditLog.create({
      data: {
        userId: subscription.customer.userId,
        action: 'SUBSCRIPTION_CREATED',
        entity: 'Subscription',
        entityId: subscription.id,
        changes: data
      }
    })

    return subscription
  }

  static async generateSubscriptionOrders() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get all active subscriptions that need orders generated
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        nextOrderDate: {
          lte: today
        },
        OR: [
          { endDate: null },
          { endDate: { gte: today } }
        ]
      },
      include: {
        items: { include: { product: true } },
        customer: { include: { addresses: true } }
      }
    })

    const generatedOrders = []

    for (const subscription of subscriptions) {
      // Check if subscription should be skipped this week
      const isSkipped = await this.isSubscriptionSkipped(subscription.id, today)
      if (isSkipped) continue

      // Generate order for this subscription
      const order = await this.generateOrderFromSubscription(subscription)
      if (order) {
        generatedOrders.push(order)
        
        // Update next order date
        await this.updateNextOrderDate(subscription)
      }
    }

    return generatedOrders
  }

  private static async generateOrderFromSubscription(subscription: any) {
    const deliveryAddress = subscription.customer.addresses.find((addr: any) => addr.isDefault)
    
    if (!deliveryAddress) {
      console.error(`No delivery address found for subscription ${subscription.id}`)
      return null
    }

    // Calculate order total
    let subtotal = 0
    const orderItems = []

    for (const item of subscription.items) {
      const totalPrice = item.quantity * item.product.basePrice
      subtotal += totalPrice
      
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product.basePrice,
        totalPrice
      })
    }

    const total = subtotal + subscription.deliveryFee

    // Generate order number
    const orderNumber = await this.generateOrderNumber()

    try {
      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerId: subscription.customerId,
          addressId: deliveryAddress.id,
          status: OrderStatus.RECEIVED,
          subtotal,
          deliveryFee: subscription.deliveryFee,
          discount: 0,
          total,
          subscriptionId: subscription.id,
          isSubscriptionOrder: true,
          requestedDeliveryDate: subscription.nextOrderDate,
          weekNumber: this.getISOWeek(subscription.nextOrderDate),
          buyingCycleDate: this.getNextThursday(subscription.nextOrderDate),
          items: {
            create: orderItems
          }
        },
        include: {
          items: { include: { product: true } },
          customer: { include: { user: true } },
          address: true
        }
      })

      // Transition order to confirmed
      await OrderStateMachine.transitionOrder(order.id, OrderStatus.CONFIRMED, 'system', 'Auto-generated from subscription')

      // Log order generation
      await prisma.auditLog.create({
        data: {
          userId: subscription.customer.userId,
          action: 'ORDER_GENERATED_FROM_SUBSCRIPTION',
          entity: 'Order',
          entityId: order.id,
          changes: {
            subscriptionId: subscription.id,
            orderNumber
          }
        }
      })

      return order
    } catch (error) {
      console.error(`Failed to generate order for subscription ${subscription.id}:`, error)
      return null
    }
  }

  private static async isSubscriptionSkipped(subscriptionId: string, date: Date): Promise<boolean> {
    const skip = await prisma.subscriptionSkip.findFirst({
      where: {
        subscriptionId,
        skipDate: date
      }
    })
    return !!skip
  }

  private static async updateNextOrderDate(subscription: any) {
    const nextDate = this.calculateNextOrderDate(
      subscription.frequency,
      subscription.nextOrderDate
    )

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { nextOrderDate: nextDate }
    })
  }

  static calculateNextOrderDate(frequency: SubscriptionFrequency, fromDate: Date): Date {
    const nextDate = new Date(fromDate)
    
    switch (frequency) {
      case SubscriptionFrequency.WEEKLY:
        nextDate.setDate(nextDate.getDate() + 7)
        break
      case SubscriptionFrequency.BIWEEKLY:
        nextDate.setDate(nextDate.getDate() + 14)
        break
      case SubscriptionFrequency.MONTHLY:
        nextDate.setMonth(nextDate.getMonth() + 1)
        break
    }
    
    return nextDate
  }

  private static getNextThursday(date: Date): Date {
    const thursday = new Date(date)
    const dayOfWeek = thursday.getDay()
    const daysUntilThursday = (4 - dayOfWeek + 7) % 7
    thursday.setDate(thursday.getDate() + daysUntilThursday)
    return thursday
  }

  private static getISOWeek(date: Date): number {
    const target = new Date(date.valueOf())
    const dayNr = (date.getDay() + 6) % 7
    target.setDate(target.getDate() - dayNr + 3)
    const firstThursday = target.valueOf()
    target.setMonth(0, 1)
    if (target.getDay() !== 4) target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7))
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
  }

  private static async generateOrderNumber(): Promise<string> {
    const prefix = 'BFNG'
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    
    // Get count of orders today
    const todayStart = new Date(date)
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date(date)
    todayEnd.setHours(23, 59, 59, 999)
    
    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd
        }
      }
    })
    
    const sequence = (count + 1).toString().padStart(4, '0')
    return `${prefix}${dateStr}${sequence}`
  }

  static async pauseSubscription(subscriptionId: string, reason?: string) {
    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.PAUSED,
        pausedAt: new Date()
      },
      include: { customer: { include: { user: true } } }
    })

    await prisma.auditLog.create({
      data: {
        userId: subscription.customer.userId,
        action: 'SUBSCRIPTION_PAUSED',
        entity: 'Subscription',
        entityId: subscriptionId,
        changes: { reason }
      }
    })

    return subscription
  }

  static async resumeSubscription(subscriptionId: string) {
    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.ACTIVE,
        nextOrderDate: this.calculateNextOrderDate(
          SubscriptionFrequency.WEEKLY, // Default to weekly
          new Date()
        ),
        pausedAt: null
      },
      include: { customer: { include: { user: true } } }
    })

    await prisma.auditLog.create({
      data: {
        userId: subscription.customer.userId,
        action: 'SUBSCRIPTION_RESUMED',
        entity: 'Subscription',
        entityId: subscriptionId
      }
    })

    return subscription
  }

  static async skipSubscriptionDate(subscriptionId: string, skipDate: Date, reason?: string) {
    const skip = await prisma.subscriptionSkip.create({
      data: {
        subscriptionId,
        skipDate,
        reason
      }
    })

    await prisma.auditLog.create({
      data: {
        action: 'SUBSCRIPTION_DATE_SKIPPED',
        entity: 'SubscriptionSkip',
        entityId: skip.id,
        changes: { subscriptionId, skipDate, reason }
      }
    })

    return skip
  }

  static async updateSubscriptionItems(subscriptionId: string, items: Array<{
    productId: string
    quantity: number
    isFlexible?: boolean
  }>) {
    // Delete existing items
    await prisma.subscriptionItem.deleteMany({
      where: { subscriptionId }
    })

    // Create new items
    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        items: {
          create: items
        }
      },
      include: {
        items: { include: { product: true } },
        customer: { include: { user: true } }
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: subscription.customer.userId,
        action: 'SUBSCRIPTION_ITEMS_UPDATED',
        entity: 'Subscription',
        entityId: subscriptionId,
        changes: { items }
      }
    })

    return subscription
  }
}
