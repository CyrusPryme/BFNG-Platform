/**
 * Order Status Enum
 * Represents the complete lifecycle of an order in the BFNG system
 */
export enum OrderStatus {
  RECEIVED = 'RECEIVED',
  CONFIRMED = 'CONFIRMED',
  AWAITING_PAYMENT = 'AWAITING_PAYMENT',
  PAID = 'PAID',
  IN_SOURCING = 'IN_SOURCING',
  SUBSTITUTION_REQUIRED = 'SUBSTITUTION_REQUIRED',
  READY_FOR_PACKING = 'READY_FOR_PACKING',
  PACKED = 'PACKED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

/**
 * Order Status Transitions
 * Defines valid status transitions in the order lifecycle
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.RECEIVED]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.AWAITING_PAYMENT, OrderStatus.CANCELLED],
  [OrderStatus.AWAITING_PAYMENT]: [OrderStatus.PAID, OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [OrderStatus.IN_SOURCING, OrderStatus.CANCELLED],
  [OrderStatus.IN_SOURCING]: [OrderStatus.SUBSTITUTION_REQUIRED, OrderStatus.READY_FOR_PACKING, OrderStatus.CANCELLED],
  [OrderStatus.SUBSTITUTION_REQUIRED]: [OrderStatus.READY_FOR_PACKING, OrderStatus.CANCELLED],
  [OrderStatus.READY_FOR_PACKING]: [OrderStatus.PACKED, OrderStatus.CANCELLED],
  [OrderStatus.PACKED]: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.CANCELLED],
  [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED, OrderStatus.FAILED, OrderStatus.CANCELLED],
  [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED, OrderStatus.FAILED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [OrderStatus.REFUNDED],
  [OrderStatus.FAILED]: [OrderStatus.REFUNDED],
  [OrderStatus.REFUNDED]: []
}

/**
 * Order Status Groups
 * Groups statuses by their phase in the order lifecycle
 */
export const ORDER_STATUS_GROUPS = {
  INITIAL: [OrderStatus.RECEIVED],
  CONFIRMATION: [OrderStatus.CONFIRMED, OrderStatus.AWAITING_PAYMENT],
  PAYMENT: [OrderStatus.PAID],
  PROCESSING: [OrderStatus.IN_SOURCING, OrderStatus.SUBSTITUTION_REQUIRED, OrderStatus.READY_FOR_PACKING, OrderStatus.PACKED],
  DELIVERY: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED],
  COMPLETED: [OrderStatus.COMPLETED],
  TERMINATED: [OrderStatus.CANCELLED, OrderStatus.FAILED, OrderStatus.REFUNDED]
}

/**
 * Order Status Display Information
 * Human-readable information for each status
 */
