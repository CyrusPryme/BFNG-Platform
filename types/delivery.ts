/**
 * Delivery Status
 * Defines the different states for deliveries
 */
export enum DeliveryStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

/**
 * Delivery Priority
 * Defines the priority levels for deliveries
 */
export enum DeliveryPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
  EXPRESS = 'express'
}

/**
 * Driver Status
 * Defines the availability status of drivers
 */
export enum DriverStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline',
  ON_BREAK = 'on_break',
  UNAVAILABLE = 'unavailable'
}

/**
 * Driver Information
 * Complete driver profile and status
 */
export interface Driver {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  secondaryPhone?: string
  licenseNumber: string
  vehicleType: string
  vehicleNumber: string
  vehicleCapacity: {
    weight: number // in kg
    volume: number // in cubic meters
    items: number
  }
  status: DriverStatus
  currentLocation?: {
    latitude: number
    longitude: number
    address: string
    lastUpdated: string
  }
  rating: number
  totalDeliveries: number
  successfulDeliveries: number
  averageDeliveryTime: number // in minutes
  specialties: string[]
  languages: string[]
  hireDate: string
  lastActive: string
  notes?: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

/**
 * Delivery Route
 * Defines the delivery route and grouping
 */
export interface DeliveryRoute {
  id: string
  name: string
  description: string
  area: string
  driverId?: string
  driverName?: string
  status: 'active' | 'inactive' | 'suspended'
  deliveries: string[] // Delivery IDs
  estimatedTime: number // in minutes
  distance: number // in km
  startLocation: {
    latitude: number
    longitude: number
    address: string
  }
  endLocation: {
    latitude: number
    longitude: number
    address: string
  }
  waypoints: Array<{
    id: string
    latitude: number
    longitude: number
    address: string
    estimatedArrival: string
    order: number
  }>
  createdAt: string
  updatedAt: string
  createdBy?: string
  modifiedBy?: string
}

/**
 * Delivery Item
 * Individual item within a delivery
 */
export interface DeliveryItem {
  id: string
  productId: string
  productName: string
  productSku: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  weight: number
  volume: number
  specialInstructions?: string
  fragile: boolean
  temperatureControlled: boolean
  requiresSpecialHandling: boolean
  substitutionAllowed: boolean
  barcode?: string
}

/**
 * Delivery Model
 * Complete data model for deliveries
 */
export interface Delivery {
  id: string
  deliveryNumber: string
  orderId: string
  orderNumber: string
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    address: {
      street: string
      city: string
      region: string
      postalCode: string
      country: string
      coordinates: {
        latitude: number
        longitude: number
      }
      specialInstructions?: string
      deliveryInstructions?: string
    }
  }
  items: DeliveryItem[]
  priority: DeliveryPriority
  status: DeliveryStatus
  assignedDriverId?: string
  assignedDriverName?: string
  routeId?: string
  routeName?: string
  estimatedDeliveryTime: string
  actualDeliveryTime?: string
  pickupTime?: string
  deliveryTime?: string
  distance: number // in km
  totalWeight: number // in kg
  totalVolume: number // in cubic meters
  totalAmount: number
  currency: string
  deliveryFee: number
  specialRequirements: string[]
  deliveryInstructions: string
  
  // Tracking Information
  trackingNumber?: string
  trackingEvents: Array<{
    id: string
    timestamp: string
    status: DeliveryStatus
    location?: {
      latitude: number
      longitude: number
      address: string
    }
    notes?: string
    driverId?: string
    driverName?: string
  }>
  
  // Time Information
  createdAt: string
  updatedAt: string
  assignedAt?: string
  pickedUpAt?: string
  deliveredAt?: string
  failedAt?: string
  cancelledAt?: string
  returnedAt?: string
  
  // Quality and Feedback
  qualityScore?: number
  customerRating?: number
  customerFeedback?: string
  driverNotes?: string
  issues: Array<{
    id: string
    type: 'damage' | 'late' | 'wrong_item' | 'missing_item' | 'other'
    description: string
    severity: 'low' | 'medium' | 'high'
    resolved: boolean
    resolvedAt?: string
    reportedBy: string
    reportedAt: string
  }>
  
  // Metadata
  tags: string[]
  notes?: string
  source: 'website' | 'phone' | 'app' | 'admin'
  createdBy?: string
  modifiedBy?: string
  lastModified: string
}

/**
 * Delivery Assignment
 * Represents the assignment of a delivery to a driver
 */
export interface DeliveryAssignment {
  id: string
  deliveryId: string
  driverId: string
  driverName: string
  routeId?: string
  routeName?: string
  assignedAt: string
  assignedBy: string
  estimatedPickupTime: string
  estimatedDeliveryTime: string
  notes?: string
  status: 'assigned' | 'accepted' | 'rejected' | 'completed'
  acceptedAt?: string
  rejectedAt?: string
  completedAt?: string
  completionNotes?: string
}

/**
 * Delivery Filters
 * Used for searching and filtering deliveries
 */
