import { Delivery, DeliveryStatus, DeliveryPriority, DriverStatus, Driver } from './delivery'

/**
 * Mock Driver Examples
 * Sample drivers for the delivery system
 */
export const mockDrivers: Driver[] = [
  {
    id: 'driver-001',
    firstName: 'Kwame',
    lastName: 'Osei',
    email: 'kwame.osei@bfng.com',
    phone: '+233 24 123 4567',
    secondaryPhone: '+233 50 123 4567',
    licenseNumber: 'DL-2024-001',
    vehicleType: 'Van',
    vehicleNumber: 'GF-1234A',
    vehicleCapacity: {
      weight: 1000,
      volume: 2.5,
      items: 50
    },
    status: DriverStatus.AVAILABLE,
    currentLocation: {
      latitude: 5.6037,
      longitude: -0.1870,
      address: 'Accra Central Market',
      lastUpdated: '2024-02-03T08:30:00Z'
    },
    rating: 4.8,
    totalDeliveries: 156,
    successfulDeliveries: 148,
    averageDeliveryTime: 45,
    specialties: ['Fresh Produce', 'Perishables', 'Time-Sensitive'],
    languages: ['English', 'Twi', 'Ga'],
    hireDate: '2023-01-15T00:00:00Z',
    lastActive: '2024-02-03T08:30:00Z',
    emergencyContact: {
      name: 'Ama Osei',
      phone: '+233 50 987 6543',
      relationship: 'Spouse'
    }
  },
  {
    id: 'driver-002',
    firstName: 'Ama',
    lastName: 'Mensah',
    email: 'ama.mensah@bfng.com',
    phone: '+233 27 987 6543',
    licenseNumber: 'DL-2024-002',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'GF-5678B',
    vehicleCapacity: {
      weight: 50,
      volume: 0.5,
      items: 20
    },
    status: DriverStatus.BUSY,
    currentLocation: {
      latitude: 5.6504,
      longitude: -0.1873,
      address: 'Legon Campus',
      lastUpdated: '2024-02-03T09:15:00Z'
    },
    rating: 4.6,
    totalDeliveries: 98,
    successfulDeliveries: 92,
    averageDeliveryTime: 35,
    specialties: ['Small Packages', 'Documents', 'Express'],
    languages: ['English', 'Twi'],
    hireDate: '2023-03-20T00:00:00Z',
    lastActive: '2024-02-03T09:15:00Z',
    emergencyContact: {
      name: 'Kojo Mensah',
      phone: '+233 23 456 7890',
      relationship: 'Brother'
    }
  },
  {
    id: 'driver-003',
    firstName: 'Peter',
    lastName: 'Addo',
    email: 'peter.addo@bfng.com',
    phone: '+233 26 333 4444',
    licenseNumber: 'DL-2024-003',
    vehicleType: 'Truck',
    vehicleNumber: 'GF-9012C',
    vehicleCapacity: {
      weight: 2000,
      volume: 8.0,
      items: 100
    },
    status: DriverStatus.AVAILABLE,
    currentLocation: {
      latitude: 5.6678,
      longitude: -0.0165,
      address: 'Tema Industrial Area',
      lastUpdated: '2024-02-03T07:45:00Z'
    },
    rating: 4.9,
    totalDeliveries: 203,
    successfulDeliveries: 198,
    averageDeliveryTime: 55,
    specialties: ['Bulk Orders', 'Heavy Items', 'Commercial'],
    languages: ['English', 'Ga', 'Ewe'],
    hireDate: '2022-11-10T00:00:00Z',
    lastActive: '2024-02-03T07:45:00Z',
    emergencyContact: {
      name: 'Yaa Addo',
      phone: '+233 50 555 6666',
      relationship: 'Wife'
    }
  },
  {
    id: 'driver-004',
    firstName: 'Yaa',
    lastName: 'Nyarko',
    email: 'yaa.nyarko@bfng.com',
    phone: '+233 20 111 2222',
    licenseNumber: 'DL-2024-004',
    vehicleType: 'Scooter',
    vehicleNumber: 'GF-3456S',
    vehicleCapacity: {
      weight: 20,
      volume: 0.2,
      items: 10
    },
    status: DriverStatus.OFFLINE,
    currentLocation: {
      latitude: 9.4008,
      longitude: -0.8393,
      address: 'Tamale Market',
      lastUpdated: '2024-02-02T18:30:00Z'
    },
    rating: 4.4,
    totalDeliveries: 67,
    successfulDelivers: 62,
    averageDeliveryTime: 25,
    specialties: ['Light Packages', 'Documents', 'Quick Delivery'],
    languages: ['English', 'Dagbani'],
    hireDate: '2023-06-15T00:00:00Z',
    lastActive: '2024-02-02T18:30:00Z',
    emergencyContact: {
      name: 'Kwame Nyarko',
      phone: '+233 20 222 3333',
      relationship: 'Father'
    }
  },
  {
    id: 'driver-005',
    firstName: 'Kojo',
    lastName: 'Mensah',
    email: 'kojo.mensah@bfng.com',
    phone: '+233 23 456 7890',
    licenseNumber: 'DL-2024-005',
    vehicleType: 'Bicycle',
    vehicleNumber: 'GF-7890B',
    vehicleCapacity: {
      weight: 15,
      volume: 0.1,
      items: 5
    },
    status: DriverStatus.ON_BREAK,
    currentLocation: {
      latitude: 6.6881,
      longitude: -1.6244,
      address: 'Kumasi Central Market',
      lastUpdated: '2024-02-03T12:00:00Z'
    },
    rating: 4.7,
    totalDeliveries: 45,
    successfulDelivers: 43,
    averageDeliveryTime: 30,
    specialties: ['Ultra-Fast Delivery', 'Small Items', 'Local'],
    languages: ['English', 'Twi'],
    hireDate: '2023-09-01T00:00:00Z',
    lastActive: '2024-02-03T12:00:00Z',
    emergencyContact: {
      name: 'Ama Mensah',
      phone: '+233 27 987 6543',
      relationship: 'Sister'
    }
  }
]

