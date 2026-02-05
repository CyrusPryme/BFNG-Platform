/**
 * Payment Status
 * Defines the different states for payments
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

/**
 * Payment Method
 * Defines the different payment methods
 */
export enum PaymentMethod {
  CASH = 'cash',
  MOBILE_MONEY = 'mobile_money',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  CHECK = 'check',
  CRYPTOCURRENCY = 'cryptocurrency',
  DIGITAL_WALLET = 'digital_wallet'
}

/**
 * Payment Type
 * Defines the different payment types
 */
export enum PaymentType {
  PREPAID = 'prepaid',
  POSTPAID = 'postpaid',
  SUBSCRIPTION = 'subscription',
  ONE_TIME = 'one_time',
  INSTALLMENT = 'installment'
}

/**
 * Payment Provider
 * Defines the different payment providers
 */
export enum PaymentProvider {
  MTN_MOBILE_MONEY = 'mtn_mobile_money',
  VODAFONE_CASH = 'vodafone_cash',
  AIRTELTIGO_MONEY = 'airteltigo_money',
  GHANA_COMMERCIAL_BANK = 'ghana_commercial_bank',
  ECOBANK = 'ecobank',
  STANDARD_CHARTERED = 'standard_chartered',
  BARCLAYS = 'barclays',
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  BITCOIN = 'bitcoin',
  ETHEREUM = 'ethereum'
}

/**
 * Payment Transaction
 * Individual payment transaction record
 */
export interface PaymentTransaction {
  id: string
  transactionId: string
  orderId: string
  orderNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  paymentProvider: PaymentProvider
  paymentType: PaymentType
  status: PaymentStatus
  referenceNumber?: string
  authorizationCode?: string
  transactionDate: string
  processedDate?: string
  completedDate?: string
  failedDate?: string
  cancelledDate?: string
  refundedDate?: string
  processingFee: number
  netAmount: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  description: string
  notes?: string
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
  createdBy?: string
  modifiedBy?: string
}

/**
 * Customer Payment Profile
 * Customer payment information and preferences
 */
export interface CustomerPaymentProfile {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  paymentType: PaymentType
  creditLimit?: number
  outstandingBalance: number
  availableCredit: number
  paymentMethods: Array<{
    id: string
    type: PaymentMethod
    provider: PaymentProvider
    identifier: string // Phone number, account number, card token, etc.
    isDefault: boolean
    isActive: boolean
    expiresAt?: string
    metadata: Record<string, any>
    createdAt: string
    updatedAt: string
  }>
  billingAddress: {
    street: string
    city: string
    region: string
    postalCode: string
    country: string
    isDefault: boolean
  }
  paymentPreferences: {
    preferredMethod: PaymentMethod
    autoPay: boolean
    paymentReminders: boolean
    reminderDays: number
    lateFeeGracePeriod: number
  }
  paymentHistory: {
    totalPaid: number
    totalSpent: number
    averagePaymentAmount: number
    lastPaymentDate?: string
    paymentFrequency: string
    onTimePaymentRate: number
    latePaymentCount: number
    failedPaymentCount: number
  }
  createdAt: string
  updatedAt: string
  lastModified: string
}

/**
 * Payment Confirmation
 * Manual payment confirmation record
 */
export interface PaymentConfirmation {
  id: string
  transactionId: string
  orderId: string
  orderNumber: string
  customerId: string
  customerName: string
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  paymentProvider: PaymentProvider
  referenceNumber?: string
  receiptNumber?: string
  confirmedBy: string
  confirmedAt: string
  confirmationNotes: string
  evidence: {
    receiptImage?: string
    transactionScreenshot?: string
    bankStatement?: string
    otherDocuments?: string[]
  }
  verificationStatus: 'pending' | 'verified' | 'rejected'
  verifiedBy?: string
  verifiedAt?: string
  verificationNotes?: string
  createdAt: string
  updatedAt: string
}

/**
 * Payment Filters
 * Used for searching and filtering payments
 */
export interface PaymentFilters {
  status?: PaymentStatus | 'all'
  paymentMethod?: PaymentMethod | 'all'
  paymentType?: PaymentType | 'all'
  paymentProvider?: PaymentProvider | 'all'
  customerId?: string
  transactionAfter?: string
  transactionBefore?: string
  amountRange?: {
    min: number
    max: number
  }
  search?: string
  hasRefunds?: boolean
  isManualConfirmation?: boolean
  requiresVerification?: boolean
}