export interface DeliveryFilters {
  status?: DeliveryStatus | 'all'
  priority?: DeliveryPriority | 'all'
  driverId?: string
  routeId?: string
  customerId?: string
  assignedAfter?: string
  assignedBefore?: string
  deliveryAfter?: string
  deliveryBefore?: string
  search?: string
  hasIssues?: boolean
  qualityScore?: {
    min?: number
    max?: number
  }
  weightRange?: {
    min: number
    max: number
  }
  hasTrackingNumber?: boolean
}

/**
 * Delivery Search Result
 * Used for API responses
 */
export interface DeliverySearchResult {
  deliveries: Delivery[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  filters: DeliveryFilters
}

/**
 * Delivery Statistics
 * Dashboard statistics for deliveries
 */
export interface DeliveryStatistics {
  total: number
  pending: number
  assigned: number
  inProgress: number
  delivered: number
  failed: number
  cancelled: number
  returned: number
  averageDeliveryTime: number
  onTimeDeliveryRate: number
  successRate: number
  totalDistance: number
  totalWeight: number
  totalRevenue: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
  byDriver: Record<string, number>
  byRoute: Record<string, number>
  hourlyTrends: {
    hour: string
    deliveries: number
    completed: number
    failed: number
  }[]
  dailyTrends: {
    date: string
    deliveries: number
    completed: number
    failed: number
    revenue: number
  }[]
}

/**
 * Delivery Validation Rules
 */
export const DELIVERY_VALIDATION_RULES = {
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
    maxItems: 100
  },
  priority: {
    required: true,
    enum: Object.values(DeliveryPriority)
  }
}

/**
 * Delivery Status Display Information
 */
export const DELIVERY_STATUS_DISPLAY = {
  [DeliveryStatus.PENDING]: {
    label: 'Pending',
    description: 'Delivery is pending assignment',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'clock'
  },
  [DeliveryStatus.ASSIGNED]: {
    label: 'Assigned',
    description: 'Driver has been assigned',
    color: 'bg-blue-100 text-blue-800',
    icon: 'user-check'
  },
  [DeliveryStatus.IN_PROGRESS]: {
    label: 'In Progress',
    description: 'Delivery is in progress',
    color: 'bg-purple-100 text-purple-800',
    icon: 'truck'
  },
  [DeliveryStatus.PICKED_UP]: {
    label: 'Picked Up',
    description: 'Items have been picked up',
    color: 'bg-indigo-100 text-indigo-800',
    icon: 'package'
  },
  [DeliveryStatus.IN_TRANSIT]: {
    label: 'In Transit',
    description: 'Delivery is in transit',
    color: 'bg-orange-100 text-orange-800',
    icon: 'navigation'
  },
  [DeliveryStatus.DELIVERED]: {
    label: 'Delivered',
    description: 'Delivery has been completed',
    color: 'bg-green-100 text-green-800',
    icon: 'check-circle'
  },
  [DeliveryStatus.FAILED]: {
    label: 'Failed',
    description: 'Delivery has failed',
    color: 'bg-red-100 text-red-800',
    icon: 'x-circle'
  },
  [DeliveryStatus.CANCELLED]: {
    label: 'Cancelled',
    description: 'Delivery has been cancelled',
    color: 'bg-gray-100 text-gray-800',
    icon: 'ban'
  },
  [DeliveryStatus.RETURNED]: {
    label: 'Returned',
    description: 'Delivery has been returned',
    color: 'bg-pink-100 text-pink-800',
    icon: 'arrow-return'
  }
}

/**
 * Delivery Priority Display Information
 */
export const DELIVERY_PRIORITY_DISPLAY = {
  [DeliveryPriority.LOW]: {
    label: 'Low',
    description: 'Low priority delivery',
    color: 'bg-gray-100 text-gray-800',
    icon: 'arrow-down'
  },
  [DeliveryPriority.NORMAL]: {
    label: 'Normal',
    description: 'Normal priority delivery',
    color: 'bg-blue-100 text-blue-800',
    icon: 'minus'
  },
  [DeliveryPriority.HIGH]: {
    label: 'High',
    description: 'High priority delivery',
    color: 'bg-orange-100 text-orange-800',
    icon: 'arrow-up'
  },
  [DeliveryPriority.URGENT]: {
    label: 'urgent',
    description: 'Urgent priority delivery',
    color: 'bg-red-100 text-red-800',
    icon: 'alert-triangle'
  },
  [DeliveryPriority.EXPRESS]: {
    label: 'Express',
    description: 'Express priority delivery',
    color: 'bg-purple-100 text-purple-800',
    icon: 'zap'
  }
}

/**
 * Driver Status Display Information
 */
export const DRIVER_STATUS_DISPLAY = {
  [DriverStatus.AVAILABLE]: {
    label: 'Available',
    description: 'Driver is available for assignments',
    color: 'bg-green-100 text-green-800',
    icon: 'check-circle'
  },
  [DriverStatus.BUSY]: {
    label: 'Busy',
    description: 'Driver is currently on a delivery',
    color: 'bg-orange-100 text-orange-800',
    icon: 'truck'
  },
  [DriverStatus.OFFLINE]: {
    label: 'Offline',
    description: 'Driver is offline',
    color: 'bg-gray-100 text-gray-800',
    icon: 'wifi-off'
  },
  [DriverStatus.ON_BREAK]: {
    label: 'On Break',
    description: 'Driver is on a break',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'coffee'
  },
  [DriverStatus.UNAVAILABLE]: {
    label: 'Unavailable',
    description: 'Driver is unavailable',
    color: 'bg-red-100 text-red-800',
    icon: 'x-circle'
  }
}