/**
 * Mock Delivery Routes
 */
export const mockDeliveryRoutes = [
  {
    id: 'route-001',
    name: 'Accra Central Route',
    description: 'Central Accra area deliveries',
    area: 'Accra Central',
    driverId: 'driver-001',
    driverName: 'Kwame Osei',
    status: 'active',
    deliveries: [],
    estimatedTime: 120,
    distance: 25,
    startLocation: {
      latitude: 5.6037,
      longitude: -0.1870,
      address: 'BFNG Warehouse, Accra'
    },
    endLocation: {
      latitude: 5.6037,
      longitude: -0.1870,
      address: 'Accra Central Market'
    },
    waypoints: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-03T08:30:00Z',
    createdBy: 'admin-001',
    modifiedBy: 'admin-001'
  },
  {
    id: 'route-002',
    'name': 'Accra North Route',
    description: 'North Accra area deliveries',
    area: 'Accra North',
    driverId: 'driver-002',
    driverName: 'Ama Mensah',
    status: 'active',
    deliveries: [],
    estimatedTime: 90,
    distance: 15,
    startLocation: {
      latitude: 5.6037,
      longitude: -0.1870,
      address: 'BFNG Warehouse, Accra'
    },
    endLocation: {
      latitude: 5.6504,
      longitude: -0.1873,
      address: 'Legon Campus'
    },
    waypoints: [
      {
        id: 'wp-001',
        latitude: 5.6270,
        longitude: -0.1872,
        address: 'Airport Residential Area',
        estimatedArrival: '2024-02-03T09:30:00Z',
        order: 1
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-03T09:15:00Z',
    createdBy: 'admin-001',
    modifiedBy: 'admin-001'
  },
  {
    id: 'route-003',
    name: 'Accra East Route',
    description: 'East Accra area deliveries',
    area: 'Accra East',
    driverId: 'driver-003',
    driverName: 'Peter Addo',
    status: 'active',
    deliveries: [],
    estimatedTime: 150,
    distance: 35,
    startLocation: {
      latitude: 5.6037,
      longitude: -0.1870,
      address: 'BFNG Warehouse, Accra'
    },
    endLocation: {
      latitude: 5.6678,
      longitude: -0.0165,
      address: 'Tema Industrial Area'
    },
    waypoints: [
      {
        id: 'wp-002',
        latitude: 5.6350,
        longitude: -0.1871,
        address: 'Labone Market',
        estimatedArrival: '2024-02-03T10:00:00Z',
        order: 1
      },
      {
        id: 'wp-003',
        latitude: 5.6450,
        longitude: -0.1872,
        address: 'Ashongman Market',
        estimatedArrival: '2024-02-03T10:30:00Z',
        order: 2
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-03T07:45:00Z',
    createdBy: 'admin-001',
    modifiedBy: 'admin-001'
  },
  {
    id: 'route-004',
    name: 'Tema Route',
    description: 'Tema industrial and residential deliveries',
    area: 'Tema',
    driverId: 'driver-004',
    driverName: 'Yaa Nyarko',
    status: 'suspended',
    deliveries: [],
    estimatedTime: 180,
    distance: 45,
    startLocation: {
      latitude: 5.6037,
      longitude: -0.1870,
      address: 'BFNG Warehouse, Accra'
    },
    endLocation: {
      latitude: 9.4008,
      longitude: -0.8393,
      address: 'Tamale Market'
    },
    waypoints: [
      {
        id: 'wp-004',
        latitude: 6.0500,
        longitude: -0.1870,
        address: 'Madina Market',
        estimatedArrival: '2024-02-03T14:00:00Z',
        order: 1
      },
      {
        id: 'wp-005',
        latitude: 7.5000,
        longitude: -0.8393,
        address: 'Kumasi City',
        estimatedArrival: '2024-02-03T16:00:00Z',
        order: 2
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-02T18:30:00Z',
    createdBy: 'admin-001',
    modifiedBy: 'admin-001'
  },
  {
    id: 'route-005',
    name: 'Northern Route',
    description: 'Northern region deliveries',
    area: 'Northern Region',
    driverId: 'driver-005',
    driverName: 'Kojo Mensah',
    status: 'active',
    deliveries: [],
    estimatedTime: 240,
    distance: 80,
    startLocation: {
      latitude: 5.6037,
      longitude: -0.1870,
      address: 'BFNG Warehouse, Accra'
    },
    endLocation: {
      latitude: 9.4008,
      longitude: -0.8393,
      address: 'Tamale Market'
    },
    waypoints: [
      {
        id: 'wp-006',
        latitude: 7.0000,
        longitude: -0.8393,
        address: 'Techiman City',
        estimatedArrival: '2024-02-03T18:00:00Z',
        order: 1
      },
      {
        id: 'wp-007',
        latitude: 8.5000,
        longitude: -0.8393,
        address: 'Bolgatanga',
        estimatedArrival: '2024-02-04T10:00:00Z',
        order: 2
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-03T12:00:00Z',
    createdBy: 'admin-001',
    modifiedBy: 'admin-001'
  }
]

/**
 * Mock Delivery Examples
 * Sample deliveries demonstrating the complete delivery model
 */
export const mockDeliveries: Delivery[] = [
  {
    id: 'del-001',
    deliveryNumber: 'DEL-ABC123-XYZ',
    orderId: 'ord-001',
    orderNumber: 'ORD-2024-001',
    customer: {
      id: 'cust-001',
      firstName: 'Kwame',
      lastName: 'Asante',
      email: 'kwame.asante@email.com',
      phone: '+233 24 123 4567',
      address: {
        street: '123 Market Street',
        city: 'Accra',
        region: 'Greater Accra',
        postalCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 5.6037,
          longitude: -0.1870
        },
        specialInstructions: 'Leave at front door if no answer',
        deliveryInstructions: 'Call before delivery'
      }
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
        weight: 2.0,
        volume: 0.002,
        specialInstructions: 'Prefer ripe tomatoes',
        fragile: false,
        temperatureControlled: true,
        requiresSpecialHandling: false,
        substitutionAllowed: true
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
        weight: 0.3,
        volume: 0.001,
        specialInstructions: 'Fresh and crisp',
        fragile: true,
        temperatureControlled: true,
        requiresSpecialHandling: true,
        substitutionAllowed: true
      }
    ],
    priority: DeliveryPriority.NORMAL,
    status: DeliveryStatus.ASSIGNED,
    assignedDriverId: 'driver-001',
    assignedDriverName: 'Kwame Osei',
    routeId: 'route-001',
    routeName: 'Accra Central Route',
    estimatedDeliveryTime: '2024-02-03T10:00:00Z',
    actualDeliveryTime: undefined,
    pickupTime: undefined,
    deliveryTime: '2024-02-03T10:00:00Z',
    distance: 25,
    totalWeight: 2.3,
    totalVolume: 0.003,
    totalAmount: 34.00,
    currency: 'GHS',
    deliveryFee: 5.00,
    specialRequirements: ['Temperature controlled', 'Handle with care'],
    deliveryInstructions: 'Customer prefers morning delivery',
    trackingNumber: 'TRK-ABC123-XYZ',
    trackingEvents: [
      {
        id: 'te-001',
        timestamp: '2024-02-03T09:00:00Z',
        status: DeliveryStatus.ASSIGNED,
        location: {
          latitude: 5.6037,
          longitude: -0.1870,
          address: 'BFNG Warehouse, Accra'
        },
        notes: 'Driver assigned: Kwame Osei',
        driverId: 'driver-001',
        driverName: 'Kwame Osei'
      }
    ],
    createdAt: '2024-02-03T08:30:00Z',
    updatedAt: '2024-02-03T09:00:00Z',
    assignedAt: '2024-02-03T09:00:00Z',
    assignedBy: 'admin-001',
    lastModified: '2024-02-03T09:00:00Z',
    tags: ['organic', 'vegetables', 'morning'],
    notes: 'Regular customer, prefers morning deliveries'
  },
  {
    id: 'del-002',
    deliveryNumber: 'DEL-DEF456-ABC',
    orderId: 'ord-002',
    orderNumber: 'ORD-2024-002',
    customer: {
      id: 'cust-002',
      firstName: 'Ama',
      lastName: 'Owusu',
      email: 'ama.owusu@company.com',
      phone: '+233 27 987 6543',
      address: {
        street: '456 Business Avenue',
        city: 'Kumasi',
        region: 'Ashanti',
        postalCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 6.6881,
          longitude: -1.6244
        },
        specialInstructions: 'Deliver to main entrance',
        deliveryInstructions: 'Call upon arrival'
      }
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
        weight: 10.0,
        volume: 10.0,
        specialInstructions: 'Fresh milk from grass-fed cows',
        fragile: false,
        temperatureControlled: true,
        requiresSpecialHandling: true,
        substitutionAllowed: false
      }
    ],
    priority: DeliveryPriority.NORMAL,
    status: DeliveryStatus.IN_PROGRESS,
    assignedDriverId: 'driver-002',
    assignedDriverName: 'Ama Mensah',
    routeId: 'route-002',
    routeName: 'Accra North Route',
    estimatedDeliveryTime: '2024-02-03T11:00:00Z',
    actualDeliveryTime: undefined,
    pickupTime: '2024-02-03T10:30:00Z',
    deliveryTime: '2024-02-03T11:00:00Z',
    distance: 15,
    totalWeight: 10.0,
    totalVolume: 10.0,
    totalAmount: 125.00,
    currency: 'GHS',
    deliveryFee: 8.00,
    specialRequirements: ['Temperature controlled', 'Business delivery'],
    deliveryInstructions: 'Business customer, deliver during business hours',
    trackingNumber: 'TRK-DEF456-ABC',
    trackingEvents: [
      {
        id: 'te-002',
        timestamp: '2024-02-03T10:30:00Z',
        status: DeliveryStatus.PICKED_UP,
        location: {
          latitude: 6.6881,
          longitude: -1.6244,
          address: 'Owusu Enterprises, Kumasi'
        },
        notes: 'Items picked up successfully',
        driverId: 'driver-002',
        driverName: 'Ama Mensah'
      },
      {
        id: 'te-003',
        timestamp: '2024-02-03T10:45:00Z',
        status: DeliveryStatus.IN_TRANSIT,
        location: {
          latitude: 6.6270,
          longitude: -1.6244,
          address: 'On route to Legon Campus'
        },
        notes: 'In transit to delivery location',
        driverId: 'driver-002',
        driverName: 'Ama Mensah'
      }
    ],
    createdAt: '2024-02-03T10:15:00Z',
    updatedAt: '2024-02-03T10:45:00Z',
    assignedAt: '2024-02-03T10:30:00Z',
    assignedBy: 'admin-001',
    lastModified: '2024-02-03T10:45:00Z',
    tags: ['business', 'dairy', 'morning'],
    notes: 'Business customer, regular milk delivery'
  },
  {
    id: 'del-003',
    deliveryNumber: 'DEL-GHI789-DEF',
    orderId: 'ord-003',
    orderNumber: 'ORD-2024-003',
    customer: {
      id: 'cust-003',
      firstName: 'Yaa',
      lastName: 'Nyarko',
      email: 'yaa.nyarko@email.com',
      phone: '+233 20 111 2222',
      address: {
        street: '789 Family Lane',
        city: 'Tamale',
        region: 'Northern',
        postalCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 9.4008,
          longitude: -0.8393
        },
        specialInstructions: 'Leave with security if no answer',
        deliveryInstructions: 'Family with children, handle with care'
      }
    },
    items: [
      {
        id: 'item-004',
        productId: 'prod-004',
        productName: 'Local Rice',
        productSku: 'NG-LOCAL-RICE-004',
        quantity: 25,
        unit: 'kg',
        unitPrice: 25.00,
        totalPrice: 625.00,
        weight: 25.0,
        volume: 0.025,
        specialInstructions: 'High quality local rice',
        fragile: false,
        temperatureControlled: false,
        requiresSpecialHandling: false,
        substitutionAllowed: true
      }
    ],
    priority: DeliveryPriority.HIGH,
    status: DeliveryStatus.PENDING,
    assignedDriverId: undefined,
    assignedDriverName: undefined,
    routeId: undefined,
    routeName: undefined,
    estimatedDeliveryTime: '2024-02-04T14:00:00Z',
    actualDeliveryTime: undefined,
    pickupTime: undefined,
    deliveryTime: '2024-02-04T14:00:00Z',
    distance: 80,
    totalWeight: 25.0,
    totalVolume: 0.025,
    totalAmount: 625.00,
    currency: 'GHS',
    deliveryFee: 15.00,
    specialRequirements: ['Bulk order', 'Northern region'],
    deliveryInstructions: 'Family subscription, paused until March',
    trackingNumber: undefined,
    trackingEvents: [],
    createdAt: '2024-02-03T09:00:00Z',
    updatedAt: '2024-02-03T09:00:00Z',
    lastModified: '2024-02-03T09:00:00Z',
    tags: ['family', 'paused', 'bulk', 'grains'],
    notes: 'Family subscription currently paused, will resume in March'
  },
  {
    id: 'del-004',
    deliveryNumber: 'DEL-JKL012-GHI',
    orderId: 'ord-004',
    orderNumber: 'ORD-2024-004',
    customer: {
      id: 'cust-004',
      firstName: 'Peter',
      lastName: 'Addo',
      email: 'peter.addo@email.com',
      phone: '+233 26 333 4444',
      address: {
        street: '567 Residential Street',
        city: 'Tema',
        region: 'Greater Accra',
        postalCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 5.6678,
          longitude: -0.0165
        },
        specialInstructions: 'Leave at door, no need to ring bell',
        deliveryInstructions: 'Daily delivery for fresh vegetables'
      }
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
        weight: 0.6,
        volume: 0.3,
        specialInstructions: 'Traditional Ghanaian snacks',
        fragile: false,
        temperatureControlled: false,
        requiresSpecialHandling: false,
        substitutionAllowed: true
      }
    ],
    priority: DeliveryPriority.NORMAL,
    status: DeliveryStatus.DELIVERED,
    assignedDriverId: 'driver-003',
    assignedDriverName: 'Peter Addo',
    routeId: 'route-003',
    routeName: 'Accra East Route',
    estimatedDeliveryTime: '2024-02-03T14:00:00Z',
    actualDeliveryTime: '2024-02-03T14:30:00Z',
    pickupTime: '2024-02-03T13:15:00Z',
    deliveryTime: '2024-02-03T14:30:00Z',
    distance: 35,
    totalWeight: 0.6,
    totalVolume: 0.3,
    totalAmount: 50.00,
    currency: 'GHS',
    deliveryFee: 3.00,
    specialRequirements: ['Daily delivery', 'Fresh vegetables'],
    deliveryInstructions: 'Customer very satisfied with service',
    trackingNumber: 'TRK-JKL012-GHI',
    trackingEvents: [
      {
        id: 'te-004',
        timestamp: '2024-02-03T13:15:00Z',
        status: DeliveryStatus.PICKED_UP,
        location: {
          latitude: 5.6678,
          longitude: -0.0165
        },
        notes: 'Items picked up from warehouse',
        driverId: 'driver-003',
        driverName: 'Peter Addo'
      },
      {
        id: 'te-005',
        timestamp: '2024-02-03T14:30:00Z',
        status: DeliveryStatus.DELIVERED,
        location: {
          latitude: 5.6678,
          longitude: -0.0165
        },
        notes: 'Delivered successfully',
        driverId: 'driver-003',
        driverName: 'Peter Addo'
      }
    ],
    createdAt: '2024-02-03T07:30:00Z',
    updatedAt: '2024-02-03T14:30:00Z',
    assignedAt: '2024-02-03T13:15:00Z',
    assignedBy: 'admin-001',
    lastModified: '2024-02-03T14:30:00Z',
    qualityScore: 4.9,
    customerRating: 5.0,
    customerFeedback: 'Excellent service, always on time',
    driverNotes: 'Customer very happy with delivery',
    issues: [],
    tags: ['daily', 'vegetables', 'trial', 'new'],
    notes: 'New customer on trial period, very satisfied'
  },
  {
    id: 'del-005',
    deliveryNumber: 'DEL-MNO345-JKL',
    orderId: 'ord-005',
    orderNumber: 'ORD-2024-005',
    customer: {
      id: 'cust-005',
      firstName: 'Kojo',
      lastName: 'Mensah',
      email: 'kojo.mensah@university.edu',
      phone: '+233 23 456 7890',
      address: {
        street: '321 University Road',
        city: 'Legon',
        region: 'Greater Accra',
        postalCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 5.6504,
          longitude: -0.1873
        },
        specialInstructions: 'Deliver to campus cafeteria',
        deliveryInstructions: 'Security clearance required'
      }
    },
    items: [
      {
        id: 'item-006',
        productId: 'prod-006',
        productName: 'Premium Meats Package',
        productSku: 'PM-PREMIUM-MEAT-006',
        quantity: 5,
        unit: 'kg',
        unitPrice: 45.00,
        totalPrice: 225.00,
        weight: 5.0,
        volume: 0.05,
        specialInstructions: 'Premium quality meat',
        fragile: true,
        temperatureControlled: true,
        requiresSpecialHandling: true,
        substitutionAllowed: false
      }
    ],
    priority: DeliveryPriority.URGENT,
    status: DeliveryStatus.FAILED,
    assignedDriverId: undefined,
    assignedDriverName: undefined,
    routeId: undefined,
    routeName: undefined,
    estimatedDeliveryTime: '2024-02-03T16:00:00Z',
    actualDeliveryTime: undefined,
    pickupTime: undefined,
    deliveryTime: '2024-02-03T16:00:00Z',
    distance: 0,
    totalWeight: 5.0,
    totalVolume: 0.05,
    totalAmount: 225.00,
    currency: 'GHS',
    deliveryFee: 20.00,
    specialRequirements: ['Halal certified', 'Institutional'],
    deliveryInstructions: 'University delivery - cancelled',
    trackingNumber: undefined,
    trackingEvents: [],
    createdAt: '2024-02-03T11:20:00Z',
    updatedAt: '2024-02-03T16:45:00Z',
    assignedAt: undefined,
    failedAt: '2024-02-03T16:45:00Z',
    cancellationReason: 'Budget constraints',
    cancellationDate: '2024-02-03T16:45:00Z',
    qualityScore: 3.5,
    customerRating: 3.0,
    customerFeedback: 'Delivery cancelled due to budget',
    driverNotes: 'Customer cancelled subscription',
    issues: [
      {
        id: 'issue-001',
        type: 'budget',
        description: 'Customer cancelled due to budget constraints',
        severity: 'medium' as const,
        resolved: false,
        reportedBy: 'admin-001',
        reportedAt: '2024-02-03T16:45:00Z'
      }
    ],
    tags: ['institution', 'cancelled', 'university', 'meat'],
    notes: 'Institutional subscription cancelled due to budget constraints'
  }
]

