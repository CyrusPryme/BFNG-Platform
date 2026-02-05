/**
 * Subscription Status
 * Defines the different states for subscriptions
 */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended'
}

/**
 * Subscription Frequency
 * Defines the different delivery frequencies
 */
export enum SubscriptionFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi_weekly',
  MONTHLY = 'monthly',
  BI_MONTHLY = 'bi_monthly',
  QUARTERLY = 'quarterly'
}

/**
 * Subscription Item
 * Individual item within a subscription
 */
export interface SubscriptionItem {
  id: string
  productId: string
  productName: string
  productSku: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  isSubstitutable: boolean
  substitutionRules?: {
    alternativeProductIds: string[]
    preference: 'exact' | 'similar' | 'premium' | 'economy'
    autoApprove: boolean
    maxPriceDifference: number
  }
  specialInstructions?: string
  lastModified: string
}

/**
 * Delivery Schedule
 * Defines when and how often deliveries occur
 */
export interface DeliverySchedule {
  frequency: SubscriptionFrequency
  deliveryDays: string[] // Days of week or specific dates
  deliveryTime: {
    start: string // HH:MM format
    end: string // HH:MM format
  }
  preferredDeliveryWindow: string
  nextDeliveryDate: string
  deliveryAddress: {
    street: string
    city: string
    region: string
    postalCode: string
    country: string
    coordinates?: {
      latitude: number
      longitude: number
    }
    specialInstructions?: string
  }
  deliveryFee: number
  minimumOrderValue: number
}

/**
 * Subscription Pricing
 * Pricing structure for subscriptions
 */
export interface SubscriptionPricing {
  basePrice: number
  currency: string
  discountType: 'percentage' | 'fixed' | 'tiered'
  discountValue: number
  deliveryFee: number
  taxRate: number
  totalAmount: number
  billingCycle: 'weekly' | 'bi_weekly' | 'monthly' | 'quarterly'
  paymentMethod: 'cash' | 'mobile_money' | 'bank_transfer' | 'card'
  autoRenewal: boolean
}

/**
 * Subscription Customer Information
 */
export interface SubscriptionCustomer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  secondaryPhone?: string
  customerType: 'individual' | 'family' | 'business' | 'institution'
  businessName?: string
  businessType?: string
  registrationNumber?: string
}

/**
 * Subscription Model
 * Complete data model for subscriptions
 */
export interface Subscription {
  id: string
  subscriptionNumber: string
  customer: SubscriptionCustomer
  items: SubscriptionItem[]
  schedule: DeliverySchedule
  pricing: SubscriptionPricing
  status: SubscriptionStatus
  startDate: string
  endDate?: string
  trialEndDate?: string
  createdAt: string
  updatedAt: string
  lastModified: string
  createdBy?: string
  modifiedBy?: string
  
  // Order History
  lastOrderDate?: string
  nextOrderDate: string
  totalOrders: number
  skippedOrders: number
  cancelledOrders: number
  
  // Subscription Settings
  autoRenewal: boolean
  skipNextDelivery: boolean
  pauseUntil?: string
  cancellationReason?: string
  cancellationDate?: string
  
  // Payment Information
  paymentMethod: string
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded'
  lastPaymentDate?: string
  nextPaymentDate?: string
  outstandingBalance: number
  
  // Preferences and Notes
  dietaryRestrictions: string[]
  preferences: {
    packaging: 'plastic' | 'paper' | 'reusable' | 'minimal'
    communication: 'email' | 'sms' | 'phone' | 'whatsapp'
    substitutions: 'auto_approve' | 'manual_approval' | 'no_substitutions'
    deliveryInstructions?: string
  }
  
  // Performance Metrics
  averageOrderValue: number
  totalRevenue: number
  customerSatisfactionScore?: number
  retentionScore?: number
  
  // Metadata
  tags: string[]
  notes?: string
  source: 'website' | 'phone' | 'in_person' | 'referral'
  referralCode?: string
}

/**
 * Subscription Filters
 * Used for searching and filtering subscriptions
 */
export interface SubscriptionFilters {
  status?: SubscriptionStatus | 'all'
  customerType?: 'individual' | 'family' | 'business' | 'institution' | 'all'
  frequency?: SubscriptionFrequency | 'all'
  nextDeliveryAfter?: string
  nextDeliveryBefore?: string
  createdAfter?: string
  createdBefore?: string
  search?: string
  hasOutstandingBalance?: boolean
  autoRenewal?: boolean
  paymentStatus?: 'paid' | 'pending' | 'failed' | 'refunded' | 'all'
  minOrderValue?: number
  maxOrderValue?: number
}

