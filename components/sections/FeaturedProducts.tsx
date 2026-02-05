'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star } from 'lucide-react'

// Temporary mock products - replace with API call or real data
const productsFromImages = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    image: '/images/products/tomatoes.jpg',
    basePrice: 25,
    bulkPrice: 22,
    bulkMinQty: 5,
    unit: 'kg',
    badge: 'Best Seller',
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2', 
    name: 'Organic Honey',
    image: '/images/products/honey.jpg',
    basePrice: 45,
    bulkPrice: 40,
    bulkMinQty: 3,
    unit: 'jar',
    badge: 'Made in Ghana',
    rating: 4.9,
    reviews: 89
  }
]

// Select featured products for the homepage
const featuredProducts = productsFromImages

export function FeaturedProducts() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of fresh produce and premium Made-in-Ghana products
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {product.badge && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-ghana-green text-white">
                          {product.badge}
                        </Badge>
                      </div>
                    )}
                    
                    {product.bulkPrice && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive">
                          Save GH₵{(product.basePrice - product.bulkPrice).toFixed(2)}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-ghana-green">
                          GH₵{product.basePrice}
                        </span>
                        <span className="text-sm text-gray-500">/{product.unit}</span>
                        {product.bulkPrice && (
                          <div className="text-sm text-gray-500">
                            <span className="line-through">GH₵{product.basePrice}</span>
                            <span className="text-ghana-green ml-1">GH₵{product.bulkPrice}</span>
                            <span className="text-xs text-gray-400">
                              ({product.bulkMinQty}+ {product.unit})
                            </span>
                          </div>
                        )}
                      </div>
                      <Button size="sm" className="bg-ghana-green hover:bg-ghana-green/90">
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Featured products will be available soon.</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-ghana-green text-ghana-green hover:bg-ghana-green hover:text-white">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
