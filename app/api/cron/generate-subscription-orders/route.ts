import { NextRequest, NextResponse } from 'next/server'
import { SubscriptionEngine } from '@/lib/subscription-engine'
import { prisma } from '@/lib/prisma'

// This endpoint should be called by a cron job daily at 8 AM
export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron job call (you can add authentication here)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting subscription order generation...')
    
    const generatedOrders = await SubscriptionEngine.generateSubscriptionOrders()
    
    console.log(`Generated ${generatedOrders.length} subscription orders`)

    // Log the cron job execution
    await prisma.auditLog.create({
      data: {
        userId: 'system',
        action: 'CRON_SUBSCRIPTION_GENERATION',
        entity: 'System',
        entityId: 'cron',
        changes: {
          ordersGenerated: generatedOrders.length,
          timestamp: new Date().toISOString()
        }
      }
    })

    return NextResponse.json({
      success: true,
      ordersGenerated: generatedOrders.length,
      orders: generatedOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerId: order.customerId,
        total: order.total
      })),
      message: `Successfully generated ${generatedOrders.length} subscription orders`
    })
  } catch (error) {
    console.error('Subscription generation cron error:', error)
    
    // Log the error
    await prisma.auditLog.create({
      data: {
        userId: 'system',
        action: 'CRON_SUBSCRIPTION_GENERATION_ERROR',
        entity: 'System',
        entityId: 'cron',
        changes: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      }
    })

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate subscription orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
