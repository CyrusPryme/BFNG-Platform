'use client'

import { useMemo, type ReactNode } from 'react'

type MockUser = {
  id: string
  email: string
  name: string
  role: string
}

export function useMockAuth(): {
  isAdmin: boolean
  user: MockUser
  isLoading: boolean
  loading: boolean
  canAccess: (role?: string) => boolean
} {
  return useMemo(() => {
    const isAdmin = true

    return {
      isAdmin,
      isLoading: false,
      loading: false,
      user: {
        id: 'mock-admin',
        email: 'admin@bfng.com.gh',
        name: 'Mock Admin',
        role: 'ADMIN'
      },
      canAccess: () => true
    }
  }, [])
}

interface AdminAuthGateProps {
  children: ReactNode
  fallback?: React.ReactNode
  requiredRole?: string
}

export function AdminAuthGate({
  children,
  fallback = <div>Access Denied</div>,
}: AdminAuthGateProps) {
  const { isAdmin } = useMockAuth()

  if (!isAdmin) return fallback

  return <>{children}</>
}
