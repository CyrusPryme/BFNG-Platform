'use client'

import React, { useState, useMemo } from 'react'
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  DollarSign,
  Calendar,
  ChevronDown,
  Eye,
  CheckSquare,
  XSquare
} from 'lucide-react'
import { AdminAuthGate, useMockAuth } from '../components/AdminAuthGate'
import { 
  PaymentTransaction, 
  PaymentStatus, 
  PaymentMethod, 
  PaymentType,
  CustomerPaymentProfile,
  PaymentConfirmation,
  getPaymentStatusColor,
  getPaymentMethodIcon,
  getPaymentTypeColor,
  formatCurrency,
  formatDate,
  PAYMENT_STATUS_DISPLAY
} from '@/types/payment'
import { 
  mockPaymentTransactions,
  mockCustomerPaymentProfiles,
  mockPaymentConfirmations
} from '@/types/payment-examples'

const formatPaymentAmount = (amount: number, currency: string = 'GHS'): string => {
  return formatCurrency(amount, currency)
}

const formatPaymentDate = (dateString: string): string => {
  return formatDate(dateString)
}

const getPaymentStatusText = (status: PaymentStatus): string => {
  return PAYMENT_STATUS_DISPLAY[status]?.label || status
}

export default function PaymentsPage() {
  const { user, loading } = useMockAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all')
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<PaymentType | 'all'>('all')
  const [showConfirmations, setShowConfirmations] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null)

  // Calculate payment statistics
  const paymentStats = useMemo(() => {
    const total = mockPaymentTransactions.length
    const paid = mockPaymentTransactions.filter(t => t.status === PaymentStatus.COMPLETED).length
    const unpaid = mockPaymentTransactions.filter(t => 
      t.status === PaymentStatus.PENDING || t.status === PaymentStatus.PROCESSING
    ).length
    const failed = mockPaymentTransactions.filter(t => t.status === PaymentStatus.FAILED).length
    const totalAmount = mockPaymentTransactions.reduce((sum, t) => sum + t.amount, 0)
    const paidAmount = mockPaymentTransactions
      .filter(t => t.status === PaymentStatus.COMPLETED)
      .reduce((sum, t) => sum + t.amount, 0)
    const unpaidAmount = mockPaymentTransactions
      .filter(t => t.status === PaymentStatus.PENDING || t.status === PaymentStatus.PROCESSING)
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      total,
      paid,
      unpaid,
      failed,
      totalAmount,
      paidAmount,
      unpaidAmount,
      paidPercentage: total > 0 ? (paid / total) * 100 : 0,
      unpaidPercentage: total > 0 ? (unpaid / total) * 100 : 0
    }
  }, [])

  // Get postpaid customers
  const postpaidCustomers = useMemo(() => {
    return mockCustomerPaymentProfiles.filter(profile => 
      profile.paymentType === PaymentType.POSTPAID
    )
  }, [])

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return mockPaymentTransactions.filter(transaction => {
      const matchesSearch = searchTerm === '' || 
        transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
      const matchesMethod = methodFilter === 'all' || transaction.paymentMethod === methodFilter
      const matchesType = typeFilter === 'all' || transaction.paymentType === typeFilter

      return matchesSearch && matchesStatus && matchesMethod && matchesType
    })
  }, [searchTerm, statusFilter, methodFilter, typeFilter])

  // Get pending confirmations
  const pendingConfirmations = useMemo(() => {
    return mockPaymentConfirmations.filter(confirmation => 
      confirmation.verificationStatus === 'pending'
    )
  }, [])

  // Handle manual payment confirmation
  const handleConfirmPayment = (transactionId: string, confirmed: boolean) => {
    console.log(`Payment ${transactionId} ${confirmed ? 'confirmed' : 'rejected'}`)
    // In a real app, this would call an API to update the payment status
    setShowConfirmations(false)
    setSelectedTransaction(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <AdminAuthGate requiredRole="operations">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Payments Overview</h1>
          <p className="text-gray-600 mt-1">Manage payment transactions and confirmations</p>
        </div>

        {/* Payment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{paymentStats.total}</p>
                <p className="text-sm text-gray-500">
                  {formatPaymentAmount(paymentStats.totalAmount)}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">{paymentStats.paid}</p>
                <p className="text-sm text-gray-500">
                  {paymentStats.paidPercentage.toFixed(1)}% of total
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unpaid</p>
                <p className="text-2xl font-bold text-yellow-600">{paymentStats.unpaid}</p>
                <p className="text-sm text-gray-500">
                  {formatPaymentAmount(paymentStats.unpaidAmount)}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{paymentStats.failed}</p>
                <p className="text-sm text-gray-500">Need attention</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Postpaid Customers */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Postpaid Customers</h2>
                <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {postpaidCustomers.length}
                </span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {postpaidCustomers.slice(0, 6).map((customer) => (
                <div key={customer.customerId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{customer.customerName}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getPaymentTypeColor(customer.paymentType)}`}>
                      {customer.paymentType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{customer.customerEmail}</p>
                  <p className="text-sm text-gray-600 mb-2">{customer.customerPhone}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Credit Limit:</span>
                    <span className="font-medium">{formatPaymentAmount(customer.creditLimit || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Balance:</span>
                    <span className={`font-medium ${customer.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatPaymentAmount(customer.outstandingBalance)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {postpaidCustomers.length > 6 && (
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all postpaid customers →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Pending Payment Confirmations */}
        {pendingConfirmations.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Pending Confirmations</h2>
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {pendingConfirmations.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowConfirmations(!showConfirmations)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showConfirmations ? 'Hide' : 'Show'} confirmations
                </button>
              </div>
            </div>
            {showConfirmations && (
              <div className="p-6">
                <div className="space-y-4">
                  {pendingConfirmations.map((confirmation) => (
                    <div key={confirmation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{confirmation.transactionId}</h3>
                          <p className="text-sm text-gray-600">{confirmation.customerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatPaymentAmount(confirmation.amount)}</p>
                          <p className="text-sm text-gray-500">{confirmation.paymentMethod}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          Submitted: {formatPaymentDate(confirmation.createdAt)}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleConfirmPayment(confirmation.transactionId, true)}
                            className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            <CheckSquare className="h-4 w-4 mr-1" />
                            Confirm
                          </button>
                          <button
                            onClick={() => handleConfirmPayment(confirmation.transactionId, false)}
                            className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            <XSquare className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'all')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  {Object.values(PaymentStatus).map(status => (
                    <option key={status} value={status}>{getPaymentStatusText(status)}</option>
                  ))}
                </select>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value as PaymentMethod | 'all')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Methods</option>
                  {Object.values(PaymentMethod).map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as PaymentType | 'all')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  {Object.values(PaymentType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer name, transaction ID, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Transactions ({filteredTransactions.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.transactionId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.transactionId}</div>
                        <div className="text-sm text-gray-500">{transaction.orderId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.customerName}</div>
                      <div className="text-sm text-gray-500">{transaction.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPaymentAmount(transaction.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-2">{getPaymentMethodIcon(transaction.paymentMethod)}</span>
                        <span className="ml-2 text-sm text-gray-900">{transaction.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentTypeColor(transaction.paymentType)}`}>
                        {transaction.paymentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(transaction.status)}`}>
                        {getPaymentStatusText(transaction.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPaymentDate(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Transaction Details</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                    <p className="text-sm text-gray-900">{selectedTransaction.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order ID</p>
                    <p className="text-sm text-gray-900">{selectedTransaction.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer</p>
                    <p className="text-sm text-gray-900">{selectedTransaction.customerName}</p>
                    <p className="text-sm text-gray-500">{selectedTransaction.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="text-sm text-gray-900">{formatPaymentAmount(selectedTransaction.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                    <p className="text-sm text-gray-900">{selectedTransaction.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Type</p>
                    <p className="text-sm text-gray-900">{selectedTransaction.paymentType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(selectedTransaction.status)}`}>
                      {getPaymentStatusText(selectedTransaction.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-sm text-gray-900">{formatPaymentDate(selectedTransaction.createdAt)}</p>
                  </div>
                </div>
                {selectedTransaction.notes && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="text-sm text-gray-900">{selectedTransaction.notes}</p>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminAuthGate>
  )
}
