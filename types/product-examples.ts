import { Product, ProductCategory, ProductUnit, BulkPricingTier, ProductImage, ProductInventory, SubstitutionRule } from './product'

/**
 * Mock Product Examples
 * Sample products demonstrating the complete product data model
 */

// Mock Product Images
const mockImages: ProductImage[] = [
  {
    id: 'img-001',
    url: '/images/products/tomatoes-1.jpg',
    alt: 'Fresh Red Tomatoes',
    caption: 'Fresh red tomatoes from local farm',
    isPrimary: true,
    sortOrder: 1,
    uploadedAt: '2024-02-03T10:00:00Z',
    fileSize: 245760,
    dimensions: {
      width: 800,
      height: 600
    }
  },
  {
    id: 'img-002',
    url: '/images/products/tomatoes-2.jpg',
    alt: 'Tomatoes Close Up',
    caption: 'Close-up view of fresh tomatoes',
    isPrimary: false,
    sortOrder: 2,
    uploadedAt: '2024-02-03T10:00:00Z',
    fileSize: 198432,
    dimensions: {
      width: 800,
      height: 600
    }
  },
  {
    id: 'img-003',
    url: '/images/products/lettuce-1.jpg',
    alt: 'Fresh Lettuce',
    caption: 'Crisp green lettuce head',
    isPrimary: true,
    sortOrder: 1,
    uploadedAt: '2024-02-03T10:00:00Z',
    fileSize: 187654,
    dimensions: {
      width: 800,
      height: 600
    }
  }
]

// Mock Bulk Pricing Tiers
const mockBulkPricing: BulkPricingTier[] = [
  {
    minQuantity: 1,
    maxQuantity: 9,
    unitPrice: 8.50,
    discount: 0,
    tierName: 'Regular'
  },
  {
    minQuantity: 10,
    maxQuantity: 49,
    unitPrice: 7.50,
    discount: 12,
    tierName: 'Small Bulk'
  },
  {
    minQuantity: 50,
    maxQuantity: 99,
    unitPrice: 6.80,
    discount: 20,
    tierName: 'Medium Bulk'
  },
  {
    minQuantity: 100,
    maxQuantity: undefined,
    unitPrice: 5.95,
    discount: 30,
    tierName: 'Large Bulk'
  }
]

