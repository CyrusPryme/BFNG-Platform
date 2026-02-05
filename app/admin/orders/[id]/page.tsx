'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminAuthGate, useMockAuth } from '../../components/AdminAuthGate'
import { activityLogger, logOrderStateChange } from '@/lib/activity-logger'
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  Calendar, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  X,
  Plus,
  Minus,
  Search,
  Filter,
  XCircle
} from 'lucide-react'
import { OrderStatus } from '@/types/order'

interface OrderItem {
  id: string
  productId: string
  productName: string
  category: string
  quantity: number
  unitPrice: number
  totalPrice: number
  status: 'available' | 'unavailable' | 'substituted'
  substitution?: {
    alternativeId: string
    alternativeName: string
    alternativePrice: number
    reason: string
    status: 'pending' | 'approved' | 'rejected'
  }
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerType: 'local' | 'diaspora' | 'institution'
  customerPhone: string
  total: number
  status: OrderStatus
  deliveryDate: string
  createdAt: string
  items: OrderItem[]
  address: {
    area: string
    city: string
    landmark: string
    fullAddress: string
  }
  assignedTo?: string
  estimatedDelivery?: string
  notes?: string
}

interface AlternativeProduct {
  id: string
  name: string
  category: string
  price: number
  stock: number
  unit: string
  supplier: string
  quality: 'premium' | 'standard' | 'economy'
}

