'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function ProductFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Product Type</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Fresh Produce</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Packaged Goods</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Made in Ghana</span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="space-y-2">
            <input type="range" className="w-full" min="0" max="100" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>GH₵0</span>
              <span>GH₵100+</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-ghana-green hover:text-white">
              Vegetables
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-ghana-green hover:text-white">
              Fruits
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-ghana-green hover:text-white">
              Grains
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-ghana-green hover:text-white">
              Dairy
            </Badge>
          </div>
        </div>
        
        <Button variant="outline" className="w-full">
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}
