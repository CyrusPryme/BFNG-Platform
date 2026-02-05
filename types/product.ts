/**
 * Product Categories
 * Defines the different types of products available in the BFNG system
 */
export enum ProductCategory {
  FRESH = 'fresh',
  PACKAGED = 'packaged',
  MADE_IN_GHANA = 'made-in-ghana'
}

/**
 * Product Units
 * Defines the measurement units for different product types
 */
export enum ProductUnit {
  KG = 'kg',
  PIECES = 'pieces',
  LITERS = 'liters',
  BOTTLES = 'bottles',
  BUNCHES = 'bunches',
  HEADS = 'heads',
  BAGS = 'bags',
  BOXES = 'boxes',
  UNITS = 'units',
  PACKS = 'packs',
  DOZENS = 'dozens',
  METERS = 'meters',
  GRAMS = 'g'
}

/**
 * Bulk Pricing Tiers
 * Defines the pricing structure for bulk purchases
 */
export interface BulkPricingTier {
  minQuantity: number
  maxQuantity?: number
  unitPrice: number
  discount: number // percentage discount
  tierName: string
}

/**
 * Product Image
 * Represents an image associated with a product
 */
export interface ProductImage {
  id: string
  url: string
  alt: string
  caption?: string
  isPrimary: boolean
  sortOrder: number
  uploadedAt: string
  fileSize: number
  dimensions: {
    width: number
    height: number
  }
}

/**
 * Product Inventory
 * Tracks stock levels and availability
 */
export interface ProductInventory {
  currentStock: number
  minStock: number
  maxStock: number
  reorderLevel: number
  lastRestocked: string
  supplier: string
  location: string
  batchNumber?: string
  expiryDate?: string
}

/**
 * Product Substitution Rules
 * Defines substitution preferences and alternatives
 */
export interface SubstitutionRule {
  id: string
  productId: string
  alternativeProductIds: string[]
  preference: 'exact' | 'similar' | 'premium' | 'economy'
  autoApprove: boolean
  maxPriceDifference: number // percentage
  reason: string
}

/**
 * Product Model
 * Complete data model for products in the BFNG system
 */
export interface Product {
  id: string
  name: string
  description: string
  category: ProductCategory
  unit: ProductUnit
  basePrice: number
  currency: string
  sku: string
  barcode?: string
  
  // Availability
  isAvailable: boolean
  isSubstitutable: boolean
  inventory: ProductInventory
  
  // Pricing
  bulkPricing: BulkPricingTier[]
  
  // Images
  images: ProductImage[]
  
  // Substitution Rules
  substitutionRules: SubstitutionRule[]
  
  // Metadata
  tags: string[]
  attributes: Record<string, any>
  
  // Supplier Information
  supplierId: string
  supplierName: string
  supplierEmail: string
  supplierPhone: string
  
  // Quality and Certification
  quality: 'premium' | 'standard' | 'economy'
  certifications: string[]
  organic: boolean
  fairTrade: boolean
  locallySourced: boolean
  
  // Nutritional Information (for food items)
  nutritionalInfo?: {
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
  
  // Storage Requirements
  storageRequirements?: {
    temperature: {
      min: number
      max: number
      unit: string
    }
    humidity: {
      min: number
      max: number
    }
    shelfLife: number // in days
    storageInstructions: string[]
  }
  
  // Seasonal Information
  seasonal?: {
    availableFrom: string
    availableTo: string
    peakSeason: string[]
    offSeason: boolean
  }
  
  // Timestamps
  createdAt: string
  updatedAt: string
  lastModified: string
}

/**
 * Product Filters
 * Used for searching and filtering products
 */
export interface ProductFilters {
  category?: ProductCategory | 'all'
  isAvailable?: boolean
  isSubstitutable?: boolean
  priceRange?: {
    min: number
    max: number
  }
  supplierId?: string
  quality?: 'premium' | 'standard' | 'economy' | 'all'
  tags?: string[]
  search?: string
}

/**
 * Product Search Result
 * Used for API responses
 */
export interface ProductSearchResult {
  products: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  filters: ProductFilters
}

/**
 * Product Validation Rules
 */
export const PRODUCT_VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 1000
  },
  basePrice: {
    required: true,
    min: 0,
    max: 999999
  },
  sku: {
    required: true,
    pattern: '^[A-Z0-9-_]{3,50}$',
    unique: true
  },
  category: {
    required: true,
    enum: Object.values(ProductCategory)
  },
  unit: {
    required: true,
    enum: Object.values(ProductUnit)
  },
  images: {
    required: true,
    minItems: 1,
    maxItems: 10
  }
}

/**
 * Product Category Display Information
 */
