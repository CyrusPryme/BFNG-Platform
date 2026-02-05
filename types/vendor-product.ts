/**
 * Vendor Product Approval Status
 * Defines the different states for vendor product approval
 */
export enum VendorProductStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

/**
 * Product Quality Assessment
 * Quality metrics for vendor products
 */
export interface ProductQualityAssessment {
  overallScore: number // 0-100
  qualityScore: number // 0-100
  packagingScore: number // 0-100
  freshnessScore: number // 0-100
  complianceScore: number // 0-100
  assessmentDate: string
  assessedBy: string
  notes: string
}

/**
 * Product Pricing Review
 * Pricing analysis for vendor products
 */
export interface ProductPricingReview {
  marketPrice: number
  vendorPrice: number
  priceDifference: number // percentage
  priceReasonable: boolean
  marketComparison: {
    competitor1: string
    price1: number
    competitor2: string
    price2: number
    competitor3: string
    price3: number
  }
  reviewDate: string
  reviewedBy: string
  recommendations: string
}

/**
 * Product Documentation
 * Required documentation for vendor products
 */
export interface ProductDocumentation {
  productImages: string[]
  certificates: string[]
  licenses: string[]
  testReports: string[]
  ingredientList: string[]
  nutritionalInfo: {
    calories: number
    protein: number
    carbohydrates: number
    fat: number
    fiber: number
    sugar: number
    sodium: number
    allergens: string[]
    ingredients: string[]
    servingSize: string
  }
  specifications: {
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
    shelfLife: number // in days
    storageConditions: string[]
  }
  uploadedAt: string
}

/**
 * Vendor Product Model
 * Complete data model for vendor products awaiting approval
 */
export interface VendorProduct {
  id: string
  vendorId: string
  vendorName: string
  vendorCode: string
  productId: string
  productName: string
  productDescription: string
  category: string
  subcategory: string
  brand: string
  sku: string
  barcode?: string
  unit: string
  unitPrice: number
  currency: string
  minimumOrder: number
  maximumOrder: number
  availableQuantity: number
  status: VendorProductStatus
  submittedAt: string
  submittedBy: string
  reviewedAt?: string
  reviewedBy?: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  approvalNotes?: string
  qualityAssessment?: ProductQualityAssessment
  pricingReview?: ProductPricingReview
  documentation: ProductDocumentation
  tags: string[]
  specialRequirements?: string[]
  seasonalAvailability?: {
    availableFrom: string
    availableTo: string
    peakSeason: string[]
    offSeason: boolean
  }
  compliance: {
    foodSafety: boolean
    organic: boolean
    halal: boolean
    kosher: boolean
    glutenFree: boolean
    vegan: boolean
    fairTrade: boolean
    certifications: string[]
  }
  createdAt: string
  updatedAt: string
  lastModified: string
}

/**
 * Product Approval Request
 * Data structure for product approval requests
 */
export interface ProductApprovalRequest {
  vendorProduct: VendorProduct
  requestedBy: string
  requestedAt: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  deadline?: string
  specialInstructions?: string
}

/**
 * Product Approval Decision
 * Decision record for product approval
 */
export interface ProductApprovalDecision {
  vendorProductId: string
  decision: 'approve' | 'reject' | 'request_changes'
  reviewedBy: string
  reviewedAt: string
  notes: string
  conditions?: string[]
  followUpRequired: boolean
  followUpDate?: string
  qualityScore?: number
  pricingAdjustments?: {
    suggestedPrice: number
    reason: string
  }
  documentationRequired?: string[]
}

/**
 * Product Approval Filters
 * Used for searching and filtering products
 */
export interface ProductApprovalFilters {
  status?: VendorProductStatus | 'all'
  vendorId?: string
  category?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent' | 'all'
  submittedAfter?: string
  submittedBefore?: string
  search?: string
  qualityScore?: {
    min?: number
    max?: number
  }
  priceRange?: {
    min: number
    max: number
  }
  hasDocumentation?: boolean
  compliance?: string[]
}

/**
 * Product Approval Search Result
 * Used for API responses
 */
