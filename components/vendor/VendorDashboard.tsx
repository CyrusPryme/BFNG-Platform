'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, TrendingUp, DollarSign, Star } from 'lucide-react'

const vendorStats = [
  {
    title: 'Active Products',
    value: '12',
    change: '+2',
    icon: Package,
    color: 'text-blue-600'
  },
  {
    title: 'Monthly Sales',
    value: 'GH₵2,450',
    change: '+15%',
    icon: TrendingUp,
    color: 'text-green-600'
  },
  {
    title: 'Pending Orders',
    value: '8',
    change: '+3',
    icon: DollarSign,
    color: 'text-orange-600'
  },
  {
    title: 'Average Rating',
    value: '4.8',
    change: '+0.2',
    icon: Star,
    color: 'text-yellow-600'
  }
]

const recentProducts = [
  {
    id: '1',
    name: 'Organic Shea Butter',
    status: 'APPROVED',
    price: 45.00,
    stock: 50,
    sales: 23
  },
  {
    id: '2',
    name: 'Handwoven Baskets',
    status: 'PENDING',
    price: 85.00,
    stock: 15,
    sales: 0
  },
  {
    id: '3',
    name: 'Natural Honey',
    status: 'APPROVED',
    price: 65.00,
    stock: 30,
    sales: 18
  }
]

export function VendorDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vendorStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{product.name}</span>
                    <Badge variant={product.status === 'APPROVED' ? 'default' : 'secondary'}>
                      {product.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    GH₵{product.price.toFixed(2)} • {product.stock} in stock • {product.sales} sold
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <Button className="w-full">
              Add New Product
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
