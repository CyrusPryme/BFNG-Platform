'use client'

import {
  BarChart as RechartsBarChart,
  Bar,
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

interface BarChartProps {
  data: DataPoint[]
  bars: Array<{
    dataKey: string
    fill: string
    name?: string
  }>
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  xAxisDataKey?: string
  yAxisFormatter?: (value: any) => string
  tooltipFormatter?: (value: any, name: string) => string
  layout?: 'vertical' | 'horizontal'
}

export function BarChart({
  data,
  bars,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  xAxisDataKey = 'name',
  yAxisFormatter,
  tooltipFormatter,
  layout = 'vertical'
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart 
        data={data} 
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        layout={layout}
      >
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
            iconType="rect"
          />
        )}
        {bars.map((bar, index) => (
          <Bar
            key={index}
            dataKey={bar.dataKey}
            fill={bar.fill}
            name={bar.name || bar.dataKey}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
