'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Plus } from 'lucide-react'
import productsFromImages from '@/data/products-from-images'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  basePrice: number
  bulkPrice?: number
  bulkMinQty?: number
  unit: string
  image: string
  type: 'FRESH' | 'PACKAGED' | 'MADE_IN_GHANA'
  category: string
  inStock: boolean
  tags: string[]
}

export function ProductGrid() {
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const updateQuantity = (productId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [productId]: quantity }))
  }

  const addToCart = (productId: string) => {
    const quantity = quantities[productId] || 1
    console.log(`Adding ${quantity} of product ${productId} to cart`)
    // TODO: Implement cart functionality
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productsFromImages.map((product) => {
        const quantity = quantities[product.id] || 1
        const isBulkEligible = product.bulkPrice && product.bulkMinQty && quantity >= product.bulkMinQty
        const displayPrice = isBulkEligible ? product.bulkPrice! : product.basePrice

        return (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative">
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute top-2 left-2">
                  <Badge variant={product.type === 'MADE_IN_GHANA' ? 'default' : 'secondary'}>
                    {product.type === 'FRESH' && 'Fresh'}
                    {product.type === 'PACKAGED' && 'Packaged'}
                    {product.type === 'MADE_IN_GHANA' && 'Made in Ghana'}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
                
                <Link href={`/shop/${product.slug}`} className="block">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-ghana-green transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                </Link>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-2xl font-bold text-ghana-green">
                      GH₵{displayPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      per {product.unit}
                    </div>
                    {product.bulkPrice && (
                      <div className="text-xs text-ghana-red">
                        Bulk: GH₵{product.bulkPrice.toFixed(2)} ({product.bulkMinQty}+ {product.unit}s)
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  
                  <Button
                    onClick={() => addToCart(product.id)}
                    className="flex-1 bg-ghana-green hover:bg-ghana-green/90"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
