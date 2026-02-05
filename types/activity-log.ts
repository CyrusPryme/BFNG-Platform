/**
 * Activity Log System
 * Tracks admin activities across the BFNG Platform
 */

// Activity Types
export enum ActivityType {
  ORDER_STATE_CHANGE = 'order_state_change',
  PRODUCT_EDIT = 'product_edit',
  PRODUCT_CREATE = 'product_create',
  PRODUCT_DELETE = 'product_delete',
  VENDOR_APPROVAL = 'vendor_approval',
  VENDOR_REJECTION = 'vendor_rejection',
  VENDOR_CREATE = 'vendor_create',
  VENDOR_UPDATE = 'vendor_update',
  PAYMENT_CONFIRM = 'payment_confirm',
  DELIVERY_ASSIGN = 'delivery_assign',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  SETTINGS_CHANGE = 'settings_change'
}

// Activity Categories
export enum ActivityCategory {
  ORDERS = 'orders',
  PRODUCTS = 'products',
  VENDORS = 'vendors',
  PAYMENTS = 'payments',
  DELIVERIES = 'deliveries',
  USERS = 'users',
  SYSTEM = 'system'
}

// Activity Severity
export enum ActivitySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Base Activity Log Interface
export interface ActivityLog {
  id: string
  type: ActivityType
  category: ActivityCategory
  severity: ActivitySeverity
  title: string
  description: string
  userId: string
  userName: string
  userEmail: string
  userRole: string
  targetId?: string // ID of the affected entity
  targetType?: string // Type of the affected entity (order, product, vendor, etc.)
  oldValue?: any // Previous value for edits
  newValue?: any // New value for edits
  metadata: Record<string, any> // Additional context data
  ipAddress?: string
  userAgent?: string
  timestamp: string
  createdAt: string
}

// Order State Change Activity
export interface OrderStateChangeActivity extends ActivityLog {
  type: ActivityType.ORDER_STATE_CHANGE
  category: ActivityCategory.ORDERS
  targetId: string // Order ID
  targetType: 'order'
  oldValue: {
    status: string
    previousStatus?: string
  }
  newValue: {
    status: string
    reason?: string
  }
  metadata: {
    orderId: string
    orderNumber: string
    customerId: string
    customerName: string
    previousStatus: string
    newStatus: string
    reason?: string
  }
}

// Product Edit Activity
export interface ProductEditActivity extends ActivityLog {
  type: ActivityType.PRODUCT_EDIT
  category: ActivityCategory.PRODUCTS
  targetId: string // Product ID
  targetType: 'product'
  oldValue: {
    [key: string]: any // Changed fields with old values
  }
  newValue: {
    [key: string]: any // Changed fields with new values
  }
  metadata: {
    productId: string
    productName: string
    changedFields: string[]
    changeCount: number
  }
}

// Product Create Activity
export interface ProductCreateActivity extends ActivityLog {
  type: ActivityType.PRODUCT_CREATE
  category: ActivityCategory.PRODUCTS
  targetId: string // Product ID
  targetType: 'product'
  newValue: {
    productId: string
    productName: string
    category: string
    price: number
  }
  metadata: {
    productId: string
    productName: string
    category: string
    price: number
    sku: string
  }
}

// Vendor Approval Activity
export interface VendorApprovalActivity extends ActivityLog {
  type: ActivityType.VENDOR_APPROVAL
  category: ActivityCategory.VENDORS
  targetId: string // Vendor or Vendor Product ID
  targetType: 'vendor' | 'vendor_product'
  newValue: {
    status: 'approved'
    approvedBy: string
    approvedAt: string
    notes?: string
  }
  metadata: {
    vendorId: string
    vendorName: string
    vendorProductId?: string
    productName?: string
    approvedBy: string
    approvedAt: string
    notes?: string
  }
}

// Vendor Rejection Activity
export interface VendorRejectionActivity extends ActivityLog {
  type: ActivityType.VENDOR_REJECTION
  category: ActivityCategory.VENDORS
  targetId: string // Vendor or Vendor Product ID
  targetType: 'vendor' | 'vendor_product'
  newValue: {
    status: 'rejected'
    rejectedBy: string
    rejectedAt: string
    reason: string
  }
  metadata: {
    vendorId: string
    vendorName: string
    vendorProductId?: string
    productName?: string
    rejectedBy: string
    rejectedAt: string
    reason: string
  }
}

// Activity Log Filters
export interface ActivityLogFilters {
  type?: ActivityType | 'all'
  category?: ActivityCategory | 'all'
  severity?: ActivitySeverity | 'all'
  userId?: string
  targetId?: string
  targetType?: string
  dateFrom?: string
  dateTo?: string
  search?: string
  limit?: number
  offset?: number
}

