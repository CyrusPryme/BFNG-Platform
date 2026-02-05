import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions)
    
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'

    // Calculate date range
    const now = new Date()
    let startDate: Date
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Get overview stats
    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalSubscriptions,
      activeSubscriptions,
      pausedSubscriptions
    ] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate },
          status: 'COMPLETED'
        },
        _sum: {
          total: true
        }
      }),
      prisma.customer.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      prisma.subscription.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      prisma.subscription.count({
        where: {
          status: 'ACTIVE'
        }
      }),
      prisma.subscription.count({
        where: {
          status: 'PAUSED'
        }
      })
    ])

    const subscriptionRevenue = await prisma.subscription.aggregate({
      where: {
        status: 'ACTIVE'
      },
      _sum: {
        totalAmount: true,
        discountAmount: true
      }
    })

    // Get order stats by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: { gte: startDate }
      },
      _count: true
    })

    // Get weekly order trends
    const weeklyOrders = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('week', "createdAt") as week,
        COUNT(*) as orders,
        COALESCE(SUM("total"), 0) as revenue
      FROM "Order" 
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('week', "createdAt")
      ORDER BY week DESC
      LIMIT 12
    `

    // Get monthly trends
    const monthlyTrends = await prisma.$queryRaw`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        COUNT(*) as orders,
        COALESCE(SUM("total"), 0) as revenue
      FROM "Order" 
      WHERE "createdAt" >= ${startDate}
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 12
    `

    // Get top selling products
    const topSellingProducts = await prisma.$queryRaw`
      SELECT 
        p.id as "productId",
        p.name,
        COALESCE(SUM(oi.quantity), 0) as quantity,
        COALESCE(SUM(oi."totalPrice"), 0) as revenue
      FROM "OrderItem" oi
      JOIN "Product" p ON oi."productId" = p.id
      JOIN "Order" o ON oi."orderId" = o.id
      WHERE o."createdAt" >= ${startDate} AND o.status = 'COMPLETED'
      GROUP BY p.id, p.name
      ORDER BY quantity DESC
      LIMIT 20
    `

    // Get category breakdown
    const categoryBreakdown = await prisma.$queryRaw`
      SELECT 
        c.name as category,
        COALESCE(SUM(oi.quantity), 0) as quantity,
        COALESCE(SUM(oi."totalPrice"), 0) as revenue
      FROM "OrderItem" oi
      JOIN "Product" p ON oi."productId" = p.id
      JOIN "Category" c ON p."categoryId" = c.id
      JOIN "Order" o ON oi."orderId" = o.id
      WHERE o."createdAt" >= ${startDate} AND o.status = 'COMPLETED'
      GROUP BY c.name
      ORDER BY revenue DESC
    `

    // Get subscription stats by frequency
    const subscriptionsByFrequency = await prisma.subscription.groupBy({
      by: ['frequency'],
      _count: true
    })

    // Get vendor stats
    const [totalVendors, activeVendors] = await Promise.all([
      prisma.vendor.count(),
      prisma.vendor.count({
        where: {
          isActive: true,
          isApproved: true
        }
      })
    ])

    const totalCommissions = await prisma.vendorCommission.aggregate({
      where: {
        createdAt: { gte: startDate },
        status: 'PENDING'
      },
      _sum: {
        amount: true
      }
    })

    const topPerformingVendors = await prisma.$queryRaw`
      SELECT 
        v.id as "vendorId",
        v."businessName",
        COALESCE(SUM(o.total), 0) as revenue,
        COALESCE(SUM(vc.amount), 0) as commission
      FROM "Vendor" v
      LEFT JOIN "Product" p ON v.id = p."vendorId"
      LEFT JOIN "OrderItem" oi ON p.id = oi."productId"
      LEFT JOIN "Order" o ON oi."orderId" = o.id
      LEFT JOIN "VendorCommission" vc ON v.id = vc."vendorId"
      WHERE o."createdAt" >= ${startDate} AND o.status = 'COMPLETED'
      GROUP BY v.id, v."businessName"
      ORDER BY revenue DESC
      LIMIT 10
    `

    const analytics = {
      overview: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        totalCustomers,
        totalSubscriptions,
        averageOrderValue: totalOrders > 0 ? (totalRevenue._sum.total || 0) / totalOrders : 0,
        subscriptionRevenue: (subscriptionRevenue._sum.totalAmount || 0) - (subscriptionRevenue._sum.discountAmount || 0)
      },
      orderStats: {
        byStatus: ordersByStatus.reduce((acc, item) => {
          acc[item.status] = item._count
          return acc
        }, {} as Record<string, number>),
        byWeek: weeklyOrders,
        monthlyTrend: monthlyTrends
      },
      productStats: {
        topSelling: topSellingProducts,
        categoryBreakdown
      },
      subscriptionStats: {
        total: totalSubscriptions,
        active: activeSubscriptions,
        paused: pausedSubscriptions,
        churnRate: totalSubscriptions > 0 ? ((totalSubscriptions - activeSubscriptions) / totalSubscriptions) * 100 : 0,
        byFrequency: subscriptionsByFrequency.reduce((acc, item) => {
          acc[item.frequency] = item._count
          return acc
        }, {} as Record<string, number>),
        monthlyRevenue: (subscriptionRevenue._sum.totalAmount || 0) - (subscriptionRevenue._sum.discountAmount || 0)
      },
      vendorStats: {
        total: totalVendors,
        active: activeVendors,
        totalCommissions: totalCommissions._sum.amount || 0,
        topPerformers: topPerformingVendors
      }
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions)
    
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    // Handle analytics export
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'
    const format = searchParams.get('format') || 'csv'

    // Calculate date range
    const now = new Date()
    let startDate: Date
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Get data for export
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      include: {
        customer: {
          include: {
            user: true
          }
        },
        items: {
          include: {
            product: true
          }
        },
        address: true
      }
    })

    // Generate CSV content
    const headers = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Status',
      'Total',
      'Created At',
      'Items Count',
      'Delivery Address'
    ]

    const rows = orders.map(order => [
      order.orderNumber,
      `${order.customer.user.firstName} ${order.customer.user.lastName}`,
      order.customer.user.email,
      order.status,
      order.total.toString(),
      order.createdAt.toISOString(),
      order.items.length.toString(),
      `${order.address?.street || ''}, ${order.address?.area || ''}, ${order.address?.city || ''}`
    ])

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export analytics' },
      { status: 500 }
    )
  }
}