export const ORDER_STATUS_DISPLAY = {
  [OrderStatus.RECEIVED]: {
    label: 'Received',
    description: 'Order has been received and is being processed',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'clock'
  },
  [OrderStatus.CONFIRMED]: {
    label: 'Confirmed',
    description: 'Order has been confirmed by customer',
    color: 'bg-blue-100 text-blue-800',
    icon: 'check-circle'
  },
  [OrderStatus.AWAITING_PAYMENT]: {
    label: 'Awaiting Payment',
    description: 'Waiting for customer payment',
    color: 'bg-orange-100 text-orange-800',
    icon: 'credit-card'
  },
  [OrderStatus.PAID]: {
    label: 'Paid',
    description: 'Payment has been received',
    color: 'bg-green-100 text-green-800',
    icon: 'check-circle'
  },
  [OrderStatus.IN_SOURCING]: {
    label: 'In Sourcing',
    description: 'Products are being sourced from markets/farms',
    color: 'bg-purple-100 text-purple-800',
    icon: 'package'
  },
  [OrderStatus.SUBSTITUTION_REQUIRED]: {
    label: 'Substitution Required',
    description: 'Some items need substitution',
    color: 'bg-red-100 text-red-800',
    icon: 'alert-triangle'
  },
  [OrderStatus.READY_FOR_PACKING]: {
    label: 'Ready for Packing',
    description: 'Order is ready to be packed',
    color: 'bg-indigo-100 text-indigo-800',
    icon: 'package'
  },
  [OrderStatus.PACKED]: {
    label: 'Packed',
    description: 'Order has been packed and ready for delivery',
    color: 'bg-blue-100 text-blue-800',
    icon: 'package'
  },
  [OrderStatus.OUT_FOR_DELIVERY]: {
    label: 'Out for Delivery',
    description: 'Order is out for delivery',
    color: 'bg-orange-100 text-orange-800',
    icon: 'truck'
  },
  [OrderStatus.DELIVERED]: {
    label: 'Delivered',
    description: 'Order has been delivered to customer',
    color: 'bg-green-100 text-green-800',
    icon: 'check-circle'
  },
  [OrderStatus.COMPLETED]: {
    label: 'Completed',
    description: 'Order has been completed successfully',
    color: 'bg-emerald-100 text-emerald-800',
    icon: 'check-circle'
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelled',
    description: 'Order was cancelled by customer',
    color: 'bg-red-100 text-red-800',
    icon: 'x-circle'
  },
  [OrderStatus.FAILED]: {
    label: 'Failed',
    description: 'Order failed due to technical issues',
    color: 'bg-red-100 text-red-800',
    icon: 'x-circle'
  },
  [OrderStatus.REFUNDED]: {
    label: 'Refunded',
    description: 'Order has been refunded',
    color: 'bg-gray-100 text-gray-800',
    icon: 'refresh-cw'
  }
}

/**
 * Order Status Validation Functions
 */
export const isValidStatusTransition = (from: OrderStatus, to: OrderStatus): boolean => {
  return ORDER_STATUS_TRANSITIONS[from]?.includes(to) || false
}

export const isTerminalStatus = (status: OrderStatus): boolean => {
  return ORDER_STATUS_GROUPS.COMPLETED.includes(status) || 
         ORDER_STATUS_GROUPS.TERMINATED.includes(status)
}

export const isActiveStatus = (status: OrderStatus): boolean => {
  return !isTerminalStatus(status)
}

/**
 * Order Status Helper Functions
 */
export const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  return ORDER_STATUS_TRANSITIONS[currentStatus] || []
}

export const canTransitionTo = (from: OrderStatus, to: OrderStatus): boolean => {
  return isValidStatusTransition(from, to)
}

/**
 * Order Status Type Guards
 */
export const isPaymentStatus = (status: OrderStatus): boolean => {
  return status === OrderStatus.PAID
}

export const isDeliveryStatus = (status: OrderStatus): boolean => {
  return status === OrderStatus.OUT_FOR_DELIVERY || status === OrderStatus.DELIVERED
}

export const isProcessingStatus = (status: OrderStatus): boolean => {
  return ORDER_STATUS_GROUPS.PROCESSING.includes(status)
}

/**
 * Order Status Progress Calculation
 */
export const getProgressPercentage = (status: OrderStatus): number => {
  const statusOrder = [
    OrderStatus.RECEIVED,
    OrderStatus.CONFIRMED,
    OrderStatus.AWAITING_PAYMENT,
    OrderStatus.PAID,
    OrderStatus.IN_SOURCING,
    OrderStatus.SUBSTITUTION_REQUIRED,
    OrderStatus.READY_FOR_PACKING,
    OrderStatus.PACKED,
    OrderStatus.OUT_FOR_DELIVERY,
    OrderStatus.DELIVERED,
    OrderStatus.COMPLETED
  ]
  
  const currentIndex = statusOrder.indexOf(status)
  return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0
}

/**
 * Type Guards and Utility Types
 */
export type OrderStatusType = OrderStatus

export type ActiveOrderStatus = Exclude<OrderStatus, 
  typeof ORDER_STATUS_GROUPS.COMPLETED[number] | 
  typeof ORDER_STATUS_GROUPS.TERMINATED[number]
>

export type TerminalOrderStatus = Extract<OrderStatus, 
  typeof ORDER_STATUS_GROUPS.COMPLETED[number] | 
  typeof ORDER_STATUS_GROUPS.TERMINATED[number]
>

export default OrderStatus
