'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

// Temporary mock products - replace with API call or real data
const productsFromImages = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    slug: 'fresh-tomatoes',
    image: '/images/products/tomatoPaste.png',
    basePrice: 25,
    bulkPrice: 22,
    bulkMinQty: 5,
    unit: 'kg',
    badge: 'Best Seller',
    rating: 4.8,
    reviews: 124,
    description: 'Fresh, ripe tomatoes from local farms',
    type: 'FRESH',
    category: 'Fresh Vegetables',
    inStock: true
  },
  {
    id: '2', 
    name: 'Organic Honey',
    slug: 'organic-honey',
    image: '/images/products/palsHoney365ml.png',
    basePrice: 45,
    bulkPrice: 40,
    bulkMinQty: 3,
    unit: 'jar',
    badge: 'Made in Ghana',
    rating: 4.9,
    reviews: 89,
    description: 'Pure organic honey from Ghanaian beekeepers',
    type: 'MADE_IN_GHANA',
    category: 'Made in Ghana',
    inStock: true
  }
]

// Group products by actual categories
const categories = [
  {
    id: 'vegetables',
    name: 'Fresh Vegetables',
    description: 'Locally sourced, farm-fresh vegetables',
    icon: '🥬',
    color: 'from-green-400 to-green-600',
    slug: 'vegetables'
  },
  {
    id: 'fruits',
    name: 'Fresh Fruits',
    description: 'Seasonal fruits picked at peak ripeness',
    icon: '🍎',
    color: 'from-red-400 to-red-600',
    slug: 'fruits'
  },
  {
    id: 'tubers',
    name: 'Tubers & Roots',
    description: 'Ghanaian staple tubers and root vegetables',
    icon: '🍠',
    color: 'from-yellow-600 to-yellow-800',
    slug: 'tubers'
  },
  {
    id: 'poultry',
    name: 'Poultry & Meat',
    description: 'Fresh poultry and meat products',
    icon: '🍗',
    color: 'from-red-600 to-red-800',
    slug: 'poultry'
  },
  {
    id: 'made-in-ghana',
    name: 'Made in Ghana',
    description: 'Premium locally manufactured products',
    icon: '🇬🇭',
    color: 'from-yellow-400 to-yellow-600',
    slug: 'made-in-ghana'
  },
  {
    id: 'condiments',
    name: 'Condiments & Spices',
    description: 'Traditional spices and cooking essentials',
    icon: '🧂',
    color: 'from-orange-400 to-orange-600',
    slug: 'condiments'
  },
  {
    id: 'flours',
    name: 'Flours & Grains',
    description: 'Milled products and baking essentials',
    icon: '🌾',
    color: 'from-amber-400 to-amber-600',
    slug: 'flours'
  },
  {
    id: 'sweeteners',
    name: 'Sweeteners',
    description: 'Natural sweeteners and honey products',
    icon: '🍯',
    color: 'from-amber-600 to-amber-800',
    slug: 'sweeteners'
  }
]

// Count products in each category
const getCategoryCount = (categoryName: string) => {
  return productsFromImages.filter(product => 
    product.category.toLowerCase() === categoryName.toLowerCase()
  ).length
}

export function Categories() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our wide selection of fresh produce and premium Ghanaian products
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const productCount = getCategoryCount(category.name)
            
            return (
              <Card key={category.id} className="group hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-ghana-green transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {productCount} {productCount === 1 ? 'product' : 'products'}
                    </span>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="group-hover:bg-ghana-green group-hover:text-white"
                      onClick={() => {
                        // Navigate to shop with category filter
                        window.location.href = `/shop?category=${category.slug}`
                      }}
                    >
                      Shop Now
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
