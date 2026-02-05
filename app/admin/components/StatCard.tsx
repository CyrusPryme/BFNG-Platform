import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period: string
  }
  icon: LucideIcon
  iconColor?: string
  iconBgColor?: string
  loading?: boolean
}

export function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  iconColor = 'text-ghana-green',
  iconBgColor = 'bg-ghana-green/10',
  loading = false 
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-2 flex items-baseline">
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            )}
          </div>
          {change && !loading && (
            <div className="mt-2 flex items-center text-sm">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  change.type === 'increase'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {change.type === 'increase' ? '↑' : '↓'} {Math.abs(change.value)}%
              </span>
              <span className="ml-2 text-gray-500">vs {change.period}</span>
            </div>
          )}
        </div>
        <div className={`ml-5 flex-shrink-0 ${iconBgColor} rounded-lg p-3`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}
