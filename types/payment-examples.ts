import { PaymentTransaction, PaymentStatus, PaymentMethod, PaymentType, PaymentProvider, CustomerPaymentProfile, PaymentConfirmation } from './payment'

/**
 * Mock Payment Transactions
 * Sample payment transactions demonstrating the complete payment model
 */
export const mockPaymentTransactions: PaymentTransaction[] = [
  {
    id: 'pay-001',
    transactionId: 'TXN-ABC123-XYZ',
    orderId: 'ord-001',
    orderNumber: 'ORD-2024-001',
    customerId: 'cust-001',
    customerName: 'Kwame Asante',
    customerEmail: 'kwame.asante@email.com',
    customerPhone: '+233 24 123 4567',
    amount: 34.00,
    currency: 'GHS',
    paymentMethod: PaymentMethod.MOBILE_MONEY,
    paymentProvider: PaymentProvider.MTN_MOBILE_MONEY,
    paymentType: PaymentType.PREPAID,
    status: PaymentStatus.COMPLETED,
    referenceNumber: 'MTN-123456789',
    authorizationCode: 'AUTH-789012',
    transactionDate: '2024-02-03T10:30:00Z',
    processedDate: '2024-02-03T10:31:00Z',
    completedDate: '2024-02-03T10:32:00Z',
    processingFee: 1.70,
    netAmount: 32.30,
    taxAmount: 4.25,
    discountAmount: 0.00,
    totalAmount: 34.00,
    description: 'Payment for order ORD-2024-001',
    notes: 'Customer paid via MTN Mobile Money',
    metadata: {
      phoneNumber: '+233 24 123 4567',
      transactionId: 'MTN-TXN-123456789',
      paymentReference: 'BFNG-2024-001'
    },
    createdAt: '2024-02-03T10:30:00Z',
    updatedAt: '2024-02-03T10:32:00Z',
    createdBy: 'system',
    modifiedBy: 'system'
  },
  {
    id: 'pay-002',
    transactionId: 'TXN-DEF456-ABC',
    orderId: 'ord-002',
    orderNumber: 'ORD-2024-002',
    customerId: 'cust-002',
    customerName: 'Ama Owusu',
    customerEmail: 'ama.owusu@company.com',
    customerPhone: '+233 27 987 6543',
    amount: 125.00,
    currency: 'GHS',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentProvider: PaymentProvider.GHANA_COMMERCIAL_BANK,
    paymentType: PaymentType.POSTPAID,
    status: PaymentStatus.PENDING,
    referenceNumber: 'GCB-987654321',
    transactionDate: '2024-02-03T11:45:00Z',
    processingFee: 2.50,
    netAmount: 122.50,
    taxAmount: 15.62,
    discountAmount: 0.00,
    totalAmount: 125.00,
    description: 'Payment for order ORD-2024-002',
    notes: 'Business customer - bank transfer pending',
    metadata: {
      bankAccount: 'GCB-123456789',
      transferReference: 'BFNG-BUS-2024-002',
      companyName: 'Owusu Enterprises'
    },
    createdAt: '2024-02-03T11:45:00Z',
    updatedAt: '2024-02-03T11:45:00Z',
    createdBy: 'system',
    modifiedBy: 'system'
  },
  {
    id: 'pay-003',
    transactionId: 'TXN-GHI789-DEF',
    orderId: 'ord-003',
    orderNumber: 'ORD-2024-003',
    customerId: 'cust-003',
    customerName: 'Yaa Nyarko',
    customerEmail: 'yaa.nyarko@email.com',
    customerPhone: '+233 20 111 2222',
    amount: 120.00,
    currency: 'GHS',
    paymentMethod: PaymentMethod.CASH,
    paymentProvider: PaymentProvider.GHANA_COMMERCIAL_BANK,
    paymentType: PaymentType.POSTPAID,
    status: PaymentStatus.COMPLETED,
    referenceNumber: 'CASH-001',
    transactionDate: '2024-02-03T14:20:00Z',
    processedDate: '2024-02-03T14:20:00Z',
    completedDate: '2024-02-03T14:20:00Z',
    processingFee: 0.00,
    netAmount: 120.00,
    taxAmount: 15.00,
    discountAmount: 0.00,
    totalAmount: 120.00,
    description: 'Payment for order ORD-2024-003',
    notes: 'Customer paid cash at delivery',
    metadata: {
      receiptNumber: 'R-2024-001',
      collectedBy: 'driver-001',
      deliveryAddress: '789 Family Lane, Tamale'
    },
    createdAt: '2024-02-03T14:20:00Z',
    updatedAt: '2024-02-03T14:20:00Z',
    createdBy: 'driver-001',
    modifiedBy: 'driver-001'
  },
  {
    id: 'pay-004',
    transactionId: 'TXN-JKL012-GHI',
    orderId: 'ord-004',
    orderNumber: 'ORD-2024-004',
    customerId: 'cust-004',
    customerName: 'Peter Addo',
    customerEmail: 'peter.addo@email.com',
    customerPhone: '+233 26 333 4444',
    amount: 50.00,
    currency: 'GHS',
    paymentMethod: PaymentMethod.MOBILE_MONEY,
    paymentProvider: PaymentProvider.VODAFONE_CASH,
    paymentType: PaymentType.SUBSCRIPTION,
    status: PaymentStatus.FAILED,
    referenceNumber: 'VDF-555666777',
    transactionDate: '2024-02-03T16:15:00Z',
    failedDate: '2024-02-03T16:16:00Z',
    processingFee: 1.00,
    netAmount: 49.00,
    taxAmount: 6.25,
    discountAmount: 0.00,
    totalAmount: 50.00,
    description: 'Subscription payment for February 2024',
    notes: 'Payment failed - insufficient funds',
    metadata: {
      phoneNumber: '+233 26 333 4444',
      transactionId: 'VDF-TXN-555666777',
      subscriptionId: 'sub-005',
      billingCycle: 'weekly'
    },
    createdAt: '2024-02-03T16:15:00Z',
    updatedAt: '2024-02-03T16:16:00Z',
    createdBy: 'system',
    modifiedBy: 'system'
  },
  {
    id: 'pay-005',
    transactionId: 'TXN-MNO345-JKL',
    orderId: 'ord-005',
    orderNumber: 'ORD-2024-005',
    customerId: 'cust-005',
    customerName: 'Kojo Mensah',
    customerEmail: 'kojo.mensah@university.edu',
    customerPhone: '+233 23 456 7890',
    amount: 225.00,
    currency: 'GHS',
    paymentMethod: PaymentMethod.CREDIT_CARD,
    paymentProvider: PaymentProvider.VISA,
    paymentType: PaymentType.ONE_TIME,
    status: PaymentStatus.REFUNDED,
    referenceNumber: 'VISA-999888777',
    authorizationCode: 'AUTH-555666',
    transactionDate: '2024-02-02T09:30:00Z',
    processedDate: '2024-02-02T09:31:00Z',
    completedDate: '2024-02-02T09:32:00Z',
    refundedDate: '2024-02-03T12:00:00Z',
    processingFee: 4.50,
    netAmount: 220.50,
    taxAmount: 28.12,
    discountAmount: 0.00,
    totalAmount: 225.00,
    description: 'Payment for order ORD-2024-005',
    notes: 'Order cancelled - payment refunded',
    metadata: {
      cardNumber: '****-****-****-1234',
      cardType: 'Visa',
      refundReason: 'Order cancellation',
      refundId: 'REF-999888777'
    },
    createdAt: '2024-02-02T09:30:00Z',
    updatedAt: '2024-02-03T12:00:00Z',
    createdBy: 'system',
    modifiedBy: 'admin-001'
  },
  {
    id: 'pay-006',
    transactionId: 'TXN-PQR678-MNO',
    orderId: 'ord-006',
    orderNumber: 'ORD-2024-006',
    customerId: 'cust-006',
    customerName: 'Adwoa Boateng',
    customerEmail: 'adwoa.boateng@email.com',
    customerPhone: '+233 50 777 8888',
    amount: 88.00,
    currency: 'GHS',
    paymentMethod: PaymentMethod.MOBILE_MONEY,
    paymentProvider: PaymentProvider.AIRTELTIGO_MONEY,
    paymentType: PaymentType.PREPAID,
    status: PaymentStatus.PROCESSING,
    referenceNumber: 'ATG-111222333',
    transactionDate: '2024-02-03T18:45:00Z',
    processingFee: 1.76,
    netAmount: 86.24,
    taxAmount: 11.00,
    discountAmount: 0.00,
    totalAmount: 88.00,
    description: 'Payment for order ORD-2024-006',
    notes: 'Payment currently being processed',
    metadata: {
      phoneNumber: '+233 50 777 8888',
      transactionId: 'ATG-TXN-111222333',
      processingStage: 'authorization'
    },
    createdAt: '2024-02-03T18:45:00Z',
    updatedAt: '2024-02-03T18:45:00Z',
    createdBy: 'system',
    modifiedBy: 'system'
  },
  {
    id: 'pay-007',
    transactionId: 'TXN-STU901-PQR',
    orderId: 'ord-007',
    orderNumber: 'ORD-2024-007',
    customerId: 'cust-007',
    customerName: 'Kofi Annan',
    customerEmail: 'kofi.annan@email.com',
    customerPhone: '+233 24 999 0000',
    amount: 156.00,
    currency: 'GHS',
    paymentMethod: PaymentMethod.CHECK,
    paymentProvider: PaymentProvider.GHANA_COMMERCIAL_BANK,
    paymentType: PaymentType.POSTPAID,
    status: PaymentStatus.PENDING,
    referenceNumber: 'CHECK-333444555',
    transactionDate: '2024-02-03T20:00:00Z',
    processingFee: 3.12,
    netAmount: 152.88,
    taxAmount: 19.50,
    discountAmount: 0.00,
    totalAmount: 156.00,
    description: 'Payment for order ORD-2024-007',
    notes: 'Check payment pending verification',
    metadata: {
      checkNumber: '333444555',
      bankName: 'Ghana Commercial Bank',
      accountName: 'Kofi Annan',
      checkDate: '2024-02-03'
    },
    createdAt: '2024-02-03T20:00:00Z',
    updatedAt: '2024-02-03T20:00:00Z',
    createdBy: 'system',
    modifiedBy: 'system'
  }
]

