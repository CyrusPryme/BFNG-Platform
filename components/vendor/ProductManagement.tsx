'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Eye } from 'lucide-react'

const vendorProducts = [
  {
    id: '1',
    name: 'Organic Shea Butter',
    status: 'APPROVED',
    price: 45.00,
    stock: 50,
    sales: 23,
    category: 'Beauty & Personal Care'
  },
  {
    id: '2',
    name: 'Handwoven Baskets',
    status: 'PENDING',
    price: 85.00,
    stock: 15,
    sales: 0,
    category: 'Home & Decor'
  },
  {
    id: '3',
    name: 'Natural Honey',
    status: 'APPROVED',
    price: 65.00,
    stock: 30,
    sales: 18,
    category: 'Food & Beverages'
  }
]

export function ProductManagement() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Management</CardTitle>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vendorProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{product.name}</span>
                  <Badge variant={product.status === 'APPROVED' ? 'default' : 'secondary'}>
                    {product.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>GH₵{product.price.toFixed(2)}</span>
                  <span>{product.stock} in stock</span>
                  <span>{product.sales} sold</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