/**
 * Payment Search Result
 * Used for API responses
 */
export interface PaymentSearchResult {
  transactions: PaymentTransaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  filters: PaymentFilters
}

/**
 * Payment Statistics
 * Dashboard statistics for payments
 */
export interface PaymentStatistics {
  total: number
  paid: number
  unpaid: number
  pending: number
  failed: number
  refunded: number
  totalAmount: number
  paidAmount: number
  unpaidAmount: number
  pendingAmount: number
  failedAmount: number
  refundedAmount: number
  averageOrderValue: number
  averagePaymentAmount: number
  paymentSuccessRate: number
  onTimePaymentRate: number
  byMethod: Record<string, number>
  byProvider: Record<string, number>
  byType: Record<string, number>
  byStatus: Record<string, number>
  monthlyTrends: {
    month: string
    total: number
    paid: number
    failed: number
    amount: number
  }[]
  dailyTrends: {
    date: string
    total: number
    paid: number
    failed: number
    amount: number
  }[]
}

/**
 * Payment Validation Rules
 */
export const PAYMENT_VALIDATION_RULES = {
  amount: {
    required: true,
    min: 0,
    max: 999999999
  },
  currency: {
    required: true,
    pattern: '^[A-Z]{3}$'
  },
  paymentMethod: {
    required: true,
    enum: Object.values(PaymentMethod)
  },
  paymentProvider: {
    required: true,
    enum: Object.values(PaymentProvider)
  },
  customerId: {
    required: true,
    minLength: 1,
    maxLength: 50
  }
}

/**
 * Payment Status Display Information
 */
export const PAYMENT_STATUS_DISPLAY = {
  [PaymentStatus.PENDING]: {
    label: 'Pending',
    description: 'Payment is pending confirmation',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'clock'
  },
  [PaymentStatus.PROCESSING]: {
    label: 'Processing',
    description: 'Payment is being processed',
    color: 'bg-blue-100 text-blue-800',
    icon: 'refresh-cw'
  },
  [PaymentStatus.COMPLETED]: {
    label: 'Completed',
    description: 'Payment has been completed successfully',
    color: 'bg-green-100 text-green-800',
    icon: 'check-circle'
  },
  [PaymentStatus.FAILED]: {
    label: 'Failed',
    description: 'Payment has failed',
    color: 'bg-red-100 text-red-800',
    icon: 'x-circle'
  },
  [PaymentStatus.CANCELLED]: {
    label: 'Cancelled',
    description: 'Payment has been cancelled',
    color: 'bg-gray-100 text-gray-800',
    icon: 'ban'
  },
  [PaymentStatus.REFUNDED]: {
    label: 'Refunded',
    description: 'Payment has been refunded',
    color: 'bg-purple-100 text-purple-800',
    icon: 'arrow-return'
  },
  [PaymentStatus.PARTIALLY_REFUNDED]: {
    label: 'Partially Refunded',
    description: 'Payment has been partially refunded',
    color: 'bg-pink-100 text-pink-800',
    icon: 'arrow-return'
  }
}

/**
 * Payment Method Display Information
 */
export const PAYMENT_METHOD_DISPLAY = {
  [PaymentMethod.CASH]: {
    label: 'Cash',
    description: 'Cash payment',
    color: 'bg-green-100 text-green-800',
    icon: 'dollar-sign'
  },
  [PaymentMethod.MOBILE_MONEY]: {
    label: 'Mobile Money',
    description: 'Mobile money payment',
    color: 'bg-blue-100 text-blue-800',
    icon: 'smartphone'
  },
  [PaymentMethod.BANK_TRANSFER]: {
    label: 'Bank Transfer',
    description: 'Bank transfer payment',
    color: 'bg-purple-100 text-purple-800',
    icon: 'bank'
  },
  [PaymentMethod.CREDIT_CARD]: {
    label: 'Credit Card',
    description: 'Credit card payment',
    color: 'bg-indigo-100 text-indigo-800',
    icon: 'credit-card'
  },
  [PaymentMethod.DEBIT_CARD]: {
    label: 'Debit Card',
    description: 'Debit card payment',
    color: 'bg-orange-100 text-orange-800',
    icon: 'credit-card'
  },
  [PaymentMethod.CHECK]: {
    label: 'Check',
    description: 'Check payment',
    color: 'bg-gray-100 text-gray-800',
    icon: 'file-text'
  },
  [PaymentMethod.CRYPTOCURRENCY]: {
    label: 'Cryptocurrency',
    description: 'Cryptocurrency payment',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'bitcoin'
  },
  [PaymentMethod.DIGITAL_WALLET]: {
    label: 'Digital Wallet',
    description: 'Digital wallet payment',
    color: 'bg-pink-100 text-pink-800',
    icon: 'wallet'
  }
}