/**
 * Subscription Search Result
 * Used for API responses
 */
export interface SubscriptionSearchResult {
  subscriptions: Subscription[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  filters: SubscriptionFilters
}

/**
 * Subscription Statistics
 * Dashboard statistics for subscriptions
 */
export interface SubscriptionStatistics {
  total: number
  active: number
  paused: number
  cancelled: number
  expired: number
  newThisMonth: number
  churnRate: number
  retentionRate: number
  averageOrderValue: number
  totalRevenue: number
  monthlyRecurringRevenue: number
  byFrequency: Record<string, number>
  byCustomerType: Record<string, number>
  byStatus: Record<string, number>
  monthlyTrends: {
    month: string
    new: number
    cancelled: number
    revenue: number
  }[]
}

/**
 * Subscription Validation Rules
 */
export const SUBSCRIPTION_VALIDATION_RULES = {
  customer: {
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    lastName: {
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
    }
  },
  items: {
    required: true,
    minItems: 1,
    maxItems: 50
  },
  schedule: {
    frequency: {
      required: true,
      enum: Object.values(SubscriptionFrequency)
    },
    deliveryDays: {
      required: true,
      minItems: 1
    },
    deliveryAddress: {
      required: true
    }
  },
  pricing: {
    basePrice: {
      required: true,
      min: 0,
      max: 999999
    },
    currency: {
      required: true,
      pattern: '^[A-Z]{3}$'
    }
  }
}

/**
 * Subscription Status Display Information
 */
export const SUBSCRIPTION_STATUS_DISPLAY = {
  [SubscriptionStatus.ACTIVE]: {
    label: 'Active',
    description: 'Subscription is active and delivering',
    color: 'bg-green-100 text-green-800',
    icon: 'check-circle'
  },
  [SubscriptionStatus.PAUSED]: {
    label: 'Paused',
    description: 'Subscription is temporarily paused',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'pause-circle'
  },
  [SubscriptionStatus.CANCELLED]: {
    label: 'Cancelled',
    description: 'Subscription has been cancelled',
    color: 'bg-red-100 text-red-800',
    icon: 'x-circle'
  },
  [SubscriptionStatus.EXPIRED]: {
    label: 'Expired',
    description: 'Subscription has expired',
    color: 'bg-gray-100 text-gray-800',
    icon: 'clock'
  },
  [SubscriptionStatus.SUSPENDED]: {
    label: 'Suspended',
    description: 'Subscription is suspended due to issues',
    color: 'bg-orange-100 text-orange-800',
    icon: 'alert-triangle'
  }
}

/**
 * Subscription Frequency Display Information
 */
export const SUBSCRIPTION_FREQUENCY_DISPLAY = {
  [SubscriptionFrequency.DAILY]: {
    label: 'Daily',
    description: 'Delivered every day',
    days: 365,
    multiplier: 30.42
  },
  [SubscriptionFrequency.WEEKLY]: {
    label: 'Weekly',
    description: 'Delivered once per week',
    days: 52,
    multiplier: 4.33
  },
  [SubscriptionFrequency.BI_WEEKLY]: {
    label: 'Bi-Weekly',
    description: 'Delivered every two weeks',
    days: 26,
    multiplier: 2.17
  },
  [SubscriptionFrequency.MONTHLY]: {
    label: 'Monthly',
    description: 'Delivered once per month',
    days: 12,
    multiplier: 1
  },
  [SubscriptionFrequency.BI_MONTHLY]: {
    label: 'Bi-Monthly',
    description: 'Delivered every two months',
    days: 6,
    multiplier: 0.5
  },
  [SubscriptionFrequency.QUARTERLY]: {
    label: 'Quarterly',
    description: 'Delivered every three months',
    days: 4,
    multiplier: 0.33
  }
}

/**
 * Helper Functions
 */
export const getSubscriptionStatusColor = (status: SubscriptionStatus): string => {
  return SUBSCRIPTION_STATUS_DISPLAY[status]?.color || 'bg-gray-100 text-gray-800'
}

export const getSubscriptionStatusIcon = (status: SubscriptionStatus): string => {
  return SUBSCRIPTION_STATUS_DISPLAY[status]?.icon || 'clock'
}

export const getFrequencyDisplay = (frequency: SubscriptionFrequency): string => {
  return SUBSCRIPTION_FREQUENCY_DISPLAY[frequency]?.label || frequency
}

export const getFrequencyMultiplier = (frequency: SubscriptionFrequency): number => {
  return SUBSCRIPTION_FREQUENCY_DISPLAY[frequency]?.multiplier || 1
}

export const calculateNextDeliveryDate = (
  lastDeliveryDate: string,
  frequency: SubscriptionFrequency,
  deliveryDays: string[]
): string => {
  const lastDate = new Date(lastDeliveryDate)
  const nextDate = new Date(lastDate)
  
  switch (frequency) {
    case SubscriptionFrequency.DAILY:
      nextDate.setDate(nextDate.getDate() + 1)
      break
    case SubscriptionFrequency.WEEKLY:
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case SubscriptionFrequency.BI_WEEKLY:
      nextDate.setDate(nextDate.getDate() + 14)
      break
    case SubscriptionFrequency.MONTHLY:
      nextDate.setMonth(nextDate.getMonth() + 1)
      break
    case SubscriptionFrequency.BI_MONTHLY:
      nextDate.setMonth(nextDate.getMonth() + 2)
      break
    case SubscriptionFrequency.QUARTERLY:
      nextDate.setMonth(nextDate.getMonth() + 3)
      break
  }
  
  return nextDate.toISOString()
}

export const isSubscriptionActive = (subscription: Subscription): boolean => {
  return subscription.status === SubscriptionStatus.ACTIVE
}

export const isSubscriptionPaused = (subscription: Subscription): boolean => {
  return subscription.status === SubscriptionStatus.PAUSED
}

export const isSubscriptionCancelled = (subscription: Subscription): boolean => {
  return subscription.status === SubscriptionStatus.CANCELLED
}

export const canPauseSubscription = (subscription: Subscription): boolean => {
  return subscription.status === SubscriptionStatus.ACTIVE
}

export const canResumeSubscription = (subscription: Subscription): boolean => {
  return subscription.status === SubscriptionStatus.PAUSED
}

export const canCancelSubscription = (subscription: Subscription): boolean => {
  return subscription.status === SubscriptionStatus.ACTIVE || subscription.status === SubscriptionStatus.PAUSED
}

export const getCustomerFullName = (subscription: Subscription): string => {
  return `${subscription.customer.firstName} ${subscription.customer.lastName}`
}

export const getCustomerFullAddress = (subscription: Subscription): string => {
  const { street, city, region, postalCode, country } = subscription.schedule.deliveryAddress
  return `${street}, ${city}, ${region} ${postalCode}, ${country}`
}

export const calculateSubscriptionTotal = (items: SubscriptionItem[]): number => {
  return items.reduce((total, item) => total + item.totalPrice, 0)
}

export const calculateMonthlyRevenue = (subscription: Subscription): number => {
  const multiplier = getFrequencyMultiplier(subscription.schedule.frequency)
  return subscription.pricing.totalAmount * multiplier
}

export const validateSubscription = (subscription: Partial<Subscription>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!subscription.customer?.firstName || subscription.customer.firstName.length < 2) {
    errors.push('Customer first name is required and must be at least 2 characters')
  }
  
  if (!subscription.customer?.lastName || subscription.customer.lastName.length < 2) {
    errors.push('Customer last name is required and must be at least 2 characters')
  }
  
  if (!subscription.customer?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscription.customer.email)) {
    errors.push('Valid customer email is required')
  }
  
  if (!subscription.customer?.phone || !/^[+]?[0-9]{10,15}$/.test(subscription.customer.phone)) {
    errors.push('Valid customer phone number is required')
  }
  
  if (!subscription.items || subscription.items.length === 0) {
    errors.push('At least one subscription item is required')
  }
  
  if (!subscription.schedule?.frequency) {
    errors.push('Delivery frequency is required')
  }
  
  if (!subscription.schedule?.deliveryDays || subscription.schedule.deliveryDays.length === 0) {
    errors.push('At least one delivery day is required')
  }
  
  if (!subscription.pricing?.basePrice || subscription.pricing.basePrice < 0) {
    errors.push('Base price is required and must be greater than or equal to 0')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const generateSubscriptionNumber = (): string => {
  const timestamp = Date.now().toString(36).substring(2, 8).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `SUB-${timestamp}-${random}`
}

export default Subscription
