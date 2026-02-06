'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Home, ArrowLeft, Store, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function UnauthorizedPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Get the error message from URL params
    const errorMessage = searchParams.get('message')
    if (errorMessage) {
      setMessage(errorMessage)
    }
  }, [searchParams])

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, router])

  // If user is not authenticated, show loading
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghana-green mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  const getAccessDeniedMessage = () => {
    if (message === 'Admin access required') {
      return {
        title: 'Admin Access Required',
        description: 'You don\'t have permission to access the admin panel.',
        icon: Shield,
        color: 'red'
      }
    }
    if (message === 'Vendor access required') {
      return {
        title: 'Vendor Access Required',
        description: 'You don\'t have permission to access vendor pages.',
        icon: Store,
        color: 'orange'
      }
    }
    if (message === 'Customer access required') {
      return {
        title: 'Customer Access Required',
        description: 'You don\'t have permission to access customer pages.',
        icon: ShoppingBag,
        color: 'blue'
      }
    }
    return {
      title: 'Access Denied',
      description: 'You don\'t have permission to access this page.',
      icon: Shield,
      color: 'red'
    }
  }

  const { title, description, icon: Icon, color } = getAccessDeniedMessage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className={`p-3 bg-${color}-100 rounded-full`}>
            <Icon className={`h-8 w-8 text-${color}-600`} />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>

        {/* User Info */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Logged in as:</p>
          <p className="font-medium text-gray-900">{session.user?.email}</p>
          <p className="text-xs text-gray-500 mt-1">
            Role: {session.user?.role || 'Unknown'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {session.user?.role === 'ADMIN' ? (
            <Button 
              onClick={() => router.push('/admin')}
              className="w-full flex items-center justify-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Go to Admin Dashboard
            </Button>
          ) : session.user?.role === 'VENDOR' ? (
            <Button 
              onClick={() => router.push('/vendor')}
              className="w-full flex items-center justify-center gap-2"
            >
              <Store className="h-4 w-4" />
              Go to Vendor Portal
            </Button>
          ) : (
            <Button 
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go to Homepage
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>If you believe this is an error, please contact your system administrator.</p>
          <p>Access to this page requires specific permissions assigned to your account.</p>
        </div>

        {/* Sign Out Option */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              // Sign out and redirect to login
              fetch('/api/auth/signout', { method: 'POST' })
                .then(() => router.push('/auth/signin'))
                .catch(console.error)
            }}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Sign out and try different account
          </button>
        </div>
      </div>
    </div>
  )
}
