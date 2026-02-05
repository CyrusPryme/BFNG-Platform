'use client'

import { useState, useEffect } from 'react'
import { AdminAuthGate, useMockAuth } from '../components/AdminAuthGate'
import { ConditionalButton } from '@/components/ui/permission-guard'
import { activityLogger, logProductCreate } from '@/lib/activity-logger'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  Leaf, 
  Flag,
  ToggleLeft,
  ToggleRight,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { Product, ProductCategory, ProductUnit, PRODUCT_CATEGORY_DISPLAY, PRODUCT_UNIT_DISPLAY, PRODUCT_QUALITY_DISPLAY } from '@/types/product'
import { mockProducts } from '@/types/product-examples'

interface ProductFilters {
  category: ProductCategory | 'all'
  search: string
  isAvailable: boolean | 'all'
  quality: 'premium' | 'standard' | 'economy' | 'all'
}

export default function ProductsPage() {
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
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<ProductFilters>({
    category: 'all',
    search: '',
    isAvailable: 'all',
    quality: 'all'
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setIsLoading(false)
    }

    loadProducts()
  }, [])

  useEffect(() => {
    const filtered = products.filter(product => {
      const categoryMatch = filters.category === 'all' || product.category === filters.category
      const searchMatch = !filters.search || 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.sku.toLowerCase().includes(filters.search.toLowerCase())
      const availabilityMatch = filters.isAvailable === 'all' || product.isAvailable === filters.isAvailable
      const qualityMatch = filters.quality === 'all' || product.quality === filters.quality

      return categoryMatch && searchMatch && availabilityMatch && qualityMatch
    })

    setFilteredProducts(filtered)
  }, [products, filters])

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: 'all',
      search: '',
      isAvailable: 'all',
      quality: 'all'
    })
  }

  const toggleAvailability = async (productId: string) => {
    const updatedProducts = products.map(product => 
      product.id === productId 
        ? { ...product, isAvailable: !product.isAvailable }
        : product
    )
    setProducts(updatedProducts)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const getCategoryColor = (category: ProductCategory) => {
    return PRODUCT_CATEGORY_DISPLAY[category]?.color || 'bg-gray-100 text-gray-800'
  }

  const getQualityColor = (quality: string) => {
    return PRODUCT_QUALITY_DISPLAY[quality as keyof typeof PRODUCT_QUALITY_DISPLAY]?.color || 'bg-gray-100 text-gray-800'
  }

  const getUnitDisplay = (unit: ProductUnit) => {
    return PRODUCT_UNIT_DISPLAY[unit]?.abbreviation || unit
  }

  const getPrimaryImage = (product: Product) => {
    return product.images.find(img => img.isPrimary) || product.images[0]
  }

  const formatPrice = (price: number) => {
    return `₵${price.toFixed(2)}`
  }

  const formatStock = (stock: number, minStock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' }
    if (stock <= minStock) return { text: `Low Stock (${stock})`, color: 'text-yellow-600 bg-yellow-100' }
    return { text: stock.toString(), color: 'text-green-600 bg-green-100' }
  }

  if (isLoading) {
    return (
      <AdminAuthGate requiredRole="inventory">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
            <p className="text-gray-600">Manage product catalog and inventory</p>
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
    <AdminAuthGate requiredRole="inventory">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
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
              {Object.values(filters).filter(v => v !== 'all' && v !== '').length > 0 && (
                <span className="ml-2 px-2 py-1 bg-ghana-green text-white text-xs rounded-full">
                  {Object.values(filters).filter(v => v !== 'all' && v !== '').length}
                </span>
              )}
            </button>
            <ConditionalButton
              action="create-product"
              className="flex items-center px-4 py-2 bg-ghana-green text-white rounded-lg hover:bg-ghana-green/90 transition-colors"
              fallback={
                <button 
                  disabled 
                  className="flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                  title="You don't have permission to create products"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </button>
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </ConditionalButton>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {Object.values(ProductCategory).map(category => (
                    <option key={category} value={category}>
                      {PRODUCT_CATEGORY_DISPLAY[category]?.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  value={filters.isAvailable === 'all' ? 'all' : filters.isAvailable.toString()}
                  onChange={(e) => handleFilterChange('isAvailable', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  <option value="all">All Products</option>
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                <select
                  value={filters.quality}
                  onChange={(e) => handleFilterChange('quality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  <option value="all">All Qualities</option>
                  <option value="premium">Premium</option>
                  <option value="standard">Standard</option>
                  <option value="economy">Economy</option>
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
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const stockInfo = formatStock(product.inventory.currentStock, product.inventory.minStock)
                  const primaryImage = getPrimaryImage(product)
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {primaryImage ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={primaryImage.url}
                                alt={primaryImage.alt}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                            <div className="text-xs text-gray-500">{product.supplierName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                          {PRODUCT_CATEGORY_DISPLAY[product.category]?.icon === 'leaf' && <Leaf className="h-3 w-3 mr-1" />}
                          {PRODUCT_CATEGORY_DISPLAY[product.category]?.icon === 'package' && <Package className="h-3 w-3 mr-1" />}
                          {PRODUCT_CATEGORY_DISPLAY[product.category]?.icon === 'flag' && <Flag className="h-3 w-3 mr-1" />}
                          {PRODUCT_CATEGORY_DISPLAY[product.category]?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{getUnitDisplay(product.unit)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatPrice(product.basePrice)}</div>
                        {product.bulkPricing.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Bulk: {formatPrice(product.bulkPricing[product.bulkPricing.length - 1].unitPrice)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockInfo.color}`}>
                          {stockInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQualityColor(product.quality)}`}>
                          {product.quality === 'premium' && <Star className="h-3 w-3 mr-1" />}
                          {product.quality === 'standard' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {product.quality === 'economy' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {PRODUCT_QUALITY_DISPLAY[product.quality]?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleAvailability(product.id)}
                          className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            product.isAvailable 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {product.isAvailable ? (
                            <>
                              <ToggleRight className="h-3 w-3 mr-1" />
                              Available
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-3 w-3 mr-1" />
                              Unavailable
                            </>
                          )}
                        </button>
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
              <span className="text-sm font-medium text-gray-600">Total Products</span>
              <span className="text-2xl font-bold text-gray-900">{products.length}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Available</span>
              <span className="text-2xl font-bold text-green-600">
                {products.filter(p => p.isAvailable).length}
              </span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Low Stock</span>
              <span className="text-2xl font-bold text-yellow-600">
                {products.filter(p => p.inventory.currentStock <= p.inventory.minStock && p.inventory.currentStock > 0).length}
              </span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Out of Stock</span>
              <span className="text-2xl font-bold text-red-600">
                {products.filter(p => p.inventory.currentStock === 0).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGate>
  )
}
