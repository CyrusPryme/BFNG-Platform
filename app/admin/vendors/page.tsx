'use client'

import { useState, useEffect } from 'react'
import { AdminAuthGate, useMockAuth } from '../components/AdminAuthGate'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Phone, 
  Mail, 
  MapPin,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  DollarSign,
  Building,
  Users,
  TrendingUp
} from 'lucide-react'
import { Vendor, VendorStatus, VendorCategory, VENDOR_STATUS_DISPLAY, VENDOR_CATEGORY_DISPLAY } from '@/types/vendor'
import { mockVendors } from '@/types/vendor-examples'

interface VendorFilters {
  status: VendorStatus | 'all'
  category: VendorCategory | 'all'
  commissionRange: {
    min: number
    max: number
  }
  search: string
  city: string
  region: string
  performanceRating: 'all' | 'excellent' | 'good' | 'average' | 'poor'
}

export default function VendorsPage() {
  const { user } = useMockAuth()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<VendorFilters>({
    status: 'all',
    category: 'all',
    commissionRange: { min: 0, max: 100 },
    search: '',
    city: '',
    region: '',
    performanceRating: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const loadVendors = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setVendors(mockVendors)
      setFilteredVendors(mockVendors)
      setIsLoading(false)
    }

    loadVendors()
  }, [])

  useEffect(() => {
    const filtered = vendors.filter(vendor => {
      const statusMatch = filters.status === 'all' || vendor.status === filters.status
      const categoryMatch = filters.category === 'all' || vendor.products.categories.includes(filters.category)
      const commissionMatch = vendor.commissionRate >= filters.commissionRange.min && vendor.commissionRate <= filters.commissionRange.max
      const searchMatch = !filters.search || 
        vendor.business.businessName.toLowerCase().includes(filters.search.toLowerCase()) ||
        vendor.contact.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        vendor.contact.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        vendor.contact.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        vendor.vendorCode.toLowerCase().includes(filters.search.toLowerCase())
      const cityMatch = !filters.city || vendor.contact.address.city.toLowerCase().includes(filters.city.toLowerCase())
      const regionMatch = !filters.region || vendor.contact.address.region.toLowerCase().includes(filters.region.toLowerCase())
      
      let performanceMatch = true
      if (filters.performanceRating !== 'all') {
        const rating = getVendorPerformanceRating(vendor)
        performanceMatch = rating === filters.performanceRating
      }

      return statusMatch && categoryMatch && commissionMatch && searchMatch && cityMatch && regionMatch && performanceMatch
    })

    setFilteredVendors(filtered)
  }, [vendors, filters])

  const handleFilterChange = (key: keyof VendorFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      status: 'all',
      category: 'all',
      commissionRange: { min: 0, max: 100 },
      search: '',
      city: '',
      region: '',
      performanceRating: 'all'
    })
  }

  const getStatusColor = (status: VendorStatus) => {
    return VENDOR_STATUS_DISPLAY[status]?.color || 'bg-gray-100 text-gray-800'
  }

  const getCategoryColor = (categories: VendorCategory[]) => {
    if (categories.length === 0) return 'bg-gray-100 text-gray-800'
    return VENDOR_CATEGORY_DISPLAY[categories[0]]?.color || 'bg-gray-100 text-gray-800'
  }

  const getPerformanceRating = (vendor: Vendor): 'excellent' | 'good' | 'average' | 'poor' => {
    const { qualityScore, onTimeDeliveryRate, customerRating } = vendor.performance
    const averageScore = (qualityScore + onTimeDeliveryRate + customerRating) / 3
    
    if (averageScore >= 90) return 'excellent'
    if (averageScore >= 75) return 'good'
    if (averageScore >= 60) return 'average'
    return 'poor'
  }

  const getPerformanceColor = (rating: 'excellent' | 'good' | 'average' | 'poor'): string => {
    switch (rating) {
      case 'excellent':
        return 'text-green-600 bg-green-100'
      case 'good':
        return 'text-blue-600 bg-blue-100'
      case 'average':
        return 'text-yellow-600 bg-yellow-100'
      case 'poor':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatCurrency = (amount: number): string => {
    return `₵${amount.toLocaleString()}`
  }

  const formatCommission = (rate: number): string => {
    return `${rate.toFixed(1)}%`
  }

  const getVendorFullName = (vendor: Vendor): string => {
    return `${vendor.contact.firstName} ${vendor.contact.lastName}`
  }

  const getVendorFullAddress = (vendor: Vendor): string => {
    const { street, city, region } = vendor.contact.address
    return `${street}, ${city}, ${region}`
  }

  const getVendorPerformanceRating = (vendor: Vendor): 'excellent' | 'good' | 'average' | 'poor' => {
    const { qualityScore, onTimeDeliveryRate, customerRating } = vendor.performance
    const averageScore = (qualityScore + onTimeDeliveryRate + customerRating) / 3
    
    if (averageScore >= 90) return 'excellent'
    if (averageScore >= 75) return 'good'
    if (averageScore >= 60) return 'average'
    return 'poor'
  }

  if (isLoading) {
    return (
      <AdminAuthGate requiredRole={"procurement" as any}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendors Management</h1>
            <p className="text-gray-600">Manage vendor relationships and performance</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Vendors Management</h1>
            <p className="text-gray-600">
              {filteredVendors.length} of {vendors.length} vendors
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
              Add Vendor
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
                  {Object.values(VendorStatus).map(status => (
                    <option key={status} value={status}>
                      {VENDOR_STATUS_DISPLAY[status]?.label}
                    </option>
                  ))}
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
                  {Object.values(VendorCategory).map(category => (
                    <option key={category} value={category}>
                      {VENDOR_CATEGORY_DISPLAY[category]?.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Performance Rating</label>
                <select
                  value={filters.performanceRating}
                  onChange={(e) => handleFilterChange('performanceRating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  <option value="all">All Ratings</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commission Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.commissionRange.min}
                    onChange={(e) => handleFilterChange('commissionRange', { ...filters.commissionRange, min: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.commissionRange.max}
                    onChange={(e) => handleFilterChange('commissionRange', { ...filters.commissionRange, max: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                  placeholder="Filter by city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <input
                  type="text"
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                  placeholder="Filter by region"
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
                    placeholder="Search vendors..."
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

        {/* Vendors Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVendors.map((vendor) => {
                  const performanceRating = getVendorPerformanceRating(vendor)
                  const performanceColor = getPerformanceColor(performanceRating)
                  
                  return (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-ghana-green/10 rounded-full flex items-center justify-center">
                            <Building className="h-5 w-5 text-ghana-green" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {vendor.business.businessName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {vendor.vendorCode} • {getVendorFullName(vendor)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {vendor.business.businessType}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(vendor.products.categories)}`}>
                          {vendor.products.categories.length > 0 && VENDOR_CATEGORY_DISPLAY[vendor.products.categories[0]]?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                          {VENDOR_STATUS_DISPLAY[vendor.status]?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCommission(vendor.commissionRate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${performanceColor}`}>
                            {performanceRating}
                          </span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-gray-600 ml-1">
                              {vendor.performance.customerRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(vendor.performance.totalRevenue)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {vendor.performance.totalOrders} orders
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-1" />
                            {vendor.contact.phone}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 text-gray-400 mr-1" />
                            {vendor.contact.email}
                          </div>
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
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
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
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
              </div>
              <Building className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                <p className="text-2xl font-bold text-green-600">
                  {vendors.filter(v => v.status === VendorStatus.ACTIVE).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {vendors.filter(v => v.status === VendorStatus.PENDING).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Commission</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCommission(vendors.reduce((acc, v) => acc + v.commissionRate, 0) / vendors.length)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGate>
  )
}
