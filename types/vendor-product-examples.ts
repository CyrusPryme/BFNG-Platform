import { VendorProduct, VendorProductStatus } from './vendor-product'

/**
 * Mock Vendor Product Examples
 * Sample products demonstrating the complete vendor product approval workflow
 */

export const mockVendorProducts: VendorProduct[] = [
  {
    id: 'vp-001',
    vendorId: 'vend-001',
    vendorName: 'Fresh Ghana Produce',
    vendorCode: 'FRESH-001',
    productId: 'prod-001',
    productName: 'Organic Tomatoes',
    productDescription: 'Premium quality organic tomatoes grown without pesticides. Perfect for salads, stews, and traditional Ghanaian dishes. Rich in vitamins and antioxidants.',
    category: 'Vegetables',
    subcategory: 'Tomatoes',
    brand: 'Fresh Ghana',
    sku: 'FG-ORG-TOM-001',
    barcode: '6234567890123',
    unit: 'kg',
    unitPrice: 8.50,
    currency: 'GHS',
    minimumOrder: 5,
    maximumOrder: 500,
    availableQuantity: 150,
    status: VendorProductStatus.PENDING,
    submittedAt: '2024-02-03T08:30:00Z',
    submittedBy: 'vendor-001',
    documentation: {
      productImages: [
        '/images/products/tomatoes-1.jpg',
        '/images/products/tomatoes-2.jpg',
        '/images/products/tomatoes-3.jpg'
      ],
      certificates: ['organic-cert-001', 'food-safety-001'],
      licenses: ['vendor-license-001'],
      testReports: ['quality-test-001'],
      ingredientList: ['Tomatoes', 'Water'],
      nutritionalInfo: {
        calories: 18,
        protein: 0.9,
        carbohydrates: 3.9,
        fat: 0.2,
        fiber: 1.2,
        sugar: 2.6,
        sodium: 5,
        allergens: ['None'],
        ingredients: ['Organic Tomatoes'],
        servingSize: '100g'
      },
      specifications: {
        weight: 1,
        dimensions: {
          length: 6,
          width: 6,
          height: 6
        },
        shelfLife: 7,
        storageConditions: ['Refrigerate', 'Keep dry', 'Use within 7 days']
      },
      uploadedAt: '2024-02-03T08:30:00Z'
    },
    tags: ['organic', 'vegetables', 'premium', 'local'],
    seasonalAvailability: {
      availableFrom: '2024-01-15',
      availableTo: '2024-03-31',
      peakSeason: ['December', 'January', 'February'],
      offSeason: false
    },
    compliance: {
      foodSafety: true,
      organic: true,
      halal: false,
      kosher: false,
      glutenFree: true,
      vegan: true,
      fairTrade: true,
      certifications: ['organic-cert-001', 'fair-trade-001']
    },
    createdAt: '2024-02-03T08:30:00Z',
    updatedAt: '2024-02-03T08:30:00Z',
    lastModified: '2024-02-03T08:30:00Z'
  },
  {
    id: 'vp-002',
    vendorId: 'vend-002',
    vendorName: 'Ghana Dairy Cooperative',
    vendorCode: 'DAIRY-002',
    productId: 'prod-002',
    productName: 'Fresh Whole Milk',
    productDescription: 'Premium quality whole milk from grass-fed cows. Rich in calcium and essential nutrients. Perfect for families and businesses.',
    category: 'Dairy',
    subcategory: 'Milk',
    brand: 'Ghana Dairy',
    sku: 'GD-FRESH-MILK-002',
    barcode: '6234567890124',
    unit: 'liter',
    unitPrice: 12.00,
    currency: 'GHS',
    minimumOrder: 10,
    maximumOrder: 100,
    availableQuantity: 500,
    status: VendorProductStatus.APPROVED,
    submittedAt: '2024-02-02T10:15:00Z',
    submittedBy: 'vendor-002',
    reviewedAt: '2024-02-02T14:30:00Z',
    reviewedBy: 'admin-001',
    approvedAt: '2024-02-02T14:30:00Z',
    approvalNotes: 'Product meets all quality standards. Pricing is competitive.',
    qualityAssessment: {
      overallScore: 92,
      qualityScore: 95,
      packagingScore: 90,
      freshnessScore: 88,
      complianceScore: 95,
      assessmentDate: '2024-02-02T14:30:00Z',
      assessedBy: 'admin-001',
      notes: 'Excellent quality. Fresh and properly packaged.'
    },
    pricingReview: {
      marketPrice: 12.50,
      vendorPrice: 12.00,
      priceDifference: -4.0,
      priceReasonable: true,
      marketComparison: {
        competitor1: 'Dairy Farm Ltd',
        price1: 13.00,
        competitor2: 'Fresh Milk Co',
        price2: 12.50,
        competitor3: 'Premium Dairy',
        price3: 13.50
      },
      reviewDate: '2024-02-02T14:30:00Z',
      reviewedBy: 'admin-001',
      recommendations: 'Price is competitive. Continue with current pricing.'
    },
    documentation: {
      productImages: [
        '/images/products/milk-1.jpg',
        '/images/products/milk-2.jpg'
      ],
      certificates: ['food-safety-002', 'dairy-license-002'],
      licenses: ['dairy-processing-002'],
      testReports: ['milk-quality-002'],
      ingredientList: ['Whole Milk', 'Vitamin D', 'Calcium'],
      nutritionalInfo: {
        calories: 150,
        protein: 8,
        carbohydrates: 12,
        fat: 8,
        fiber: 0,
        sugar: 12,
        sodium: 50,
        allergens: ['Milk'],
        ingredients: ['Whole Milk', 'Vitamin D', 'Calcium'],
        servingSize: '240ml'
      },
      specifications: {
        weight: 1,
        dimensions: {
          length: 8,
          width: 6,
          height: 12
        },
        shelfLife: 14,
        storageConditions: ['Refrigerate', 'Keep at 4°C']
      },
      uploadedAt: '2024-02-02T10:15:00Z'
    },
    tags: ['dairy', 'fresh', 'local', 'fair-trade'],
    compliance: {
      foodSafety: true,
      organic: false,
      halal: false,
      kosher: false,
      glutenFree: false,
      vegan: false,
      fairTrade: true,
      certifications: ['fair-trade-002']
    },
    createdAt: '2024-02-02T10:15:00Z',
    updatedAt: '2024-02-02T14:30:00Z',
    lastModified: '2024-02-02T14:30:00Z'
  },
  {
    id: 'vp-003',
    vendorId: 'vend-003',
    vendorName: 'Premium Meats Ghana',
    vendorCode: 'MEAT-003',
    productId: 'prod-003',
    productName: 'Halal Beef',
    productDescription: 'Premium quality halal-certified beef from grass-fed cattle. Perfect for traditional Ghanaian dishes and international cuisine.',
    category: 'Meat',
    subcategory: 'Beef',
    brand: 'Premium Meats',
    sku: 'PM-HALAL-BEEF-003',
    barcode: '6234567890125',
    unit: 'kg',
    unitPrice: 45.00,
    currency: 'GHS',
    minimumOrder: 2,
    maximumOrder: 50,
    availableQuantity: 25,
    status: VendorProductStatus.REJECTED,
    submittedAt: '2024-02-01T11:20:00Z',
    submittedBy: 'vendor-003',
    reviewedAt: '2024-02-01T16:45:00Z',
    reviewedBy: 'admin-002',
    rejectedAt: '2024-02-01T16:45:00Z',
    rejectionReason: 'Product does not meet quality standards. Temperature control issues detected during inspection.',
    approvalNotes: 'Vendor needs to improve cold chain management and quality control processes.',
    qualityAssessment: {
      overallScore: 65,
      qualityScore: 60,
      packagingScore: 70,
      freshnessScore: 55,
      complianceScore: 75,
      assessmentDate: '2024-02-01T16:45:00Z',
      assessedBy: 'admin-002',
      notes: 'Temperature control issues. Packaging needs improvement.'
    },
    pricingReview: {
      marketPrice: 42.00,
      vendorPrice: 45.00,
      priceDifference: 7.1,
      priceReasonable: false,
      marketComparison: {
        competitor1: 'Quality Meats',
        price1: 40.00,
        competitor2: 'Premium Butcher',
        price2: 43.00,
        competitor3: 'Local Butcher',
        price3: 41.00
      },
      reviewDate: '2024-02-01T16:45:00Z',
      reviewedBy: 'admin-002',
      recommendations: 'Price is above market average. Recommend reduction to competitive levels.'
    },
    documentation: {
      productImages: [
        '/images/products/beef-1.jpg',
        '/images/products/beef-2.jpg'
      ],
      certificates: ['halal-cert-003'],
      licenses: ['meat-processing-003'],
      testReports: ['meat-quality-003'],
      ingredientList: ['Beef', 'Salt', 'Spices'],
      nutritionalInfo: {
        calories: 250,
        protein: 26,
        carbohydrates: 0,
        fat: 15,
        fiber: 0,
        sugar: 0,
        sodium: 60,
        allergens: ['Meat'],
        ingredients: ['Beef', 'Salt', 'Natural Spices'],
        servingSize: '100g'
      },
      specifications: {
        weight: 1,
        dimensions: {
          length: 20,
          width: 15,
          height: 5
        },
        shelfLife: 3,
        storageConditions: ['Refrigerate', 'Keep at 0-4°C']
      },
      uploadedAt: '2024-02-01T11:20:00Z'
    },
    tags: ['meat', 'halal', 'premium', 'rejected'],
    compliance: {
      foodSafety: false,
      organic: false,
      halal: true,
      kosher: false,
      glutenFree: false,
      vegan: false,
      fairTrade: false,
      certifications: ['halal-cert-003']
    },
    createdAt: '2024-02-01T11:20:00Z',
    updatedAt: '2024-02-01T16:45:00Z',
    lastModified: '2024-02-01T16:45:00Z'
  },
  {
    id: 'vp-004',
    vendorId: 'vend-004',
    vendorName: 'Northern Grains Association',
    vendorCode: 'GRAIN-004',
    productId: 'prod-004',
    productName: 'Local Rice',
    productDescription: 'High-quality locally grown rice from Northern Ghana. Perfect for traditional dishes and daily consumption.',
    category: 'Grains',
    subcategory: 'Rice',
    brand: 'Northern Grains',
    sku: 'NG-LOCAL-RICE-004',
    barcode: '6234567890126',
    unit: 'kg',
    unitPrice: 25.00,
    currency: 'GHS',
    minimumOrder: 50,
    maximumOrder: 1000,
    availableQuantity: 2000,
    status: VendorProductStatus.PENDING,
    submittedAt: '2024-02-03T09:00:00Z',
    submittedBy: 'vendor-004',
    documentation: {
      productImages: [
        '/images/products/rice-1.jpg',
        '/images/products/rice-2.jpg',
        '/images/products/rice-3.jpg'
      ],
      certificates: ['grain-quality-004'],
      licenses: ['grain-trading-004'],
      testReports: ['rice-quality-004'],
      ingredientList: ['Local Rice'],
      nutritionalInfo: {
        calories: 130,
        protein: 2.7,
        carbohydrates: 28,
        fat: 0.3,
        fiber: 0.4,
        sugar: 0.1,
        sodium: 1,
        allergens: ['None'],
        ingredients: ['Local Rice'],
        servingSize: '100g'
      },
      specifications: {
        weight: 1,
        dimensions: {
          length: 5,
          width: 5,
          height: 5
        },
        shelfLife: 365,
        storageConditions: ['Store in cool, dry place', 'Protect from moisture']
      },
      uploadedAt: '2024-02-03T09:00:00Z'
    },
    tags: ['grains', 'local', 'bulk', 'pending'],
    compliance: {
      foodSafety: true,
      organic: false,
      halal: false,
      kosher: false,
      glutenFree: true,
      vegan: true,
      fairTrade: true,
      certifications: ['fair-trade-004']
    },
    createdAt: '2024-02-03T09:00:00Z',
    updatedAt: '2024-02-03T09:00:00Z',
    lastModified: '2024-02-03T09:00:00Z'
  },
  {
    id: 'vp-005',
    vendorId: 'vend-005',
    vendorName: 'Packaged Goods Ghana Ltd',
    vendorCode: 'PACK-005',
    productId: 'prod-005',
    productName: 'Traditional Snack Mix',
    productDescription: 'Traditional Ghanaian snack mix with plantain chips, peanuts, and spices. Perfect for parties and gatherings.',
    category: 'Packaged',
    subcategory: 'Snacks',
    brand: 'Ghana Traditions',
    sku: 'GT-TRAD-SNACK-005',
    barcode: '6234567890127',
    unit: 'pack',
    unitPrice: 15.00,
    currency: 'GHS',
    minimumOrder: 10,
    maximumOrder: 500,
    availableQuantity: 100,
    status: VendorProductStatus.APPROVED,
    submittedAt: '2024-02-03T07:30:00Z',
    submittedBy: 'vendor-005',
    reviewedAt: '2024-02-03T11:00:00Z',
    reviewedBy: 'admin-001',
    approvedAt: '2024-02-03T11:00:00Z',
    approvalNotes: 'Product meets all quality standards. Great traditional taste.',
    qualityAssessment: {
      overallScore: 88,
      qualityScore: 85,
      packagingScore: 90,
      freshnessScore: 92,
      complianceScore: 85,
      assessmentDate: '2024-02-03T11:00:00Z',
      assessedBy: 'admin-001',
      notes: 'Good quality packaging and authentic taste.'
    },
    pricingReview: {
      marketPrice: 16.00,
      vendorPrice: 15.00,
      priceDifference: -6.25,
      priceReasonable: true,
      marketComparison: {
        competitor1: 'Snack Master',
        price1: 17.00,
        competitor2: 'Traditional Foods',
        price2: 16.50,
        competitor3: 'Local Snacks',
        price3: 15.50
      },
      reviewDate: '2024-02-03T11:00:00Z',
      reviewedBy: 'admin-001',
      recommendations: 'Good pricing strategy. Maintain current levels.'
    },
    documentation: {
      productImages: [
        '/images/products/snack-1.jpg',
        '/images/products/snack-2.jpg',
        '/images/products/snack-3.jpg'
      ],
      certificates: ['food-safety-005', 'packaging-005'],
      licenses: ['food-manufacturing-005'],
      testReports: ['snack-quality-005'],
      ingredientList: ['Plantain Chips', 'Peanuts', 'Salt', 'Spices', 'Palm Oil'],
      nutritionalInfo: {
        calories: 180,
        protein: 5,
        carbohydrates: 15,
        fat: 10,
        fiber: 2,
        sugar: 3,
        sodium: 150,
        allergens: ['Peanuts', 'Nuts'],
        ingredients: ['Plantain Chips', 'Peanuts', 'Salt', 'Spices', 'Palm Oil'],
        servingSize: '50g'
      },
      specifications: {
        weight: 0.2,
        dimensions: {
          length: 15,
          width: 10,
          height: 3
        },
        shelfLife: 180,
        storageConditions: ['Store in cool, dry place', 'Keep sealed']
      },
      uploadedAt: '2024-02-03T07:30:00Z'
    },
    tags: ['packaged', 'snacks', 'traditional', 'approved'],
    compliance: {
      foodSafety: true,
      organic: false,
      halal: false,
      kosher: false,
      glutenFree: false,
      vegan: false,
      fairTrade: false,
      certifications: ['food-safety-005', 'packaging-005']
    },
    createdAt: '2024-02-03T07:30:00Z',
    updatedAt: '2024-02-03T11:00:00Z',
    lastModified: '2024-02-03T11:00:00Z'
  }
]

// Example usage
export const getVendorProductsByStatus = (status: VendorProductStatus): VendorProduct[] => {
  return mockVendorProducts.filter(product => product.status === status)
}

export const getVendorProductsByVendor = (vendorId: string): VendorProduct[] => {
  return mockVendorProducts.filter(product => product.vendorId === vendorId)
}

export const getVendorProductById = (id: string): VendorProduct | null => {
  return mockVendorProducts.find(product => product.id === id) || null
}

export const getVendorProductsByCategory = (category: string): VendorProduct[] => {
  return mockVendorProducts.filter(product => product.category === category)
}

export const searchVendorProducts = (query: string): VendorProduct[] => {
  const lowerQuery = query.toLowerCase()
  return mockVendorProducts.filter(product => 
    product.productName.toLowerCase().includes(lowerQuery) ||
    product.productDescription.toLowerCase().includes(lowerQuery) ||
    product.brand.toLowerCase().includes(lowerQuery) ||
    product.sku.toLowerCase().includes(lowerQuery) ||
    product.vendorName.toLowerCase().includes(lowerQuery)
  )
}

export default mockVendorProducts
