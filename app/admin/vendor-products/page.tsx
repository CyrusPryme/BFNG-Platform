'use client'

import { useState, useEffect } from 'react'
import { AdminAuthGate, useMockAuth } from '../components/AdminAuthGate'
import { ConditionalButton } from '@/components/ui/permission-guard'
import { activityLogger, logVendorApproval, logVendorRejection } from '@/lib/activity-logger'
import { AdminRole } from '@/lib/rbac'
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  Star,
  Package,
  Building,
  TrendingUp,
  Calendar,
  DollarSign,
  FileText,
  Image as ImageIcon
} from 'lucide-react'
import { 
  VendorProduct, 
  VendorProductStatus, 
  VENDOR_PRODUCT_STATUS_DISPLAY,
  getVendorProductStatusColor,
  getVendorProductStatusIcon,
  canApproveProduct,
  canRejectProduct
} from '@/types/vendor-product'
import { mockVendorProducts } from '@/types/vendor-product-examples'

interface ProductApprovalFilters {
  status: VendorProductStatus | 'all'
  vendorId: string
  category: string
  search: string
  submittedAfter?: string
  submittedBefore?: string
  qualityScore?: {
    min?: number
    max?: number
  }
  priceRange?: {
    min: number
    max: number
  }
}

export default function VendorProductsPage() {
  const { user, isLoading: authLoading } = useMockAuth()
  
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
  const [products, setProducts] = useState<VendorProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<VendorProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<ProductApprovalFilters>({
    status: 'all',
    vendorId: 'all',
    category: 'all',
    search: '',
    qualityScore: { min: 0, max: 100 }
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<VendorProduct | null>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve')
  const [approvalNotes, setApprovalNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProducts(mockVendorProducts)
      setFilteredProducts(mockVendorProducts)
      setIsLoading(false)
    }

    loadProducts()
  }, [])

  useEffect(() => {
    const filtered = products.filter(product => {
      const statusMatch = filters.status === 'all' || product.status === filters.status
      const vendorMatch = filters.vendorId === 'all' || product.vendorId === filters.vendorId
      const categoryMatch = filters.category === 'all' || product.category === filters.category
      const searchMatch = !filters.search || 
        product.productName.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.productDescription.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.sku.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.vendorName.toLowerCase().includes(filters.search.toLowerCase())
      
      let qualityMatch = true
      if (filters.qualityScore?.min !== undefined || filters.qualityScore?.max !== undefined) {
        const score = product.qualityAssessment?.overallScore || 0
        qualityMatch = score >= (filters.qualityScore?.min || 0) && score <= (filters.qualityScore?.max || 100)
      }
      
      let priceMatch = true
      if (filters.priceRange?.min !== undefined || filters.priceRange?.max !== undefined) {
        priceMatch = product.unitPrice >= (filters.priceRange?.min || 0) && product.unitPrice <= (filters.priceRange?.max || 999999)
      }
      
      let dateMatch = true
      if (filters.submittedAfter) {
        dateMatch = new Date(product.submittedAt) >= new Date(filters.submittedAfter)
      }
      if (filters.submittedBefore) {
        dateMatch = dateMatch && new Date(product.submittedAt) <= new Date(filters.submittedBefore)
      }

      return statusMatch && vendorMatch && categoryMatch && searchMatch && qualityMatch && priceMatch && dateMatch
    })

    setFilteredProducts(filtered)
  }, [products, filters])

  const handleFilterChange = (key: keyof ProductApprovalFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      status: 'all',
      vendorId: 'all',
      category: 'all',
      search: '',
      qualityScore: { min: 0, max: 100 }
    })
  }

  const handleApproveProduct = async (product: VendorProduct) => {
    setSelectedProduct(product)
    setApprovalAction('approve')
    setShowApprovalModal(true)
  }

  const handleRejectProduct = async (product: VendorProduct) => {
    setSelectedProduct(product)
    setApprovalAction('reject')
    setShowRejectionModal(true)
  }

  const processApproval = async () => {
    if (!selectedProduct || !user) return

    setIsProcessing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update product status
    const updatedProducts = products.map(p => 
      p.id === selectedProduct.id 
        ? {
            ...p,
            status: approvalAction === 'approve' ? VendorProductStatus.APPROVED : VendorProductStatus.REJECTED,
            reviewedAt: new Date().toISOString(),
            reviewedBy: user.id,
            approvedAt: approvalAction === 'approve' ? new Date().toISOString() : undefined,
            rejectedAt: approvalAction === 'reject' ? new Date().toISOString() : undefined,
            approvalNotes: approvalNotes,
            rejectionReason: approvalAction === 'reject' ? approvalNotes : undefined
          }
        : p
    )
    
    setProducts(updatedProducts)
    
    // Log the activity
    if (approvalAction === 'approve') {
      logVendorApproval(
        selectedProduct.vendorId,
        selectedProduct.vendorName,
        selectedProduct.id,
        selectedProduct.productName,
        approvalNotes
      )
    } else {
      logVendorRejection(
        selectedProduct.vendorId,
        selectedProduct.vendorName,
        approvalNotes,
        selectedProduct.id,
        selectedProduct.productName
      )
    }
    
    // Close modal
    setShowApprovalModal(false)
    setShowRejectionModal(false)
    setSelectedProduct(null)
    setApprovalNotes('')
    setIsProcessing(false)
  }

  const getStatusColor = (status: VendorProductStatus) => {
    return getVendorProductStatusColor(status)
  }

  const getStatusIcon = (status: VendorProductStatus) => {
    return getVendorProductStatusIcon(status)
  }

  const formatCurrency = (amount: number): string => {
    return `₵${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getQualityScore = (product: VendorProduct): number => {
    return product.qualityAssessment?.overallScore || 0
  }

  const getQualityColor = (score: number): string => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 75) return 'text-blue-600 bg-blue-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  if (isLoading) {
    return (
      <AdminAuthGate requiredRole={"procurement" as any}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Products Approval</h1>
            <p className="text-gray-600">Review and approve vendor product submissions</p>
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
    <AdminAuthGate requiredRole={"procurement" as any}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Products Approval</h1>
            <p className="text-gray-600">
              {filteredProducts.length} of {products.length} products
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
                (typeof v === 'object' ? v.min !== 0 || v.max !== 100 : true)
              ).length > 0 && (
                <span className="ml-2 px-2 py-1 bg-ghana-green text-white text-xs rounded-full">
                  {Object.values(filters).filter(v => 
                    v !== 'all' && 
                    v !== '' && 
                    (typeof v === 'object' ? v.min !== 0 || v.max !== 100 : true)
                  ).length}
                </span>
              )}
            </button>
            <button className="flex items-center px-4 py-2 bg-ghana-green text-white rounded-lg hover:bg-ghana-green/90 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
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
                  {Object.values(VendorProductStatus).map(status => (
                    <option key={status} value={status}>
                      {VENDOR_PRODUCT_STATUS_DISPLAY[status]?.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                <select
                  value={filters.vendorId}
                  onChange={(e) => handleFilterChange('vendorId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  <option value="all">All Vendors</option>
                  <option value="vend-001">Fresh Ghana Produce</option>
                  <option value="vend-002">Ghana Dairy Cooperative</option>
                  <option value="vend-003">Premium Meats Ghana</option>
                  <option value="vend-004">Northern Grains Association</option>
                  <option value="vend-005">Packaged Goods Ghana Ltd</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Meat">Meat</option>
                  <option value="Grains">Grains</option>
                  <option value="Packaged">Packaged</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality Score Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.qualityScore?.min || 0}
                    onChange={(e) => handleFilterChange('qualityScore', { ...filters.qualityScore, min: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.qualityScore?.max || 100}
                    onChange={(e) => handleFilterChange('qualityScore', { ...filters.qualityScore, max: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    value={filters.priceRange?.min || 0}
                    onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, min: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    min="0"
                    value={filters.priceRange?.max || 999999}
                    onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Submitted After</label>
                <input
                  type="date"
                  value={filters.submittedAfter}
                  onChange={(e) => handleFilterChange('submittedAfter', e.target.value)}
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
                    placeholder="Search products..."
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

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {product.documentation.productImages.length > 0 ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={product.documentation.productImages[0]}
                              alt={product.productName}
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                          <div className="text-xs text-gray-500">{product.brand}</div>
                          <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.vendorName}</div>
                        <div className="text-xs text-gray-500">{product.vendorCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {getStatusIcon(product.status)}
                        <span className="ml-2">{VENDOR_PRODUCT_STATUS_DISPLAY[product.status]?.label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getQualityColor(getQualityScore(product))}`}>
                          {getQualityScore(product).toFixed(0)}
                        </span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-600 ml-1">
                            {product.qualityAssessment?.overallScore?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.unitPrice)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {product.minimumOrder} {product.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(product.submittedAt)}</div>
                      <div className="text-xs text-gray-500">{formatDateTime(product.submittedAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-ghana-green hover:text-ghana-green/800">
                          <Eye className="h-4 w-4" />
                        </button>
                        <ConditionalButton
                          action="approve-vendor-product"
                          onClick={() => handleApproveProduct(product)}
                          className="text-blue-600 hover:text-blue-800"
                          fallback={
                            <span className="text-gray-400 cursor-not-allowed" title="You don't have permission to approve products">
                              <CheckCircle className="h-4 w-4" />
                            </span>
                          }
                        >
                          <CheckCircle className="h-4 w-4" />
                        </ConditionalButton>
                        <ConditionalButton
                          action="reject-vendor-product"
                          onClick={() => handleRejectProduct(product)}
                          className="text-red-600 hover:text-red-800"
                          fallback={
                            <span className="text-gray-400 cursor-not-allowed" title="You don't have permission to reject products">
                              <XCircle className="h-4 w-4" />
                            </span>
                          }
                        >
                          <XCircle className="h-4 w-4" />
                        </ConditionalButton>
                      </div>
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
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {products.filter(p => p.status === VendorProductStatus.PENDING).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.status === VendorProductStatus.APPROVED).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {products.filter(p => p.status === VendorProductStatus.REJECTED).length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {(showApprovalModal || showRejectionModal) && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {approvalAction === 'approve' ? 'Approve Product' : 'Reject Product'}
              </h3>
              <button
                onClick={() => {
                  setShowApprovalModal(false)
                  setShowRejectionModal(false)
                  setSelectedProduct(null)
                  setApprovalNotes('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  {showApprovalModal ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{selectedProduct.productName}</p>
                    <p className="text-sm text-gray-600">{selectedProduct.brand}</p>
                    <p className="text-xs text-gray-500">Vendor: {selectedProduct.vendorName}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {approvalAction === 'approve' ? 'Approval Notes' : 'Rejection Reason'}
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                placeholder={approvalAction === 'approve' ? 'Enter approval notes...' : 'Enter rejection reason...'}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false)
                  setShowRejectionModal(false)
                  setSelectedProduct(null)
                  setApprovalNotes('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={processApproval}
                disabled={isProcessing || !approvalNotes.trim()}
                className="px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {approvalAction === 'approve' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </>
                    )}
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
