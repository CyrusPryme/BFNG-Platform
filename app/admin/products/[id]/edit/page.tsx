'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminAuthGate, useMockAuth } from '../../../components/AdminAuthGate'
import { Product, ProductCategory, ProductUnit, BulkPricingTier, ProductImage, PRODUCT_CATEGORY_DISPLAY, PRODUCT_UNIT_DISPLAY, PRODUCT_QUALITY_DISPLAY } from '@/types/product'
import { mockProducts } from '@/types/product-examples'

export default function EditProductPage() {
  const { user } = useMockAuth()
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Find product by ID
      const foundProduct = mockProducts.find(p => p.id === params.id)
      setProduct(foundProduct || null)
      setIsLoading(false)
    }

    loadProduct()
  }, [params.id])

  const handleSave = async () => {
    if (!product) return
    
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Product updated:', product)
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AdminAuthGate requiredRole="inventory">
        <div className="space-y-6">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Loading Product...</h1>
              <p className="text-gray-600">Please wait while we fetch the product details</p>
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

  if (!product) {
    return (
      <AdminAuthGate requiredRole="inventory">
        <div className="space-y-6">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
              <p className="text-gray-600">The product you're looking for doesn't exist</p>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600">Update product information</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-ghana-green text-white rounded-lg hover:bg-ghana-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Basic Information</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Name:</dt>
                  <dd className="text-sm font-medium text-gray-900">{product.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">SKU:</dt>
                  <dd className="text-sm font-medium text-gray-900">{product.sku}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Category:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {PRODUCT_CATEGORY_DISPLAY[product.category]?.label}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Unit:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {PRODUCT_UNIT_DISPLAY[product.unit]?.label}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Base Price:</dt>
                  <dd className="text-sm font-medium text-gray-900">₵{product.basePrice.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Quality:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {PRODUCT_QUALITY_DISPLAY[product.quality]?.label}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Substitutable:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    product.isSubstitutable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.isSubstitutable ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <span className="text-sm font-medium text-gray-900">{product.inventory.currentStock}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Supplier Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">Name:</span>
                <p className="text-sm font-medium text-gray-900">{product.supplierName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="text-sm font-medium text-gray-900">{product.supplierEmail}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Phone:</span>
                <p className="text-sm font-medium text-gray-900">{product.supplierPhone}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Bulk Pricing Tiers</h3>
            <div className="space-y-2">
              {product.bulkPricing.map((tier, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{tier.tierName}</span>
                    <span className="text-sm text-gray-600">
                      {tier.minQuantity} - {tier.maxQuantity || '∞'} units
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">
                      {tier.discount}% discount
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      ₵{tier.unitPrice.toFixed(2)} per unit
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Product Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-ghana-green text-white text-xs rounded-full">
                        Primary
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                <strong>Edit functionality coming soon!</strong> This page currently shows a preview of the product. Full editing capabilities will be implemented in the next phase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGate>
  )
}
