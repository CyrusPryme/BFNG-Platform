'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  ShoppingBag, 
  Users,
  Package,
  ShoppingCart,
  Settings,
  BarChart3,
  Truck,
  FileText,
  LogOut
} from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Vendors', href: '/admin/vendors', icon: Truck },
  { name: 'Vendor Products', href: '/admin/vendor-products', icon: ShoppingBag },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className='w-64 bg-white shadow-lg h-screen sticky top-0'>
      <div className='p-6'>
        {/* Logo/Brand */}
        <div className='flex items-center mb-8'>
          <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3'>
            <span className='text-white font-bold text-sm'>BF</span>
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>BFNG Admin</h1>
            <p className='text-xs text-gray-500'>Management Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className='space-y-1'>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
              >
                <item.icon className='mr-3 h-5 w-5' />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className='absolute bottom-0 left-0 right-0 p-6 border-t'>
        <Link
          href='/'
          className='flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
        >
          <LogOut className='h-5 w-5 mr-3' />
          <span className='font-medium'>Exit Admin</span>
        </Link>
      </div>
    </div>
  )
}
