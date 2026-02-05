'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRBAC, RBACUser } from '@/hooks/use-rbac'
import { canAccessSection, AdminRole, Permission } from '@/lib/rbac'

interface EnhancedAdminAuthGateProps {
  children: React.ReactNode
  requiredRole?: AdminRole
  requiredPermission?: Permission
  section?: string
  action?: string
  fallback?: React.ReactNode
  redirectTo?: string
}

export function EnhancedAdminAuthGate({ 
  children, 
  requiredRole, 
  requiredPermission,
  section,
  action,
  fallback = <div>Access Denied</div>,
  redirectTo = '/admin'
}: EnhancedAdminAuthGateProps) {
  const router = useRouter()
  const [user, setUser] = useState<RBACUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = () => {
      // In a real app, this would check session/token
      const storedUser = localStorage.getItem('rbac_admin_user')
      
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        // Default to super admin for demo purposes
        // In production, this would redirect to login
        const defaultUser: RBACUser = {
          id: '1',
          email: 'admin@bfng.com.gh',
          name: 'Super Admin',
          role: 'super_admin',
          permissions: ['*']
        }
        setUser(defaultUser)
        localStorage.setItem('rbac_admin_user', JSON.stringify(defaultUser))
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const rbac = useRBAC(user)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ghana-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login or show access denied
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You must be logged in to access the admin panel.</p>
          <button 
            onClick={() => router.push('/auth/signin')}
            className="bg-ghana-green text-white px-6 py-2 rounded-lg hover:bg-ghana-green/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Check role-based access
  if (requiredRole && !rbac.isSuperAdmin() && user.role !== requiredRole) {
    return fallback
  }

  // Check section-based access
  if (section && !rbac.canAccessSection(section)) {
    return fallback
  }

  // Check permission-based access
  if (requiredPermission && !rbac.hasPermission(requiredPermission)) {
    return fallback
  }

  // Check action-based access
  if (action && !rbac.canPerformAction(action)) {
    return fallback
  }

  return <>{children}</>
}

// Hook for switching roles (for demo purposes)
export function useRoleSwitcher() {
  const [user, setUser] = useState<RBACUser | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('rbac_admin_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const switchRole = (newRole: AdminRole) => {
    if (!user) return

    const updatedUser: RBACUser = {
      ...user,
      role: newRole,
      permissions: newRole === 'super_admin' ? ['*'] : [] // Will be auto-calculated
    }

    setUser(updatedUser)
    localStorage.setItem('rbac_admin_user', JSON.stringify(updatedUser))
    
    // Trigger a page reload to refresh permissions
    window.location.reload()
  }

  return { user, switchRole }
}

// Demo role switcher component
export function RoleSwitcher() {
  const { user, switchRole } = useRoleSwitcher()

  if (!user) return null

  const roles: AdminRole[] = [
    'super_admin',
    'operations',
    'inventory',
    'vendor_manager',
    'procurement',
    'finance',
    'customer_service',
    'analytics'
  ]

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border">
      <div className="text-sm font-medium text-gray-700 mb-2">Current Role: {user.role}</div>
      <div className="space-y-1">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => switchRole(role)}
            className={`block w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-100 ${
              user.role === role ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
            }`}
          >
            {role.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
