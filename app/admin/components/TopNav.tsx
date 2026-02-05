'use client'

import { useState } from 'react'
import { Bell, Search, User, Menu, X, Shield } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { validateAdminSession } from '@/lib/admin-auth'

export function TopNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()
  
  // Validate admin session
  const sessionValidation = validateAdminSession(session)
  const isAdmin = sessionValidation.valid

  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <div className='px-6 py-4'>
        <div className='flex items-center justify-between'>
          {/* Left Section - Search */}
          <div className='flex items-center flex-1'>
            <div className='relative max-w-md w-full'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Search className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                placeholder='Search...'
                className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-ghana-green focus:border-ghana-green sm:text-sm'
              />
            </div>
          </div>

          {/* Right Section */}
          <div className='flex items-center space-x-4 ml-6'>
            {/* Role Badge */}
            {isAdmin && (
              <div className='hidden md:flex items-center space-x-2 px-3 py-1 bg-ghana-green/10 text-ghana-green rounded-full text-sm'>
                <Shield className='h-4 w-4' />
                <span className='font-medium'>Administrator</span>
              </div>
            )}

            {/* Notifications */}
            <button className='relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-ghana-green rounded-lg'>
              <Bell className='h-5 w-5' />
              <span className='absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full'></span>
            </button>

            {/* User Menu */}
            <div className='relative'>
              <div className='flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-ghana-green'>
                <div className='h-8 w-8 bg-ghana-green rounded-full flex items-center justify-center'>
                  <User className='h-4 w-4 text-white' />
                </div>
                <div className='hidden md:block text-left'>
                  <p className='text-sm font-medium text-gray-900'>{session?.user?.email}</p>
                  <p className='text-xs text-gray-500'>Administrator</p>
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-ghana-green rounded-lg'
            >
              {isMobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden mt-4 pt-4 border-t border-gray-200'>
            <div className='flex flex-col space-y-3'>
              {isAdmin && (
                <div className='flex items-center space-x-2 px-3 py-1 bg-ghana-green/10 text-ghana-green rounded-full text-sm'>
                  <Shield className='h-4 w-4' />
                  <span className='font-medium'>Administrator</span>
                </div>
              )}
              <a href='#' className='text-sm text-gray-600 hover:text-gray-900'>Profile</a>
              <a href='#' className='text-sm text-gray-600 hover:text-gray-900'>Settings</a>
              <button
                onClick={() => signOut()}
                className='text-sm text-red-600 hover:text-red-900 text-left'
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}