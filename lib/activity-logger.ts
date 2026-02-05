/**
 * Activity Logger Service
 * Handles logging of admin activities across the BFNG Platform
 */

import { 
  ActivityLog, 
  ActivityType, 
  ActivityCategory, 
  ActivitySeverity,
  OrderStateChangeActivity,
  ProductEditActivity,
  ProductCreateActivity,
  VendorApprovalActivity,
  VendorRejectionActivity,
  ActivityLogFilters,
  ActivityLogSearchResult,
  ActivityStatistics,
  generateActivityId,
  formatActivityTimestamp
} from '@/types/activity-log'

// User interface for activity logging
export interface ActivityUser {
  id: string
  name: string
  email: string
  role: string
}

// In-memory storage for demo purposes
// In production, this would be replaced with database storage
let activityLogs: ActivityLog[] = []

// Activity Logger Class
export class ActivityLogger {
  private static instance: ActivityLogger
  private user: ActivityUser | null = null

  private constructor() {}

  static getInstance(): ActivityLogger {
    if (!ActivityLogger.instance) {
      ActivityLogger.instance = new ActivityLogger()
    }
    return ActivityLogger.instance
  }

  // Set current user for logging
  setUser(user: ActivityUser | null): void {
    this.user = user
  }

  // Get current user
  getUser(): ActivityUser | null {
    return this.user
  }

  // Generic log method
  private log(data: Omit<ActivityLog, 'id' | 'timestamp' | 'createdAt'>): ActivityLog {
    const log: ActivityLog = {
      id: generateActivityId(),
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...data
    }

    // Add to in-memory storage
    activityLogs.unshift(log) // Add to beginning for chronological order

    // In production, this would save to database
    console.log('Activity Log:', log)

    return log
  }

  // Order State Change Logging
  logOrderStateChange(
    orderId: string,
    orderNumber: string,
    customerId: string,
    customerName: string,
    previousStatus: string,
    newStatus: string,
    reason?: string
  ): OrderStateChangeActivity {
    if (!this.user) {
      throw new Error('User not set for activity logging')
    }

    const log = this.log({
      type: ActivityType.ORDER_STATE_CHANGE,
      category: ActivityCategory.ORDERS,
      severity: ActivitySeverity.MEDIUM,
      title: `Order ${orderNumber} status changed`,
      description: `Order status changed from ${previousStatus} to ${newStatus}`,
      userId: this.user.id,
      userName: this.user.name,
      userEmail: this.user.email,
      userRole: this.user.role,
      targetId: orderId,
      targetType: 'order',
      oldValue: {
        status: previousStatus,
        previousStatus
      },
      newValue: {
        status: newStatus,
        reason
      },
      metadata: {
        orderId,
        orderNumber,
        customerId,
        customerName,
        previousStatus,
        newStatus,
        reason
      },
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent()
    }) as OrderStateChangeActivity

    return log
  }

  // Product Edit Logging
  logProductEdit(
    productId: string,
    productName: string,
    changedFields: string[],
    oldValues: Record<string, any>,
    newValues: Record<string, any>
  ): ProductEditActivity {
    if (!this.user) {
      throw new Error('User not set for activity logging')
    }

    const log = this.log({
      type: ActivityType.PRODUCT_EDIT,
      category: ActivityCategory.PRODUCTS,
      severity: ActivitySeverity.LOW,
      title: `Product "${productName}" edited`,
      description: `Product modified with ${changedFields.length} changes`,
      userId: this.user.id,
      userName: this.user.name,
      userEmail: this.user.email,
      userRole: this.user.role,
      targetId: productId,
      targetType: 'product',
      oldValue: oldValues,
      newValue: newValues,
      metadata: {
        productId,
        productName,
        changedFields,
        changeCount: changedFields.length
      },
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent()
    }) as ProductEditActivity

    return log
  }