/**
 * Payment Type Display Information
 */
export const PAYMENT_TYPE_DISPLAY = {
  [PaymentType.PREPAID]: {
    label: 'Prepaid',
    description: 'Prepaid payment',
    color: 'bg-blue-100 text-blue-800',
    icon: 'credit-card'
  },
  [PaymentType.POSTPAID]: {
    label: 'Postpaid',
    description: 'Postpaid payment',
    color: 'bg-orange-100 text-orange-800',
    icon: 'clock'
  },
  [PaymentType.SUBSCRIPTION]: {
    label: 'Subscription',
    description: 'Subscription payment',
    color: 'bg-purple-100 text-purple-800',
    icon: 'repeat'
  },
  [PaymentType.ONE_TIME]: {
    label: 'One-Time',
    description: 'One-time payment',
    color: 'bg-green-100 text-green-800',
    icon: 'shopping-cart'
  },
  [PaymentType.INSTALLMENT]: {
    label: 'Installment',
    description: 'Installment payment',
    color: 'bg-indigo-100 text-indigo-800',
    icon: 'calendar'
  }
}

/**
 * Payment Provider Display Information
 */
export const PAYMENT_PROVIDER_DISPLAY = {
  [PaymentProvider.MTN_MOBILE_MONEY]: {
    label: 'MTN Mobile Money',
    description: 'MTN Mobile Money',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'smartphone'
  },
  [PaymentProvider.VODAFONE_CASH]: {
    label: 'Vodafone Cash',
    description: 'Vodafone Cash',
    color: 'bg-red-100 text-red-800',
    icon: 'smartphone'
  },
  [PaymentProvider.AIRTELTIGO_MONEY]: {
    label: 'AirtelTigo Money',
    description: 'AirtelTigo Money',
    color: 'bg-blue-100 text-blue-800',
    icon: 'smartphone'
  },
  [PaymentProvider.GHANA_COMMERCIAL_BANK]: {
    label: 'Ghana Commercial Bank',
    description: 'Ghana Commercial Bank',
    color: 'bg-green-100 text-green-800',
    icon: 'bank'
  },
  [PaymentProvider.ECOBANK]: {
    label: 'Ecobank',
    description: 'Ecobank',
    color: 'bg-purple-100 text-purple-800',
    icon: 'bank'
  },
  [PaymentProvider.STANDARD_CHARTERED]: {
    label: 'Standard Chartered',
    description: 'Standard Chartered',
    color: 'bg-indigo-100 text-indigo-800',
    icon: 'bank'
  },
  [PaymentProvider.BARCLAYS]: {
    label: 'Barclays',
    description: 'Barclays',
    color: 'bg-blue-100 text-blue-800',
    icon: 'bank'
  },
  [PaymentProvider.VISA]: {
    label: 'Visa',
    description: 'Visa',
    color: 'bg-blue-100 text-blue-800',
    icon: 'credit-card'
  },
  [PaymentProvider.MASTERCARD]: {
    label: 'Mastercard',
    description: 'Mastercard',
    color: 'bg-orange-100 text-orange-800',
    icon: 'credit-card'
  },
  [PaymentProvider.PAYPAL]: {
    label: 'PayPal',
    description: 'PayPal',
    color: 'bg-blue-100 text-blue-800',
    icon: 'wallet'
  },
  [PaymentProvider.STRIPE]: {
    label: 'Stripe',
    description: 'Stripe',
    color: 'bg-purple-100 text-purple-800',
    icon: 'credit-card'
  },
  [PaymentProvider.BITCOIN]: {
    label: 'Bitcoin',
    description: 'Bitcoin',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'bitcoin'
  },
  [PaymentProvider.ETHEREUM]: {
    label: 'Ethereum',
    description: 'Ethereum',
    color: 'bg-blue-100 text-blue-800',
    icon: 'hexagon'
  }
}

