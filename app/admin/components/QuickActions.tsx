'use client'

import { useState } from 'react'
import { Plus, Users, Package, Truck, BarChart3, Settings } from 'lucide-react'

interface QuickAction {
  title: string
  description: string
  icon: any
  color: string
  bgColor: string
  href: string
}

const quickActions: QuickAction[] = [
  {
    title: 'New Order',
    description: 'Create a new customer order',
    icon: Plus,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    href: '/admin/orders/new'
  },
  {
    title: 'Add Product',
    description: 'Add new product to inventory',
    icon: Package,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    href: '/admin/products/new'
  },
  {
    title: 'Manage Customers',
    description: 'View and manage customer accounts',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    href: '/admin/customers'
  },
  {
    title: 'Delivery Schedule',
    description: 'View today\'s delivery schedule',
    icon: Truck,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    href: '/admin/deliveries'
  },
  {
    title: 'View Analytics',
    description: 'Detailed business analytics',
    icon: BarChart3,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    href: '/admin/analytics'
  },
  {
    title: 'System Settings',
    description: 'Configure system settings',
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    href: '/admin/settings'
  }
]

export function QuickActions() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = (title: string, href: string) => {
    setLoading(title)
    // Simulate navigation delay
    setTimeout(() => {
      setLoading(null)
      // In a real app, this would use Next.js router
      console.log(`Navigate to: ${href}`)
    }, 500)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          const isLoading = loading === action.title

          return (
            <button
              key={action.title}
              onClick={() => handleAction(action.title, action.href)}
              disabled={isLoading}
              className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 hover:border-ghana-green hover:shadow-md transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className={`flex-shrink-0 ${action.bgColor} rounded-lg p-2`}>
                <Icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900">{action.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{action.description}</p>
              </div>
              {isLoading && (
                <div className="flex-shrink-0">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ghana-green"></div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
