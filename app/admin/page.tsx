'use client'

import { useState, useEffect } from 'react'
import { StatCard } from './components/StatCard'
import { RecentOrdersTable } from './components/RecentOrdersTable'
import { QuickActions } from './components/QuickActions'
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  Users, 
  TrendingUp,
  Clock
} from 'lucide-react'

interface DashboardStats {
  todayOrders: number
  ordersInSourcing: number
  deliveriesToday: number
  activeSubscriptions: number
  weeklyRevenue: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    ordersInSourcing: 0,
    deliveriesToday: 0,
    activeSubscriptions: 0,
    weeklyRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  // Simulate loading dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Dummy data
      setStats({
        todayOrders: 47,
        ordersInSourcing: 23,
        deliveriesToday: 15,
        activeSubscriptions: 156,
        weeklyRevenue: 12450.75
      })
      setLoading(false)
    }

    loadDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders}
          change={{ value: 12, type: 'increase', period: 'yesterday' }}
          icon={ShoppingCart}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          loading={loading}
        />
        <StatCard
          title="Orders In Sourcing"
          value={stats.ordersInSourcing}
          change={{ value: 8, type: 'decrease', period: 'last hour' }}
          icon={Package}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          loading={loading}
        />
        <StatCard
          title="Deliveries Today"
          value={stats.deliveriesToday}
          change={{ value: 15, type: 'increase', period: 'yesterday' }}
          icon={Truck}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          loading={loading}
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          change={{ value: 5, type: 'increase', period: 'last week' }}
          icon={Users}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          loading={loading}
        />
        <StatCard
          title="Weekly Revenue"
          value={`₵${stats.weeklyRevenue.toLocaleString()}`}
          change={{ value: 23, type: 'increase', period: 'last week' }}
          icon={TrendingUp}
          iconColor="text-ghana-green"
          iconBgColor="bg-ghana-green/10"
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Additional Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Tasks</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">3 orders awaiting confirmation</p>
                <p className="text-xs text-gray-500">Pending for 2+ hours</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">5 orders ready for packing</p>
                <p className="text-xs text-gray-500">Ready to process</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <Truck className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">2 deliveries scheduled for tomorrow</p>
                <p className="text-xs text-gray-500">Route optimization needed</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Order Processing</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Gateway</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Inventory System</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Synced
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Delivery Tracking</span>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Delayed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