/**
 * Helper Functions
 */
export const getPaymentStatusColor = (status: PaymentStatus): string => {
  return PAYMENT_STATUS_DISPLAY[status]?.color || 'bg-gray-100 text-gray-800'
}

export const getPaymentStatusIcon = (status: PaymentStatus): string => {
  return PAYMENT_STATUS_DISPLAY[status]?.icon || 'clock'
}

export const getPaymentMethodColor = (method: PaymentMethod): string => {
  return PAYMENT_METHOD_DISPLAY[method]?.color || 'bg-gray-100 text-gray-800'
}

export const getPaymentMethodIcon = (method: PaymentMethod): string => {
  return PAYMENT_METHOD_DISPLAY[method]?.icon || 'dollar-sign'
}

export const getPaymentTypeColor = (type: PaymentType): string => {
  return PAYMENT_TYPE_DISPLAY[type]?.color || 'bg-gray-100 text-gray-800'
}

export const getPaymentTypeIcon = (type: PaymentType): string => {
  return PAYMENT_TYPE_DISPLAY[type]?.icon || 'credit-card'
}

export const getPaymentProviderColor = (provider: PaymentProvider): string => {
  return PAYMENT_PROVIDER_DISPLAY[provider]?.color || 'bg-gray-100 text-gray-800'
}

export const getPaymentProviderIcon = (provider: PaymentProvider): string => {
  return PAYMENT_PROVIDER_DISPLAY[provider]?.icon || 'bank'
}

export const isPaymentPaid = (payment: PaymentTransaction): boolean => {
  return payment.status === PaymentStatus.COMPLETED
}

export const isPaymentPending = (payment: PaymentTransaction): boolean => {
  return payment.status === PaymentStatus.PENDING || payment.status === PaymentStatus.PROCESSING
}

export const isPaymentFailed = (payment: PaymentTransaction): boolean => {
  return payment.status === PaymentStatus.FAILED
}

export const isPaymentRefunded = (payment: PaymentTransaction): boolean => {
  return payment.status === PaymentStatus.REFUNDED || payment.status === PaymentStatus.PARTIALLY_REFUNDED
}

export const canConfirmPayment = (payment: PaymentTransaction): boolean => {
  return payment.status === PaymentStatus.PENDING && 
         (payment.paymentMethod === PaymentMethod.CASH || 
          payment.paymentMethod === PaymentMethod.BANK_TRANSFER ||
          payment.paymentMethod === PaymentMethod.CHECK)
}

export const canRefundPayment = (payment: PaymentTransaction): boolean => {
  return payment.status === PaymentStatus.COMPLETED && !isPaymentRefunded(payment)
}

export const getCustomerFullName = (payment: PaymentTransaction): string => {
  return payment.customerName
}

export const formatCurrency = (amount: number, currency: string = 'GHS'): string => {
  return `${currency} ${amount.toFixed(2)}`
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const generateTransactionId = (): string => {
  const timestamp = Date.now().toString(36).substring(2, 8).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `TXN-${timestamp}-${random}`
}

export const generateReferenceNumber = (): string => {
  const timestamp = Date.now().toString(36).substring(2, 8).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `REF-${timestamp}-${random}`
}

export const validatePayment = (payment: Partial<PaymentTransaction>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!payment.amount || payment.amount <= 0) {
    errors.push('Payment amount is required and must be greater than 0')
  }
  
  if (!payment.currency || !/^[A-Z]{3}$/.test(payment.currency)) {
    errors.push('Valid currency code is required (3 letters)')
  }
  
  if (!payment.paymentMethod || !Object.values(PaymentMethod).includes(payment.paymentMethod)) {
    errors.push('Valid payment method is required')
  }
  
  if (!payment.paymentProvider || !Object.values(PaymentProvider).includes(payment.paymentProvider)) {
    errors.push('Valid payment provider is required')
  }
  
  if (!payment.customerId || payment.customerId.length === 0) {
    errors.push('Customer ID is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export default PaymentTransaction
