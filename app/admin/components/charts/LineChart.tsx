'use client'

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface DataPoint {
  name: string
  value?: number
  [key: string]: any
}

interface LineChartProps {
  data: DataPoint[]
  lines: Array<{
    dataKey: string
    stroke: string
    strokeWidth?: number
    name?: string
  }>
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  xAxisDataKey?: string
  yAxisFormatter?: (value: any) => string
  tooltipFormatter?: (value: any, name: string) => string
}

export function LineChart({
  data,
  lines,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  xAxisDataKey = 'name',
  yAxisFormatter,
  tooltipFormatter
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
        <XAxis 
          dataKey={xAxisDataKey} 
          tick={{ fontSize: 12 }}
          tickLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={{ stroke: '#e5e7eb' }}
          tickFormatter={yAxisFormatter}
        />
        {showTooltip && (
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px'
            }}
            formatter={tooltipFormatter}
          />
        )}
        {showLegend && (
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            iconType="line"
          />
        )}
        {lines.map((line, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth || 2}
            name={line.name || line.dataKey}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
