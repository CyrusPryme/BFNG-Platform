'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminAuthGate, useMockAuth } from '../../components/AdminAuthGate'

interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}
import { 
  ArrowLeft, 
  Save, 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Package,
  Star,
  Flag,
  Leaf
} from 'lucide-react'
import { Product, ProductCategory, ProductUnit, BulkPricingTier, ProductImage, PRODUCT_CATEGORY_DISPLAY, PRODUCT_UNIT_DISPLAY, PRODUCT_QUALITY_DISPLAY } from '@/types/product'
import { ImageUploadHandler, UploadedImage, UploadResult } from '@/lib/image-upload-new'

interface FormData {
  name: string
  description: string
  category: ProductCategory
  unit: ProductUnit
  basePrice: number
  sku: string
  barcode: string
  isAvailable: boolean
  isSubstitutable: boolean
  quality: 'premium' | 'standard' | 'economy'
  supplierName: string
  supplierEmail: string
  supplierPhone: string
  tags: string[]
  bulkPricing: BulkPricingTier[]
  images: ProductImage[]
}

export default function CreateProductPage() {
  const { user } = useMockAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [imageUploadHandler] = useState(() => new ImageUploadHandler())
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({})
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: ProductCategory.FRESH,
    unit: ProductUnit.KG,
    basePrice: 0,
    sku: '',
    barcode: '',
    isAvailable: true,
    isSubstitutable: true,
    quality: 'standard',
    supplierName: '',
    supplierEmail: '',
    supplierPhone: '',
    tags: [],
    bulkPricing: [
      {
        minQuantity: 1,
        maxQuantity: 9,
        unitPrice: 0,
        discount: 0,
        tierName: 'Regular'
      }
    ],
    images: []
  })

  useEffect(() => {
    // Update bulk pricing tier price when base price changes
    const updatedBulkPricing = formData.bulkPricing.map(tier => ({
      ...tier,
      unitPrice: formData.basePrice * (1 - tier.discount / 100)
    }))
    setFormData(prev => ({ ...prev, bulkPricing: updatedBulkPricing }))
  }, [formData.basePrice])

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleBulkPricingChange = (index: number, field: keyof BulkPricingTier, value: any) => {
    const updatedBulkPricing = [...formData.bulkPricing]
    updatedBulkPricing[index] = { ...updatedBulkPricing[index], [field]: value }
    
    // Recalculate unit price if discount changes
    if (field === 'discount') {
      updatedBulkPricing[index].unitPrice = formData.basePrice * (1 - value / 100)
    }
    
    setFormData(prev => ({ ...prev, bulkPricing: updatedBulkPricing }))
  }

  const addBulkPricingTier = () => {
    const lastTier = formData.bulkPricing[formData.bulkPricing.length - 1]
    const newTier: BulkPricingTier = {
      minQuantity: lastTier ? lastTier.maxQuantity ? lastTier.maxQuantity + 1 : 10 : 10,
      maxQuantity: undefined,
      unitPrice: formData.basePrice * 0.9,
      discount: 10,
      tierName: `Tier ${formData.bulkPricing.length + 1}`
    }
    setFormData(prev => ({ ...prev, bulkPricing: [...prev.bulkPricing, newTier] }))
  }

  const removeBulkPricingTier = (index: number) => {
    if (formData.bulkPricing.length > 1) {
      setFormData(prev => ({ 
        ...prev, 
        bulkPricing: prev.bulkPricing.filter((_, i) => i !== index) 
      }))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleImageFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleImageFiles(files)
  }

  const handleImageFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    imageFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string
        setPreviewImages(prev => [...prev, previewUrl])
        setUploadedImages(prev => [...prev, {
          id: `img-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          file,
          preview: previewUrl
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const setPrimaryImage = (index: number) => {
    const updatedImages = previewImages.map((url, i) => ({
      id: `img-${i}`,
      url,
      alt: formData.name,
      caption: '',
      isPrimary: i === index,
      sortOrder: i,
      uploadedAt: new Date().toISOString(),
      fileSize: uploadedImages[i]?.size || 0,
      dimensions: { width: 800, height: 600 }
    }))
    setFormData(prev => ({ ...prev, images: updatedImages }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Product name is required and must be at least 2 characters'
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description is required and must be at least 10 characters'
    }

    if (!formData.basePrice || formData.basePrice <= 0) {
      newErrors.basePrice = 'Base price is required and must be greater than 0'
    }

    if (!formData.sku || !/^[A-Z0-9-_]{3,50}$/.test(formData.sku)) {
      newErrors.sku = 'SKU is required and must be 3-50 characters (alphanumeric, hyphens, underscores only)'
    }

    if (!formData.supplierName) {
      newErrors.supplierName = 'Supplier name is required'
    }

    if (!formData.supplierEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supplierEmail)) {
      newErrors.supplierEmail = 'Valid supplier email is required'
    }

    if (uploadedImages.length === 0) {
      newErrors.images = 'At least one product image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Convert uploaded images to ProductImage format
      const productImages: ProductImage[] = uploadedImages.map((file, index) => ({
        id: `img-${index}`,
        url: previewImages[index],
        alt: formData.name,
        caption: '',
        isPrimary: index === 0,
        sortOrder: index,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size,
        dimensions: { width: 800, height: 600 }
      }))

      const productData = {
        ...formData,
        images: productImages,
        currency: 'GHS',
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Product created:', productData)
      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      setIsLoading(false)
    }
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
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
              <p className="text-gray-600">Add a new product to your catalog</p>
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
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-ghana-green text-white rounded-lg hover:bg-ghana-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value.toUpperCase())}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent ${
                    errors.sku ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter SKU (e.g., TOM-001)"
                />
                {errors.sku && (
                  <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value as ProductCategory)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  {Object.values(ProductCategory).map(category => (
                    <option key={category} value={category}>
                      {PRODUCT_CATEGORY_DISPLAY[category]?.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value as ProductUnit)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  {Object.values(ProductUnit).map(unit => (
                    <option key={unit} value={unit}>
                      {PRODUCT_UNIT_DISPLAY[unit]?.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price (₵) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.basePrice}
                  onChange={(e) => handleInputChange('basePrice', parseFloat(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent ${
                    errors.basePrice ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.basePrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.basePrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barcode
                </label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange('barcode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                  placeholder="Enter barcode (optional)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter product description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pricing Tiers</h2>
              <button
                type="button"
                onClick={addBulkPricingTier}
                className="flex items-center px-3 py-1 bg-ghana-green text-white rounded-md hover:bg-ghana-green/90"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Tier
              </button>
            </div>

            <div className="space-y-4">
              {formData.bulkPricing.map((tier, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900">{tier.tierName}</h3>
                    {formData.bulkPricing.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBulkPricingTier(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={tier.minQuantity}
                        onChange={(e) => handleBulkPricingChange(index, 'minQuantity', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={tier.maxQuantity || ''}
                        onChange={(e) => handleBulkPricingChange(index, 'maxQuantity', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                        placeholder="Unlimited"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={tier.discount}
                        onChange={(e) => handleBulkPricingChange(index, 'discount', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Price (₵)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={tier.unitPrice}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
            
            {errors.images && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-sm text-red-800">{errors.images}</p>
                </div>
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging ? 'border-ghana-green bg-ghana-green/10' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="mb-4">
                <p className="text-lg font-medium text-gray-900">
                  {isDragging ? 'Drop images here' : 'Drag & drop images here'}
                </p>
                <p className="text-sm text-gray-500">or</p>
              </div>
              <label className="cursor-pointer">
                <span className="inline-flex items-center px-4 py-2 bg-ghana-green text-white rounded-md hover:bg-ghana-green/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Select Files
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>

            {/* Image Preview */}
            {previewImages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Image Preview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          className="px-2 py-1 bg-ghana-green text-white text-xs rounded-full hover:bg-ghana-green/90"
                        >
                          {index === 0 ? 'Primary' : 'Set Primary'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality
                </label>
                <select
                  value={formData.quality}
                  onChange={(e) => handleInputChange('quality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                >
                  <option value="premium">Premium</option>
                  <option value="standard">Standard</option>
                  <option value="economy">Economy</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                    className="rounded border-gray-300 text-ghana-green focus:ring-ghana-green"
                  />
                  <span className="ml-2 text-sm text-gray-700">Available</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isSubstitutable}
                    onChange={(e) => handleInputChange('isSubstitutable', e.target.checked)}
                    className="rounded border-gray-300 text-ghana-green focus:ring-ghana-green"
                  />
                  <span className="ml-2 text-sm text-gray-700">Substitutable</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Name *
                </label>
                <input
                  type="text"
                  value={formData.supplierName}
                  onChange={(e) => handleInputChange('supplierName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent ${
                    errors.supplierName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter supplier name"
                />
                {errors.supplierName && (
                  <p className="mt-1 text-sm text-red-600">{errors.supplierName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Email *
                </label>
                <input
                  type="email"
                  value={formData.supplierEmail}
                  onChange={(e) => handleInputChange('supplierEmail', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent ${
                    errors.supplierEmail ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter supplier email"
                />
                {errors.supplierEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.supplierEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Phone
                </label>
                <input
                  type="tel"
                  value={formData.supplierPhone}
                  onChange={(e) => handleInputChange('supplierPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ghana-green focus:border-transparent"
                  placeholder="Enter supplier phone"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminAuthGate>
  )
}
