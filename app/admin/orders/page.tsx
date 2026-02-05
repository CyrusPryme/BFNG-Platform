'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminAuthGate, useMockAuth } from '../components/AdminAuthGate'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  ChevronDown,
  CheckCircle,
  Clock,
  Package,
  Truck,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { OrderStatus, isActiveStatus } from '@/types/order'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerType: 'local' | 'diaspora' | 'institution'
  total: number
  status: OrderStatus
  deliveryDate: string
  createdAt: string
  items: number
  address: {
    area: string
    city: string
    landmark: string
  }
  assignedTo?: string
  estimatedDelivery?: string
}

interface Filters {
  status: OrderStatus | 'all'
  customerType: 'local' | 'diaspora' | 'institution' | 'all'
  deliveryDate: string
  searchTerm: string
}

export default function OrdersPage() {
  const { user, canAccess } = useMockAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    customerType: 'all',
    deliveryDate: '',
    searchTerm: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  // Mock data
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'BFNG-2024-001',
      customerName: 'Akua Mensah',
      customerEmail: 'akua.mensah@gmail.com',
      customerType: 'local',
      total: 156.50,
      status: OrderStatus.DELIVERED,
      deliveryDate: '2024-02-03',
      createdAt: '2024-02-03T08:30:00Z',
      items: 12,
      address: {
        area: 'East Legon',
        city: 'Accra',
        landmark: 'Near Market'
      },
      assignedTo: 'delivery-1',
      estimatedDelivery: '2024-02-03T14:00:00Z'
    },
    {
      id: '2',
      orderNumber: 'BFNG-2024-002',
      customerName: 'Kofi Asante',
      customerEmail: 'kofi.asante@yahoo.com',
      customerType: 'diaspora',
      total: 89.75,
      status: OrderStatus.OUT_FOR_DELIVERY,
      deliveryDate: '2024-02-03',
      createdAt: '2024-02-03T09:15:00Z',
      items: 8,
      address: {
        area: 'Spintex',
        city: 'Accra',
        landmark: 'Near Mall'
      },
      assignedTo: 'delivery-2',
      estimatedDelivery: '2024-02-03T16:00:00Z'
    },
    {
      id: '3',
      orderNumber: 'BFNG-2024-003',
      customerName: 'Ama Osei',
      customerEmail: 'ama.osei@company.com',
      customerType: 'institution',
      total: 234.25,
      status: OrderStatus.PACKED,
      deliveryDate: '2024-02-04',
      createdAt: '2024-02-03T08:45:00Z',
      items: 15,
      address: {
        area: 'Labone',
        city: 'Accra',
        landmark: 'Near Hospital'
      }
    },
    {
      'id': '4',
      orderNumber: 'BFNG-2024-004',
      customerName: 'Yaw Boateng',
      customerEmail: 'yaw.boateng@gmail.com',
      customerType: 'local',
      total: 178.90,
      status: OrderStatus.IN_SOURCING,
      deliveryDate: '2024-02-03',
      createdAt: '2024-02-03T07:30:00Z',
      items: 10,
      address: {
        area: 'Osu',
        city: 'Accra',
        landmark: 'Near School'
      }
    },
    {
      id: '5',
      orderNumber: 'BFNG-2024-005',
      customerName: 'Adwoa Serwaa',
      customerEmail: 'adwoa.serwaa@university.edu.gh',
      customerType: 'diaspora',
      total: 92.40,
      status: OrderStatus.CONFIRMED,
      deliveryDate: '2024-02-04',
      createdAt: '2024-02-03T16:20:00Z',
      items: 6,
      address: {
        area: 'Tema',
        city: 'Accra',
        landmark: 'Community Center'
      }
    },
    {
      id: '6',
      orderNumber: 'BFNG-2024-006',
      customerName: 'Kojo Mensah',
      customerEmail: 'kojo.mensah@gmail.com',
      customerType: 'local',
      total: 145.60,
      status: OrderStatus.PAID,
      deliveryDate: '2024-02-03',
      createdAt: '2024-02-03T10:45:00Z',
      items: 9,
      address: {
        area: 'Madina',
        city: 'Accra',
        landmark: 'Near Market'
      }
    },
    {
      id: '7',
      orderNumber: 'BFNG-2024-007',
      customerName: 'Ghana Natural Ltd',
      customerEmail: 'orders@ghananatural.com',
      customerType: 'institution',
      total: 567.80,
      status: OrderStatus.RECEIVED,
      deliveryDate: '2024-02-04',
      createdAt: '2024-02-03T11:30:00Z',
      items: 18,
      address: {
        area: 'Airport',
        city: 'Accra',
        landmark: 'Terminal 2'
      }
    },
    {
      id: '8',
      orderNumber: 'BFNG-2024-008',
      customerName: 'Nana Yaa',
      customerEmail: 'nana.yaa@gmail.com',
      customerType: 'local',
      total: 78.30,
      status: OrderStatus.CANCELLED,
      deliveryDate: '2024-02-02',
      createdAt: '2024-02-02T14:15:00Z',
      items: 5,
      address: {
        area: 'Dansoman',
        city: 'Accra',
        landmark: 'Near Church'
      }
    }
  ]

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOrders(mockOrders)
      setFilteredOrders(mockOrders)
      setIsLoading(false)
    }

    loadOrders()
  }, [])

  useEffect(() => {
    const filtered = orders.filter(order => {
      const statusMatch = filters.status === 'all' || order.status === filters.status
      const customerTypeMatch = filters.customerType === 'all' || order.customerType === filters.customerType
      const deliveryDateMatch = !filters.deliveryDate || order.deliveryDate === filters.deliveryDate
      const searchMatch = !filters.searchTerm || 
        order.orderNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(filters.searchTerm.toLowerCase())

      return statusMatch && customerTypeMatch && deliveryDateMatch && searchMatch
    })

    setFilteredOrders(filtered)
  }, [orders, filters])

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      status: 'all',
      customerType: 'all',
      deliveryDate: '',
      searchTerm: ''
    })
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.RECEIVED:
        return <Clock className="h-4 w-4" />
      case OrderStatus.CONFIRMED:
        return <CheckCircle className="h-4 w-4" />
      case OrderStatus.AWAITING_PAYMENT:
        return <Clock className="h-4 w-4" />
      case OrderStatus.PAID:
        return <CheckCircle2 className="h-4 w-4" />
      case OrderStatus.IN_SOURCING:
        return <Package className="h-4 w-4" />
      case OrderStatus.SUBSTITUTION_REQUIRED:
        return <AlertTriangle className="h-4 w-4" />
      case OrderStatus.READY_FOR_PACKING:
        return <Package className="h-4 w-4" />
      case OrderStatus.PACKED:
        return <Package className="h-4 w-4" />
      case OrderStatus.OUT_FOR_DELIVERY:
        return <Truck className="h-4 w-4" />
      case OrderStatus.DELIVERED:
        return <CheckCircle2 className="h-4 w-4" />
      case OrderStatus.COMPLETED:
        return <CheckCircle2 className="h-4 w-4" />
      case OrderStatus.CANCELLED:
        return <XCircle className="h-4 w-4" />
      case OrderStatus.FAILED:
        return <XCircle className="h-4 w-4" />
      case OrderStatus.REFUNDED:
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.RECEIVED:
        return 'text-yellow-600 bg-yellow-100'
      case OrderStatus.CONFIRMED:
        return 'text-blue-600 bg-blue-100'
      case OrderStatus.AWAITING_PAYMENT:
        return 'text-orange-600 bg-orange-100'
      case OrderStatus.PAID:
        return 'text-green-600 bg-green-100'
      case OrderStatus.IN_SOURCING:
        return 'text-purple-600 bg-purple-100'
      case OrderStatus.SUBSTITUTION_REQUIRED:
        return 'text-red-600 bg-red-100'
      case OrderStatus.READY_FOR_PACKING:
        return 'text-indigo-600 bg-indigo-100'
      case OrderStatus.PACKED:
        return 'text-blue-600 bg-blue-100'
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'text-orange-600 bg-orange-100'
      case OrderStatus.DELIVERED:
        return 'text-green-600 bg-green-100'
      case OrderStatus.COMPLETED:
        return 'text-emerald-600 bg-emerald-100'
      case OrderStatus.CANCELLED:
        return 'text-red-600 bg-red-100'
      case OrderStatus.FAILED:
        return 'text-red-600 bg-red-100'
      case OrderStatus.REFUNDED:
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'local':
        return 'bg-blue-100 text-blue-800'
      case 'diaspora':
        return 'bg-purple-100 text-purple-800'
      case 'institution':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportToCSV = () => {
    const csvContent = [
      'Order Number,Customer Name,Customer Email,Customer Type,Status,Total,Delivery Date,Created Date',
      ...filteredOrders.map(order => [
        order.orderNumber,
        order.customerName,
        order.customerEmail,
        order.customerType,
        order.status,
        order.total,
        order.deliveryDate,
        order.createdAt
      ])
    ].map(row => (Array.isArray(row) ? row.join(',') : row)).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AdminAuthGate requiredRole="operations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-600">
              {filteredOrders.length} of {orders.length} orders
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {Object.values(filters).filter(v => v !== 'all').length > 0 && (
                <span className="ml-2 px-2 py-1 bg-ghana-green text-white text-xs rounded-full">
                  {Object.values(filters).filter(v => v !== 'all').length}
                </span>
              )}
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-ghana-green text-white rounded-lg hover:bg-ghana-green/90 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  {Object.values(OrderStatus).map(status => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Type</label>
                <select
                  value={filters.customerType}
                  onChange={(e) => handleFilterChange('customerType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="local">Local</option>
                  <option value="diaspora">Diaspora</option>
                  <option value="institution">Institution</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                <input
                  type="date"
                  value={filters.deliveryDate}
                  onChange={(e) => handleFilterChange('deliveryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    placeholder="Search orders..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCustomerTypeColor(order.customerType)}`}>
                        {order.customerType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{order.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₵{order.total.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(order.deliveryDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                        className="text-ghana-green hover:text-ghana-green/800 mr-3"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Orders</span>
              <span className="text-2xl font-bold text-gray-900">{orders.length}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Active Orders</span>
              <span className="text-2xl font-bold text-green-600">
                {orders.filter(o => isActiveStatus(o.status)).length}
              </span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Pending Payment</span>
              <span className="text-2xl font-bold text-orange-600">
                {orders.filter(o => o.status === OrderStatus.AWAITING_PAYMENT).length}
              </span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Today's Deliveries</span>
              <span className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === OrderStatus.OUT_FOR_DELIVERY).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGate>
  )
}
