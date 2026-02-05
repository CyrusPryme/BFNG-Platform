import { Subscription, SubscriptionStatus, SubscriptionFrequency } from './subscription'

/**
 * Mock Subscription Examples
 * Sample subscriptions demonstrating the complete subscription model
 */

export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-001',
    subscriptionNumber: 'SUB-ABC123-XYZ',
    customer: {
      id: 'cust-001',
      firstName: 'Kwame',
      lastName: 'Asante',
      email: 'kwame.asante@email.com',
      phone: '+233 24 123 4567',
      secondaryPhone: '+233 50 123 4567',
      customerType: 'individual',
      businessName: undefined,
      businessType: undefined,
      registrationNumber: undefined
    },
    items: [
      {
        id: 'item-001',
        productId: 'prod-001',
        productName: 'Organic Tomatoes',
        productSku: 'FG-ORG-TOM-001',
        quantity: 2,
        unit: 'kg',
        unitPrice: 8.50,
        totalPrice: 17.00,
        isSubstitutable: true,
        substitutionRules: {
          alternativeProductIds: ['alt-001', 'alt-002'],
          preference: 'similar',
          autoApprove: false,
          maxPriceDifference: 20
        },
        specialInstructions: 'Prefer ripe tomatoes for salads',
        lastModified: '2024-02-03T08:30:00Z'
      },
      {
        id: 'item-002',
        productId: 'prod-002',
        productName: 'Fresh Lettuce',
        productSku: 'FG-FRESH-LET-002',
        quantity: 1,
        unit: 'head',
        unitPrice: 12.00,
        totalPrice: 12.00,
        isSubstitutable: true,
        substitutionRules: {
          alternativeProductIds: ['alt-003'],
          preference: 'similar',
          autoApprove: true,
          maxPriceDifference: 15
        },
        lastModified: '2024-02-03T08:30:00Z'
      }
    ],
    schedule: {
      frequency: SubscriptionFrequency.WEEKLY,
      deliveryDays: ['Wednesday', 'Saturday'],
      deliveryTime: {
        start: '09:00',
        end: '12:00'
      },
      preferredDeliveryWindow: 'Morning (9AM - 12PM)',
      nextDeliveryDate: '2024-02-07T09:00:00Z',
      deliveryAddress: {
        street: '123 Market Street',
        city: 'Accra',
        region: 'Greater Accra',
        postalCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 5.6037,
          longitude: -0.1870
        },
        specialInstructions: 'Ring doorbell, leave at front door if no answer'
      },
      deliveryFee: 5.00,
      minimumOrderValue: 20.00
    },
    pricing: {
      basePrice: 29.00,
      currency: 'GHS',
      discountType: 'percentage',
      discountValue: 10,
      deliveryFee: 5.00,
      taxRate: 12.5,
      totalAmount: 34.00,
      billingCycle: 'weekly',
      paymentMethod: 'mobile_money',
      autoRenewal: true
    },
    status: SubscriptionStatus.ACTIVE,
    startDate: '2024-01-15T00:00:00Z',
    trialEndDate: undefined,
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-02-03T08:30:00Z',
    lastModified: '2024-02-03T08:30:00Z',
    createdBy: 'admin-001',
    modifiedBy: 'admin-001',
    lastOrderDate: '2024-01-31T09:15:00Z',
    nextOrderDate: '2024-02-07T09:00:00Z',
    totalOrders: 8,
    skippedOrders: 0,
    cancelledOrders: 0,
    autoRenewal: true,
    skipNextDelivery: false,
    paymentMethod: 'Mobile Money',
    paymentStatus: 'paid',
    lastPaymentDate: '2024-01-31T09:15:00Z',
    nextPaymentDate: '2024-02-07T09:00:00Z',
    outstandingBalance: 0,
    dietaryRestrictions: ['No peanuts', 'Low sodium'],
    preferences: {
      packaging: 'reusable',
      communication: 'whatsapp',
      substitutions: 'manual_approval',
      deliveryInstructions: 'Please call before delivery'
    },
    averageOrderValue: 34.00,
    totalRevenue: 272.00,
    customerSatisfactionScore: 4.8,
    retentionScore: 95,
    tags: ['organic', 'vegetables', 'regular', 'premium'],
    notes: 'Customer prefers organic products, very satisfied with service',
    source: 'website',
    referralCode: undefined
  },
  {
    id: 'sub-002',
    subscriptionNumber: 'SUB-DEF456-ABC',
    customer: {
      id: 'cust-002',
      firstName: 'Ama',
      lastName: 'Owusu',
      email: 'ama.owusu@company.com',
      phone: '+233 27 987 6543',
      secondaryPhone: undefined,
      customerType: 'business',
      businessName: 'Owusu Enterprises',
      businessType: 'Restaurant',
      registrationNumber: 'BN-2024-001'
    },
    items: [
      {
        id: 'item-003',
        productId: 'prod-003',
        productName: 'Fresh Whole Milk',
        productSku: 'GD-FRESH-MILK-003',
        quantity: 10,
        unit: 'liter',
        unitPrice: 12.00,
        totalPrice: 120.00,
        isSubstitutable: false,
        specialInstructions: 'Must be fresh milk, no alternatives',
        lastModified: '2024-02-01T10:15:00Z'
      },
      {
        id: 'item-004',
        productId: 'prod-004',
        productName: 'Local Rice',
        productSku: 'NG-LOCAL-RICE-004',
        quantity: 25,
        unit: 'kg',
        unitPrice: 25.00,
        totalPrice: 625.00,
        isSubstitutable: true,
        substitutionRules: {
          alternativeProductIds: ['alt-004', 'alt-005'],
          preference: 'similar',
          autoApprove: true,
          maxPriceDifference: 10
        },
        lastModified: '2024-02-01T10:15:00Z'
      }
    ],
    schedule: {
      frequency: SubscriptionFrequency.BI_WEEKLY,
      deliveryDays: ['Monday', 'Thursday'],
      deliveryTime: {
        start: '07:00',
        end: '09:00'
      },
      preferredDeliveryWindow: 'Early Morning (7AM - 9AM)',
      nextDeliveryDate: '2024-02-08T07:00:00Z',
      deliveryAddress: {
        street: '456 Business Avenue',
        city: 'Kumasi',
        region: 'Ashanti',
        postalCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 6.6881,
          longitude: -1.6244
        },
        specialInstructions: 'Deliver to kitchen entrance, call upon arrival'
      },
      deliveryFee: 15.00,
      minimumOrderValue: 500.00
    },
    pricing: {
      basePrice: 745.00,
      currency: 'GHS',
      discountType: 'fixed',
      discountValue: 25.00,
      deliveryFee: 15.00,
      taxRate: 12.5,
      totalAmount: 735.00,
      billingCycle: 'bi_weekly',
      paymentMethod: 'bank_transfer',
      autoRenewal: true
    },
    status: SubscriptionStatus.ACTIVE,
    startDate: '2024-01-10T00:00:00Z',
    trialEndDate: undefined,
    createdAt: '2024-01-10T10:15:00Z',
    updatedAt: '2024-02-01T10:15:00Z',
    lastModified: '2024-02-01T10:15:00Z',
    createdBy: 'admin-001',
    modifiedBy: 'admin-001',
    lastOrderDate: '2024-01-25T07:30:00Z',
    nextOrderDate: '2024-02-08T07:00:00Z',
    totalOrders: 4,
    skippedOrders: 0,
    cancelledOrders: 0,
    autoRenewal: true,
    skipNextDelivery: false,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'paid',
    lastPaymentDate: '2024-01-25T07:30:00Z',
    nextPaymentDate: '2024-02-08T07:00:00Z',
    outstandingBalance: 0,
    dietaryRestrictions: [],
    preferences: {
      packaging: 'reusable',
      communication: 'email',
      substitutions: 'auto_approve',
      deliveryInstructions: 'Early morning delivery preferred'
    },
    averageOrderValue: 735.00,
    totalRevenue: 2940.00,
    customerSatisfactionScore: 4.5,
    retentionScore: 88,
    tags: ['business', 'restaurant', 'bulk', 'bi-weekly'],
    notes: 'Business customer, requires consistent quality and timely delivery',
    source: 'phone',
    referralCode: 'REST-2024'
  },
  {
    id: 'sub-003',
    subscriptionNumber: 'SUB-GHI789-DEF',
    customer: {
      id: 'cust-003',
      firstName: 'Yaa',
      lastName: 'Nyarko',
      email: 'yaa.nyarko@email.com',
      phone: '+233 20 111 2222',
      secondaryPhone: undefined,
      customerType: 'family',
      businessName: undefined,
      businessType: undefined,
      registrationNumber: undefined
    },
    items: [
      {
        id: 'item-005',
        productId: 'prod-005',
        productName: 'Traditional Snack Mix',
        productSku: 'GT-TRAD-SNACK-005',
        quantity: 3,
        unit: 'pack',
        unitPrice: 15.00,
        totalPrice: 45.00,
        isSubstitutable: true,
        substitutionRules: {
          alternativeProductIds: ['alt-006'],
          preference: 'similar',
          autoApprove: true,
          maxPriceDifference: 20
        },
        lastModified: '2024-02-03T07:30:00Z'
      },
      {
        id: 'item-006',
        productId: 'prod-006',
        productName: 'Organic Honey',
        productSku: 'GH-ORG-HON-006',
        quantity: 2,
        unit: 'bottle',
        unitPrice: 35.00,
        totalPrice: 70.00,
        isSubstitutable: false,
        specialInstructions: 'Must be organic, no substitutes',
        lastModified: '2024-02-03T07:30:00Z'
      }
    ],
    schedule: {
      frequency: SubscriptionFrequency.MONTHLY,
      deliveryDays: ['15th'],
      deliveryTime: {
        start: '14:00',
        end: '17:00'
      },
      preferredDeliveryWindow: 'Afternoon (2PM - 5PM)',
      nextDeliveryDate: '2024-02-15T14:00:00Z',
      deliveryAddress: {
        street: '789 Family Lane',
        city: 'Tamale',
        region: 'Northern',
        postalCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 9.4008,
          longitude: -0.8393
        },
        specialInstructions: 'Leave with security if no one is home'
      },
      deliveryFee: 8.00,
      minimumOrderValue: 50.00
    },
    pricing: {
      basePrice: 115.00,
      currency: 'GHS',
      discountType: 'percentage',
      discountValue: 5,
      deliveryFee: 8.00,
      taxRate: 12.5,
      totalAmount: 120.00,
      billingCycle: 'monthly',
      paymentMethod: 'cash',
      autoRenewal: true
    },
    status: SubscriptionStatus.PAUSED,
    startDate: '2024-01-20T00:00:00Z',
    trialEndDate: undefined,
    createdAt: '2024-01-20T07:30:00Z',
    updatedAt: '2024-02-01T15:30:00Z',
    lastModified: '2024-02-01T15:30:00Z',
    createdBy: 'admin-001',
    modifiedBy: 'admin-001',
    lastOrderDate: '2024-01-20T14:15:00Z',
    nextOrderDate: '2024-02-15T14:00:00Z',
    totalOrders: 1,
    skippedOrders: 0,
    cancelledOrders: 0,
    autoRenewal: true,
    skipNextDelivery: false,
    pauseUntil: '2024-03-01T00:00:00Z',
    paymentMethod: 'Cash',
    paymentStatus: 'paid',
    lastPaymentDate: '2024-01-20T14:15:00Z',
    nextPaymentDate: '2024-02-15T14:00:00Z',
    outstandingBalance: 0,
    dietaryRestrictions: ['No artificial sweeteners'],
    preferences: {
      packaging: 'paper',
      communication: 'sms',
      substitutions: 'manual_approval',
      deliveryInstructions: 'Family with children, please handle with care'
    },
    averageOrderValue: 120.00,
    totalRevenue: 120.00,
    customerSatisfactionScore: 4.2,
    retentionScore: 75,
    tags: ['family', 'paused', 'organic', 'snacks'],
    notes: 'Family subscription, paused due to travel, will resume in March',
    source: 'website',
    referralCode: undefined
  },
  {
    id: 'sub-004',
    subscriptionNumber: 'SUB-JKL012-GHI',
    customer: {
      id: 'cust-004',
      firstName: 'Kojo',
      lastName: 'Mensah',
      email: 'kojo.mensah@university.edu',
      phone: '+233 23 456 7890',
      secondaryPhone: undefined,
      customerType: 'institution',
      businessName: 'University of Ghana',
      businessType: 'Educational Institution',
      registrationNumber: 'UG-2024-001'
    },
    items: [
      {
        id: 'item-007',
        productId: 'prod-007',
        productName: 'Premium Meats Package',
        productSku: 'PM-PREMIUM-MEAT-007',
        quantity: 5,
        unit: 'kg',
        unitPrice: 45.00,
        totalPrice: 225.00,
        isSubstitutable: true,
        substitutionRules: {
          alternativeProductIds: ['alt-007', 'alt-008'],
          preference: 'premium',
          autoApprove: false,
          maxPriceDifference: 15
        },
        lastModified: '2024-02-02T11:20:00Z'
      }
    ],
    schedule: {
      frequency: SubscriptionFrequency.WEEKLY,
      deliveryDays: ['Tuesday', 'Friday'],
      deliveryTime: {
        start: '10:00',
        end: '12:00'
      },
      preferredDeliveryWindow: 'Morning (10AM - 12PM)',
      nextDeliveryDate: '2024-02-06T10:00:00Z',
      deliveryAddress: {
        street: '321 University Road',
        city: 'Legon',
        region: 'Greater Accra',
        postalCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 5.6504,
          longitude: -0.1873
        },
        specialInstructions: 'Deliver to campus cafeteria, security clearance required'
      },
      deliveryFee: 20.00,
      minimumOrderValue: 200.00
    },
    pricing: {
      basePrice: 225.00,
      currency: 'GHS',
      discountType: 'percentage',
      discountValue: 15,
      deliveryFee: 20.00,
      taxRate: 12.5,
      totalAmount: 231.00,
      billingCycle: 'weekly',
      paymentMethod: 'card',
      autoRenewal: true
    },
    status: SubscriptionStatus.CANCELLED,
    startDate: '2024-01-05T00:00:00Z',
    endDate: '2024-02-01T00:00:00Z',
    trialEndDate: undefined,
    createdAt: '2024-01-05T11:20:00Z',
    updatedAt: '2024-02-01T16:45:00Z',
    lastModified: '2024-02-01T16:45:00Z',
    createdBy: 'admin-001',
    modifiedBy: 'admin-001',
    lastOrderDate: '2024-01-29T10:30:00Z',
    nextOrderDate: '2024-02-06T10:00:00Z',
    totalOrders: 4,
    skippedOrders: 0,
    cancelledOrders: 1,
    autoRenewal: false,
    skipNextDelivery: false,
    cancellationReason: 'Budget constraints',
    cancellationDate: '2024-02-01T16:45:00Z',
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    lastPaymentDate: '2024-01-29T10:30:00Z',
    nextPaymentDate: undefined,
    outstandingBalance: 0,
    dietaryRestrictions: ['Halal required'],
    preferences: {
      packaging: 'reusable',
      communication: 'email',
      substitutions: 'manual_approval',
      deliveryInstructions: 'Halal certification required for all meat products'
    },
    averageOrderValue: 231.00,
    totalRevenue: 924.00,
    customerSatisfactionScore: 3.8,
    retentionScore: 45,
    tags: ['institution', 'cancelled', 'university', 'meat'],
    notes: 'Institutional subscription cancelled due to budget constraints',
    source: 'in_person',
    referralCode: undefined
  },
  {
    id: 'sub-005',
    subscriptionNumber: 'SUB-MNO345-JKL',
    customer: {
      id: 'cust-005',
      firstName: 'Peter',
      lastName: 'Addo',
      email: 'peter.addo@email.com',
      phone: '+233 26 333 4444',
      secondaryPhone: '+233 50 555 6666',
      customerType: 'individual',
      businessName: undefined,
      businessType: undefined,
      registrationNumber: undefined
    },
    items: [
      {
        id: 'item-008',
        productId: 'prod-008',
        productName: 'Fresh Vegetables Box',
        productSku: 'FG-FRESH-VEG-008',
        quantity: 1,
        unit: 'box',
        unitPrice: 85.00,
        totalPrice: 85.00,
        isSubstitutable: true,
        substitutionRules: {
          alternativeProductIds: ['alt-009', 'alt-010'],
          preference: 'similar',
          autoApprove: true,
          maxPriceDifference: 25
        },
        specialInstructions: 'Mix of seasonal vegetables',
        lastModified: '2024-02-03T09:00:00Z'
      }
    ],
    schedule: {
      frequency: SubscriptionFrequency.DAILY,
      deliveryDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      deliveryTime: {
        start: '08:00',
        end: '10:00'
      },
      preferredDeliveryWindow: 'Early Morning (8AM - 10AM)',
      nextDeliveryDate: '2024-02-04T08:00:00Z',
      deliveryAddress: {
        street: '567 Residential Street',
        city: 'Tema',
        region: 'Greater Accra',
        postalCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 5.6678,
          longitude: -0.0165
        },
        specialInstructions: 'Leave at door, no need to ring bell'
      },
      deliveryFee: 3.00,
      minimumOrderValue: 50.00
    },
    pricing: {
      basePrice: 85.00,
      currency: 'GHS',
      discountType: 'tiered',
      discountValue: 5,
      deliveryFee: 3.00,
      taxRate: 12.5,
      totalAmount: 88.00,
      billingCycle: 'weekly',
      paymentMethod: 'mobile_money',
      autoRenewal: true
    },
    status: SubscriptionStatus.ACTIVE,
    startDate: '2024-02-01T00:00:00Z',
    trialEndDate: '2024-02-15T00:00:00Z',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-03T09:00:00Z',
    lastModified: '2024-02-03T09:00:00Z',
    createdBy: 'admin-001',
    modifiedBy: 'admin-001',
    lastOrderDate: '2024-02-03T08:15:00Z',
    nextOrderDate: '2024-02-04T08:00:00Z',
    totalOrders: 2,
    skippedOrders: 0,
    cancelledOrders: 0,
    autoRenewal: true,
    skipNextDelivery: false,
    paymentMethod: 'Mobile Money',
    paymentStatus: 'paid',
    lastPaymentDate: '2024-02-03T08:15:00Z',
    nextPaymentDate: '2024-02-04T08:00:00Z',
    outstandingBalance: 0,
    dietaryRestrictions: ['No onions', 'No garlic'],
    preferences: {
      packaging: 'minimal',
      communication: 'whatsapp',
      substitutions: 'auto_approve',
      deliveryInstructions: 'Daily delivery for fresh vegetables'
    },
    averageOrderValue: 88.00,
    totalRevenue: 176.00,
    customerSatisfactionScore: 4.9,
    retentionScore: 98,
    tags: ['daily', 'vegetables', 'trial', 'new'],
    notes: 'New customer on trial period, very satisfied with daily deliveries',
    source: 'referral',
    referralCode: 'FRIEND-2024'
  }
]

