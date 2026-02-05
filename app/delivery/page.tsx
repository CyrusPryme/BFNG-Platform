'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Package, Truck, CheckCircle, Clock, Navigation, Phone } from 'lucide-react'

interface Delivery {
  id: string
  status: string
  scheduledDate: string
  estimatedDeliveryTime?: string
  actualDeliveryTime?: string
  notes?: string
  proofOfDelivery?: {
    photoUrl?: string
    signature?: string
    recipientName?: string
  }
  order: {
    id: string
    orderNumber: string
    total: number
    customer: {
      user: {
        firstName: string
        lastName: string
        phone?: string
      }
    }
    address: {
      street: string
      area: string
      city: string
      region: string
      gpsCoordinates?: string
    }
    items: Array<{
      id: string
      quantity: number
      product: {
        name: string
      }
    }>
  }
}

const statusConfig = {
  PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: Clock },
  ASSIGNED: { color: 'bg-blue-100 text-blue-800', label: 'Assigned', icon: Package },
  OUT_FOR_DELIVERY: { color: 'bg-purple-100 text-purple-800', label: 'Out for Delivery', icon: Truck },
  DELIVERED: { color: 'bg-green-100 text-green-800', label: 'Delivered', icon: CheckCircle },
  FAILED: { color: 'bg-red-100 text-red-800', label: 'Failed', icon: Clock }
}

export default function DeliveryPortalPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    if (session.user.role !== 'DELIVERY') {
      router.push('/')
      return
    }
    
    fetchDeliveries()
  }, [session, router])

  const fetchDeliveries = async () => {
    try {
      const response = await fetch('/api/deliveries')
      if (response.ok) {
        const data = await response.json()
        setDeliveries(data.deliveries || [])
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDeliveries = selectedStatus === 'ALL' 
    ? deliveries 
    : deliveries.filter(delivery => delivery.status === selectedStatus)

  const handleStartDelivery = async (deliveryId: string) => {
    try {
      const response = await fetch(`/api/deliveries/${deliveryId}/start`, {
        method: 'POST'
      })
      if (response.ok) {
        fetchDeliveries()
      }
    } catch (error) {
      console.error('Error starting delivery:', error)
    }
  }

  const handleCompleteDelivery = async (deliveryId: string) => {
    try {
      const response = await fetch(`/api/deliveries/${deliveryId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          proofOfDelivery: {
            recipientName: 'Customer Name', // In real app, this would be collected
            notes: 'Delivered successfully'
          }
        })
      })
      if (response.ok) {
        fetchDeliveries()
      }
    } catch (error) {
      console.error('Error completing delivery:', error)
    }
  }

  const getDirections = (address: any) => {
    const addressString = `${address.street}, ${address.area}, ${address.city}, ${address.region}`
    const encodedAddress = encodeURIComponent(addressString)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Delivery Portal</h1>
        <p className="text-gray-600">
          Manage your delivery assignments and track deliveries
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
            All ({deliveries.length})
          </Button>
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = deliveries.filter(d => d.status === status).length
            if (count === 0) return null
            const StatusIcon = config.icon
            return (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                onClick={() => setSelectedStatus(status)}
                className={config.color}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {config.label} ({count})
              </Button>
            )
          })}
        </div>
      </div>

      {/* Deliveries List */}
      {filteredDeliveries.length === 0 ? (
        <div className="text-center py-16">
          <Truck className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No deliveries found</h2>
          <p className="text-gray-600">
            {selectedStatus === 'ALL' 
              ? "You don't have any deliveries assigned yet." 
              : `No deliveries with status "${statusConfig[selectedStatus as keyof typeof statusConfig]?.label}".`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredDeliveries.map((delivery) => {
            const statusInfo = statusConfig[delivery.status as keyof typeof statusConfig]
            const StatusIcon = statusInfo.icon
            
            return (
              <Card key={delivery.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Order {delivery.order.orderNumber}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Customer: {delivery.order.customer.user.firstName} {delivery.order.customer.user.lastName}
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
                    {/* Delivery Details */}
                    <div>
                      <h4 className="font-medium mb-3">Delivery Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                          <div>
                            <p className="font-medium">Delivery Address:</p>
                            <p className="text-gray-600">
                              {delivery.order.address.street},<br />
                              {delivery.order.address.area}, {delivery.order.address.city}<br />
                              {delivery.order.address.region}
                            </p>
                            {delivery.order.address.gpsCoordinates && (
                              <p className="text-xs text-gray-500">
                                GPS: {delivery.order.address.gpsCoordinates}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{delivery.order.customer.user.phone || 'No phone number'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span>{delivery.order.items.length} items</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Total:</span>
                          <span>GH₵{delivery.order.total.toFixed(2)}</span>
                        </div>
                        
                        {delivery.scheduledDate && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>Scheduled: {new Date(delivery.scheduledDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-3">Order Items</h4>
                      <div className="space-y-1 text-sm">
                        {delivery.order.items.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.quantity}x {item.product.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-6 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => getDirections(delivery.order.address)}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    
                    <Link href={`/delivery/${delivery.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    
                    {delivery.status === 'ASSIGNED' && (
                      <Button
                        size="sm"
                        onClick={() => handleStartDelivery(delivery.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Start Delivery
                      </Button>
                    )}
                    
                    {delivery.status === 'OUT_FOR_DELIVERY' && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteDelivery(delivery.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Delivered
                      </Button>
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
