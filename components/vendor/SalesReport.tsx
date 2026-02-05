'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

const salesData = [
  {
    month: 'January',
    sales: 2450,
    orders: 45,
    commission: 367.50
  },
  {
    month: 'February',
    sales: 3200,
    orders: 58,
    commission: 480.00
  },
  {
    month: 'March',
    sales: 2890,
    orders: 52,
    commission: 433.50
  }
]

const topProducts = [
  {
    name: 'Organic Shea Butter',
    sales: 23,
    revenue: 1035.00
  },
  {
    name: 'Natural Honey',
    sales: 18,
    revenue: 1170.00
  },
  {
    name: 'Handwoven Baskets',
    sales: 8,
    revenue: 680.00
  }
]

export function SalesReport() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData.map((month) => (
              <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{month.month}</p>
                  <p className="text-sm text-gray-600">{month.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">GH₵{month.sales.toFixed(2)}</p>
                  <p className="text-sm text-ghana-green">Commission: GH₵{month.commission.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-ghana-green/20 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">GH₵{product.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-ghana-green" />
              <p className="text-2xl font-bold">GH₵1,281.00</p>
              <p className="text-sm text-gray-600">Total Commission</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold">+15%</p>
              <p className="text-sm text-gray-600">vs Last Month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
