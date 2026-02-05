'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { USER_ROLES, getRoleDisplay } from '@/lib/roles'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <img 
                src="/images/bfng-logo-hr1.jpg" 
                alt="BFNG Logo" 
                className="h-10 w-auto mr-2"
              />
            </Link>
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    )
  }

  const navigation = [
    { name: 'Shop', href: '/shop' },
    { name: 'Subscriptions', href: '/subscriptions' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]

  const customerNavigation = [
    { name: 'My Orders', href: '/customer/orders' },
    { name: 'My Subscriptions', href: '/customer/subscriptions' },
    { name: 'Profile', href: '/customer/profile' }
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img 
              src="/images/bfng-logo-hr1.jpg" 
              alt="BFNG Logo" 
              className="h-10 w-auto mr-2"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-ghana-green transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/shop/cart">
                  <Button variant="outline" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                      0
                    </Badge>
                  </Button>
                </Link>
                
                <div className="relative group">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {session.user?.firstName || 'User'}
                  </Button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="py-1">
                      {customerNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.name}
                        </Link>
                      ))}
                      <hr className="my-1" />
                      {session.user?.role === USER_ROLES.ADMIN && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      {session.user?.role === USER_ROLES.VENDOR && (
                        <Link
                          href="/vendor"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Vendor Portal
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 inline mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-ghana-green hover:bg-ghana-green/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-ghana-green hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {session ? (
                <>
                  <hr className="my-2" />
                  {customerNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 text-gray-700 hover:text-ghana-green hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {session.user?.role === USER_ROLES.ADMIN && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 text-gray-700 hover:text-ghana-green hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {session.user?.role === USER_ROLES.VENDOR && (
                    <Link
                      href="/vendor"
                      className="block px-3 py-2 text-gray-700 hover:text-ghana-green hover:bg-gray-50 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Vendor Portal
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-ghana-green hover:bg-gray-50 rounded-md"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <hr className="my-2" />
                  <Link
                    href="/auth/signin"
                    className="block px-3 py-2 text-gray-700 hover:text-ghana-green hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-3 py-2 text-gray-700 hover:text-ghana-green hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
