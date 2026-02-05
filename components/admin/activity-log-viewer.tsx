'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react'
import { 
  ActivityLog, 
  ActivityType, 
  ActivityCategory, 
  ActivitySeverity,
  ActivityLogFilters,
  formatActivityTimestamp,
  getActivityTypeColor,
  getActivityTypeIcon,
  getActivityCategoryColor,
  getActivitySeverityColor,
  ACTIVITY_TYPE_DISPLAY,
  ACTIVITY_CATEGORY_DISPLAY,
  ACTIVITY_SEVERITY_DISPLAY
} from '@/types/activity-log'
import { activityLogger } from '@/lib/activity-logger'

interface ActivityLogViewerProps {
  className?: string
  maxHeight?: string
  showFilters?: boolean
  showExport?: boolean
  refreshInterval?: number
}

export function ActivityLogViewer({ 
  className = '',
  maxHeight = '600px',
  showFilters = true,
  showExport = true,
  refreshInterval = 0
}: ActivityLogViewerProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ActivityLogFilters>({
    type: 'all',
    category: 'all',
    severity: 'all',
    search: '',
    limit: 50,
    offset: 0
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [expandedLog, setExpandedLog] = useState<string | null>(null)

  // Load logs
  const loadLogs = async () => {
    setLoading(true)
    try {
      const result = activityLogger.getLogs(filters)
      setLogs(result.logs)
    } catch (error) {
      console.error('Failed to load activity logs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial load and refresh
  useEffect(() => {
    loadLogs()
  }, [filters])

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(loadLogs, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshInterval, filters])

  const handleFilterChange = (key: keyof ActivityLogFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }))
  }

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      severity: 'all',
      search: '',
      limit: 50,
      offset: 0
    })
  }

  const exportLogs = () => {
    const csvContent = [
      'Timestamp,User,Type,Category,Severity,Title,Description',
      ...logs.map(log => 
        `"${formatActivityTimestamp(log.timestamp)}","${log.userName}","${log.type}","${log.category}","${log.severity}","${log.title}","${log.description}"`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleLogExpansion = (logId: string) => {
    setExpandedLog(expandedLog === logId ? null : logId)
  }

  const getLogIcon = (log: ActivityLog) => {
    const icon = getActivityTypeIcon(log.type)
    const color = getActivityTypeColor(log.type)
    
    // Simple icon representation using text
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${color}`}>
        {icon.charAt(0).toUpperCase()}
      </div>
    )
  }

  if (loading && logs.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400 mr-2" />
          <span className="text-gray-500">Loading activity logs...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Activity Logs</h2>
          <div className="flex items-center space-x-2">
            {showExport && (
              <button
                onClick={exportLogs}
                className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            )}
            <button
              onClick={loadLogs}
              className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Filters</h3>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-800"
            >
              {showAdvancedFilters ? (
                <ChevronUp className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-1" />
              )}
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type || 'all'}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {Object.values(ActivityType).map(type => (
                  <option key={type} value={type}>
                    {ACTIVITY_TYPE_DISPLAY[type]?.label || type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category || 'all'}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {Object.values(ActivityCategory).map(category => (
                  <option key={category} value={category}>
                    {ACTIVITY_CATEGORY_DISPLAY[category]?.label || category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={filters.severity || 'all'}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                {Object.values(ActivitySeverity).map(severity => (
                  <option key={severity} value={severity}>
                    {ACTIVITY_SEVERITY_DISPLAY[severity]?.label || severity}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="mt-4 flex space-x-2">
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Logs List */}
      <div className="overflow-y-auto" style={{ maxHeight }}>
        {logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No activity logs found</p>
            <p className="text-sm mt-2">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  {getLogIcon(log)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {log.title}
                      </p>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getActivitySeverityColor(log.severity)}`}>
                          {log.severity}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatActivityTimestamp(log.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{log.description}</p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {log.userName}
                      </span>
                      <span className={`inline-flex px-2 py-1 rounded ${getActivityCategoryColor(log.category)}`}>
                        {log.category}
                      </span>
                      <span className={`inline-flex px-2 py-1 rounded ${getActivityTypeColor(log.type)}`}>
                        {ACTIVITY_TYPE_DISPLAY[log.type]?.label || log.type}
                      </span>
                    </div>

                    {/* Expandable Details */}
                    {(log.oldValue || log.newValue || log.metadata) && (
                      <div className="mt-3">
                        <button
                          onClick={() => toggleLogExpansion(log.id)}
                          className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {expandedLog === log.id ? 'Hide' : 'Show'} Details
                        </button>
                        
                        {expandedLog === log.id && (
                          <div className="mt-2 p-3 bg-gray-100 rounded text-xs">
                            {log.targetId && (
                              <div className="mb-2">
                                <strong>Target ID:</strong> {log.targetId}
                              </div>
                            )}
                            {log.targetType && (
                              <div className="mb-2">
                                <strong>Target Type:</strong> {log.targetType}
                              </div>
                            )}
                            {log.oldValue && (
                              <div className="mb-2">
                                <strong>Previous Value:</strong>
                                <pre className="mt-1 p-2 bg-white rounded border">
                                  {JSON.stringify(log.oldValue, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.newValue && (
                              <div className="mb-2">
                                <strong>New Value:</strong>
                                <pre className="mt-1 p-2 bg-white rounded border">
                                  {JSON.stringify(log.newValue, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.metadata && Object.keys(log.metadata).length > 0 && (
                              <div>
                                <strong>Metadata:</strong>
                                <pre className="mt-1 p-2 bg-white rounded border">
                                  {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More */}
      {logs.length >= (filters.limit || 50) && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => handleFilterChange('limit', (filters.limit || 50) + 50)}
            className="w-full py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}
