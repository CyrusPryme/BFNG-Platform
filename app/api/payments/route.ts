import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import crypto from 'crypto'

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
    const { orderId, amount, paymentMethod, reference } = body

    // Validate required fields
    if (!orderId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if user can pay for this order
    if (session.user.role === 'CUSTOMER') {
      const customer = await prisma.customer.findUnique({
        where: { userId: session.user.id }
      })
      if (!customer || order.customerId !== customer.id) {
        return NextResponse.json(
          { error: 'Cannot pay for this order' },
          { status: 403 }
        )
      }
    }

    // Check if payment amount matches order total
    if (amount !== order.total) {
      return NextResponse.json(
        { error: 'Payment amount does not match order total' },
        { status: 400 }
      )
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount,
        method: paymentMethod.toUpperCase(),
        status: 'PENDING',
        reference: reference || `PAY-${Date.now()}`,
        metadata: {
          userId: session.user.id,
          timestamp: new Date().toISOString()
        }
      }
    })

    // For Paystack integration, generate payment URL
    if (paymentMethod.toLowerCase() === 'paystack') {
      const paystackData = await generatePaystackPayment(order, payment)
      
      return NextResponse.json({
        payment,
        paymentUrl: paystackData.authorization_url,
        access_code: paystackData.access_code,
        message: 'Payment initiated'
      })
    }

    // For other payment methods, mark as pending
    return NextResponse.json({
      payment,
      message: 'Payment recorded successfully'
    })
  } catch (error) {
    console.error('POST /api/payments error:', error)
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const status = searchParams.get('status')

    // Build where clause
    const where: any = {}
    
    if (orderId) {
      where.orderId = orderId
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    // For customers, only show their own payments
    if (session?.user.role === 'CUSTOMER') {
      const customer = await prisma.customer.findUnique({
        where: { userId: session.user.id }
      })
      if (customer) {
        where.order = {
          customerId: customer.id
        }
      }
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        order: {
          select: {
            orderNumber: true,
            total: true,
            customer: {
              select: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ payments })
  } catch (error) {
    console.error('GET /api/payments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// Paystack webhook handler
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get('x-paystack-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const secret = process.env.PAYSTACK_SECRET_KEY
    if (!secret) {
      return NextResponse.json(
        { error: 'Paystack secret not configured' },
        { status: 500 }
      )
    }

    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(body))
      .digest('hex')

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const { event, data } = body

    if (event === 'charge.success') {
      // Find payment by reference
      const payment = await prisma.payment.findUnique({
        where: { reference: data.reference },
        include: { order: true }
      })

      if (payment && payment.status === 'PENDING') {
        // Update payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'SUCCESS',
            paidAt: new Date(),
            metadata: {
              ...payment.metadata,
              paystackData: data
            }
          }
        })

        // Update order status
        if (payment.order.status === 'AWAITING_PAYMENT') {
          await prisma.order.update({
            where: { id: payment.orderId },
            data: {
              status: 'PAID',
              paidAt: new Date()
            }
          })
        }

        // Log successful payment
        await prisma.auditLog.create({
          data: {
            userId: payment.metadata?.userId || 'system',
            action: 'PAYMENT_SUCCESS',
            entity: 'Payment',
            entityId: payment.id,
            changes: {
              reference: data.reference,
              amount: data.amount,
              orderNumber: payment.order.orderNumber
            }
          }
        })
      }
    } else if (event === 'charge.failed') {
      // Handle failed payment
      const payment = await prisma.payment.findUnique({
        where: { reference: data.reference }
      })

      if (payment && payment.status === 'PENDING') {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
            metadata: {
              ...payment.metadata,
              paystackData: data
            }
          }
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('PUT /api/payments (webhook) error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}

async function generatePaystackPayment(order: any, payment: any) {
  // This would integrate with actual Paystack API
  // For now, return mock data
  return {
    authorization_url: `https://checkout.paystack.com/${payment.id}`,
    access_code: `access_${payment.id}`,
    reference: payment.reference
  }
}
