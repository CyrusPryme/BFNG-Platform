import { Suspense } from 'react'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { ProductFilters } from '@/components/shop/ProductFilters'
import { SearchBar } from '@/components/shop/SearchBar'

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shop Fresh Produce</h1>
        <SearchBar />
      </div>
      
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilters />
        </div>
        
        <div className="lg:col-span-3">
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductGrid />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
