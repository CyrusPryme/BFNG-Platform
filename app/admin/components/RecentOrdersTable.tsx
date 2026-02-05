'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  total: number
  status: 'received' | 'confirmed' | 'in_sourcing' | 'ready_for_packing' | 'out_for_delivery' | 'delivered' | 'cancelled'
  createdAt: string
}

const dummyOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'BFNG-2024-001',
    customerName: 'Akua Mensah',
    total: 156.50,
    status: 'received',
    createdAt: '2024-02-03T10:30:00Z'
  },
  {
    id: '2',
    orderNumber: 'BFNG-2024-002',
    customerName: 'Kofi Asante',
    total: 89.75,
    status: 'in_sourcing',
    createdAt: '2024-02-03T09:15:00Z'
  },
  {
    id: '3',
    orderNumber: 'BFNG-2024-003',
    customerName: 'Ama Osei',
    total: 234.25,
    status: 'ready_for_packing',
    createdAt: '2024-02-03T08:45:00Z'
  },
  {
    id: '4',
    orderNumber: 'BFNG-2024-004',
    customerName: 'Yaw Boateng',
    total: 178.90,
    status: 'out_for_delivery',
    createdAt: '2024-02-03T07:30:00Z'
  },
  {
    id: '5',
    orderNumber: 'BFNG-2024-005',
    customerName: 'Adwoa Serwaa',
    total: 92.40,
    status: 'delivered',
    createdAt: '2024-02-02T16:20:00Z'
  }
]

const statusConfig = {
  received: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Received' },
  confirmed: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Confirmed' },
  in_sourcing: { icon: Package, color: 'text-purple-600', bg: 'bg-purple-100', label: 'In Sourcing' },
  ready_for_packing: { icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Ready for Packing' },
  out_for_delivery: { icon: Truck, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Out for Delivery' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' }
}

export function RecentOrdersTable() {
  const router = useRouter()
  const [orders] = useState<Order[]>(dummyOrders)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <button className="text-sm text-ghana-green hover:text-ghana-green/80 font-medium">
            View All
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status]
              const StatusIcon = statusInfo.icon

              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₵{order.total.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      className="text-ghana-green hover:text-ghana-green/800"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