// Mock Substitution Rules
const mockSubstitutionRules: SubstitutionRule[] = [
  {
    id: 'sub-001',
    productId: 'prod-002',
    alternativeProductIds: ['alt-001', 'alt-002'],
    preference: 'similar',
    autoApprove: false,
    maxPriceDifference: 20,
    reason: 'Original product out of stock'
  }
]

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Fresh Tomatoes',
    description: 'Premium quality fresh tomatoes from local farms in Ghana. Perfect for salads, stews, and sauces.',
    category: ProductCategory.FRESH,
    unit: ProductUnit.KG,
    basePrice: 8.50,
    currency: 'GHS',
    sku: 'TOM-001',
    barcode: '6234567890123',
    isAvailable: true,
    isSubstitutable: true,
    inventory: {
      currentStock: 150,
      minStock: 20,
      maxStock: 500,
      reorderLevel: 50,
      lastRestocked: '2024-02-03T06:00:00Z',
      supplier: 'Accra Fresh Farms',
      location: 'Accra Central Market',
      batchNumber: 'TOM-2024-02-03',
      expiryDate: '2024-02-10'
    },
    bulkPricing: mockBulkPricing,
    images: mockImages.slice(0, 2),
    tags: ['fresh', 'vegetables', 'local', 'popular'],
    attributes: {
      variety: 'Roma',
      color: 'Red',
      size: 'Medium',
      origin: 'Ghana'
    },
    supplierId: 'sup-001',
    supplierName: 'Accra Fresh Farms',
    supplierEmail: 'info@accrafreshfarms.com',
    supplierPhone: '+233 30 123 4567',
    quality: 'premium',
    certifications: ['organic', 'ghana-standards'],
    organic: true,
    fairTrade: true,
    locallySourced: true,
    nutritionalInfo: {
      calories: 18,
      protein: 0.9,
      carbohydrates: 3.9,
      fat: 0.2,
      fiber: 1.2,
      sugar: 2.6,
      sodium: 5,
      allergens: ['None'],
      ingredients: ['Tomatoes'],
      servingSize: '100g'
    },
    storageRequirements: {
      temperature: {
        min: 10,
        max: 20,
        unit: '°C'
      },
      humidity: {
        min: 85,
        max: 95
      },
      shelfLife: 7,
      storageInstructions: [
        'Store in a cool, dry place',
        'Do not refrigerate unless necessary',
        'Use within 7 days of purchase'
      ]
    },
    seasonal: {
      availableFrom: '2024-01-15',
      availableTo: '2024-03-31',
      peakSeason: ['December', 'January', 'February'],
      offSeason: false
    },
    substitutionRules: mockSubstitutionRules,
    createdAt: '2024-02-03T10:00:00Z',
    updatedAt: '2024-02-03T10:00:00Z',
    lastModified: '2024-02-03T10:00:00Z'
  },
  {
    id: 'prod-002',
    name: 'Organic Lettuce',
    description: 'Crisp organic lettuce grown without pesticides. Perfect for salads and sandwiches.',
    category: ProductCategory.FRESH,
    unit: ProductUnit.HEADS,
    basePrice: 12.00,
    currency: 'GHS',
    sku: 'LET-001',
    barcode: '6234567890124',
    isAvailable: false,
    isSubstitutable: true,
    inventory: {
      currentStock: 0,
      minStock: 10,
      maxStock: 100,
      reorderLevel: 25,
      lastRestocked: '2024-02-02T14:00:00Z',
      supplier: 'Premium Greens Ltd',
      location: 'Accra',
      batchNumber: 'LET-2024-02-02',
      expiryDate: '2024-02-09'
    },
    bulkPricing: [
      {
        minQuantity: 1,
        maxQuantity: 9,
        unitPrice: 12.00,
        discount: 0,
        tierName: 'Regular'
      },
      {
        minQuantity: 10,
        maxQuantity: 49,
        unitPrice: 10.80,
        discount: 10,
        tierName: 'Small Bulk'
      }
    ],
    images: [mockImages[2]],
    tags: ['organic', 'vegetables', 'premium', 'salads'],
    attributes: {
      variety: 'Iceberg',
      color: 'Green',
      size: 'Large',
      origin: 'Ghana'
    },
    supplierId: 'sup-002',
    supplierName: 'Premium Greens Ltd',
    supplierEmail: 'orders@premiumgreens.com',
    supplierPhone: '+233 30 987 6543',
    quality: 'premium',
    certifications: ['organic', 'ghana-standards'],
    organic: true,
    fairTrade: false,
    locallySourced: true,
    nutritionalInfo: {
      calories: 15,
      protein: 1.3,
      carbohydrates: 2.8,
      fat: 0.2,
      fiber: 2.8,
      sugar: 1.2,
      sodium: 10,
      allergens: ['None'],
      ingredients: ['Lettuce'],
      servingSize: '100g'
    },
    storageRequirements: {
      temperature: {
        min: 4,
        max: 8,
        unit: '°C'
      },
      humidity: {
        min: 90,
        max: 95
      },
      shelfLife: 5,
      storageInstructions: [
        'Refrigerate immediately',
        'Keep in crisper drawer',
        'Use within 5 days'
      ]
    },
    substitutionRules: mockSubstitutionRules,
    createdAt: '2024-02-03T10:00:00Z',
    updatedAt: '2024-02-03T10:00:00Z',
    lastModified: '2024-02-03T10:00:00Z'
  },
  {
    id: 'prod-003',
    name: 'Local Rice',
    description: 'High-quality locally grown rice from Ashanti region. Perfect for traditional Ghanaian dishes.',
    category: ProductCategory.PACKAGED,
    unit: ProductUnit.KG,
    basePrice: 25.00,
    currency: 'GHS',
    sku: 'RICE-001',
    barcode: '6234567890125',
    isAvailable: true,
    isSubstitutable: false,
    inventory: {
      currentStock: 500,
      minStock: 100,
      maxStock: 2000,
      reorderLevel: 200,
      lastRestocked: '2024-02-03T08:00:00Z',
      supplier: 'Ghana Rice Growers Association',
      location: 'Kumasi',
      batchNumber: 'RICE-2024-02-03'
    },
    bulkPricing: [
      {
        minQuantity: 1,
        maxQuantity: 9,
        unitPrice: 25.00,
        discount: 0,
        tierName: 'Regular'
      },
      {
        minQuantity: 10,
        maxQuantity: 49,
        unitPrice: 23.75,
        discount: 5,
        tierName: 'Small Bulk'
      },
      {
        minQuantity: 50,
        maxQuantity: 99,
        unitPrice: 22.50,
        discount: 10,
        tierName: 'Medium Bulk'
      },
      {
        minQuantity: 100,
        maxQuantity: undefined,
        unitPrice: 20.00,
        discount: 20,
        tierName: 'Large Bulk'
      }
    ],
    images: [
      {
        id: 'img-004',
        url: '/images/products/rice-1.jpg',
        alt: 'Local Rice Package',
        caption: 'Packaged local rice',
        isPrimary: true,
        sortOrder: 1,
        uploadedAt: '2024-02-03T10:00:00Z',
        fileSize: 156789,
        dimensions: {
          width: 800,
          height: 600
        }
      }
    ],
    tags: ['packaged', 'grains', 'local', 'staple'],
    attributes: {
      variety: 'Jasmine',
      type: 'Long grain',
      processing: 'Polished',
      origin: 'Ghana'
    },
    supplierId: 'sup-003',
    supplierName: 'Ghana Rice Growers Association',
    supplierEmail: 'orders@ghanarice.org',
    supplierPhone: '+233 50 234 5678',
    quality: 'standard',
    certifications: ['ghana-standards'],
    organic: false,
    fairTrade: true,
    locallySourced: true,
    substitutionRules: [],
    createdAt: '2024-02-03T10:00:00Z',
    updatedAt: '2024-02-03T10:00:00Z',
    lastModified: '2024-02-03T10:00:00Z'
  },
  {
    id: 'prod-004',
    name: 'Handwoven Baskets',
    description: 'Beautiful handwoven baskets made by local artisans. Perfect for storage and decoration.',
    category: ProductCategory.MADE_IN_GHANA,
    unit: ProductUnit.PIECES,
    basePrice: 45.00,
    currency: 'GHS',
    sku: 'BAS-001',
    barcode: '6234567890126',
    isAvailable: true,
    isSubstitutable: false,
    inventory: {
      currentStock: 25,
      minStock: 5,
      maxStock: 100,
      reorderLevel: 10,
      lastRestocked: '2024-02-03T10:00:00Z',
      supplier: 'Ghana Crafts Cooperative',
      location: 'Kumasi Craft Market'
    },
    bulkPricing: [
      {
        minQuantity: 1,
        maxQuantity: 4,
        unitPrice: 45.00,
        discount: 0,
        tierName: 'Regular'
      },
      {
        minQuantity: 5,
        maxQuantity: 19,
        unitPrice: 42.75,
        discount: 5,
        tierName: 'Small Bulk'
      },
      {
        minQuantity: 20,
        maxQuantity: 49,
        unitPrice: 40.50,
        discount: 10,
        tierName: 'Medium Bulk'
      }
    ],
    images: [
      {
        id: 'img-005',
        url: '/images/products/basket-1.jpg',
        alt: 'Handwoven Basket',
        caption: 'Traditional handwoven basket',
        isPrimary: true,
        sortOrder: 1,
        uploadedAt: '2024-02-03T10:00:00Z',
        fileSize: 234567,
        dimensions: {
          width: 800,
          height: 600
        }
      }
    ],
    tags: ['made-in-ghana', 'handmade', 'crafts', 'storage'],
    attributes: {
      material: 'Rattan',
      size: 'Medium',
      color: 'Brown',
      pattern: 'Traditional'
    },
    supplierId: 'sup-004',
    supplierName: 'Ghana Crafts Cooperative',
    supplierEmail: 'orders@ghanacrafts.org',
    supplierPhone: '+233 50 345 6789',
    quality: 'standard',
    certifications: ['ghana-standards'],
    organic: false,
    fairTrade: true,
    locallySourced: true,
    substitutionRules: [],
    createdAt: '2024-02-03T10:00:00Z',
    updatedAt: '2024-02-03T10:00:00Z',
    lastModified: '2024-02-03T10:00:00Z'
  }
]

// Example usage
export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return mockProducts.filter(product => product.category === category)
}

export const getAvailableProducts = (): Product[] => {
  return mockProducts.filter(product => product.isAvailable)
}

export const getSubstitutableProducts = (): Product[] => {
  return mockProducts.filter(product => product.isSubstitutable)
}

export const getProductById = (id: string): Product | null => {
  return mockProducts.find(product => product.id === id) || null
}

export const getProductsByPriceRange = (min: number, max: number): Product[] => {
  return mockProducts.filter(product => 
    product.basePrice >= min && product.basePrice <= max
  )
}

export default mockProducts