  // Product Create Logging
  logProductCreate(
    productId: string,
    productName: string,
    category: string,
    price: number,
    sku: string
  ): ProductCreateActivity {
    if (!this.user) {
      throw new Error('User not set for activity logging')
    }

    const log = this.log({
      type: ActivityType.PRODUCT_CREATE,
      category: ActivityCategory.PRODUCTS,
      severity: ActivitySeverity.MEDIUM,
      title: `Product "${productName}" created`,
      description: `New product added to inventory`,
      userId: this.user.id,
      userName: this.user.name,
      userEmail: this.user.email,
      userRole: this.user.role,
      targetId: productId,
      targetType: 'product',
      newValue: {
        productId,
        productName,
        category,
        price
      },
      metadata: {
        productId,
        productName,
        category,
        price,
        sku
      },
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent()
    }) as ProductCreateActivity

    return log
  }

  // Vendor Approval Logging
  logVendorApproval(
    vendorId: string,
    vendorName: string,
    vendorProductId?: string,
    productName?: string,
    notes?: string
  ): VendorApprovalActivity {
    if (!this.user) {
      throw new Error('User not set for activity logging')
    }

    const targetType = vendorProductId ? 'vendor_product' : 'vendor'
    const title = vendorProductId 
      ? `Vendor product "${productName}" approved`
      : `Vendor "${vendorName}" approved`

    const log = this.log({
      type: ActivityType.VENDOR_APPROVAL,
      category: ActivityCategory.VENDORS,
      severity: ActivitySeverity.MEDIUM,
      title,
      description: `${targetType === 'vendor_product' ? 'Vendor product' : 'Vendor'} approved`,
      userId: this.user.id,
      userName: this.user.name,
      userEmail: this.user.email,
      userRole: this.user.role,
      targetId: vendorProductId || vendorId,
      targetType,
      newValue: {
        status: 'approved',
        approvedBy: this.user.name,
        approvedAt: new Date().toISOString(),
        notes
      },
      metadata: {
        vendorId,
        vendorName,
        vendorProductId,
        productName,
        approvedBy: this.user.name,
        approvedAt: new Date().toISOString(),
        notes
      },
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent()
    }) as VendorApprovalActivity

    return log
  }

  // Vendor Rejection Logging
  logVendorRejection(
    vendorId: string,
    vendorName: string,
    reason: string,
    vendorProductId?: string,
    productName?: string
  ): VendorRejectionActivity {
    if (!this.user) {
      throw new Error('User not set for activity logging')
    }

    const targetType = vendorProductId ? 'vendor_product' : 'vendor'
    const title = vendorProductId 
      ? `Vendor product "${productName}" rejected`
      : `Vendor "${vendorName}" rejected`

    const log = this.log({
      type: ActivityType.VENDOR_REJECTION,
      category: ActivityCategory.VENDORS,
      severity: ActivitySeverity.HIGH,
      title,
      description: `${targetType === 'vendor_product' ? 'Vendor product' : 'Vendor'} rejected`,
      userId: this.user.id,
      userName: this.user.name,
      userEmail: this.user.email,
      userRole: this.user.role,
      targetId: vendorProductId || vendorId,
      targetType,
      newValue: {
        status: 'rejected',
        rejectedBy: this.user.name,
        rejectedAt: new Date().toISOString(),
        reason
      },
      metadata: {
        vendorId,
        vendorName,
        vendorProductId,
        productName,
        rejectedBy: this.user.name,
        rejectedAt: new Date().toISOString(),
        reason
      },
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent()
    }) as VendorRejectionActivity

    return log
  }

  // Generic activity logging
  logActivity(
    type: ActivityType,
    category: ActivityCategory,
    severity: ActivitySeverity,
    title: string,
    description: string,
    targetId?: string,
    targetType?: string,
    oldValue?: any,
    newValue?: any,
    metadata?: Record<string, any>
  ): ActivityLog {
    if (!this.user) {
      throw new Error('User not set for activity logging')
    }

    return this.log({
      type,
      category,
      severity,
      title,
      description,
      userId: this.user.id,
      userName: this.user.name,
      userEmail: this.user.email,
      userRole: this.user.role,
      targetId,
      targetType,
      oldValue,
      newValue,
      metadata: metadata || {},
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent()
    })
  }

  // Get activity logs with filters
  getLogs(filters: ActivityLogFilters = {}): ActivityLogSearchResult {
    let filteredLogs = [...activityLogs]

    // Apply filters
    if (filters.type && filters.type !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.type === filters.type)
    }

