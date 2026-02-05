'use client'

import { useState, useEffect } from 'react'
import { AdminAuthGate, useMockAuth } from '../components/AdminAuthGate'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  User,
  Truck,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Navigation,
  Package,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Phone,
  Mail,
  Star,
  Users,
  Route
} from 'lucide-react'
import { 
  Delivery, 
  Driver,
  DeliveryStatus, 
  DeliveryPriority,
  DriverStatus,
  DeliveryRoute,
  DeliveryItem,
  getDeliveryStatusColor,
  getDeliveryStatusIcon,
  getDriverStatusColor,
  getDriverStatusIcon,
  canAssignDelivery,
  canUpdateDeliveryStatus
} from '@/types/delivery'
import { mockDeliveries, mockDrivers, mockDeliveryRoutes } from '@/types/delivery-examples'

interface DeliveryAssignmentFilters {
  status: DeliveryStatus | 'all'
  priority: DeliveryPriority | 'all'
  driverId: string
  routeId: string
  assignedAfter?: string
  assignedBefore?: string
  search: string
  hasIssues?: boolean
  driverStatus?: DriverStatus | 'all'
}

export default function DeliveryAssignmentsPage() {
  const { user } = useMockAuth()
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<DeliveryAssignmentFilters>({
    status: 'all',
    priority: 'all',
    driverId: 'all',
    routeId: 'all',
    search: '',
    driverStatus: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus>(DeliveryStatus.ASSIGNED)
  const [statusNotes, setStatusNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [groupByRoute, setGroupByRoute] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setDeliveries(mockDeliveries)
      setDrivers(mockDrivers)
      setRoutes(mockDeliveryRoutes)
      setFilteredDeliveries(mockDeliveries)
      setIsLoading(false)
    }

    loadData()
  }, [])

  useEffect(() => {
    const filtered = deliveries.filter(delivery => {
      const statusMatch = filters.status === 'all' || delivery.status === filters.status
      const priorityMatch = filters.priority === 'all' || delivery.priority === filters.priority
      const driverMatch = filters.driverId === 'all' || delivery.assignedDriverId === filters.driverId
      const routeMatch = filters.routeId === 'all' || delivery.routeId === filters.routeId
      const searchMatch = !filters.search || 
        delivery.customer.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        delivery.customer.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        delivery.customer.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        delivery.deliveryNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        delivery.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        delivery.assignedDriverName?.toLowerCase().includes(filters.search.toLowerCase())
      
      let assignedMatch: boolean = true
      if (filters.assignedAfter) {
        assignedMatch = Boolean(delivery.assignedAt && new Date(delivery.assignedAt) >= new Date(filters.assignedAfter))
      }
      if (filters.assignedBefore) {
        assignedMatch = assignedMatch && Boolean(delivery.assignedAt && new Date(delivery.assignedAt) <= new Date(filters.assignedBefore))
      }
      
      const issuesMatch = filters.hasIssues === undefined || 
        (filters.hasIssues ? delivery.issues.length > 0 : delivery.issues.length === 0)

      return statusMatch && priorityMatch && driverMatch && routeMatch && searchMatch && 
             assignedMatch && issuesMatch
    })

    setFilteredDeliveries(filtered)
  }, [deliveries, filters])

  const handleFilterChange = (key: keyof DeliveryAssignmentFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      driverId: 'all',
      routeId: 'all',
      search: '',
      driverStatus: 'all'
    })
  }

  const handleAssignDriver = async (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setShowAssignModal(true)
  }

  const handleUpdateStatus = async (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setSelectedStatus(delivery.status)
    setShowStatusModal(true)
  }

  const processDriverAssignment = async () => {
    if (!selectedDelivery || !selectedDriver) return

    setIsProcessing(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Get driver details
      const driver = drivers.find(d => d.id === selectedDriver)
      
      // Update delivery with driver assignment
      const updatedDeliveries = deliveries.map(d => 
        d.id === selectedDelivery.id 
          ? {
              ...d,
              status: DeliveryStatus.ASSIGNED,
              assignedDriverId: selectedDriver,
              assignedDriverName: driver?.firstName + ' ' + driver?.lastName,
              assignedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              lastModified: new Date().toISOString(),
              modifiedBy: user?.id || 'admin-001',
              trackingEvents: [
                ...d.trackingEvents,
                {
                  id: `te-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  status: DeliveryStatus.ASSIGNED,
                  location: {
                    latitude: driver?.currentLocation?.latitude || 0,
                    longitude: driver?.currentLocation?.longitude || 0,
                    address: driver?.currentLocation?.address || 'Unknown'
                  },
                  notes: `Driver assigned: ${driver?.firstName} ${driver?.lastName}`,
                  driverId: selectedDriver,
                  driverName: driver?.firstName + ' ' + driver?.lastName
                }
              ]
            }
          : d
      )
      
      // Update driver status to busy
      const updatedDrivers = drivers.map(d => 
        d.id === selectedDriver 
          ? { ...d, status: DriverStatus.BUSY, lastActive: new Date().toISOString() }
          : d
      )
      
      setDeliveries(updatedDeliveries)
      setDrivers(updatedDrivers)
      setFilteredDeliveries(updatedDeliveries)
      
      // Close modal
      setShowAssignModal(false)
      setSelectedDelivery(null)
      setSelectedDriver('')
      
    } catch (error) {
      console.error('Error assigning driver:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const processStatusUpdate = async () => {
    if (!selectedDelivery) return

    setIsProcessing(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update delivery status
      const updatedDeliveries = deliveries.map(d => 
        d.id === selectedDelivery.id 
          ? {
              ...d,
              status: selectedStatus,
              updatedAt: new Date().toISOString(),
              lastModified: new Date().toISOString(),
              modifiedBy: user?.id || 'admin-001',
              trackingEvents: [
                ...d.trackingEvents,
                {
                  id: `te-${Date.now()}`,
                  timestamp: new Date().toISOString(),
                  status: selectedStatus,
                  location: d.customer.address,
                  notes: statusNotes || `Status updated to ${selectedStatus}`,
                  driverId: d.assignedDriverId,
                  driverName: d.assignedDriverName
                }
              ]
            }
          : d
      )
      
      setDeliveries(updatedDeliveries as Delivery[])
      setFilteredDeliveries(updatedDeliveries as Delivery[])
      
      // Close modal
      setShowStatusModal(false)
      setSelectedDelivery(null)
      setSelectedStatus(DeliveryStatus.ASSIGNED)
      setStatusNotes('')
      
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: DeliveryStatus) => {
    return getDeliveryStatusColor(status)
  }

  const getStatusIcon = (status: DeliveryStatus) => {
    return getDeliveryStatusIcon(status)
  }

  const getPriorityColor = (priority: DeliveryPriority) => {
    const priorityMap = {
      [DeliveryPriority.LOW]: 'bg-gray-100 text-gray-800',
      [DeliveryPriority.NORMAL]: 'bg-blue-100 text-blue-800',
      [DeliveryPriority.HIGH]: 'bg-orange-100 text-orange-800',
      [DeliveryPriority.URGENT]: 'bg-red-100 text-red-800',
      [DeliveryPriority.EXPRESS]: 'bg-purple-100 text-purple-800'
    }
    return priorityMap[priority] || 'bg-gray-100 text-gray-800'
  }

  const getDriverStatusColor = (status: DriverStatus) => {
    return getDriverStatusColor(status)
  }

  const getDriverStatusIcon = (status: DriverStatus) => {
    return getDriverStatusIcon(status)
  }

  const getCustomerFullName = (delivery: Delivery) => {
    return `${delivery.customer.firstName} ${delivery.customer.lastName}`
  }

  const getCustomerFullAddress = (delivery: Delivery) => {
    const { street, city, region } = delivery.customer.address
    return `${street}, ${city}, ${region}`
  }

  const formatCurrency = (amount: number): string => {
    return `₵${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAvailableDrivers = () => {
    return drivers.filter(driver => driver.status === DriverStatus.AVAILABLE)
  }

  const getDeliveriesByRoute = () => {
    const grouped: Record<string, Delivery[]> = {}
    filteredDeliveries.forEach(delivery => {
      const routeName = delivery.routeName || 'Unassigned'
      if (!grouped[routeName]) {
        grouped[routeName] = []
      }
      grouped[routeName].push(delivery)
    })
    return grouped
  }

  if (isLoading) {
    return (
      <AdminAuthGate requiredRole="operations">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Delivery Assignments</h1>
            <p className="text-gray-600">Manage driver assignments and delivery status</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </AdminAuthGate>
    )
  }

  const deliveriesByRoute = getDeliveriesByRoute()

  return (
    <AdminAuthGate requiredRole="operations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Delivery Assignments</h1>
            <p className="text-gray-600">
              {filteredDeliveries.length} of {deliveries.length} deliveries
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setGroupByRoute(!groupByRoute)}
              className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
                groupByRoute 
                  ? 'bg-ghana-green text-white border-ghana-green' 
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Route className="h-4 w-4 mr-2" />
              {groupByRoute ? 'Grouped by Route' : 'Group by Route'}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {Object.values(filters).filter(v => 
                v !== 'all' && 
                v !== '' && 
                (typeof v === 'object' ? Object.keys(v).length > 0 : true)
              ).length > 0 && (
                <span className="ml-2 px-2 py-1 bg-ghana-green text-white text-xs rounded-full">
                  {Object.values(filters).filter(v => 
                    v !== 'all' && 
                    v !== '' && 
                    (typeof v === 'object' ? Object.keys(v).length > 0 : true)
                  ).length}
                </span>
              )}
            </button>
            <button className="flex items-center px-4 py-2 bg-ghana-green text-white rounded-lg hover:bg-ghana-green/90 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              New Delivery
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                  <option value="express">Express</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Driver</label>
                <select
                  value={filters.driverId}
                  onChange={(e) => handleFilterChange('driverId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  <option value="all">All Drivers</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
                <select
                  value={filters.routeId}
                  onChange={(e) => handleFilterChange('routeId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  <option value="all">All Routes</option>
                  {routes.map(route => (
                    <option key={route.id} value={route.id}>
                      {route.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search deliveries..."
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

        {/* Driver Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {drivers.filter(d => d.status === DriverStatus.AVAILABLE).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Busy</p>
                <p className="text-2xl font-bold text-orange-600">
                  {drivers.filter(d => d.status === DriverStatus.BUSY).length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {deliveries.filter(d => d.status === DeliveryStatus.PENDING).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Deliveries Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{delivery.deliveryNumber}</div>
                        <div className="text-xs text-gray-500">{delivery.orderNumber}</div>
                        <div className="text-xs text-gray-500">{delivery.items.length} items</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{getCustomerFullName(delivery)}</div>
                          <div className="text-xs text-gray-500">{getCustomerFullAddress(delivery)}</div>
                          <div className="text-xs text-gray-500">{delivery.customer.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {delivery.assignedDriverName ? (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{delivery.assignedDriverName}</div>
                            <div className="text-xs text-gray-500">{delivery.routeName}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{delivery.routeName || 'Unassigned'}</div>
                      <div className="text-xs text-gray-500">{delivery.distance} km</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                        {getStatusIcon(delivery.status)}
                        <span className="ml-2">{delivery.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(delivery.priority)}`}>
                        {delivery.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-ghana-green hover:text-ghana-green/800">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="h-4 w-4" />
                        </button>
                        {canAssignDelivery(delivery) && (
                          <button
                            onClick={() => handleAssignDriver(delivery)}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            <User className="h-4 w-4" />
                          </button>
                        )}
                        {canUpdateDeliveryStatus(delivery) && (
                          <button
                            onClick={() => handleUpdateStatus(delivery)}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grouped by Route View */}
        {groupByRoute && Object.entries(deliveriesByRoute).map(([routeName, routeDeliveries]) => (
          <div key={routeName} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{routeName}</h3>
              <p className="text-sm text-gray-600">{routeDeliveries.length} deliveries</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {routeDeliveries.map((delivery) => (
                  <div key={delivery.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium text-gray-900">{delivery.deliveryNumber}</p>
                            <p className="text-sm text-gray-600">{getCustomerFullName(delivery)}</p>
                            <p className="text-xs text-gray-500">{getCustomerFullAddress(delivery)}</p>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>{delivery.items.length} items • {delivery.distance} km</p>
                            <p>{formatCurrency(delivery.totalAmount)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(delivery.priority)}`}>
                          {delivery.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Driver Modal */}
      {showAssignModal && selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assign Driver</h3>
              <button
                onClick={() => {
                  setShowAssignModal(false)
                  setSelectedDelivery(null)
                  setSelectedDriver('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Package className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedDelivery.deliveryNumber}</p>
                    <p className="text-sm text-gray-600">{getCustomerFullName(selectedDelivery)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Driver
              </label>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
              >
                <option value="">Choose a driver...</option>
                {getAvailableDrivers().map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.firstName} {driver.lastName} - {driver.vehicleType} ({driver.vehicleNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAssignModal(false)
                  setSelectedDelivery(null)
                  setSelectedDriver('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={processDriverAssignment}
                disabled={isProcessing || !selectedDriver}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Assigning...
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Assign
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Delivery Status</h3>
              <button
                onClick={() => {
                  setShowStatusModal(false)
                  setSelectedDelivery(null)
                  setSelectedStatus(DeliveryStatus.ASSIGNED)
                  setStatusNotes('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Package className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedDelivery.deliveryNumber}</p>
                    <p className="text-sm text-gray-600">{getCustomerFullName(selectedDelivery)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as DeliveryStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
              >
                <option value={DeliveryStatus.ASSIGNED}>Assigned</option>
                <option value={DeliveryStatus.IN_PROGRESS}>In Progress</option>
                <option value={DeliveryStatus.PICKED_UP}>Picked Up</option>
                <option value={DeliveryStatus.IN_TRANSIT}>In Transit</option>
                <option value={DeliveryStatus.DELIVERED}>Delivered</option>
                <option value={DeliveryStatus.FAILED}>Failed</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                placeholder="Enter status update notes..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowStatusModal(false)
                  setSelectedDelivery(null)
                  setSelectedStatus(DeliveryStatus.ASSIGNED)
                  setStatusNotes('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={processStatusUpdate}
                disabled={isProcessing}
                className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Update
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminAuthGate>
  )
}