export default function OrderDetailPage() {
  const { user } = useMockAuth()
  const params = useParams()
  const router = useRouter()

  // Set up activity logger with current user
  useEffect(() => {
    if (user) {
      activityLogger.setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      })
    }
  }, [user])
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null)
  const [alternatives, setAlternatives] = useState<AlternativeProduct[]>([])
  const [selectedAlternative, setSelectedAlternative] = useState<AlternativeProduct | null>(null)
  const [substitutionReason, setSubstitutionReason] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock order data
  const mockOrder: Order = {
    id: '1',
    orderNumber: 'BFNG-2024-001',
    customerName: 'Akua Mensah',
    customerEmail: 'akua.mensah@gmail.com',
    customerType: 'local',
    customerPhone: '+233 24 123 4567',
    total: 156.50,
    status: OrderStatus.IN_SOURCING,
    deliveryDate: '2024-02-03',
    createdAt: '2024-02-03T08:30:00Z',
    items: [
      {
        id: '1',
        productId: 'prod-001',
        productName: 'Fresh Tomatoes',
        category: 'Vegetables',
        quantity: 5,
        unitPrice: 8.50,
        totalPrice: 42.50,
        status: 'available'
      },
      {
        id: '2',
        productId: 'prod-002',
        productName: 'Organic Lettuce',
        category: 'Vegetables',
        quantity: 3,
        unitPrice: 12.00,
        totalPrice: 36.00,
        status: 'unavailable'
      },
      {
        id: '3',
        productId: 'prod-003',
        productName: 'Local Rice',
        category: 'Grains',
        quantity: 2,
        unitPrice: 25.00,
        totalPrice: 50.00,
        status: 'available'
      },
      {
        id: '4',
        productId: 'prod-004',
        productName: 'Fresh Eggs',
        category: 'Dairy',
        quantity: 1,
        unitPrice: 28.00,
        totalPrice: 28.00,
        status: 'substituted',
        substitution: {
          alternativeId: 'alt-004',
          alternativeName: 'Free-Range Eggs',
          alternativePrice: 32.00,
          reason: 'Original product out of stock',
          status: 'approved'
        }
      }
    ],
    address: {
      area: 'East Legon',
      city: 'Accra',
      landmark: 'Near Market',
      fullAddress: '123 Market Street, East Legon, Accra, Ghana'
    },
    assignedTo: 'delivery-1',
    estimatedDelivery: '2024-02-03T14:00:00Z',
    notes: 'Customer prefers fresh produce, no frozen items please.'
  }

  // Mock alternative products
  const mockAlternatives: AlternativeProduct[] = [
    {
      id: 'alt-001',
      name: 'Iceberg Lettuce',
      category: 'Vegetables',
      price: 10.50,
      stock: 25,
      unit: 'head',
      supplier: 'Accra Fresh Farms',
      quality: 'standard'
    },
    {
      id: 'alt-002',
      name: 'Romaine Lettuce',
      category: 'Vegetables',
      price: 14.00,
      stock: 15,
      unit: 'head',
      supplier: 'Premium Greens Ltd',
      quality: 'premium'
    },
    {
      id: 'alt-003',
      name: 'Mixed Greens',
      category: 'Vegetables',
      price: 16.50,
      stock: 8,
      unit: 'bag',
      supplier: 'Local Harvest',
      quality: 'premium'
    },
    {
      id: 'alt-004',
      name: 'Cabbage',
      category: 'Vegetables',
      price: 8.00,
      stock: 30,
      unit: 'head',
      supplier: 'Accra Fresh Farms',
      quality: 'standard'
    }
  ]

  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOrder(mockOrder)
      setAlternatives(mockAlternatives)
      setIsLoading(false)
    }

    loadOrder()
  }, [params.id])

  const handleFlagUnavailable = (item: OrderItem) => {
    setSelectedItem(item)
    setShowSubstitutionModal(true)
    setSubstitutionReason('')
    setSelectedAlternative(null)
  }

  const handleProposeAlternative = () => {
    if (!selectedItem || !selectedAlternative || !order) return

    const updatedOrder = { ...order }
    const itemIndex = updatedOrder.items.findIndex(item => item.id === selectedItem.id)
    
    if (itemIndex !== -1) {
      updatedOrder.items[itemIndex] = {
        ...updatedOrder.items[itemIndex],
        status: 'substituted',
        substitution: {
          alternativeId: selectedAlternative.id,
          alternativeName: selectedAlternative.name,
          alternativePrice: selectedAlternative.price,
          reason: substitutionReason,
          status: 'pending'
        }
      }
      setOrder(updatedOrder)
    }

    setShowSubstitutionModal(false)
    setSelectedItem(null)
    setSelectedAlternative(null)
    setSubstitutionReason('')
  }

  const handleApproveSubstitution = (item: OrderItem) => {
    if (!order) return
    
    const previousStatus = order.status
    const updatedOrder = { ...order }
    const itemIndex = updatedOrder.items.findIndex(i => i.id === item.id)
    
    if (itemIndex !== -1) {
      updatedOrder.items[itemIndex] = {
        ...item,
        status: 'substituted',
        substitution: {
          ...item.substitution!,
          status: 'approved'
        }
      }
      
      // Update order status if needed
      if (updatedOrder.status === OrderStatus.SUBSTITUTION_REQUIRED) {
        updatedOrder.status = OrderStatus.READY_FOR_PACKING
      }
      
      setOrder(updatedOrder)
      
      // Log the activity
      if (item.substitution) {
        logOrderStateChange(
          order.id,
          order.orderNumber,
          order.customerName, // Use customerName as ID since customerId doesn't exist
          order.customerName,
          previousStatus,
          updatedOrder.status,
          `Substitution approved for ${item.productName}`
        )
      }
    }
  }

  const handleRejectSubstitution = (item: OrderItem) => {
    if (!order) return
    
    const previousStatus = order.status
    const updatedOrder = { ...order }
    const itemIndex = updatedOrder.items.findIndex(i => i.id === item.id)
    
    if (itemIndex !== -1) {
      updatedOrder.items[itemIndex] = {
        ...item,
        status: 'unavailable',
        substitution: {
          ...item.substitution!,
          status: 'rejected'
        }
      }
      
      setOrder(updatedOrder)
      
      // Log the activity
      if (item.substitution) {
        logOrderStateChange(
          order.id,
          order.orderNumber,
          order.customerName, // Use customerName as ID since customerId doesn't exist
          order.customerName,
          previousStatus,
          updatedOrder.status,
          `Substitution rejected for ${item.productName}`
        )
      }
    }
  }

  const calculatePriceDifference = (originalPrice: number, newPrice: number) => {
    const difference = newPrice - originalPrice
    const percentage = (difference / originalPrice) * 100
    return { difference, percentage }
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
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getItemStatusColor = (status: string, substitutionStatus?: string) => {
    if (status === 'substituted') {
      switch (substitutionStatus) {
        case 'pending':
          return 'text-yellow-600 bg-yellow-100'
        case 'approved':
          return 'text-green-600 bg-green-100'
        case 'rejected':
          return 'text-red-600 bg-red-100'
        default:
          return 'text-orange-600 bg-orange-100'
      }
    }
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100'
      case 'unavailable':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getItemStatusIcon = (status: string, substitutionStatus?: string) => {
    if (status === 'substituted') {
      switch (substitutionStatus) {
        case 'pending':
          return <Clock className="h-4 w-4" />
        case 'approved':
          return <CheckCircle className="h-4 w-4" />
        case 'rejected':
          return <XCircle className="h-4 w-4" />
        default:
          return <AlertTriangle className="h-4 w-4" />
      }
    }
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />
      case 'unavailable':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
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

  if (isLoading) {
    return (
      <AdminAuthGate requiredRole="operations">
        <div className="space-y-6">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Loading Order...</h1>
              <p className="text-gray-600">Please wait while we fetch the order details</p>
            </div>
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

  if (!order) {
    return (
      <AdminAuthGate requiredRole="operations">
        <div className="space-y-6">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
              <p className="text-gray-600">The order you're looking for doesn't exist</p>
            </div>
          </div>
        </div>
      </AdminAuthGate>
    )
  }

  const filteredAlternatives = alternatives.filter(alt => 
    alt.category === selectedItem?.category &&
    alt.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminAuthGate requiredRole="operations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600">{order.orderNumber}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <User className="h-8 w-8 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Customer</p>
                <p className="text-lg font-semibold text-gray-900">{order.customerName}</p>
                <p className="text-sm text-gray-500">{order.customerEmail}</p>
                <p className="text-sm text-gray-500">{order.customerPhone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Delivery Address</p>
                <p className="text-sm text-gray-900">{order.address.fullAddress}</p>
                <p className="text-sm text-gray-500">{order.address.landmark}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Delivery Date</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(order.deliveryDate)}</p>
                <p className="text-sm text-gray-500">Created: {formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Order Total</p>
                <p className="text-lg font-semibold text-gray-900">₵{order.total.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{order.items.length} items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                        <div className="text-xs text-gray-500">ID: {item.productId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₵{item.unitPrice.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₵{item.totalPrice.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-start space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getItemStatusColor(item.status, item.substitution?.status)}`}>
                          {getItemStatusIcon(item.status, item.substitution?.status)}
                          <span className="ml-2">{item.status}</span>
                        </span>
                        {item.status === 'substituted' && item.substitution && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            item.substitution.status === 'approved' ? 'bg-green-100 text-green-800' :
                            item.substitution.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.substitution.status}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {item.status === 'available' && (
                        <button
                          onClick={() => handleFlagUnavailable(item)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </button>
                      )}
                      {item.status === 'substituted' && item.substitution?.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveSubstitution(item)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectSubstitution(item)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Substitution Details */}
        {order.items.some(item => item.status === 'substituted') && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Substitution Details</h2>
            </div>
            <div className="p-6">
              {order.items.filter(item => item.status === 'substituted').map((item) => (
                <div key={item.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{item.productName}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getItemStatusColor(item.status, item.substitution?.status)}`}>
                          {getItemStatusIcon(item.status, item.substitution?.status)}
                          <span className="ml-1">{item.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Original: ₵{item.unitPrice.toFixed(2)} x {item.quantity}</p>
                      {item.substitution && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-green-600">
                              Substituted with: {item.substitution.alternativeName}
                            </p>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              item.substitution.status === 'approved' ? 'bg-green-100 text-green-800' :
                              item.substitution.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.substitution.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            New price: ₵{item.substitution.alternativePrice.toFixed(2)} x {item.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            Reason: {item.substitution.reason}
                          </p>
                          <div className="mt-2">
                            {(() => {
                              const { difference, percentage } = calculatePriceDifference(
                                item.unitPrice,
                                item.substitution.alternativePrice
                              )
                              return (
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                  difference > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {difference > 0 ? '+' : ''}₵{difference.toFixed(2)} ({percentage > 0 ? '+' : ''}{percentage.toFixed(1)}%)
                                </span>
                              )
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Notes */}
        {order.notes && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Notes</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Substitution Modal */}
      {showSubstitutionModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Propose Substitution for {selectedItem.productName}
              </h3>
              <button
                onClick={() => setShowSubstitutionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Original Item</p>
                    <p className="text-sm text-yellow-700">
                      {selectedItem.productName} - ₵{selectedItem.unitPrice.toFixed(2)} x {selectedItem.quantity}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Substitution
              </label>
              <textarea
                value={substitutionReason}
                onChange={(e) => setSubstitutionReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                placeholder="Enter reason for substitution..."
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Alternative Products
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search alternatives..."
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                {filteredAlternatives.map((alternative) => (
                  <div
                    key={alternative.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedAlternative?.id === alternative.id
                        ? 'border-ghana-green bg-ghana-green/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedAlternative(alternative)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{alternative.name}</h4>
                        <p className="text-sm text-gray-600">{alternative.category}</p>
                        <p className="text-sm text-gray-500">{alternative.supplier}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          alternative.quality === 'premium' ? 'bg-purple-100 text-purple-800' :
                          alternative.quality === 'standard' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {alternative.quality}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₵{alternative.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{alternative.stock} in stock</p>
                        {(() => {
                          const { difference, percentage } = calculatePriceDifference(
                            selectedItem.unitPrice,
                            alternative.price
                          )
                          return (
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              difference > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {difference > 0 ? '+' : ''}₵{difference.toFixed(2)}
                            </span>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSubstitutionModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleProposeAlternative}
                disabled={!selectedAlternative || !substitutionReason}
                className="px-4 py-2 bg-ghana-green text-white rounded-lg hover:bg-ghana-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Propose Substitution
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminAuthGate>
  )
}
