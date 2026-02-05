import { NextRequest, NextResponse } from 'next/server'
// import { OrderStateMachine } from '@/lib/order-state-machine'
import { prisma } from '@/lib/prisma'

// This endpoint should be called by a cron job on Thursday morning
export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron job call
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting weekly bulk buying process...')
    
    // Process weekly bulk buying
    // const orders = await OrderStateMachine.processWeeklyBulkBuying()
    const orders: any[] = []
    
    console.log(`Processed ${orders.length} orders for bulk buying`)

    // Generate bulk shopping list
    const bulkShoppingList = await generateBulkShoppingList()
    
    console.log(`Generated shopping list with ${bulkShoppingList.length} unique products`)

    // Log the cron job execution
    await prisma.auditLog.create({
      data: {
        userId: 'system',
        action: 'CRON_WEEKLY_BULK_BUYING',
        metadata: JSON.stringify({
          ordersProcessed: orders.length,
          productsInShoppingList: bulkShoppingList.length,
          timestamp: new Date().toISOString()
        })
      }
    })

    return NextResponse.json({
      success: true,
      ordersProcessed: orders.length,
      shoppingList: bulkShoppingList.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        totalQuantity: item.totalQuantity,
        orderCount: item.orderCount,
        orders: item.orders
      })),
      message: `Successfully processed ${orders.length} orders for bulk buying`
    })
  } catch (error) {
    console.error('Weekly bulk buying cron error:', error);
    
    // Log error
    await prisma.auditLog.create({
      data: {
        userId: 'system',
        action: 'CRON_WEEKLY_BULK_BUYING_ERROR',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        })
      }
    })

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process weekly bulk buying',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

async function generateBulkShoppingList() {
  const today = new Date()
  const thursday = new Date(today)
  thursday.setDate(today.getDate() + ((4 - today.getDay() + 7) % 7))
  
  // Get all paid orders for this week's bulk buying
  const orders = await prisma.order.findMany({
    where: {
      status: 'PAID',
      buyingCycleDate: thursday
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  // Aggregate items by product
  const aggregated = new Map()
  
  for (const order of orders) {
    for (const item of order.items) {
      const key = item.productId
      const existing = aggregated.get(key)
      
      if (existing) {
        existing.totalQuantity += item.quantity
        existing.orderCount += 1
        existing.orders.push(order.orderNumber)
      } else {
        aggregated.set(key, {
          product: item.product,
          totalQuantity: item.quantity,
          orderCount: 1,
          orders: [order.orderNumber]
        })
      }
    }
  }

  return Array.from(aggregated.values())
}
