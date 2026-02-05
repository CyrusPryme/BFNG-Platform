export interface ProductFromImage {
  id: string
  name: string
  slug: string
  description: string
  category: string
  type: 'FRESH' | 'PACKAGED' | 'MADE_IN_GHANA'
  basePrice: number
  bulkPrice?: number
  bulkMinQty?: number
  unit: string
  vendorId?: string
  commissionRate?: number
  image: string
  inStock: boolean
  tags: string[]
  nutritionalInfo?: {
    calories?: number
    protein?: string
    vitamins?: string[]
  }
  storageInfo?: string
  origin?: string
}

export const productsFromImages: ProductFromImage[] = [
  {
    id: 'chili-pepper',
    name: 'Chili Pepper',
    slug: 'chili-pepper',
    description: 'Fresh Ghanaian chili peppers, perfect for adding heat to local dishes. Medium-hot variety commonly used in soups, stews, and sauces.',
    category: 'Vegetables',
    type: 'FRESH',
    basePrice: 8.50,
    bulkPrice: 6.50,
    bulkMinQty: 5,
    unit: 'kg',
    image: '/images/products/ChiliPepper.png',
    inStock: true,
    tags: ['spicy', 'vegetables', 'cooking', 'local'],
    nutritionalInfo: {
      calories: 40,
      protein: '1.9g',
      vitamins: ['Vitamin C', 'Vitamin A', 'Vitamin B6']
    },
    storageInfo: 'Store in refrigerator for up to 2 weeks',
    origin: 'Ghana'
  },
  {
    id: 'garden-eggs',
    name: 'Garden Eggs',
    slug: 'garden-eggs',
    description: 'Fresh African garden eggs (eggplants), a staple in Ghanaian cuisine. Mild flavor and tender texture, perfect for stews and grilling.',
    category: 'Vegetables',
    type: 'FRESH',
    basePrice: 12.00,
    bulkPrice: 9.00,
    bulkMinQty: 10,
    unit: 'piece',
    image: '/images/products/GardenEggs.png',
    inStock: true,
    tags: ['vegetables', 'staple', 'local', 'healthy'],
    nutritionalInfo: {
      calories: 25,
      protein: '1g',
      vitamins: ['Vitamin C', 'Vitamin K', 'Folate']
    },
    storageInfo: 'Store at room temperature for 3-4 days',
    origin: 'Ghana'
  },
  {
    id: 'yam',
    name: 'Yam',
    slug: 'yam',
    description: 'Premium Ghanaian yam, starchy and versatile. Perfect for fufu, yam fries, or boiled dishes. Sweet and nutty flavor.',
    category: 'Tubers',
    type: 'FRESH',
    basePrice: 15.00,
    bulkPrice: 11.00,
    bulkMinQty: 3,
    unit: 'kg',
    image: '/images/products/Yam.png',
    inStock: true,
    tags: ['tubers', 'staple', 'fufu', 'carbohydrates'],
    nutritionalInfo: {
      calories: 118,
      protein: '2g',
      vitamins: ['Vitamin C', 'Vitamin B6']
    },
    storageInfo: 'Store in cool, dry place for up to 2 weeks',
    origin: 'Ghana'
  },
  {
    id: 'carrots',
    name: 'Carrots',
    slug: 'carrots',
    description: 'Fresh, crunchy carrots rich in beta-carotene. Perfect for salads, juices, or cooking. Sweet and vibrant orange color.',
    category: 'Vegetables',
    type: 'FRESH',
    basePrice: 10.00,
    bulkPrice: 7.50,
    bulkMinQty: 5,
    unit: 'kg',
    image: '/images/products/carrots.png',
    inStock: true,
    tags: ['vegetables', 'healthy', 'vitamin-a', 'salads'],
    nutritionalInfo: {
      calories: 41,
      protein: '0.9g',
      vitamins: ['Vitamin A', 'Vitamin K', 'Vitamin B6']
    },
    storageInfo: 'Refrigerate for up to 3 weeks',
    origin: 'Ghana'
  },
  {
    id: 'chicken-wing',
    name: 'Chicken Wings',
    slug: 'chicken-wings',
    description: 'Fresh chicken wings, perfect for grilling, frying, or baking. Tender and juicy meat with great flavor absorption.',
    category: 'Poultry',
    type: 'FRESH',
    basePrice: 25.00,
    bulkPrice: 20.00,
    bulkMinQty: 2,
    unit: 'kg',
    image: '/images/products/chickenWing.png',
    inStock: true,
    tags: ['poultry', 'protein', 'meat', 'grilling'],
    nutritionalInfo: {
      calories: 203,
      protein: '18g',
      vitamins: ['Vitamin B6', 'Vitamin B12', 'Niacin']
    },
    storageInfo: 'Freeze immediately or refrigerate for 2 days',
    origin: 'Ghana'
  },
  {
    id: 'cocoyam',
    name: 'Cocoyam',
    slug: 'cocoyam',
    description: 'Fresh cocoyam (taro), a versatile Ghanaian staple. Great for soups, stews, and traditional dishes like ampesi.',
    category: 'Tubers',
    type: 'FRESH',
    basePrice: 18.00,
    bulkPrice: 14.00,
    bulkMinQty: 4,
    unit: 'kg',
    image: '/images/products/cocoyam.png',
    inStock: true,
    tags: ['tubers', 'staple', 'traditional', 'carbohydrates'],
    nutritionalInfo: {
      calories: 112,
      protein: '1.5g',
      vitamins: ['Vitamin E', 'Vitamin B6']
    },
    storageInfo: 'Store in cool, dry place for up to 1 week',
    origin: 'Ghana'
  },
  {
    id: 'dragon-fruit',
    name: 'Dragon Fruit',
    slug: 'dragon-fruit',
    description: 'Exotic dragon fruit with vibrant pink skin and white speckled flesh. Mild, sweet flavor with kiwi-like texture.',
    category: 'Fruits',
    type: 'FRESH',
    basePrice: 35.00,
    bulkPrice: 28.00,
    bulkMinQty: 3,
    unit: 'piece',
    image: '/images/products/dragonFruit.png',
    inStock: true,
    tags: ['exotic', 'fruits', 'healthy', 'antioxidants'],
    nutritionalInfo: {
      calories: 60,
      protein: '1.2g',
      vitamins: ['Vitamin C', 'Iron', 'Magnesium']
    },
    storageInfo: 'Refrigerate for up to 5 days',
    origin: 'Imported'
  },
  {
    id: 'kontomire',
    name: 'Kontomire',
    slug: 'kontomire',
    description: 'Fresh kontomire (taro leaves), essential for Ghanaian palaver sauce and traditional stews. Nutritious and flavorful.',
    category: 'Vegetables',
    type: 'FRESH',
    basePrice: 8.00,
    bulkPrice: 6.00,
    bulkMinQty: 10,
    unit: 'bunch',
    image: '/images/products/kontomire.png',
    inStock: true,
    tags: ['vegetables', 'traditional', 'leafy-greens', 'stews'],
    nutritionalInfo: {
      calories: 43,
      protein: '3g',
      vitamins: ['Vitamin A', 'Vitamin C', 'Iron']
    },
    storageInfo: 'Refrigerate for up to 4 days',
    origin: 'Ghana'
  },
  {
    id: 'pals-honey',
    name: "Pal's Honey 365ml",
    slug: 'pals-honey-365ml',
    description: 'Pure, natural Ghanaian honey from Pal\'s Apiaries. Raw, unfiltered honey with rich floral notes. Perfect for sweetening and health benefits.',
    category: 'Sweeteners',
    type: 'MADE_IN_GHANA',
    basePrice: 45.00,
    bulkPrice: 38.00,
    bulkMinQty: 6,
    unit: 'bottle',
    image: '/images/products/palsHoney365ml.png',
    inStock: true,
    tags: ['honey', 'natural', 'sweetener', 'made-in-ghana', 'health'],
    nutritionalInfo: {
      calories: 64,
      protein: '0.1g',
      vitamins: ['Antioxidants', 'Enzymes']
    },
    storageInfo: 'Store at room temperature, crystallization is natural',
    origin: 'Ghana'
  },
  {
    id: 'passion-fruit',
    name: 'Passion Fruit',
    slug: 'passion-fruit',
    description: 'Tangy, aromatic passion fruits perfect for juices, desserts, or eating fresh. Rich tropical flavor with edible seeds.',
    category: 'Fruits',
    type: 'FRESH',
    basePrice: 20.00,
    bulkPrice: 15.00,
    bulkMinQty: 8,
    unit: 'piece',
    image: '/images/products/passionFruit.png',
    inStock: true,
    tags: ['fruits', 'tropical', 'juicy', 'vitamin-c'],
    nutritionalInfo: {
      calories: 97,
      protein: '2.2g',
      vitamins: ['Vitamin C', 'Vitamin A', 'Fiber']
    },
    storageInfo: 'Store at room temperature until ripe, then refrigerate',
    origin: 'Ghana'
  },
  {
    id: 'plantain-flour',
    name: 'Plantain Flour',
    slug: 'plantain-flour',
    description: 'Premium plantain flour made from ripe Ghanaian plantains. Perfect for amala, pancakes, and gluten-free baking.',
    category: 'Flours',
    type: 'MADE_IN_GHANA',
    basePrice: 40.00,
    bulkPrice: 32.00,
    bulkMinQty: 3,
    unit: 'kg',
    image: '/images/products/plantainFlour.png',
    inStock: true,
    tags: ['flour', 'gluten-free', 'made-in-ghana', 'baking'],
    nutritionalInfo: {
      calories: 337,
      protein: '2.3g',
      vitamins: ['Vitamin B6', 'Magnesium', 'Potassium']
    },
    storageInfo: 'Store in airtight container in cool, dry place',
    origin: 'Ghana'
  },
  {
    id: 'prekese',
    name: 'Prekese',
    slug: 'prekese',
    description: 'Traditional prekese (Aidan fruit), essential for Ghanaian soups and medicinal purposes. Distinctive aroma and health benefits.',
    category: 'Spices',
    type: 'PACKAGED',
    basePrice: 25.00,
    bulkPrice: 20.00,
    bulkMinQty: 5,
    unit: 'piece',
    image: '/images/products/prekese.png',
    inStock: true,
    tags: ['spices', 'traditional', 'medicinal', 'soups'],
    nutritionalInfo: {
      calories: 285,
      protein: '7.5g',
      vitamins: ['Iron', 'Calcium', 'Potassium']
    },
    storageInfo: 'Store in airtight container away from moisture',
    origin: 'Ghana'
  },
  {
    id: 'soursop',
    name: 'Soursop',
    slug: 'soursop',
    description: 'Fresh soursop with creamy white flesh and sweet-tart flavor. Popular for juices and traditional remedies. Rich in nutrients.',
    category: 'Fruits',
    type: 'FRESH',
    basePrice: 30.00,
    bulkPrice: 24.00,
    bulkMinQty: 4,
    unit: 'piece',
    image: '/images/products/soursop.png',
    inStock: true,
    tags: ['fruits', 'tropical', 'creamy', 'medicinal'],
    nutritionalInfo: {
      calories: 66,
      protein: '1g',
      vitamins: ['Vitamin C', 'Vitamin B6', 'Fiber']
    },
    storageInfo: 'Refrigerate for up to 3 days once ripe',
    origin: 'Ghana'
  },
  {
    id: 'tomato-paste',
    name: 'Tomato Paste',
    slug: 'tomato-paste',
    description: 'Rich, concentrated tomato paste perfect for stews, soups, and sauces. Made from ripe Ghanaian tomatoes.',
    category: 'Condiments',
    type: 'PACKAGED',
    basePrice: 15.00,
    bulkPrice: 12.00,
    bulkMinQty: 8,
    unit: 'tin',
    image: '/images/products/tomatoPaste.png',
    inStock: true,
    tags: ['condiments', 'cooking', 'tomatoes', 'sauces'],
    nutritionalInfo: {
      calories: 82,
      protein: '4.3g',
      vitamins: ['Vitamin C', 'Lycopene', 'Vitamin K']
    },
    storageInfo: 'Store in cool, dry place. Refrigerate after opening.',
    origin: 'Ghana'
  }
]

export default productsFromImages
