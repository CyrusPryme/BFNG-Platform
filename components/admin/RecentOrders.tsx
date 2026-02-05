'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Package, Truck } from 'lucide-react'

const recentOrders = [
  {
    id: 'ORD-001',
    customer: 'Ama Mensah',
    items: 12,
    total: 156.50,
    status: 'IN_SOURCING',
    priority: 'high',
    deliveryDate: '2024-01-15'
  },
  {
    id: 'ORD-002',
    customer: 'Kofi Asante',
    items: 8,
    total: 98.00,
    status: 'SUBSTITUTION_REQUIRED',
    priority: 'urgent',
    deliveryDate: '2024-01-15'
  },
  {
    id: 'ORD-003',
    customer: 'Adwoa Serwaa',
    items: 15,
    total: 234.75,
    status: 'PACKED',
    priority: 'normal',
    deliveryDate: '2024-01-14'
  }
]

const statusColors = {
  RECEIVED: 'bg-gray-100 text-gray-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  IN_SOURCING: 'bg-yellow-100 text-yellow-800',
  SUBSTITUTION_REQUIRED: 'bg-orange-100 text-orange-800',
  PACKED: 'bg-purple-100 text-purple-800',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800'
}

const priorityColors = {
  normal: 'bg-gray-100 text-gray-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600'
}

export function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{order.id}</span>
                  <Badge variant="outline" className={priorityColors[order.priority as keyof typeof priorityColors]}>
                    {order.priority}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">{order.customer}</div>
                <div className="text-xs text-gray-500">
                  {order.items} items • GH₵{order.total.toFixed(2)}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                  {order.status.replace('_', ' ')}
                </Badge>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Button variant="outline" className="w-full">
            View All Orders
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
