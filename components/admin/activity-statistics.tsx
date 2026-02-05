'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  ShoppingCart,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { activityLogger } from '@/lib/activity-logger'
import { 
  ActivityStatistics as IActivityStatistics,
  ActivityType,
  ActivityCategory,
  ActivitySeverity,
  ACTIVITY_TYPE_DISPLAY,
  ACTIVITY_CATEGORY_DISPLAY,
  ACTIVITY_SEVERITY_DISPLAY
} from '@/types/activity-log'

interface StatCardProps {
  title: string
  value: number
  change?: number
  icon: React.ReactNode
  color: string
}

function StatCard({ title, value, change, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-1 text-sm ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className={`${color} rounded-full p-3`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export function ActivityStatistics() {
  const [statistics, setStatistics] = useState<IActivityStatistics | null>(null)
  const [loading, setLoading] = useState(true)

  const loadStatistics = async () => {
    setLoading(true)
    try {
      const stats = activityLogger.getStatistics()
      setStatistics(stats)
    } catch (error) {
      console.error('Failed to load activity statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStatistics()
    // Refresh every 30 seconds
    const interval = setInterval(loadStatistics, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Failed to load statistics</p>
      </div>
    )
  }

  // Get top activities by type
  const topActivitiesByType = Object.entries(statistics.byType)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Get top activities by user
  const topUsers = Object.entries(statistics.byUser)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Calculate daily trend
  const dailyTrend = statistics.dailyTrends.slice(-7)
  const todayCount = dailyTrend[dailyTrend.length - 1]?.count || 0
  const yesterdayCount = dailyTrend[dailyTrend.length - 2]?.count || 0
  const dailyChange = yesterdayCount > 0 ? ((todayCount - yesterdayCount) / yesterdayCount) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Activities"
          value={statistics.total}
          change={dailyChange}
          icon={<Activity className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Order Changes"
          value={statistics.byType[ActivityType.ORDER_STATE_CHANGE] || 0}
          icon={<ShoppingCart className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Product Actions"
          value={(statistics.byType[ActivityType.PRODUCT_EDIT] || 0) + (statistics.byType[ActivityType.PRODUCT_CREATE] || 0)}
          icon={<Package className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Vendor Actions"
          value={(statistics.byType[ActivityType.VENDOR_APPROVAL] || 0) + (statistics.byType[ActivityType.VENDOR_REJECTION] || 0)}
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity by Type */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activities by Type</h3>
          <div className="space-y-3">
            {topActivitiesByType.map(([type, count]) => {
              const display = ACTIVITY_TYPE_DISPLAY[type as ActivityType]
              const percentage = statistics.total > 0 ? (count / statistics.total) * 100 : 0
              
              return (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${display?.color || 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-700">
                      {display?.label || type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Activity by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activities by Category</h3>
          <div className="space-y-3">
            {Object.entries(statistics.byCategory).map(([category, count]) => {
              const display = ACTIVITY_CATEGORY_DISPLAY[category as ActivityCategory]
              const percentage = statistics.total > 0 ? (count / statistics.total) * 100 : 0
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${display?.color || 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-700">
                      {display?.label || category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Severity Distribution and Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Severity Distribution</h3>
          <div className="space-y-3">
            {Object.entries(statistics.bySeverity).map(([severity, count]) => {
              const display = ACTIVITY_SEVERITY_DISPLAY[severity as ActivitySeverity]
              const percentage = statistics.total > 0 ? (count / statistics.total) * 100 : 0
              
              return (
                <div key={severity} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${display?.color || 'bg-gray-400'}`}></div>
                    <span className="text-sm text-gray-700">
                      {display?.label || severity}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Active Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Active Users</h3>
          <div className="space-y-3">
            {topUsers.map(([userId, count]) => {
              const percentage = statistics.total > 0 ? (count / statistics.total) * 100 : 0
              
              return (
                <div key={userId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-700">
                      User {userId.slice(-4)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {statistics.recent.slice(0, 10).map((log) => (
            <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{log.title}</p>
                <p className="text-xs text-gray-600">{log.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{log.userName}</p>
                <p className="text-xs text-gray-400">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