// Example usage
export const getSubscriptionsByStatus = (status: SubscriptionStatus): Subscription[] => {
  return mockSubscriptions.filter(subscription => subscription.status === status)
}

export const getSubscriptionsByFrequency = (frequency: SubscriptionFrequency): Subscription[] => {
  return mockSubscriptions.filter(subscription => subscription.schedule.frequency === frequency)
}

export const getSubscriptionsByCustomerType = (customerType: string): Subscription[] => {
  return mockSubscriptions.filter(subscription => subscription.customer.customerType === customerType)
}

export const getSubscriptionById = (id: string): Subscription | null => {
  return mockSubscriptions.find(subscription => subscription.id === id) || null
}

export const getSubscriptionsByCustomer = (customerId: string): Subscription[] => {
  return mockSubscriptions.filter(subscription => subscription.customer.id === customerId)
}

export const searchSubscriptions = (query: string): Subscription[] => {
  const lowerQuery = query.toLowerCase()
  return mockSubscriptions.filter(subscription => 
    subscription.customer.firstName.toLowerCase().includes(lowerQuery) ||
    subscription.customer.lastName.toLowerCase().includes(lowerQuery) ||
    subscription.customer.email.toLowerCase().includes(lowerQuery) ||
    subscription.subscriptionNumber.toLowerCase().includes(lowerQuery) ||
    subscription.customer.businessName?.toLowerCase().includes(lowerQuery)
  )
}

export const getActiveSubscriptions = (): Subscription[] => {
  return mockSubscriptions.filter(subscription => subscription.status === SubscriptionStatus.ACTIVE)
}

export const getPausedSubscriptions = (): Subscription[] => {
  return mockSubscriptions.filter(subscription => subscription.status === SubscriptionStatus.PAUSED)
}

export const getCancelledSubscriptions = (): Subscription[] => {
  return mockSubscriptions.filter(subscription => subscription.status === SubscriptionStatus.CANCELLED)
}

export const getSubscriptionsWithOutstandingBalance = (): Subscription[] => {
  return mockSubscriptions.filter(subscription => subscription.outstandingBalance > 0)
}

export const getSubscriptionsByNextDeliveryDate = (date: string): Subscription[] => {
  return mockSubscriptions.filter(subscription => 
    subscription.nextOrderDate.startsWith(date.split('T')[0])
  )
}

export default mockSubscriptions
