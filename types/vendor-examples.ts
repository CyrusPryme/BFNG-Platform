import { Vendor, VendorStatus, VendorCategory } from './vendor'

/**
 * Mock Vendor Examples
 * Sample vendors demonstrating the complete vendor data model
 */

export const mockVendors: Vendor[] = [
  {
    id: 'vend-001',
    vendorCode: 'FRESH-001',
    contact: {
      firstName: 'Kwame',
      lastName: 'Asante',
      email: 'kwame.asante@freshghana.com',
      phone: '+233 24 123 4567',
      secondaryPhone: '+233 50 123 4567',
      address: {
        street: '123 Market Street',
        city: 'Accra',
        region: 'Greater Accra',
        postalCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 5.6037,
          longitude: -0.1870
        }
      }
    },
    business: {
      businessName: 'Fresh Ghana Produce',
      businessType: 'company',
      registrationNumber: 'GH-2024-001',
      taxId: 'TIN-123456789',
      website: 'https://freshghana.com',
      description: 'Leading supplier of fresh fruits and vegetables from local farms across Ghana',
      establishedYear: 2015,
      numberOfEmployees: 25,
      annualRevenue: 2500000
    },
    banking: {
      bankName: 'Ghana Commercial Bank',
      accountName: 'Fresh Ghana Produce Ltd',
      accountNumber: '1234567890',
      branchCode: '001',
      routingNumber: 'GH001',
      mobileMoney: {
        provider: 'MTN Mobile Money',
        number: '+233 24 123 4567',
        name: 'Kwame Asante'
      }
    },
    performance: {
      totalOrders: 1250,
      totalRevenue: 2500000,
      averageOrderValue: 2000,
      onTimeDeliveryRate: 95.5,
      qualityScore: 92.3,
      customerRating: 4.8,
      lastOrderDate: '2024-02-03T10:30:00Z',
      averageDeliveryTime: 2.5,
      returnRate: 1.2,
      complaintRate: 0.8
    },
    compliance: {
      certifications: ['HACCP', 'ISO 22000', 'Ghana Standards Authority'],
      licenses: ['Food Business License', 'Export License'],
      insurance: {
        liability: true,
        expiryDate: '2024-12-31',
        provider: 'Ghana Insurance Company'
      },
      foodSafety: {
        certified: true,
        expiryDate: '2024-06-30',
        authority: 'Food and Drugs Authority'
      },
      organic: {
        certified: true,
        expiryDate: '2024-09-30',
        authority: 'Organic Certification Ghana'
      },
      fairTrade: {
        certified: false
      }
    },
    products: {
      categories: [VendorCategory.PRODUCE],
      productTypes: ['Tomatoes', 'Onions', 'Peppers', 'Leafy Greens', 'Fruits'],
      specialties: ['Organic Vegetables', 'Seasonal Fruits'],
      capacity: {
        dailyCapacity: 5000,
        weeklyCapacity: 35000,
        unit: 'kg'
      },
      pricing: {
        wholesale: true,
        retail: false,
        minimumOrder: 100,
        deliveryRadius: 50
      }
    },
    status: VendorStatus.ACTIVE,
    commissionRate: 8.5,
    paymentTerms: {
      method: 'bank_transfer',
      frequency: 'weekly',
      netDays: 7
    },
    notes: 'Premium quality produce supplier with excellent track record',
    tags: ['organic', 'reliable', 'premium', 'local'],
    assignedProducts: ['prod-001', 'prod-002', 'prod-003'],
    preferredDeliveryDays: ['monday', 'wednesday', 'friday'],
    deliverySchedule: {
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: false,
      sunday: false
    },
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-02-03T10:30:00Z',
    lastModified: '2024-02-03T10:30:00Z',
    createdBy: 'admin-001',
    modifiedBy: 'admin-001'
  },
  {
    id: 'vend-002',
    vendorCode: 'DAIRY-002',
    contact: {
      firstName: 'Ama',
      lastName: 'Owusu',
      email: 'ama.owusu@ghanadairy.com',
      phone: '+233 27 987 6543',
      address: {
        street: '456 Dairy Road',
        city: 'Kumasi',
        region: 'Ashanti',
        postalCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 6.6881,
          longitude: -1.6244
        }
      }
    },
    business: {
      businessName: 'Ghana Dairy Cooperative',
      businessType: 'cooperative',
      registrationNumber: 'COOP-2024-002',
      taxId: 'TIN-987654321',
      website: 'https://ghanadairy.com',
      description: 'Cooperative of local dairy farmers providing fresh milk and dairy products',
      establishedYear: 2018,
      numberOfEmployees: 15,
      annualRevenue: 800000
    },
    banking: {
      bankName: 'Agricultural Development Bank',
      accountName: 'Ghana Dairy Cooperative',
      accountNumber: '0987654321',
      branchCode: '002',
      mobileMoney: {
        provider: 'Vodafone Cash',
        number: '+233 27 987 6543',
        name: 'Ama Owusu'
      }
    },
    performance: {
      totalOrders: 450,
      totalRevenue: 800000,
      averageOrderValue: 1778,
      onTimeDeliveryRate: 88.2,
      qualityScore: 85.7,
      customerRating: 4.5,
      lastOrderDate: '2024-02-02T14:15:00Z',
      averageDeliveryTime: 3.2,
      returnRate: 2.5,
      complaintRate: 1.5
    },
    compliance: {
      certifications: ['HACCP', 'Ghana Standards Authority'],
      licenses: ['Dairy Processing License'],
      insurance: {
        liability: true,
        expiryDate: '2024-11-30',
        provider: 'Agricultural Insurance'
      },
      foodSafety: {
        certified: true,
        expiryDate: '2024-08-31',
        authority: 'Food and Drugs Authority'
      },
      organic: {
        certified: false
      },
      fairTrade: {
        certified: true,
        expiryDate: '2024-07-31',
        authority: 'Fair Trade Ghana'
      }
    },
    products: {
      categories: [VendorCategory.DAIRY],
      productTypes: ['Fresh Milk', 'Yogurt', 'Cheese', 'Butter', 'Ice Cream'],
      specialties: ['Organic Milk', 'Artisanal Cheese'],
      capacity: {
        dailyCapacity: 1000,
        weeklyCapacity: 7000,
        unit: 'liters'
      },
      pricing: {
        wholesale: true,
        retail: true,
        minimumOrder: 50,
        deliveryRadius: 75
      }
    },
    status: VendorStatus.ACTIVE,
    commissionRate: 12.0,
    paymentTerms: {
      method: 'mobile_money',
      frequency: 'bi_weekly',
      netDays: 3
    },
    notes: 'Reliable dairy supplier with fair trade certification',
    tags: ['cooperative', 'fair-trade', 'dairy', 'local'],
    assignedProducts: ['prod-004', 'prod-005', 'prod-006'],
    preferredDeliveryDays: ['tuesday', 'thursday', 'saturday'],
    deliverySchedule: {
      monday: false,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: false,
      saturday: true,
      sunday: false
    },
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-02-02T14:15:00Z',
    lastModified: '2024-02-02T14:15:00Z',
    createdBy: 'admin-001',
    modifiedBy: 'admin-001'
  },
  {
    id: 'vend-003',
    vendorCode: 'MEAT-003',
    contact: {
      firstName: 'Kojo',
      lastName: 'Mensah',
      email: 'kojo.mensah@premiummeats.com',
      phone: '+233 23 456 7890',
      address: {
        street: '789 Butcher Street',
        city: 'Tema',
        region: 'Greater Accra',
        postalCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 5.6678,
          longitude: -0.0165
        }
      }
    },
    business: {
      businessName: 'Premium Meats Ghana',
      businessType: 'company',
      registrationNumber: 'GH-2024-003',
      taxId: 'TIN-555666777',
      description: 'Premium quality meat and poultry supplier with halal certification',
      establishedYear: 2012,
      numberOfEmployees: 35,
      annualRevenue: 3200000
    },
    banking: {
      bankName: 'Ecobank Ghana',
      accountName: 'Premium Meats Ghana Ltd',
      accountNumber: '555666777',
      branchCode: '003',
      mobileMoney: {
        provider: 'AirtelTigo Money',
        number: '+233 23 456 7890',
        name: 'Kojo Mensah'
      }
    },
    performance: {
      totalOrders: 890,
      totalRevenue: 3200000,
      averageOrderValue: 3596,
      onTimeDeliveryRate: 91.8,
      qualityScore: 94.2,
      customerRating: 4.7,
      lastOrderDate: '2024-02-03T09:45:00Z',
      averageDeliveryTime: 1.8,
      returnRate: 0.5,
      complaintRate: 0.3
    },
    compliance: {
      certifications: ['HACCP', 'ISO 22000', 'Halal Certification', 'Ghana Standards Authority'],
      licenses: ['Meat Processing License', 'Halal Certificate'],
      insurance: {
        liability: true,
        expiryDate: '2024-10-31',
        provider: 'Premium Insurance'
      },
      foodSafety: {
        certified: true,
        expiryDate: '2024-07-15',
        authority: 'Food and Drugs Authority'
      },
      organic: {
        certified: false
      },
      fairTrade: {
        certified: false
      }
    },
    products: {
      categories: [VendorCategory.MEAT],
      productTypes: ['Beef', 'Chicken', 'Pork', 'Lamb', 'Turkey', 'Fish'],
      specialties: ['Halal Meats', 'Grass-fed Beef', 'Free-range Chicken'],
      capacity: {
        dailyCapacity: 2000,
        weeklyCapacity: 14000,
        unit: 'kg'
      },
      pricing: {
        wholesale: true,
        retail: true,
        minimumOrder: 25,
        deliveryRadius: 60
      }
    },
    status: VendorStatus.ACTIVE,
    commissionRate: 15.0,
    paymentTerms: {
      method: 'bank_transfer',
      frequency: 'weekly',
      netDays: 5
    },
    notes: 'High-quality meat supplier with halal certification',
    tags: ['halal', 'premium', 'meat', 'reliable'],
    assignedProducts: ['prod-007', 'prod-008', 'prod-009'],
    preferredDeliveryDays: ['monday', 'wednesday', 'friday'],
    deliverySchedule: {
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: false,
      sunday: false
    },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-02-03T09:45:00Z',
    lastModified: '2024-02-03T09:45:00Z',
    createdBy: 'admin-001',
    modifiedBy: 'admin-001'
  },
  {
    id: 'vend-004',
    vendorCode: 'GRAIN-004',
    contact: {
      firstName: 'Yaa',
      lastName: 'Nyarko',
      email: 'yaa.nyarko@ghanagrains.com',
      phone: '+233 20 111 2222',
      address: {
        street: '321 Grain Market',
        city: 'Tamale',
        region: 'Northern',
        postalCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 9.4008,
          longitude: -0.8393
        }
      }
    },
    business: {
      businessName: 'Northern Grains Association',
      businessType: 'cooperative',
      registrationNumber: 'COOP-2024-004',
      taxId: 'TIN-333444555',
      description: 'Large cooperative of farmers supplying rice, maize, and other grains',
      establishedYear: 2010,
      numberOfEmployees: 50,
      annualRevenue: 1500000
    },
    banking: {
      bankName: 'Bank of Africa Ghana',
      accountName: 'Northern Grains Association',
      accountNumber: '333444555',
      branchCode: '004',
      mobileMoney: {
        provider: 'MTN Mobile Money',
        number: '+233 20 111 2222',
        name: 'Yaa Nyarko'
      }
    },
    performance: {
      totalOrders: 320,
      totalRevenue: 1500000,
      averageOrderValue: 4688,
      onTimeDeliveryRate: 85.5,
      qualityScore: 88.9,
      customerRating: 4.3,
      lastOrderDate: '2024-02-01T11:20:00Z',
      averageDeliveryTime: 4.5,
      returnRate: 3.2,
      complaintRate: 2.1
    },
    compliance: {
      certifications: ['Ghana Standards Authority'],
      licenses: ['Grain Trading License'],
      insurance: {
        liability: true,
        expiryDate: '2024-09-30',
        provider: 'Cooperative Insurance'
      },
      foodSafety: {
        certified: true,
        expiryDate: '2024-06-30',
        authority: 'Food and Drugs Authority'
      },
      organic: {
        certified: false
      },
      fairTrade: {
        certified: true,
        expiryDate: '2024-08-31',
        authority: 'Fair Trade Ghana'
      }
    },
    products: {
      categories: [VendorCategory.GRAINS],
      productTypes: ['Rice', 'Maize', 'Millet', 'Sorghum', 'Beans'],
      specialties: ['Local Rice', 'Organic Maize', 'Traditional Grains'],
      capacity: {
        dailyCapacity: 10000,
        weeklyCapacity: 70000,
        unit: 'kg'
      },
      pricing: {
        wholesale: true,
        retail: false,
        minimumOrder: 500,
        deliveryRadius: 100
      }
    },
    status: VendorStatus.PENDING,
    commissionRate: 7.5,
    paymentTerms: {
      method: 'bank_transfer',
      frequency: 'monthly',
      netDays: 14
    },
    notes: 'Large grain cooperative pending approval',
    tags: ['cooperative', 'grains', 'bulk', 'northern'],
    assignedProducts: ['prod-010', 'prod-011', 'prod-012'],
    preferredDeliveryDays: ['tuesday', 'friday'],
    deliverySchedule: {
      monday: false,
      tuesday: true,
      wednesday: false,
      thursday: false,
      friday: true,
      saturday: false,
      sunday: false
    },
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-01T08:00:00Z',
    lastModified: '2024-02-01T08:00:00Z',
    createdBy: 'admin-001',
    modifiedBy: 'admin-001'
  },
  {
    id: 'vend-005',
    vendorCode: 'PACK-005',
    contact: {
      firstName: 'Peter',
      lastName: 'Addo',
      email: 'peter.addo@packagedghana.com',
      phone: '+233 26 333 4444',
      address: {
        street: '567 Industrial Area',
        city: 'Tema',
        region: 'Greater Accra',
        postalCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 5.6678,
          longitude: -0.0165
        }
      }
    },
    business: {
      businessName: 'Packaged Goods Ghana Ltd',
      businessType: 'company',
      registrationNumber: 'GH-2024-005',
      taxId: 'TIN-777888999',
      description: 'Manufacturer and distributor of packaged food products',
      establishedYear: 2016,
      numberOfEmployees: 40,
      annualRevenue: 4500000
    },
    banking: {
      bankName: 'Standard Chartered Ghana',
      accountName: 'Packaged Goods Ghana Ltd',
      accountNumber: '777888999',
      branchCode: '005',
      mobileMoney: {
        provider: 'MTN Mobile Money',
        number: '+233 26 333 4444',
        name: 'Peter Addo'
      }
    },
    performance: {
      totalOrders: 2100,
      totalRevenue: 4500000,
      averageOrderValue: 2143,
      onTimeDeliveryRate: 93.2,
      qualityScore: 90.5,
      customerRating: 4.6,
      lastOrderDate: '2024-02-03T12:00:00Z',
      averageDeliveryTime: 2.1,
      returnRate: 1.8,
      complaintRate: 1.2
    },
    compliance: {
      certifications: ['ISO 9001', 'HACCP', 'Ghana Standards Authority'],
      licenses: ['Food Manufacturing License', 'Export License'],
      insurance: {
        liability: true,
        expiryDate: '2024-12-15',
        provider: 'Industrial Insurance'
      },
      foodSafety: {
        certified: true,
        expiryDate: '2024-09-30',
        authority: 'Food and Drugs Authority'
      },
      organic: {
        certified: false
      },
      fairTrade: {
        certified: false
      }
    },
    products: {
      categories: [VendorCategory.PACKAGED],
      productTypes: ['Canned Goods', 'Snacks', 'Beverages', 'Condiments', 'Flour'],
      specialties: ['Local Snacks', 'Traditional Foods', 'Imported Goods'],
      capacity: {
        dailyCapacity: 15000,
        weeklyCapacity: 105000,
        unit: 'units'
      },
      pricing: {
        wholesale: true,
        retail: true,
        minimumOrder: 100,
        deliveryRadius: 80
      }
    },
    status: VendorStatus.SUSPENDED,
    commissionRate: 10.0,
    paymentTerms: {
      method: 'bank_transfer',
      frequency: 'weekly',
      netDays: 7
    },
    notes: 'Temporarily suspended due to quality issues',
    tags: ['packaged', 'manufacturer', 'suspended'],
    assignedProducts: ['prod-013', 'prod-014', 'prod-015'],
    preferredDeliveryDays: ['monday', 'wednesday', 'friday'],
    deliverySchedule: {
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: false,
      sunday: false
    },
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-25T15:30:00Z',
    lastModified: '2024-01-25T15:30:00Z',
    createdBy: 'admin-001',
    modifiedBy: 'admin-001'
  }
]

