'use client'

import { LineChart } from '../components/charts/LineChart'
import { BarChart } from '../components/charts/BarChart'
import { PieChart } from '../components/charts/PieChart'

export default function ChartsDemoPage() {
  // Mock data for demonstration
  const lineChartData = [
    { name: 'Jan', sales: 4000, profit: 2400, customers: 240 },
    { name: 'Feb', sales: 3000, profit: 1398, customers: 221 },
    { name: 'Mar', sales: 2000, profit: 980, customers: 229 },
    { name: 'Apr', sales: 2780, profit: 1908, customers: 200 },
    { name: 'May', sales: 1890, profit: 800, customers: 218 },
    { name: 'Jun', sales: 2390, profit: 1200, customers: 250 },
  ]

  const barChartData = [
    { name: 'Electronics', sales: 4500, profit: 1200 },
    { name: 'Clothing', sales: 3200, profit: 800 },
    { name: 'Food', sales: 2800, profit: 600 },
    { name: 'Books', sales: 1900, profit: 400 },
    { name: 'Sports', sales: 1500, profit: 300 },
  ]

  const pieChartData = [
    { name: 'Desktop', value: 45, color: '#3b82f6' },
    { name: 'Mobile', value: 30, color: '#10b981' },
    { name: 'Tablet', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 10, color: '#8b5cf6' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Charts Demo</h1>
        <p className="text-gray-600">Demonstrating the reusable chart components</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Line Chart - Sales Trend</h3>
          <LineChart
            data={lineChartData}
            lines={[
              { dataKey: 'sales', stroke: '#3b82f6', name: 'Sales' },
              { dataKey: 'profit', stroke: '#10b981', name: 'Profit' },
              { dataKey: 'customers', stroke: '#f59e0b', name: 'Customers' }
            ]}
            height={300}
            showLegend={true}
            tooltipFormatter={(value, name) => `${value} ${name.toLowerCase()}`}
          />
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bar Chart - Category Sales</h3>
          <BarChart
            data={barChartData}
            bars={[
              { dataKey: 'sales', fill: '#8b5cf6', name: 'Sales' },
              { dataKey: 'profit', fill: '#10b981', name: 'Profit' }
            ]}
            height={300}
            showLegend={true}
            tooltipFormatter={(value, name) => `$${value}`}
          />
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pie Chart - Device Distribution</h3>
        <PieChart
          data={pieChartData}
          height={400}
          innerRadius={60}
          outerRadius={120}
          showLegend={true}
          tooltipFormatter={(value, name) => `${value}% ${name}`}
        />
      </div>

      {/* Chart Features */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Line Chart</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Multiple data series</li>
              <li>• Custom colors and styling</li>
              <li>• Interactive tooltips</li>
              <li>• Responsive design</li>
              <li>• Grid and axes control</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Bar Chart</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Single or multiple bars</li>
              <li>• Horizontal/vertical layout</li>
              <li>• Custom bar colors</li>
              <li>• Rounded corners</li>
              <li>• Value formatting</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Pie Chart</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Custom color palette</li>
              <li>• Inner/outer radius control</li>
              <li>• Percentage labels</li>
              <li>• Interactive tooltips</li>
              <li>• Legend support</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">All Charts</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Responsive containers</li>
              <li>• Custom formatters</li>
              <li>• Loading states support</li>
              <li>• Tailwind CSS styling</li>
              <li>• TypeScript support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
