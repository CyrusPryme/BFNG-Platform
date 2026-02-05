'use client'

import { useState, useEffect } from 'react'
import { StatCard } from '../components/StatCard'
import { AdminAuthGate } from '../components/AdminAuthGate'
import { LineChart } from '../components/charts/LineChart'
import { BarChart } from '../components/charts/BarChart'
import { PieChart } from '../components/charts/PieChart'
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  Download
} from 'lucide-react'

interface AnalyticsData {
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  totalSubscriptions: number
  averageOrderValue: number
  subscriptionRevenue: number
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalSubscriptions: 0,
    averageOrderValue: 0,
    subscriptionRevenue: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Dummy analytics data
      setAnalytics({
        totalOrders: 1247,
        totalRevenue: 45680.50,
        totalCustomers: 892,
        totalSubscriptions: 156,
        averageOrderValue: 36.60,
        subscriptionRevenue: 12450.75
      })
      setIsLoading(false)
    }

    fetchAnalytics()
  }, [])

  const exportReport = () => {
    // Simulate report export
    const csvContent = `Metric,Value\nTotal Orders,${analytics.totalOrders}\nTotal Revenue,${analytics.totalRevenue}\nTotal Customers,${analytics.totalCustomers}\nTotal Subscriptions,${analytics.totalSubscriptions}`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bfng-analytics-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Mock data for charts
  const revenueData = [
    { name: 'Jan', revenue: 8500, orders: 120 },
    { name: 'Feb', revenue: 9200, orders: 135 },
    { name: 'Mar', revenue: 10100, orders: 145 },
    { name: 'Apr', revenue: 9800, orders: 140 },
    { name: 'May', revenue: 11200, orders: 165 },
    { name: 'Jun', revenue: 12450, orders: 180 },
  ]

  const orderStatusData = [
    { name: 'Delivered', value: 892 },
    { name: 'In Progress', value: 234 },
    { name: 'Pending', value: 89 },
    { name: 'Cancelled', value: 32 },
  ]

  const categoryData = [
    { name: 'Fresh Produce', value: 450 },
    { name: 'Packaged Goods', value: 320 },
    { name: 'Dairy', value: 280 },
    { name: 'Bakery', value: 195 },
    { name: 'Other', value: 120 },
  ]

  const weeklyData = [
    { name: 'Week 1', orders: 45, revenue: 1650 },
    { name: 'Week 2', orders: 52, revenue: 1890 },
    { name: 'Week 3', orders: 48, revenue: 1720 },
    { name: 'Week 4', orders: 58, revenue: 2100 },
  ]

  return (
    <AdminAuthGate>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your business performance and insights</p>
          </div>
          <button 
            onClick={exportReport}
            className="flex items-center px-4 py-2 bg-ghana-green text-white rounded-lg hover:bg-ghana-green/90 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Orders"
            value={analytics.totalOrders.toLocaleString()}
            change={{ value: 12, type: 'increase', period: 'last month' }}
            icon={ShoppingCart}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
            loading={isLoading}
          />
          <StatCard
            title="Total Revenue"
            value={`₵${analytics.totalRevenue.toLocaleString()}`}
            change={{ value: 8, type: 'increase', period: 'last month' }}
            icon={DollarSign}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
            loading={isLoading}
          />
          <StatCard
            title="Active Customers"
            value={analytics.totalCustomers.toLocaleString()}
            change={{ value: 15, type: 'increase', period: 'last month' }}
            icon={Users}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
            loading={isLoading}
          />
          <StatCard
            title="Active Subscriptions"
            value={analytics.totalSubscriptions}
            change={{ value: 5, type: 'increase', period: 'last month' }}
            icon={Package}
            iconColor="text-orange-600"
            iconBgColor="bg-orange-100"
            loading={isLoading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <LineChart
              data={revenueData}
              lines={[
                { dataKey: 'revenue', stroke: '#10b981', name: 'Revenue (₵)' },
                { dataKey: 'orders', stroke: '#3b82f6', name: 'Orders' }
              ]}
              height={300}
              yAxisFormatter={(value) => `₵${value}`}
              tooltipFormatter={(value, name) => {
                if (name === 'Revenue (₵)') return `₵${value}`
                return value
              }}
            />
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
            <PieChart
              data={orderStatusData}
              height={300}
              innerRadius={60}
              outerRadius={100}
              tooltipFormatter={(value, name) => `${value} orders`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Performance */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
            <BarChart
              data={categoryData}
              bars={[
                { dataKey: 'value', fill: '#8b5cf6', name: 'Units Sold' }
              ]}
              height={300}
              tooltipFormatter={(value, name) => `${value} units`}
            />
          </div>

          {/* Weekly Performance */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance</h3>
            <BarChart
              data={weeklyData}
              bars={[
                { dataKey: 'orders', fill: '#f59e0b', name: 'Orders' },
                { dataKey: 'revenue', fill: '#10b981', name: 'Revenue (₵)' }
              ]}
              height={300}
              tooltipFormatter={(value, name) => {
                if (name === 'Revenue (₵)') return `₵${value}`
                return value
              }}
            />
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Order Value</span>
                <span className="text-lg font-bold">₵{analytics.averageOrderValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Subscription Revenue</span>
                <span className="text-lg font-bold">₵{analytics.subscriptionRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Retention Rate</span>
                <span className="text-lg font-bold text-green-600">87.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Order Completion Rate</span>
                <span className="text-lg font-bold text-green-600">94.2%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trends</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Monthly Growth</span>
                </div>
                <span className="text-sm font-medium text-green-600">+23.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Quarterly Growth</span>
                </div>
                <span className="text-sm font-medium text-green-600">+18.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Year-over-Year</span>
                </div>
                <span className="text-sm font-medium text-green-600">+45.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">New Customers This Month</span>
                </div>
                <span className="text-sm font-medium text-blue-600">+47</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGate>
  )
}
