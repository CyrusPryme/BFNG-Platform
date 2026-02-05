'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Users, ShoppingCart, AlertTriangle } from 'lucide-react'

const stats = [
  {
    title: 'Orders Today',
    value: '47',
    change: '+12%',
    icon: ShoppingCart,
    color: 'text-blue-600'
  },
  {
    title: 'Pending Substitutions',
    value: '8',
    change: '+3',
    icon: AlertTriangle,
    color: 'text-orange-600'
  },
  {
    title: 'Active Customers',
    value: '1,234',
    change: '+5%',
    icon: Users,
    color: 'text-green-600'
  },
  {
    title: 'Products in Stock',
    value: '156',
    change: '-2',
    icon: Package,
    color: 'text-purple-600'
  }
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
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
              {stat.change} from yesterday
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
