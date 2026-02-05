import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/orders
 * List orders with filters
 */
export async function GET(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions);
    
    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    const weekNumber = searchParams.get('weekNumber');

    // Build where clause
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (customerId) {
      where.customerId = customerId;
    }
    // } else if (session.user.role === 'CUSTOMER') {
    //   // Customers can only see their own orders
    //   where.customerId = session.user.customer?.id;
    // }
    
    if (weekNumber) {
      where.weekNumber = parseInt(weekNumber);
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        address: true,
        delivery: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * Create a new order
 */
export async function POST(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions);
    
    // if (!session || session.user.role !== 'CUSTOMER') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const body = await request.json();
    const {
      addressId,
      items,
      deliveryFee,
      discount,
      customerNotes,
      subscriptionId,
    } = body;

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Validate address belongs to customer
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        customerId: session.user.customer?.id,
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: 'Invalid delivery address' },
        { status: 400 }
      );
    }

    // Get product prices
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Some products are not available' },
        { status: 400 }
      );
    }

    // Calculate prices
    const orderItems = items.map((item: any) => {
      const product = products.find((p: any) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      // Use bulk price if applicable
      const unitPrice =
        product.bulkPrice && 
        product.bulkMinQty && 
        item.quantity >= product.bulkMinQty
          ? product.bulkPrice
          : product.basePrice;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity
      };
    });

    // Calculate totals
    const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
    const total = subtotal + (deliveryFee || 0) - (discount || 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: `BFNG${Date.now()}`,
        customerId: session.user.customer!.id,
        addressId,
        status: 'RECEIVED',
        subtotal,
        deliveryFee,
        discount,
        total,
        customerNotes,
        subscriptionId,
        items: {
          create: orderItems
        }
      },
      include: {
        items: { include: { product: true } },
        customer: { include: { user: true } },
        address: true
      }
    });

    return NextResponse.json({ 
      order,
      message: 'Order created successfully' 
    });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/orders/:id
 * Update order status
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id?: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    
    // if (!session || !['ADMIN', 'SHOPPER'].includes(session.user.role)) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const body = await request.json();
    const { status, metadata } = body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: { include: { product: true } },
        customer: { include: { user: true } },
        address: true
      }
    });

    return NextResponse.json({ 
      order,
      message: 'Order updated successfully' 
    });
  } catch (error: any) {
    console.error('PATCH /api/orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}
