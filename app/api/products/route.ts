import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {
      isActive: true
    }

    if (category) {
      where.category = {
        slug: category
      }
    }

    if (type) {
      where.type = type.toUpperCase()
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          vendor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          inventory: {
            where: {
              type: 'HARD'
            },
            orderBy: {
              updatedAt: 'desc'
            },
            take: 1
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { name: 'asc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'VENDOR'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      categoryId,
      type,
      basePrice,
      bulkPrice,
      bulkMinQty,
      unit,
      vendorId,
      commissionRate,
      allowSubstitution = true,
      isFeatured = false,
      images = []
    } = body

    // Validate required fields
    if (!name || !slug || !categoryId || !type || !basePrice || !unit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug is unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      )
    }

    // For vendors, ensure they can only create products for themselves
    if (session.user.role === 'VENDOR') {
      const vendor = await prisma.vendor.findUnique({
        where: { userId: session.user.id }
      })
      
      if (!vendor || vendorId !== vendor.id) {
        return NextResponse.json(
          { error: 'Vendors can only create products for themselves' },
          { status: 403 }
        )
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        type: type.toUpperCase(),
        basePrice,
        bulkPrice,
        bulkMinQty,
        unit,
        vendorId,
        commissionRate,
        allowSubstitution,
        isFeatured,
        isActive: false, // Requires admin approval
        images
      },
      include: {
        category: true,
        vendor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    // Log product creation
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'PRODUCT_CREATED',
        entity: 'Product',
        entityId: product.id,
        changes: {
          name,
          type: product.type,
          basePrice
        }
      }
    })

    return NextResponse.json({
      product,
      message: session.user.role === 'VENDOR' 
        ? 'Product created and pending admin approval'
        : 'Product created successfully'
    })
  } catch (error) {
    console.error('POST /api/products error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