export const PRODUCT_CATEGORY_DISPLAY = {
  [ProductCategory.FRESH]: {
    label: 'Fresh Produce',
    description: 'Fresh fruits, vegetables, and perishable items',
    color: 'bg-green-100 text-green-800',
    icon: 'leaf'
  },
  [ProductCategory.PACKAGED]: {
    label: 'Packaged Goods',
    description: 'Processed and packaged food items',
    color: 'bg-blue-100 text-blue-800',
    icon: 'package'
  },
  [ProductCategory.MADE_IN_GHANA]: {
    label: 'Made in Ghana',
    description: 'Products manufactured in Ghana',
    color: 'bg-orange-100 text-orange-800',
    icon: 'flag'
  }
}

/**
 * Product Unit Display Information
 */
export const PRODUCT_UNIT_DISPLAY = {
  [ProductUnit.KG]: {
    label: 'Kilogram',
    abbreviation: 'kg'
  },
  [ProductUnit.PIECES]: {
    label: 'Pieces',
    abbreviation: 'pcs'
  },
  [ProductUnit.LITERS]: {
    label: 'Liters',
    abbreviation: 'L'
  },
  [ProductUnit.BOTTLES]: {
    label: 'Bottles',
    abbreviation: 'btl'
  },
  [ProductUnit.BUNCHES]: {
    label: 'Bunches',
    abbreviation: 'bunch'
  },
  [ProductUnit.HEADS]: {
    label: 'Heads',
    abbreviation: 'heads'
  },
  [ProductUnit.BAGS]: {
    label: 'Bags',
    abbreviation: 'bags'
  },
  [ProductUnit.BOXES]: {
    label: 'Boxes',
    abbreviation: 'boxes'
  },
  [ProductUnit.UNITS]: {
    label: 'Units',
    abbreviation: 'units'
  },
  [ProductUnit.PACKS]: {
    label: 'Packs',
    abbreviation: 'packs'
  },
  [ProductUnit.DOZENS]: {
    label: 'Dozens',
    abbreviation: 'doz'
  },
  [ProductUnit.METERS]: {
    label: 'Meters',
    abbreviation: 'm'
  },
  [ProductUnit.GRAMS]: {
    label: 'Grams',
    abbreviation: 'g'
  }
}

/**
 * Product Quality Display Information
 */
export const PRODUCT_QUALITY_DISPLAY = {
  premium: {
    label: 'Premium',
    description: 'Highest quality products',
    color: 'bg-purple-100 text-purple-800',
    icon: 'star'
  },
  standard: {
    label: 'Standard',
    description: 'Regular quality products',
    color: 'bg-blue-100 text-blue-800',
    icon: 'check-circle'
  },
  economy: {
    label: 'Economy',
    description: 'Budget-friendly options',
    color: 'bg-gray-100 text-gray-800',
    icon: 'dollar-sign'
  }
}

/**
 * Helper Functions
 */
export const getProductPrice = (product: Product, quantity: number): number => {
  // Find applicable bulk pricing tier
  const applicableTier = product.bulkPricing
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find(tier => quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity))
  
  if (applicableTier) {
    return applicableTier.unitPrice * quantity
  }
  
  return product.basePrice * quantity
}

export const getBulkDiscount = (product: Product, quantity: number): number => {
  const applicableTier = product.bulkPricing
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find(tier => quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity))
  
  return applicableTier ? applicableTier.discount : 0
}

export const isProductAvailable = (product: Product): boolean => {
  return product.isAvailable && product.inventory.currentStock > 0
}

export const canSubstitute = (product: Product): boolean => {
  return product.isSubstitutable && product.substitutionRules.length > 0
}

export const getPrimaryImage = (product: Product): ProductImage | null => {
  return product.images.find(img => img.isPrimary) || product.images[0] || null
}

export const validateProduct = (product: Partial<Product>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!product.name || product.name.length < 2) {
    errors.push('Product name is required and must be at least 2 characters')
  }
  
  if (!product.description || product.description.length < 10) {
    errors.push('Product description is required and must be at least 10 characters')
  }
  
  if (!product.basePrice || product.basePrice < 0) {
    errors.push('Base price is required and must be a positive number')
  }
  
  if (!product.sku || !/^[A-Z0-9-_]{3,50}$/.test(product.sku)) {
    errors.push('SKU is required and must be 3-50 characters (alphanumeric, hyphens, underscores only)')
  }
  
  if (!product.images || product.images.length < 1) {
    errors.push('At least one product image is required')
  }
  
  if (!product.category || !Object.values(ProductCategory).includes(product.category)) {
    errors.push('Valid product category is required')
  }
  
  if (!product.unit || !Object.values(ProductUnit).includes(product.unit)) {
    errors.push('Valid product unit is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export default Product
