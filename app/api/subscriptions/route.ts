import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
// import { SubscriptionEngine } from '@/lib/subscription-engine'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const status = searchParams.get('status')

    // Build where clause
    const where: any = {}
    
    if (customerId) {
      where.customerId = customerId
    } else if (session?.user.role === 'CUSTOMER') {
      // Customers can only see their own subscriptions
      const customer = await prisma.customer.findUnique({
        where: { userId: session.user.id }
      })
      if (customer) {
        where.customerId = customer.id
      }
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    const subscriptions = await prisma.subscription.findMany({
      where,
      include: {
        items: {
          include: { product: true }
        },
        customer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error('GET /api/subscriptions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      frequency,
      basePrice,
      deliveryFee,
      startDate,
      endDate,
      preferredDeliveryDay,
      addressId,
      items
    } = body

    // Validate required fields
    if (!name || !frequency || !basePrice || !startDate || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get customer ID
    let customerId
    if (session.user.role === 'CUSTOMER') {
      const customer = await prisma.customer.findUnique({
        where: { userId: session.user.id }
      })
      if (!customer) {
        return NextResponse.json(
          { error: 'Customer profile not found' },
          { status: 404 }
        )
      }
      customerId = customer.id
    } else if (session.user.role === 'ADMIN') {
      customerId = body.customerId
      if (!customerId) {
        return NextResponse.json(
          { error: 'Customer ID required for admin' },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Validate address belongs to customer
    if (addressId) {
      const address = await prisma.address.findFirst({
        where: {
          id: addressId,
          customerId
        }
      })
      if (!address) {
        return NextResponse.json(
          { error: 'Invalid delivery address' },
          { status: 400 }
        )
      }
    }

    // Validate items
    const productIds = items.map((item: any) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true
      }
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Some products are not available' },
        { status: 400 }
      )
    }

    // Create subscription
    // const subscription = await SubscriptionEngine.createSubscription({
    //   customerId,
    //   name,
    //   description,
    //   frequency: frequency.toUpperCase(),
    //   basePrice,
    //   deliveryFee: deliveryFee || 0,
    //   startDate: new Date(startDate),
    //   endDate: endDate ? new Date(endDate) : undefined,
    //   preferredDeliveryDay,
    //   addressId,
    //   items: items.map((item: any) => ({
    //     productId: item.productId,
    //     quantity: item.quantity,
    //     isFlexible: item.isFlexible || false
    //   }))
    // })
    
    // Return mock response for now
    const subscription = {
      id: `sub-${Date.now()}`,
      customerId,
      name,
      description,
      frequency: frequency.toUpperCase(),
      status: 'ACTIVE',
      createdAt: new Date(),
      endDate: endDate ? new Date(endDate) : undefined,
      preferredDeliveryDay,
      addressId,
      items: items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        isFlexible: item.isFlexible || false
      }))
    }

    return NextResponse.json({
      subscription,
      message: 'Subscription created successfully'
    })
  } catch (error) {
    console.error('POST /api/subscriptions error:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
