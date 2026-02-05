import { Suspense } from 'react'
import { VendorDashboard } from '@/components/vendor/VendorDashboard'
import { ProductManagement } from '@/components/vendor/ProductManagement'
import { SalesReport } from '@/components/vendor/SalesReport'

export default function VendorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vendor Portal</h1>
        <p className="text-gray-600">Manage your Made-in-Ghana products and track sales</p>
      </div>
      
      <div className="space-y-8">
        <Suspense fallback={<div>Loading dashboard...</div>}>
          <VendorDashboard />
        </Suspense>
        
        <ProductManagement />
        <SalesReport />
      </div>
    </div>
  )
}
