'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Pause, Play, SkipForward, Edit, Trash2 } from 'lucide-react'

interface Subscription {
  id: string
  name: string
  description?: string
  frequency: string
  basePrice: number
  deliveryFee: number
  status: string
  nextOrderDate: string
  startDate: string
  endDate?: string
  items: Array<{
    id: string
    quantity: number
    isFlexible: boolean
    product: {
      id: string
      name: string
      unit: string
      basePrice: number
    }
  }>
  customer: {
    user: {
      firstName: string
      lastName: string
    }
  }
}

const statusConfig = {
  ACTIVE: { color: 'bg-green-100 text-green-800', label: 'Active' },
  PAUSED: { color: 'bg-yellow-100 text-yellow-800', label: 'Paused' },
  CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
}

const frequencyConfig = {
  WEEKLY: 'Every week',
  BIWEEKLY: 'Every 2 weeks',
  MONTHLY: 'Every month'
}

export default function CustomerSubscriptionsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    fetchSubscriptions()
  }, [session, router])

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions')
      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data.subscriptions || [])
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePauseSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/pause`, {
        method: 'POST'
      })
      if (response.ok) {
        fetchSubscriptions()
      }
    } catch (error) {
      console.error('Error pausing subscription:', error)
    }
  }

  const handleResumeSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/resume`, {
        method: 'POST'
      })
      if (response.ok) {
        fetchSubscriptions()
      }
    } catch (error) {
      console.error('Error resuming subscription:', error)
    }
  }

  const handleSkipDate = async (subscriptionId: string, date: string) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/skip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skipDate: date })
      })
      if (response.ok) {
        fetchSubscriptions()
      }
    } catch (error) {
      console.error('Error skipping subscription date:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Subscriptions</h1>
          <p className="text-gray-600">
            Manage your recurring grocery deliveries
          </p>
        </div>
        <Link href="/subscriptions">
          <Button className="bg-ghana-green hover:bg-ghana-green/90">
            Create New Subscription
          </Button>
        </Link>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No subscriptions yet</h2>
          <p className="text-gray-600 mb-6">
            Set up recurring deliveries to save time and money.
          </p>
          <Link href="/subscriptions">
            <Button className="bg-ghana-green hover:bg-ghana-green/90">
              Create Your First Subscription
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {subscriptions.map((subscription) => {
            const statusInfo = statusConfig[subscription.status as keyof typeof statusConfig]
            const frequencyInfo = frequencyConfig[subscription.frequency as keyof typeof frequencyConfig]
            const totalMonthly = subscription.basePrice + subscription.deliveryFee
            
            return (
              <Card key={subscription.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{subscription.name}</CardTitle>
                      <p className="text-gray-600">{subscription.description}</p>
                    </div>
                    <Badge className={statusInfo.color}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Subscription Details */}
                    <div>
                      <h4 className="font-medium mb-3">Subscription Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Frequency:</span>
                          <span>{frequencyInfo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Base Price:</span>
                          <span>GH₵{subscription.basePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery Fee:</span>
                          <span>GH₵{subscription.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total per delivery:</span>
                          <span>GH₵{totalMonthly.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next delivery:</span>
                          <span>{new Date(subscription.nextOrderDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Started:</span>
                          <span>{new Date(subscription.startDate).toLocaleDateString()}</span>
                        </div>
                        {subscription.endDate && (
                          <div className="flex justify-between">
                            <span>Ends:</span>
                            <span>{new Date(subscription.endDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h4 className="font-medium mb-3">Items ({subscription.items.length})</h4>
                      <div className="space-y-2">
                        {subscription.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.quantity}x {item.product.name}
                              {item.isFlexible && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  Flexible
                                </Badge>
                              )}
                            </span>
                            <span>GH₵{(item.quantity * item.product.basePrice).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-6 pt-4 border-t">
                    <Link href={`/customer/subscriptions/${subscription.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    
                    {subscription.status === 'ACTIVE' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePauseSubscription(subscription.id)}
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSkipDate(subscription.id, subscription.nextOrderDate)}
                        >
                          <SkipForward className="h-4 w-4 mr-2" />
                          Skip Next
                        </Button>
                      </>
                    )}
                    
                    {subscription.status === 'PAUSED' && (
                      <Button 
                        size="sm"
                        onClick={() => handleResumeSubscription(subscription.id)}
                        className="bg-ghana-green hover:bg-ghana-green/90"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    
                    {subscription.status === 'ACTIVE' && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to cancel this subscription?')) {
                            // Handle cancellation
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Cancel
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
