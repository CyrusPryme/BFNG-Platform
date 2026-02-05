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
  Pause, 
  Play, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Package,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import { 
  Subscription, 
  SubscriptionStatus, 
  SubscriptionFrequency,
  SUBSCRIPTION_STATUS_DISPLAY,
  getSubscriptionStatusColor,
  getSubscriptionStatusIcon,
  isSubscriptionActive,
  isSubscriptionPaused,
  canPauseSubscription,
  canResumeSubscription
} from '@/types/subscription'
import { mockSubscriptions } from '@/types/subscription-examples'

interface SubscriptionFilters {
  status: SubscriptionStatus | 'all'
  customerType: 'individual' | 'family' | 'business' | 'institution' | 'all'
  frequency: SubscriptionFrequency | 'all'
  nextDeliveryAfter?: string
  nextDeliveryBefore?: string
  search: string
  hasOutstandingBalance?: boolean
  autoRenewal?: boolean
  paymentStatus?: 'paid' | 'pending' | 'failed' | 'refunded' | 'all'
}

export default function SubscriptionsPage() {
  const { user } = useMockAuth()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<SubscriptionFilters>({
    status: 'all',
    customerType: 'all',
    frequency: 'all',
    search: '',
    paymentStatus: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [showPauseModal, setShowPauseModal] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [actionNotes, setActionNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const loadSubscriptions = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubscriptions(mockSubscriptions)
      setFilteredSubscriptions(mockSubscriptions)
      setIsLoading(false)
    }

    loadSubscriptions()
  }, [])

  useEffect(() => {
    const filtered = subscriptions.filter(subscription => {
      const statusMatch = filters.status === 'all' || subscription.status === filters.status
      const customerTypeMatch = filters.customerType === 'all' || subscription.customer.customerType === filters.customerType
      const frequencyMatch = filters.frequency === 'all' || subscription.schedule.frequency === filters.frequency
      const searchMatch = !filters.search || 
        subscription.customer.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        subscription.customer.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        subscription.customer.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        subscription.subscriptionNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        subscription.customer.businessName?.toLowerCase().includes(filters.search.toLowerCase())
      
      let nextDeliveryMatch = true
      if (filters.nextDeliveryAfter) {
        nextDeliveryMatch = new Date(subscription.nextOrderDate) >= new Date(filters.nextDeliveryAfter)
      }
      if (filters.nextDeliveryBefore) {
        nextDeliveryMatch = nextDeliveryMatch && new Date(subscription.nextOrderDate) <= new Date(filters.nextDeliveryBefore)
      }
      
      const balanceMatch = filters.hasOutstandingBalance === undefined || 
        (filters.hasOutstandingBalance ? subscription.outstandingBalance > 0 : subscription.outstandingBalance === 0)
      
      const autoRenewalMatch = filters.autoRenewal === undefined || 
        subscription.autoRenewal === filters.autoRenewal
      
      const paymentStatusMatch = filters.paymentStatus === 'all' || 
        subscription.paymentStatus === filters.paymentStatus

      return statusMatch && customerTypeMatch && frequencyMatch && searchMatch && 
             nextDeliveryMatch && balanceMatch && autoRenewalMatch && paymentStatusMatch
    })

    setFilteredSubscriptions(filtered)
  }, [subscriptions, filters])

  const handleFilterChange = (key: keyof SubscriptionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      status: 'all',
      customerType: 'all',
      frequency: 'all',
      search: '',
      paymentStatus: 'all'
    })
  }

  const handlePauseSubscription = async (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setShowPauseModal(true)
  }

  const handleResumeSubscription = async (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setShowResumeModal(true)
  }

  const processPause = async () => {
    if (!selectedSubscription) return

    setIsProcessing(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update subscription status
      const updatedSubscriptions = subscriptions.map(s => 
        s.id === selectedSubscription.id 
          ? {
              ...s,
              status: SubscriptionStatus.PAUSED,
              pauseUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Pause for 30 days
              updatedAt: new Date().toISOString(),
              lastModified: new Date().toISOString(),
              modifiedBy: user?.id || 'admin-001'
            }
          : s
      )
      
      setSubscriptions(updatedSubscriptions)
      setFilteredSubscriptions(updatedSubscriptions)
      
      // Close modal
      setShowPauseModal(false)
      setSelectedSubscription(null)
      setActionNotes('')
      
    } catch (error) {
      console.error('Error pausing subscription:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const processResume = async () => {
    if (!selectedSubscription) return

    setIsProcessing(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update subscription status
      const updatedSubscriptions = subscriptions.map(s => 
        s.id === selectedSubscription.id 
          ? {
              ...s,
              status: SubscriptionStatus.ACTIVE,
              pauseUntil: undefined,
              updatedAt: new Date().toISOString(),
              lastModified: new Date().toISOString(),
              modifiedBy: user?.id || 'admin-001'
            }
          : s
      )
      
      setSubscriptions(updatedSubscriptions)
      setFilteredSubscriptions(updatedSubscriptions)
      
      // Close modal
      setShowResumeModal(false)
      setSelectedSubscription(null)
      setActionNotes('')
      
    } catch (error) {
      console.error('Error resuming subscription:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: SubscriptionStatus) => {
    return getSubscriptionStatusColor(status)
  }

  const getStatusIcon = (status: SubscriptionStatus) => {
    return getSubscriptionStatusIcon(status)
  }

  const getFrequencyDisplay = (frequency: SubscriptionFrequency): string => {
    const frequencyMap = {
      [SubscriptionFrequency.DAILY]: 'Daily',
      [SubscriptionFrequency.WEEKLY]: 'Weekly',
      [SubscriptionFrequency.BI_WEEKLY]: 'Bi-Weekly',
      [SubscriptionFrequency.MONTHLY]: 'Monthly',
      [SubscriptionFrequency.BI_MONTHLY]: 'Bi-Monthly',
      [SubscriptionFrequency.QUARTERLY]: 'Quarterly'
    }
    return frequencyMap[frequency] || frequency
  }

  const getCustomerTypeDisplay = (customerType: string): string => {
    const typeMap = {
      'individual': 'Individual',
      'family': 'Family',
      'business': 'Business',
      'institution': 'Institution'
    }
    return typeMap[customerType as keyof typeof typeMap] || customerType
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

  const getCustomerFullName = (subscription: Subscription): string => {
    return `${subscription.customer.firstName} ${subscription.customer.lastName}`
  }

  const getCustomerFullAddress = (subscription: Subscription): string => {
    const { street, city, region } = subscription.schedule.deliveryAddress
    return `${street}, ${city}, ${region}`
  }

  const getNextDeliveryDays = (nextDeliveryDate: string): number => {
    const now = new Date()
    const nextDate = new Date(nextDeliveryDate)
    const diffTime = nextDate.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getNextDeliveryColor = (days: number): string => {
    if (days <= 0) return 'text-red-600 bg-red-100'
    if (days <= 1) return 'text-orange-600 bg-orange-100'
    if (days <= 3) return 'text-yellow-600 bg-yellow-100'
    if (days <= 7) return 'text-blue-600 bg-blue-100'
    return 'text-green-600 bg-green-100'
  }

  if (isLoading) {
    return (
      <AdminAuthGate requiredRole="operations">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subscriptions Management</h1>
            <p className="text-gray-600">Manage customer subscriptions and deliveries</p>
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

  return (
    <AdminAuthGate requiredRole="operations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subscriptions Management</h1>
            <p className="text-gray-600">
              {filteredSubscriptions.length} of {subscriptions.length} subscriptions
            </p>
          </div>
          <div className="flex gap-2">
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
              Add Subscription
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
                  {Object.values(SubscriptionStatus).map(status => (
                    <option key={status} value={status}>
                      {SUBSCRIPTION_STATUS_DISPLAY[status]?.label}
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
                  <option value="individual">Individual</option>
                  <option value="family">Family</option>
                  <option value="business">Business</option>
                  <option value="institution">Institution</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  value={filters.frequency}
                  onChange={(e) => handleFilterChange('frequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  <option value="all">All Frequencies</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi_weekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="bi_monthly">Bi-Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  <option value="all">All Payment Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Next Delivery After</label>
                <input
                  type="date"
                  value={filters.nextDeliveryAfter}
                  onChange={(e) => handleFilterChange('nextDeliveryAfter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Next Delivery Before</label>
                <input
                  type="date"
                  value={filters.nextDeliveryBefore}
                  onChange={(e) => handleFilterChange('nextDeliveryBefore', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search subscriptions..."
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

        {/* Subscriptions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Delivery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.map((subscription) => {
                  const nextDeliveryDays = getNextDeliveryDays(subscription.nextOrderDate)
                  const nextDeliveryColor = getNextDeliveryColor(nextDeliveryDays)
                  
                  return (
                    <tr key={subscription.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-ghana-green/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-ghana-green" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {getCustomerFullName(subscription)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getCustomerTypeDisplay(subscription.customer.customerType)}
                              {subscription.customer.businessName && (
                                <span className="ml-1">• {subscription.customer.businessName}</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {subscription.subscriptionNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getFrequencyDisplay(subscription.schedule.frequency)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {subscription.schedule.deliveryDays.join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                          {getStatusIcon(subscription.status)}
                          <span className="ml-2">{SUBSCRIPTION_STATUS_DISPLAY[subscription.status]?.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${nextDeliveryColor}`}>
                            {nextDeliveryDays === 0 ? 'Today' : nextDeliveryDays === 1 ? 'Tomorrow' : `${nextDeliveryDays} days`}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(subscription.nextOrderDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(subscription.pricing.totalAmount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {subscription.schedule.frequency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            subscription.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                            subscription.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            subscription.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {subscription.paymentStatus}
                          </span>
                          {subscription.outstandingBalance > 0 && (
                            <span className="text-xs text-red-600">
                              Owes: {formatCurrency(subscription.outstandingBalance)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-ghana-green hover:text-ghana-green/800">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit className="h-4 w-4" />
                          </button>
                          {isSubscriptionActive(subscription) && canPauseSubscription(subscription) && (
                            <button
                              onClick={() => handlePauseSubscription(subscription)}
                              className="text-yellow-600 hover:text-yellow-800"
                            >
                              <Pause className="h-4 w-4" />
                            </button>
                          )}
                          {isSubscriptionPaused(subscription) && canResumeSubscription(subscription) && (
                            <button
                              onClick={() => handleResumeSubscription(subscription)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptions.length}</p>
              </div>
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {subscriptions.filter(s => s.status === SubscriptionStatus.ACTIVE).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paused</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {subscriptions.filter(s => s.status === SubscriptionStatus.PAUSED).length}
                </p>
              </div>
              <Pause className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    subscriptions
                      .filter(s => s.status === SubscriptionStatus.ACTIVE)
                      .reduce((total, s) => total + (s.pricing.totalAmount * 4.33), 0) // Weekly to monthly multiplier
                  )}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pause Modal */}
      {showPauseModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pause Subscription</h3>
              <button
                onClick={() => {
                  setShowPauseModal(false)
                  setSelectedSubscription(null)
                  setActionNotes('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Pause className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">{getCustomerFullName(selectedSubscription)}</p>
                    <p className="text-sm text-gray-600">{selectedSubscription.subscriptionNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pause Reason (Optional)
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                placeholder="Enter reason for pausing subscription..."
              />
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Subscription will be paused for 30 days. Customer will be notified.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPauseModal(false)
                  setSelectedSubscription(null)
                  setActionNotes('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={processPause}
                disabled={isProcessing}
                className="px-4 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Pausing...
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Modal */}
      {showResumeModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Resume Subscription</h3>
              <button
                onClick={() => {
                  setShowResumeModal(false)
                  setSelectedSubscription(null)
                  setActionNotes('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Play className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">{getCustomerFullName(selectedSubscription)}</p>
                    <p className="text-sm text-gray-600">{selectedSubscription.subscriptionNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume Notes (Optional)
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                placeholder="Enter notes for resuming subscription..."
              />
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Subscription will be resumed immediately. Next delivery will be scheduled.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowResumeModal(false)
                  setSelectedSubscription(null)
                  setActionNotes('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={processResume}
                disabled={isProcessing}
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Resuming...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
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
