'use client'

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'

interface DataPoint {
  name: string
  value: number
  color?: string
}

interface PieChartProps {
  data: DataPoint[]
  height?: number
  showTooltip?: boolean
  showLegend?: boolean
  innerRadius?: number
  outerRadius?: number
  tooltipFormatter?: (value: any, name: string) => string
  colors?: string[]
}

const DEFAULT_COLORS = [
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
]

export function PieChart({
  data,
  height = 300,
  showTooltip = true,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 80,
  tooltipFormatter,
  colors = DEFAULT_COLORS
}: PieChartProps) {
  // Assign colors to data points
  const coloredData = data.map((item, index) => ({
    ...item,
    color: item.color || colors[index % colors.length]
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {tooltipFormatter ? tooltipFormatter(data.value, data.name) : data.value}
          </p>
        </div>
      )
    }
    return null
  }

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null // Don't show label for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={coloredData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey="value"
        >
          {coloredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {showTooltip && <Tooltip content={<CustomTooltip />} />}
        {showLegend && (
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(value: any, entry: any) => (
              <span style={{ color: entry.color }}>
                {entry.payload.name}: {entry.payload.value}
              </span>
            )}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