/**
 * Mock Customer Payment Profiles
 * Sample customer payment profiles with postpaid information
 */
export const mockCustomerPaymentProfiles: CustomerPaymentProfile[] = [
  {
    id: 'cpp-001',
    customerId: 'cust-001',
    customerName: 'Kwame Asante',
    customerEmail: 'kwame.asante@email.com',
    customerPhone: '+233 24 123 4567',
    paymentType: PaymentType.PREPAID,
    outstandingBalance: 0.00,
    availableCredit: 0.00,
    paymentMethods: [
      {
        id: 'pm-001',
        type: PaymentMethod.MOBILE_MONEY,
        provider: PaymentProvider.MTN_MOBILE_MONEY,
        identifier: '+233 24 123 4567',
        isDefault: true,
        isActive: true,
        metadata: {
          registeredName: 'Kwame Asante',
          verificationStatus: 'verified'
        },
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-02-03T10:30:00Z'
      }
    ],
    billingAddress: {
      street: '123 Market Street',
      city: 'Accra',
      region: 'Greater Accra',
      postalCode: '00233',
      country: 'Ghana',
      isDefault: true
    },
    paymentPreferences: {
      preferredMethod: PaymentMethod.MOBILE_MONEY,
      autoPay: true,
      paymentReminders: true,
      reminderDays: 3,
      lateFeeGracePeriod: 7
    },
    paymentHistory: {
      totalPaid: 272.00,
      totalSpent: 272.00,
      averagePaymentAmount: 34.00,
      lastPaymentDate: '2024-02-03T10:32:00Z',
      paymentFrequency: 'weekly',
      onTimePaymentRate: 95.5,
      latePaymentCount: 1,
      failedPaymentCount: 0
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-02-03T10:32:00Z',
    lastModified: '2024-02-03T10:32:00Z'
  },
  {
    id: 'cpp-002',
    customerId: 'cust-002',
    customerName: 'Ama Owusu',
    customerEmail: 'ama.owusu@company.com',
    customerPhone: '+233 27 987 6543',
    paymentType: PaymentType.POSTPAID,
    creditLimit: 5000.00,
    outstandingBalance: 125.00,
    availableCredit: 4875.00,
    paymentMethods: [
      {
        id: 'pm-002',
        type: PaymentMethod.BANK_TRANSFER,
        provider: PaymentProvider.GHANA_COMMERCIAL_BANK,
        identifier: 'GCB-123456789',
        isDefault: true,
        isActive: true,
        metadata: {
          accountName: 'Owusu Enterprises',
          accountType: 'business',
          bankName: 'Ghana Commercial Bank'
        },
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-02-03T11:45:00Z'
      },
      {
        id: 'pm-003',
        type: PaymentMethod.MOBILE_MONEY,
        provider: PaymentProvider.VODAFONE_CASH,
        identifier: '+233 27 987 6543',
        isDefault: false,
        isActive: true,
        metadata: {
          registeredName: 'Ama Owusu',
          verificationStatus: 'verified'
        },
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z'
      }
    ],
    billingAddress: {
      street: '456 Business Avenue',
      city: 'Kumasi',
      region: 'Ashanti',
      postalCode: '00233',
      country: 'Ghana',
      isDefault: true
    },
    paymentPreferences: {
      preferredMethod: PaymentMethod.BANK_TRANSFER,
      autoPay: false,
      paymentReminders: true,
      reminderDays: 5,
      lateFeeGracePeriod: 14
    },
    paymentHistory: {
      totalPaid: 2940.00,
      totalSpent: 3065.00,
      averagePaymentAmount: 125.00,
      lastPaymentDate: '2024-01-25T14:30:00Z',
      paymentFrequency: 'bi_weekly',
      onTimePaymentRate: 88.2,
      latePaymentCount: 3,
      failedPaymentCount: 1
    },
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-02-03T11:45:00Z',
    lastModified: '2024-02-03T11:45:00Z'
  },
  {
    id: 'cpp-003',
    customerId: 'cust-003',
    customerName: 'Yaa Nyarko',
    customerEmail: 'yaa.nyarko@email.com',
    customerPhone: '+233 20 111 2222',
    paymentType: PaymentType.POSTPAID,
    creditLimit: 2000.00,
    outstandingBalance: 120.00,
    availableCredit: 1880.00,
    paymentMethods: [
      {
        id: 'pm-004',
        type: PaymentMethod.CASH,
        provider: PaymentProvider.GHANA_COMMERCIAL_BANK,
        identifier: 'Cash Payment',
        isDefault: true,
        isActive: true,
        metadata: {
          paymentType: 'cash',
          collectionMethod: 'delivery'
        },
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-02-03T14:20:00Z'
      }
    ],
    billingAddress: {
      street: '789 Family Lane',
      city: 'Tamale',
      region: 'Northern',
      postalCode: '00233',
      country: 'Ghana',
      isDefault: true
    },
    paymentPreferences: {
      preferredMethod: PaymentMethod.CASH,
      autoPay: false,
      paymentReminders: true,
      reminderDays: 7,
      lateFeeGracePeriod: 30
    },
    paymentHistory: {
      totalPaid: 120.00,
      totalSpent: 120.00,
      averagePaymentAmount: 120.00,
      lastPaymentDate: '2024-02-03T14:20:00Z',
      paymentFrequency: 'monthly',
      onTimePaymentRate: 100.0,
      latePaymentCount: 0,
      failedPaymentCount: 0
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-02-03T14:20:00Z',
    lastModified: '2024-02-03T14:20:00Z'
  },
  {
    id: 'cpp-004',
    customerId: 'cust-004',
    customerName: 'Peter Addo',
    customerEmail: 'peter.addo@email.com',
    customerPhone: '+233 26 333 4444',
    paymentType: PaymentType.SUBSCRIPTION,
    outstandingBalance: 0.00,
    availableCredit: 0.00,
    paymentMethods: [
      {
        id: 'pm-005',
        type: PaymentMethod.MOBILE_MONEY,
        provider: PaymentProvider.VODAFONE_CASH,
        identifier: '+233 26 333 4444',
        isDefault: true,
        isActive: true,
        metadata: {
          registeredName: 'Peter Addo',
          verificationStatus: 'verified',
          autoRenewal: true
        },
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-03T16:15:00Z'
      }
    ],
    billingAddress: {
      street: '567 Residential Street',
      city: 'Tema',
      region: 'Greater Accra',
      postalCode: '00233',
      country: 'Ghana',
      isDefault: true
    },
    paymentPreferences: {
      preferredMethod: PaymentMethod.MOBILE_MONEY,
      autoPay: true,
      paymentReminders: true,
      reminderDays: 2,
      lateFeeGracePeriod: 3
    },
    paymentHistory: {
      totalPaid: 176.00,
      totalSpent: 176.00,
      averagePaymentAmount: 44.00,
      lastPaymentDate: '2024-02-01T08:15:00Z',
      paymentFrequency: 'daily',
      onTimePaymentRate: 98.9,
      latePaymentCount: 1,
      failedPaymentCount: 1
    },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-03T16:15:00Z',
    lastModified: '2024-02-03T16:15:00Z'
  },
  {
    id: 'cpp-005',
    customerId: 'cust-005',
    customerName: 'Kojo Mensah',
    customerEmail: 'kojo.mensah@university.edu',
    customerPhone: '+233 23 456 7890',
    paymentType: PaymentType.POSTPAID,
    creditLimit: 10000.00,
    outstandingBalance: 0.00,
    availableCredit: 10000.00,
    paymentMethods: [
      {
        id: 'pm-006',
        type: PaymentMethod.CREDIT_CARD,
        provider: PaymentProvider.VISA,
        identifier: '****-****-****-1234',
        isDefault: true,
        isActive: true,
        expiresAt: '2025-12-31T00:00:00Z',
        metadata: {
          cardType: 'Visa',
          cardBrand: 'Visa',
          lastFour: '1234',
          expiryMonth: '12',
          expiryYear: '2025'
        },
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-02-02T09:30:00Z'
      }
    ],
    billingAddress: {
      street: '321 University Road',
      city: 'Legon',
      region: 'Greater Accra',
      postalCode: '00233',
      country: 'Ghana',
      isDefault: true
    },
    paymentPreferences: {
      preferredMethod: PaymentMethod.CREDIT_CARD,
      autoPay: true,
      paymentReminders: true,
      reminderDays: 3,
      lateFeeGracePeriod: 10
    },
    paymentHistory: {
      totalPaid: 225.00,
      totalSpent: 225.00,
      averagePaymentAmount: 225.00,
      lastPaymentDate: '2024-02-02T09:32:00Z',
      paymentFrequency: 'one_time',
      onTimePaymentRate: 100.0,
      latePaymentCount: 0,
      failedPaymentCount: 0
    },
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-02-03T12:00:00Z',
    lastModified: '2024-02-03T12:00:00Z'
  }
]

/**
 * Mock Payment Confirmations
 * Sample manual payment confirmations
 */
export const mockPaymentConfirmations: PaymentConfirmation[] = [
  {
    id: 'conf-001',
    transactionId: 'TXN-DEF456-ABC',
    orderId: 'ord-002',
    orderNumber: 'ORD-2024-002',
    customerId: 'cust-002',
    customerName: 'Ama Owusu',
    amount: 125.00,
    currency: 'GHS',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    paymentProvider: PaymentProvider.GHANA_COMMERCIAL_BANK,
    referenceNumber: 'GCB-987654321',
    receiptNumber: 'R-2024-002',
    confirmedBy: 'admin-001',
    confirmedAt: '2024-02-03T15:30:00Z',
    confirmationNotes: 'Bank transfer confirmed. Transaction ID: GCB-987654321',
    evidence: {
      receiptImage: '/images/receipts/receipt-002.jpg',
      transactionScreenshot: '/images/screenshots/transfer-002.png',
      bankStatement: '/images/statements/statement-002.pdf'
    },
    verificationStatus: 'verified',
    verifiedBy: 'admin-001',
    verifiedAt: '2024-02-03T15:35:00Z',
    verificationNotes: 'Transaction verified with bank statement',
    createdAt: '2024-02-03T15:30:00Z',
    updatedAt: '2024-02-03T15:35:00Z'
  },
  {
    id: 'conf-002',
    transactionId: 'TXN-STU901-PQR',
    orderId: 'ord-007',
    orderNumber: 'ORD-2024-007',
    customerId: 'cust-007',
    customerName: 'Kofi Annan',
    amount: 156.00,
    currency: 'GHS',
    paymentMethod: PaymentMethod.CHECK,
    paymentProvider: PaymentProvider.GHANA_COMMERCIAL_BANK,
    referenceNumber: 'CHECK-333444555',
    confirmedBy: 'admin-001',
    confirmedAt: '2024-02-03T21:00:00Z',
    confirmationNotes: 'Check payment submitted for verification',
    evidence: {
      receiptImage: '/images/receipts/check-002.jpg',
      otherDocuments: ['/images/checks/check-002-front.jpg', '/images/checks/check-002-back.jpg']
    },
    verificationStatus: 'pending',
    createdAt: '2024-02-03T21:00:00Z',
    updatedAt: '2024-02-03T21:00:00Z'
  },
  {
    id: 'conf-003',
    transactionId: 'TXN-VWX234-STU',
    orderId: 'ord-008',
    orderNumber: 'ORD-2024-008',
    customerId: 'cust-008',
    customerName: 'Esther Osei',
    amount: 95.00,
    currency: 'GHS',
    paymentMethod: PaymentMethod.CASH,
    paymentProvider: PaymentProvider.GHANA_COMMERCIAL_BANK,
    referenceNumber: 'CASH-002',
    receiptNumber: 'R-2024-003',
    confirmedBy: 'driver-002',
    confirmedAt: '2024-02-03T22:15:00Z',
    confirmationNotes: 'Cash payment collected at delivery',
    evidence: {
      receiptImage: '/images/receipts/cash-002.jpg'
    },
    verificationStatus: 'verified',
    verifiedBy: 'admin-001',
    verifiedAt: '2024-02-03T22:20:00Z',
    verificationNotes: 'Cash payment verified with receipt',
    createdAt: '2024-02-03T22:15:00Z',
    updatedAt: '2024-02-03T22:20:00Z'
  }
]

// Example usage
export const getPaymentsByStatus = (status: PaymentStatus): PaymentTransaction[] => {
  return mockPaymentTransactions.filter(payment => payment.status === status)
}

export const getPaymentsByMethod = (method: PaymentMethod): PaymentTransaction[] => {
  return mockPaymentTransactions.filter(payment => payment.paymentMethod === method)
}

export const getPaymentsByType = (type: PaymentType): PaymentTransaction[] => {
  return mockPaymentTransactions.filter(payment => payment.paymentType === type)
}

export const getPaymentsByCustomer = (customerId: string): PaymentTransaction[] => {
  return mockPaymentTransactions.filter(payment => payment.customerId === customerId)
}

export const getPaymentById = (id: string): PaymentTransaction | null => {
  return mockPaymentTransactions.find(payment => payment.id === id) || null
}

export const searchPayments = (query: string): PaymentTransaction[] => {
  const lowerQuery = query.toLowerCase()
  return mockPaymentTransactions.filter(payment => 
    payment.customerName.toLowerCase().includes(lowerQuery) ||
    payment.customerEmail.toLowerCase().includes(lowerQuery) ||
    payment.customerPhone.toLowerCase().includes(lowerQuery) ||
    payment.transactionId.toLowerCase().includes(lowerQuery) ||
    payment.orderNumber.toLowerCase().includes(lowerQuery) ||
    payment.referenceNumber?.toLowerCase().includes(lowerQuery)
  )
}

export const getPaidPayments = (): PaymentTransaction[] => {
  return mockPaymentTransactions.filter(payment => payment.status === PaymentStatus.COMPLETED)
}

export const getUnpaidPayments = (): PaymentTransaction[] => {
  return mockPaymentTransactions.filter(payment => 
    payment.status === PaymentStatus.PENDING || 
    payment.status === PaymentStatus.PROCESSING ||
    payment.status === PaymentStatus.FAILED
  )
}

export const getPostpaidCustomers = (): CustomerPaymentProfile[] => {
  return mockCustomerPaymentProfiles.filter(profile => profile.paymentType === PaymentType.POSTPAID)
}

export const getCustomerPaymentProfile = (customerId: string): CustomerPaymentProfile | null => {
  return mockCustomerPaymentProfiles.find(profile => profile.customerId === customerId) || null
}

export default mockPaymentTransactions