// Activity Log Search Result
export interface ActivityLogSearchResult {
  logs: ActivityLog[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  filters: ActivityLogFilters
}

// Activity Statistics
export interface ActivityStatistics {
  total: number
  byType: Record<ActivityType, number>
  byCategory: Record<ActivityCategory, number>
  bySeverity: Record<ActivitySeverity, number>
  byUser: Record<string, number>
  recent: ActivityLog[]
  dailyTrends: {
    date: string
    count: number
  }[]
}

// Activity Log Display Information
export const ACTIVITY_TYPE_DISPLAY = {
  [ActivityType.ORDER_STATE_CHANGE]: {
    label: 'Order State Change',
    description: 'Order status was changed',
    color: 'bg-blue-100 text-blue-800',
    icon: 'refresh-cw'
  },
  [ActivityType.PRODUCT_EDIT]: {
    label: 'Product Edit',
    description: 'Product was modified',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'edit'
  },
  [ActivityType.PRODUCT_CREATE]: {
    label: 'Product Created',
    description: 'New product was added',
    color: 'bg-green-100 text-green-800',
    icon: 'plus-circle'
  },
  [ActivityType.PRODUCT_DELETE]: {
    label: 'Product Deleted',
    description: 'Product was removed',
    color: 'bg-red-100 text-red-800',
    icon: 'trash-2'
  },
  [ActivityType.VENDOR_APPROVAL]: {
    label: 'Vendor Approval',
    description: 'Vendor or product was approved',
    color: 'bg-green-100 text-green-800',
    icon: 'check-circle'
  },
  [ActivityType.VENDOR_REJECTION]: {
    label: 'Vendor Rejection',
    description: 'Vendor or product was rejected',
    color: 'bg-red-100 text-red-800',
    icon: 'x-circle'
  },
  [ActivityType.VENDOR_CREATE]: {
    label: 'Vendor Created',
    description: 'New vendor was added',
    color: 'bg-purple-100 text-purple-800',
    icon: 'user-plus'
  },
  [ActivityType.VENDOR_UPDATE]: {
    label: 'Vendor Updated',
    description: 'Vendor information was modified',
    color: 'bg-orange-100 text-orange-800',
    icon: 'user-edit'
  },
  [ActivityType.PAYMENT_CONFIRM]: {
    label: 'Payment Confirmed',
    description: 'Payment was manually confirmed',
    color: 'bg-green-100 text-green-800',
    icon: 'check-square'
  },
  [ActivityType.DELIVERY_ASSIGN]: {
    label: 'Delivery Assigned',
    description: 'Delivery was assigned to driver',
    color: 'bg-blue-100 text-blue-800',
    icon: 'truck'
  },
  [ActivityType.USER_LOGIN]: {
    label: 'User Login',
    description: 'User logged into admin panel',
    color: 'bg-gray-100 text-gray-800',
    icon: 'log-in'
  },
  [ActivityType.USER_LOGOUT]: {
    label: 'User Logout',
    description: 'User logged out of admin panel',
    color: 'bg-gray-100 text-gray-800',
    icon: 'log-out'
  },
  [ActivityType.SETTINGS_CHANGE]: {
    label: 'Settings Changed',
    description: 'System settings were modified',
    color: 'bg-purple-100 text-purple-800',
    icon: 'settings'
  }
}

export const ACTIVITY_CATEGORY_DISPLAY = {
  [ActivityCategory.ORDERS]: {
    label: 'Orders',
    color: 'bg-blue-100 text-blue-800',
    icon: 'shopping-cart'
  },
  [ActivityCategory.PRODUCTS]: {
    label: 'Products',
    color: 'bg-green-100 text-green-800',
    icon: 'package'
  },
  [ActivityCategory.VENDORS]: {
    label: 'Vendors',
    color: 'bg-purple-100 text-purple-800',
    icon: 'users'
  },
  [ActivityCategory.PAYMENTS]: {
    label: 'Payments',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'credit-card'
  },
  [ActivityCategory.DELIVERIES]: {
    label: 'Deliveries',
    color: 'bg-orange-100 text-orange-800',
    icon: 'truck'
  },
  [ActivityCategory.USERS]: {
    label: 'Users',
    color: 'bg-gray-100 text-gray-800',
    icon: 'user'
  },
  [ActivityCategory.SYSTEM]: {
    label: 'System',
    color: 'bg-red-100 text-red-800',
    icon: 'settings'
  }
}

export const ACTIVITY_SEVERITY_DISPLAY = {
  [ActivitySeverity.LOW]: {
    label: 'Low',
    color: 'bg-gray-100 text-gray-800',
    icon: 'info'
  },
  [ActivitySeverity.MEDIUM]: {
    label: 'Medium',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'alert-triangle'
  },
  [ActivitySeverity.HIGH]: {
    label: 'High',
    color: 'bg-orange-100 text-orange-800',
    icon: 'alert-circle'
  },
  [ActivitySeverity.CRITICAL]: {
    label: 'Critical',
    color: 'bg-red-100 text-red-800',
    icon: 'alert-octagon'
  }
}

// Helper Functions
export const getActivityTypeColor = (type: ActivityType): string => {
  return ACTIVITY_TYPE_DISPLAY[type]?.color || 'bg-gray-100 text-gray-800'
}

export const getActivityTypeIcon = (type: ActivityType): string => {
  return ACTIVITY_TYPE_DISPLAY[type]?.icon || 'info'
}

export const getActivityCategoryColor = (category: ActivityCategory): string => {
  return ACTIVITY_CATEGORY_DISPLAY[category]?.color || 'bg-gray-100 text-gray-800'
}

export const getActivitySeverityColor = (severity: ActivitySeverity): string => {
  return ACTIVITY_SEVERITY_DISPLAY[severity]?.color || 'bg-gray-100 text-gray-800'
}

export const formatActivityTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export const generateActivityId = (): string => {
  const timestamp = Date.now().toString(36).substring(2, 8).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ACT-${timestamp}-${random}`
}

export const getActivityDescription = (log: ActivityLog): string => {
  const typeDisplay = ACTIVITY_TYPE_DISPLAY[log.type]
  if (typeDisplay) {
    return `${log.userName} ${typeDisplay.description.toLowerCase()}`
  }
  return `${log.userName} performed ${log.type}`
}

export default ActivityLog
