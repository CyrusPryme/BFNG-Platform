'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  status: string
  subtotal: number
  deliveryFee: number
  total: number
  createdAt: string
  requestedDeliveryDate?: string
  items: Array<{
    id: string
    quantity: number
    unitPrice: number
    totalPrice: number
    product: {
      id: string
      name: string
      unit: string
      images?: string[]
    }
  }>
  address: {
    street: string
    area: string
    city: string
  }
}

const statusConfig = {
  RECEIVED: { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Received' },
  CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: Package, label: 'Confirmed' },
  AWAITING_PAYMENT: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Awaiting Payment' },
  PAID: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Paid' },
  IN_SOURCING: { color: 'bg-purple-100 text-purple-800', icon: Package, label: 'In Sourcing' },
  SUBSTITUTION_REQUIRED: { color: 'bg-orange-100 text-orange-800', icon: Clock, label: 'Substitution Required' },
  READY_FOR_PACKING: { color: 'bg-indigo-100 text-indigo-800', icon: Package, label: 'Ready for Packing' },
  PACKED: { color: 'bg-blue-100 text-blue-800', icon: Package, label: 'Packed' },
  OUT_FOR_DELIVERY: { color: 'bg-cyan-100 text-cyan-800', icon: Truck, label: 'Out for Delivery' },
  DELIVERED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Delivered' },
  COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Completed' },
  CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
  FAILED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Failed' },
  REFUNDED: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Refunded' }
}

export default function CustomerOrdersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    fetchOrders()
  }, [session, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOrders = selectedStatus === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus)

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-gray-600">
          Track and manage your grocery orders
        </p>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedStatus === 'ALL' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('ALL')}
            className="bg-ghana-green hover:bg-ghana-green/90"
          >
            All ({orders.length})
          </Button>
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = statusCounts[status] || 0
            if (count === 0) return null
            return (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                onClick={() => setSelectedStatus(status)}
                className={config.color}
              >
                {config.label} ({count})
              </Button>
            )
          })}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No orders found</h2>
          <p className="text-gray-600 mb-6">
            {selectedStatus === 'ALL' 
              ? "You haven't placed any orders yet." 
              : `No orders with status "${statusConfig[selectedStatus as keyof typeof statusConfig]?.label}".`
            }
          </p>
          <Link href="/shop">
            <Button className="bg-ghana-green hover:bg-ghana-green/90">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusInfo = statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = statusInfo.icon
            
            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-3">Items ({order.items.length})</h4>
                      <div className="space-y-2">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.quantity}x {item.product.name}
                            </span>
                            <span>GH₵{item.totalPrice.toFixed(2)}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-gray-600">
                            +{order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div>
                      <h4 className="font-medium mb-3">Order Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>GH₵{order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery:</span>
                          <span>GH₵{order.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total:</span>
                          <span>GH₵{order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          <strong>Delivery Address:</strong><br />
                          {order.address.street}, {order.address.area}, {order.address.city}
                        </p>
                        {order.requestedDeliveryDate && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Requested Delivery:</strong><br />
                            {new Date(order.requestedDeliveryDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-6 pt-4 border-t">
                    <Link href={`/customer/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    
                    {order.status === 'SUBSTITUTION_REQUIRED' && (
                      <Link href={`/customer/orders/${order.id}/substitutions`}>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                          Review Substitutions
                        </Button>
                      </Link>
                    )}
                    
                    {order.status === 'AWAITING_PAYMENT' && (
                      <Link href={`/customer/orders/${order.id}/payment`}>
                        <Button size="sm" className="bg-ghana-green hover:bg-ghana-green/90">
                          Pay Now
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