export interface ProductApprovalSearchResult {
  products: VendorProduct[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  filters: ProductApprovalFilters
}

/**
 * Product Approval Statistics
 * Dashboard statistics for approval workflow
 */
export interface ProductApprovalStatistics {
  total: number
  pending: number
  approved: number
  rejected: number
  averageReviewTime: number // in hours
  approvalRate: number
  rejectionRate: number
  byCategory: Record<string, number>
  byVendor: Record<string, number>
  byPriority: Record<string, number>
  monthlyTrends: {
    month: string
    submitted: number
    approved: number
    rejected: number
  }[]
}

/**
 * Product Approval Validation Rules
 */
export const PRODUCT_APPROVAL_VALIDATION_RULES = {
  productName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  productDescription: {
    required: true,
    minLength: 10,
    maxLength: 1000
  },
  unitPrice: {
    required: true,
    min: 0,
    max: 999999
  },
  minimumOrder: {
    required: true,
    min: 1
  },
  category: {
    required: true
  },
  unit: {
    required: true
  },
  documentation: {
    required: true,
    minImages: 1
  }
}

/**
 * Product Status Display Information
 */
export const VENDOR_PRODUCT_STATUS_DISPLAY = {
  [VendorProductStatus.PENDING]: {
    label: 'Pending Review',
    description: 'Product is awaiting admin approval',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'clock'
  },
  [VendorProductStatus.APPROVED]: {
    label: 'Approved',
    description: 'Product has been approved for sale',
    color: 'bg-green-100 text-green-800',
    icon: 'check-circle'
  },
  [VendorProductStatus.REJECTED]: {
    label: 'Rejected',
    description: 'Product has been rejected',
    color: 'bg-red-100 text-red-800',
    icon: 'x-circle'
  }
}

/**
 * Priority Display Information
 */
export const PRIORITY_DISPLAY = {
  low: {
    label: 'Low',
    description: 'Low priority review',
    color: 'bg-gray-100 text-gray-800',
    icon: 'arrow-down'
  },
  medium: {
    label: 'Medium',
    description: 'Medium priority review',
    color: 'bg-blue-100 text-blue-800',
    icon: 'minus'
  },
  high: {
    label: 'High',
    description: 'High priority review',
    color: 'bg-orange-100 text-orange-800',
    icon: 'arrow-up'
  },
  urgent: {
    label: 'Urgent',
    description: 'Urgent priority review',
    color: 'bg-red-100 text-red-800',
    icon: 'alert-triangle'
  }
}

/**
 * Helper Functions
 */
export const getVendorProductStatusColor = (status: VendorProductStatus): string => {
  return VENDOR_PRODUCT_STATUS_DISPLAY[status]?.color || 'bg-gray-100 text-gray-800'
}

export const getVendorProductStatusIcon = (status: VendorProductStatus): string => {
  return VENDOR_PRODUCT_STATUS_DISPLAY[status]?.icon || 'clock'
}

export const getPriorityColor = (priority: string): string => {
  return PRIORITY_DISPLAY[priority as keyof typeof PRIORITY_DISPLAY]?.color || 'bg-gray-100 text-gray-800'
}

export const getPriorityIcon = (priority: string): string => {
  return PRIORITY_DISPLAY[priority as keyof typeof PRIORITY_DISPLAY]?.icon || 'minus'
}

export const calculateApprovalRate = (products: VendorProduct[]): number => {
  if (products.length === 0) return 0
  const approvedCount = products.filter(p => p.status === VendorProductStatus.APPROVED).length
  return (approvedCount / products.length) * 100
}

export const calculateRejectionRate = (products: VendorProduct[]): number => {
  if (products.length === 0) return 0
  const rejectedCount = products.filter(p => p.status === VendorProductStatus.REJECTED).length
  return (rejectedCount / products.length) * 100
}

export const getAverageReviewTime = (products: VendorProduct[]): number => {
  const reviewedProducts = products.filter(p => p.reviewedAt)
  if (reviewedProducts.length === 0) return 0
  
  const totalTime = reviewedProducts.reduce((acc, product) => {
    if (product.submittedAt && product.reviewedAt) {
      const submitted = new Date(product.submittedAt).getTime()
      const reviewed = new Date(product.reviewedAt).getTime()
      return acc + (reviewed - submitted)
    }
    return acc
  }, 0)
  
  return totalTime / reviewedProducts.length / (1000 * 60 * 60) // Convert to hours
}

export const isProductPending = (product: VendorProduct): boolean => {
  return product.status === VendorProductStatus.PENDING
}

export const isProductApproved = (product: VendorProduct): boolean => {
  return product.status === VendorProductStatus.APPROVED
}

export const isProductRejected = (product: VendorProduct): boolean => {
  return product.status === VendorProductStatus.REJECTED
}

export const canApproveProduct = (product: VendorProduct): boolean => {
  return product.status === VendorProductStatus.PENDING
}

export const canRejectProduct = (product: VendorProduct): boolean => {
  return product.status === VendorProductStatus.PENDING
}

export const validateVendorProduct = (product: Partial<VendorProduct>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!product.productName || product.productName.length < 2) {
    errors.push('Product name is required and must be at least 2 characters')
  }
  
  if (!product.productDescription || product.productDescription.length < 10) {
    errors.push('Product description is required and must be at least 10 characters')
  }
  
  if (!product.unitPrice || product.unitPrice <= 0) {
    errors.push('Unit price is required and must be greater than 0')
  }
  
  if (!product.minimumOrder || product.minimumOrder < 1) {
    errors.push('Minimum order is required and must be at least 1')
  }
  
  if (!product.category) {
    errors.push('Product category is required')
  }
  
  if (!product.unit) {
    errors.push('Product unit is required')
  }
  
  if (!product.documentation?.productImages || product.documentation.productImages.length === 0) {
    errors.push('At least one product image is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const generateProductSKU = (vendorCode: string, productName: string): string => {
  const cleanName = productName.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 8)
  const timestamp = Date.now().toString(36).substring(2, 8).toUpperCase()
  return `${vendorCode}-${cleanName}-${timestamp}`
}

export default VendorProduct