// Example usage
export const getDeliveriesByStatus = (status: DeliveryStatus): Delivery[] => {
  return mockDeliveries.filter(delivery => delivery.status === status)
}

export const getDeliveriesByDriver = (driverId: string): Delivery[] => {
  return mockDeliveries.filter(delivery => delivery.assignedDriverId === driverId)
}

export const getDeliveriesByRoute = (routeId: string): Delivery[] => {
  return mockDeliveries.filter(delivery => delivery.routeId === routeId)
}

export const getDeliveryById = (id: string): Delivery | null => {
  return mockDeliveries.find(delivery => delivery.id === id) || null
}

export const getDeliveriesByCustomer = (customerId: string): Delivery[] => {
  return mockDeliveries.filter(delivery => delivery.customer.id === customerId)
}

export const searchDeliveries = (query: string): Delivery[] => {
  const lowerQuery = query.toLowerCase()
  return mockDeliveries.filter(delivery => 
    delivery.customer.firstName.toLowerCase().includes(lowerQuery) ||
    delivery.customer.lastName.toLowerCase().includes(lowerQuery) ||
    delivery.customer.email.toLowerCase().includes(lowerQuery) ||
    delivery.deliveryNumber.toLowerCase().includes(lowerQuery) ||
    delivery.orderNumber.toLowerCase().includes(lowerQuery)
  )
}

export const getDeliveriesByPriority = (priority: DeliveryPriority): Delivery[] => {
  return mockDeliveries.filter(delivery => delivery.priority === priority)
}

export const getDeliveriesByDate = (date: string): Delivery[] => {
  return mockDeliveries.filter(delivery => 
    delivery.deliveryTime?.startsWith(date.split('T')[0])
  )
}

export default mockDeliveries