/**
 * Helper Functions
 */
export const getDeliveryStatusColor = (status: DeliveryStatus): string => {
  return DELIVERY_STATUS_DISPLAY[status]?.color || 'bg-gray-100 text-gray-800'
}

export const getDeliveryStatusIcon = (status: DeliveryStatus): string => {
  return DELIVERY_STATUS_DISPLAY[status]?.icon || 'clock'
}

export const getPriorityColor = (priority: DeliveryPriority): string => {
  return DELIVERY_PRIORITY_DISPLAY[priority]?.color || 'bg-gray-100 text-gray-800'
}

export const getPriorityIcon = (priority: DeliveryPriority): string => {
  return DELIVERY_PRIORITY_DISPLAY[priority]?.icon || 'minus'
}

export const getDriverStatusColor = (status: DriverStatus): string => {
  return DRIVER_STATUS_DISPLAY[status]?.color || 'bg-gray-100 text-gray-800'
}

export const getDriverStatusIcon = (status: DriverStatus): string => {
  return DRIVER_STATUS_DISPLAY[status]?.icon || 'user'
}

export const isDeliveryPending = (delivery: Delivery): boolean => {
  return delivery.status === DeliveryStatus.PENDING
}

export const isDeliveryAssigned = (delivery: Delivery): boolean => {
  return delivery.status === DeliveryStatus.ASSIGNED
}

export const isDeliveryInProgress = (delivery: Delivery): boolean => {
  return delivery.status === DeliveryStatus.IN_PROGRESS
}

export const isDeliveryDelivered = (delivery: Delivery): boolean => {
  return delivery.status === DeliveryStatus.DELIVERED
}

export const isDeliveryFailed = (delivery: Delivery): boolean => {
  return delivery.status === DeliveryStatus.FAILED
}

export const canAssignDelivery = (delivery: Delivery): boolean => {
  return delivery.status === DeliveryStatus.PENDING
}

export const canUpdateDeliveryStatus = (delivery: Delivery): boolean => {
  return delivery.status !== DeliveryStatus.DELIVERED && 
         delivery.status !== DeliveryStatus.CANCELLED &&
         delivery.status !== DeliveryStatus.RETURNED
}

export const getCustomerFullName = (delivery: Delivery): string => {
  return `${delivery.customer.firstName} ${delivery.customer.lastName}`
}

export const getCustomerFullAddress = (delivery: Delivery): string => {
  const { street, city, region, postalCode, country } = delivery.customer.address
  return `${street}, ${city}, ${region} ${postalCode}, ${country}`
}

export const calculateTotalWeight = (items: DeliveryItem[]): number => {
  return items.reduce((total, item) => total + item.weight, 0)
}

export const calculateTotalVolume = (items: DeliveryItem[]): number => {
  return items.reduce((total, item) => total + item.volume, 0)
}

export const calculateTotalAmount = (items: DeliveryItem[]): number => {
  return items.reduce((total, item) => total + item.totalPrice, 0)
}

export const calculateDeliveryTime = (delivery: Delivery): number => {
  if (delivery.actualDeliveryTime && delivery.estimatedDeliveryTime) {
    const estimated = new Date(delivery.estimatedDeliveryTime).getTime()
    const actual = new Date(delivery.actualDeliveryTime).getTime()
    return Math.round((actual - estimated) / (1000 * 60)) // Convert to minutes
  }
  return 0
}

export const generateDeliveryNumber = (): string => {
  const timestamp = Date.now().toString(36).substring(2, 8).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `DEL-${timestamp}-${random}`
}

export const generateTrackingNumber = (): string => {
  const timestamp = Date.now().toString(36).substring(2, 8).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `TRK-${timestamp}-${random}`
}

export const validateDelivery = (delivery: Partial<Delivery>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!delivery.customer?.firstName || delivery.customer.firstName.length < 2) {
    errors.push('Customer first name is required and must be at least 2 characters')
  }
  
  if (!delivery.customer?.lastName || delivery.customer.lastName.length < 2) {
    errors.push('Customer last name is required and must be at least 2 characters')
  }
  
  if (!delivery.customer?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(delivery.customer.email)) {
    errors.push('Valid customer email is required')
  }
  
  if (!delivery.customer?.phone || !/^[+]?[0-9]{10,15}$/.test(delivery.customer.phone)) {
    errors.push('Valid customer phone number is required')
  }
  
  if (!delivery.items || delivery.items.length === 0) {
    errors.push('At least one delivery item is required')
  }
  
  if (!delivery.priority || !Object.values(DeliveryPriority).includes(delivery.priority)) {
    errors.push('Valid delivery priority is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export default Delivery