// Example usage
export const getVendorsByStatus = (status: VendorStatus): Vendor[] => {
  return mockVendors.filter(vendor => vendor.status === status)
}

export const getVendorsByCategory = (category: VendorCategory): Vendor[] => {
  return mockVendors.filter(vendor => vendor.products.categories.includes(category))
}

export const getActiveVendors = (): Vendor[] => {
  return mockVendors.filter(vendor => vendor.status === VendorStatus.ACTIVE)
}

export const getVendorById = (id: string): Vendor | null => {
  return mockVendors.find(vendor => vendor.id === id) || null
}

export const getVendorsByCommissionRange = (min: number, max: number): Vendor[] => {
  return mockVendors.filter(vendor => vendor.commissionRate >= min && vendor.commissionRate <= max)
}

export const searchVendors = (query: string): Vendor[] => {
  const lowerQuery = query.toLowerCase()
  return mockVendors.filter(vendor => 
    vendor.business.businessName.toLowerCase().includes(lowerQuery) ||
    vendor.contact.firstName.toLowerCase().includes(lowerQuery) ||
    vendor.contact.lastName.toLowerCase().includes(lowerQuery) ||
    vendor.contact.email.toLowerCase().includes(lowerQuery) ||
    vendor.vendorCode.toLowerCase().includes(lowerQuery)
  )
}

export default mockVendors
