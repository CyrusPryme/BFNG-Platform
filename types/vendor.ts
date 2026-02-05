/**
 * Vendor Status
 * Defines the different status states for vendors
 */
export enum VendorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  BLACKLISTED = 'blacklisted'
}

/**
 * Vendor Categories
 * Defines the different types of vendors
 */
export enum VendorCategory {
  PRODUCE = 'produce',
  DAIRY = 'dairy',
  MEAT = 'meat',
  GRAINS = 'grains',
  PACKAGED = 'packaged',
  BEVERAGES = 'beverages',
  IMPORTED = 'imported',
  HANDMADE = 'handmade'
}

/**
 * Vendor Contact Information
 */
export interface VendorContact {
  firstName: string
  lastName: string
  email: string
  phone: string
  secondaryPhone?: string
  address: {
    street: string
    city: string
    region: string
    postalCode: string
    country: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
}

/**
 * Vendor Business Information
 */
export interface VendorBusiness {
  businessName: string
  businessType: 'individual' | 'company' | 'cooperative'
  registrationNumber?: string
  taxId?: string
  website?: string
  description: string
  establishedYear?: number
  numberOfEmployees?: number
  annualRevenue?: number
}

/**
 * Vendor Banking Information
 */
export interface VendorBanking {
  bankName: string
  accountName: string
  accountNumber: string
  branchCode?: string
  routingNumber?: string
  swiftCode?: string
  mobileMoney?: {
    provider: string
    number: string
    name: string
  }
}

/**
 * Vendor Performance Metrics
 */
export interface VendorPerformance {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  onTimeDeliveryRate: number
  qualityScore: number
  customerRating: number
  lastOrderDate: string
  averageDeliveryTime: number // in hours
  returnRate: number
  complaintRate: number
}

/**
 * Vendor Certifications and Compliance
 */
export interface VendorCompliance {
  certifications: string[]
  licenses: string[]
  insurance: {
    liability: boolean
    expiryDate?: string
    provider?: string
  }
  foodSafety: {
    certified: boolean
    expiryDate?: string
    authority?: string
  }
  organic: {
    certified: boolean
    expiryDate?: string
    authority?: string
  }
  fairTrade: {
    certified: boolean
    expiryDate?: string
    authority?: string
  }
}

/**
 * Vendor Products and Services
 */
export interface VendorProducts {
  categories: VendorCategory[]
  productTypes: string[]
  specialties: string[]
  capacity: {
    dailyCapacity: number
    weeklyCapacity: number
    unit: string
  }
  pricing: {
    wholesale: boolean
    retail: boolean
    minimumOrder: number
    deliveryRadius: number // in km
  }
}

/**
 * Vendor Model
 * Complete data model for vendors in the BFNG system
 */
export interface Vendor {
  id: string
  vendorCode: string
  contact: VendorContact
  business: VendorBusiness
  banking: VendorBanking
  performance: VendorPerformance
  compliance: VendorCompliance
  products: VendorProducts
  status: VendorStatus
  commissionRate: number // percentage
  paymentTerms: {
    method: 'cash' | 'bank_transfer' | 'mobile_money' | 'check'
    frequency: 'immediate' | 'weekly' | 'bi_weekly' | 'monthly'
    netDays: number
  }
  notes?: string
  tags: string[]
  assignedProducts: string[] // Product IDs they supply
  preferredDeliveryDays: string[]
  deliverySchedule: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  createdAt: string
  updatedAt: string
  lastModified: string
  createdBy?: string
  modifiedBy?: string
}

/**
 * Vendor Filters
 * Used for searching and filtering vendors
 */
export interface VendorFilters {
  status?: VendorStatus | 'all'
  category?: VendorCategory | 'all'
  commissionRange?: {
    min: number
    max: number
  }
  search?: string
  city?: string
  region?: string
  hasCertifications?: boolean
  performanceRating?: 'all' | 'excellent' | 'good' | 'average' | 'poor'
}

/**
 * Vendor Search Result
 * Used for API responses
 */
export interface VendorSearchResult {
  vendors: Vendor[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  filters: VendorFilters
}

/**
 * Vendor Validation Rules
 */
export const VENDOR_VALIDATION_RULES = {
  businessName: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  contactName: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  email: {
    required: true,
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
  },
  phone: {
    required: true,
    pattern: '^[+]?[0-9]{10,15}$'
  },
  commissionRate: {
    required: true,
    min: 0,
    max: 100
  },
  vendorCode: {
    required: true,
    pattern: '^[A-Z0-9-_]{3,20}$',
    unique: true
  }
}

/**
 * Vendor Status Display Information
 */
export const VENDOR_STATUS_DISPLAY = {
  [VendorStatus.ACTIVE]: {
    label: 'Active',
    description: 'Vendor is actively supplying products',
    color: 'bg-green-100 text-green-800',
    icon: 'check-circle'
  },
  [VendorStatus.INACTIVE]: {
    label: 'Inactive',
    description: 'Vendor is not currently active',
    color: 'bg-gray-100 text-gray-800',
    icon: 'pause-circle'
  },
  [VendorStatus.PENDING]: {
    label: 'Pending',
    description: 'Vendor application is pending approval',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'clock'
  },
  [VendorStatus.SUSPENDED]: {
    label: 'Suspended',
    description: 'Vendor is temporarily suspended',
    color: 'bg-orange-100 text-orange-800',
    icon: 'alert-triangle'
  },
  [VendorStatus.BLACKLISTED]: {
    label: 'Blacklisted',
    description: 'Vendor is blacklisted from the platform',
    color: 'bg-red-100 text-red-800',
    icon: 'x-circle'
  }
}

/**
 * Vendor Category Display Information
 */
export const VENDOR_CATEGORY_DISPLAY = {
  [VendorCategory.PRODUCE]: {
    label: 'Fresh Produce',
    description: 'Fruits and vegetables suppliers',
    color: 'bg-green-100 text-green-800',
    icon: 'leaf'
  },
  [VendorCategory.DAIRY]: {
    label: 'Dairy Products',
    description: 'Milk, cheese, and dairy suppliers',
    color: 'bg-blue-100 text-blue-800',
    icon: 'droplet'
  },
  [VendorCategory.MEAT]: {
    label: 'Meat & Poultry',
    description: 'Meat, poultry, and fish suppliers',
    color: 'bg-red-100 text-red-800',
    icon: 'beef'
  },
  [VendorCategory.GRAINS]: {
    label: 'Grains & Cereals',
    description: 'Rice, wheat, and grain suppliers',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'wheat'
  },
  [VendorCategory.PACKAGED]: {
    label: 'Packaged Goods',
    description: 'Processed and packaged food suppliers',
    color: 'bg-purple-100 text-purple-800',
    icon: 'package'
  },
  [VendorCategory.BEVERAGES]: {
    label: 'Beverages',
    description: 'Drinks and beverage suppliers',
    color: 'bg-indigo-100 text-indigo-800',
    icon: 'coffee'
  },
  [VendorCategory.IMPORTED]: {
    label: 'Imported Goods',
    description: 'International product suppliers',
    color: 'bg-pink-100 text-pink-800',
    icon: 'globe'
  },
  [VendorCategory.HANDMADE]: {
    label: 'Handmade Products',
    description: 'Artisan and craft suppliers',
    color: 'bg-orange-100 text-orange-800',
    icon: 'hand'
  }
}

/**
 * Helper Functions
 */
export const getVendorFullName = (vendor: Vendor): string => {
  return `${vendor.contact.firstName} ${vendor.contact.lastName}`
}

export const getVendorFullAddress = (vendor: Vendor): string => {
  const { street, city, region, postalCode, country } = vendor.contact.address
  return `${street}, ${city}, ${region} ${postalCode}, ${country}`
}

export const getVendorPerformanceRating = (vendor: Vendor): 'excellent' | 'good' | 'average' | 'poor' => {
  const { qualityScore, onTimeDeliveryRate, customerRating } = vendor.performance
  const averageScore = (qualityScore + onTimeDeliveryRate + customerRating) / 3
  
  if (averageScore >= 90) return 'excellent'
  if (averageScore >= 75) return 'good'
  if (averageScore >= 60) return 'average'
  return 'poor'
}

export const getVendorPerformanceColor = (rating: 'excellent' | 'good' | 'average' | 'poor'): string => {
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

export const isVendorActive = (vendor: Vendor): boolean => {
  return vendor.status === VendorStatus.ACTIVE
}

export const canVendorReceiveOrders = (vendor: Vendor): boolean => {
  return vendor.status === VendorStatus.ACTIVE && 
         vendor.performance.qualityScore >= 60 &&
         vendor.performance.onTimeDeliveryRate >= 70
}

export const validateVendor = (vendor: Partial<Vendor>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!vendor.business?.businessName || vendor.business.businessName.length < 2) {
    errors.push('Business name is required and must be at least 2 characters')
  }
  
  if (!vendor.contact?.firstName || vendor.contact.firstName.length < 2) {
    errors.push('Contact first name is required and must be at least 2 characters')
  }
  
  if (!vendor.contact?.lastName || vendor.contact.lastName.length < 2) {
    errors.push('Contact last name is required and must be at least 2 characters')
  }
  
  if (!vendor.contact?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendor.contact.email)) {
    errors.push('Valid email address is required')
  }
  
  if (!vendor.contact?.phone || !/^[+]?[0-9]{10,15}$/.test(vendor.contact.phone)) {
    errors.push('Valid phone number is required')
  }
  
  if (vendor.commissionRate === undefined || vendor.commissionRate < 0 || vendor.commissionRate > 100) {
    errors.push('Commission rate must be between 0 and 100')
  }
  
  if (!vendor.vendorCode || !/^[A-Z0-9-_]{3,20}$/.test(vendor.vendorCode)) {
    errors.push('Vendor code is required and must be 3-20 characters (alphanumeric, hyphens, underscores only)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const generateVendorCode = (businessName: string): string => {
  const cleanName = businessName.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${cleanName.substring(0, 8)}-${randomSuffix}`
}

export default Vendor