    if (filters.category && filters.category !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.category === filters.category)
    }

    if (filters.severity && filters.severity !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.severity === filters.severity)
    }

    if (filters.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId)
    }

    if (filters.targetId) {
      filteredLogs = filteredLogs.filter(log => log.targetId === filters.targetId)
    }

    if (filters.targetType) {
      filteredLogs = filteredLogs.filter(log => log.targetType === filters.targetType)
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= fromDate)
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= toDate)
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredLogs = filteredLogs.filter(log => 
        log.title.toLowerCase().includes(searchTerm) ||
        log.description.toLowerCase().includes(searchTerm) ||
        log.userName.toLowerCase().includes(searchTerm) ||
        (log.targetId && log.targetId.toLowerCase().includes(searchTerm))
      )
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Pagination
    const limit = filters.limit || 50
    const offset = filters.offset || 0
    const paginatedLogs = filteredLogs.slice(offset, offset + limit)

    return {
      logs: paginatedLogs,
      total: filteredLogs.length,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(filteredLogs.length / limit),
      filters
    }
  }

  // Get activity statistics
  getStatistics(): ActivityStatistics {
    const logs = activityLogs

    // Count by type
    const byType = Object.values(ActivityType).reduce((acc, type) => {
      acc[type] = logs.filter(log => log.type === type).length
      return acc
    }, {} as Record<ActivityType, number>)

    // Count by category
    const byCategory = Object.values(ActivityCategory).reduce((acc, category) => {
      acc[category] = logs.filter(log => log.category === category).length
      return acc
    }, {} as Record<ActivityCategory, number>)

    // Count by severity
    const bySeverity = Object.values(ActivitySeverity).reduce((acc, severity) => {
      acc[severity] = logs.filter(log => log.severity === severity).length
      return acc
    }, {} as Record<ActivitySeverity, number>)

    // Count by user
    const byUser = logs.reduce((acc, log) => {
      acc[log.userId] = (acc[log.userId] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Recent activities (last 10)
    const recent = logs.slice(0, 10)

    // Daily trends (last 7 days)
    const dailyTrends = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const count = logs.filter(log => 
        log.timestamp.split('T')[0] === dateStr
      ).length
      dailyTrends.push({ date: dateStr, count })
    }

    return {
      total: logs.length,
      byType,
      byCategory,
      bySeverity,
      byUser,
      recent,
      dailyTrends
    }
  }

  // Clear all logs (for testing)
  clearLogs(): void {
    activityLogs = []
  }

  // Helper methods
  private getClientIP(): string {
    // In a real app, this would get the client IP from request headers
    return '127.0.0.1'
  }

  private getUserAgent(): string {
    // In a real app, this would get the user agent from request headers
    return typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown'
  }
}

// Export singleton instance
export const activityLogger = ActivityLogger.getInstance()

// Convenience functions for common logging operations
export const logOrderStateChange = (
  orderId: string,
  orderNumber: string,
  customerId: string,
  customerName: string,
  previousStatus: string,
  newStatus: string,
  reason?: string
) => activityLogger.logOrderStateChange(orderId, orderNumber, customerId, customerName, previousStatus, newStatus, reason)

export const logProductEdit = (
  productId: string,
  productName: string,
  changedFields: string[],
  oldValues: Record<string, any>,
  newValues: Record<string, any>
) => activityLogger.logProductEdit(productId, productName, changedFields, oldValues, newValues)

export const logProductCreate = (
  productId: string,
  productName: string,
  category: string,
  price: number,
  sku: string
) => activityLogger.logProductCreate(productId, productName, category, price, sku)

export const logVendorApproval = (
  vendorId: string,
  vendorName: string,
  vendorProductId?: string,
  productName?: string,
  notes?: string
) => activityLogger.logVendorApproval(vendorId, vendorName, vendorProductId, productName, notes)

export const logVendorRejection = (
  vendorId: string,
  vendorName: string,
  reason: string,
  vendorProductId?: string,
  productName?: string
) => activityLogger.logVendorRejection(vendorId, vendorName, reason, vendorProductId, productName)
