'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star } from 'lucide-react'
import productsFromImages from '@/data/products-from-images'

// Select 4 featured products for the homepage
const featuredProducts = [
  { ...productsFromImages[0], badge: 'Best Seller', rating: 4.8, reviews: 124 },
  { ...productsFromImages[6], badge: 'Made in Ghana', rating: 4.9, reviews: 89 },
  { ...productsFromImages[1], badge: 'Fresh Today', rating: 4.7, reviews: 156 },
  { ...productsFromImages[8], badge: 'Premium', rating: 4.9, reviews: 67 }
]

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
          {featuredProducts.map((product) => (
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
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-ghana-green transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-2xl font-bold text-ghana-green">
                        GH₵{product.basePrice.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        per {product.unit}
                      </div>
                      {product.bulkPrice && (
                        <div className="text-sm text-ghana-red font-medium">
                          Bulk: GH₵{product.bulkPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button className="w-full bg-ghana-green hover:bg-ghana-green/90">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
