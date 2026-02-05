'use client'

import React from 'react'
import { useMemo } from 'react'
import { 
  AdminRole, 
  Permission, 
  createPermissionChecker,
  getPermissionsForRole,
  canAccessSection,
  canPerformAction
} from '@/lib/rbac'

export interface RBACUser {
  id: string
  email: string
  name: string
  role: AdminRole
  permissions: Permission[]
}

export function useRBAC(user: RBACUser | null) {
  const permissions = useMemo(() => {
    if (!user) return []
    return user.permissions.length > 0 ? user.permissions : getPermissionsForRole(user.role)
  }, [user])

  const checker = useMemo(() => {
    if (!user) return null
    return createPermissionChecker(user.role, permissions)
  }, [user, permissions])

  return {
    user,
    permissions,
    checker,
    
    // Convenience methods
    hasPermission: (permission: Permission) => checker?.hasPermission(permission) || false,
    canAccessSection: (section: string) => checker?.canAccessSection(section) || false,
    canPerformAction: (action: string) => checker?.canPerformAction(action) || false,
    isSuperAdmin: () => user?.role === 'super_admin' || false,
    
    // Role checks
    isOperations: () => user?.role === 'operations',
    isInventory: () => user?.role === 'inventory',
    isVendorManager: () => user?.role === 'vendor_manager',
    isProcurement: () => user?.role === 'procurement',
    isFinance: () => user?.role === 'finance',
    isCustomerService: () => user?.role === 'customer_service',
    isAnalytics: () => user?.role === 'analytics',
  }
}

// Higher-order component for conditional rendering
export interface ConditionalRenderProps {
  children: React.ReactNode
  permission?: Permission
  section?: string
  action?: string
  role?: AdminRole
  fallback?: React.ReactNode
}

export function ConditionalRender({ 
  children, 
  permission, 
  section, 
  action, 
  role,
  fallback = null 
}: ConditionalRenderProps) {
  const rbac = useRBAC(useMockRBACUser())

  if (permission && !rbac.hasPermission(permission)) {
    return React.createElement(React.Fragment, null, fallback)
  }

  if (section && !rbac.canAccessSection(section)) {
    return React.createElement(React.Fragment, null, fallback)
  }

  if (action && !rbac.canPerformAction(action)) {
    return React.createElement(React.Fragment, null, fallback)
  }

  if (role && rbac.user?.role !== role && !rbac.isSuperAdmin()) {
    return React.createElement(React.Fragment, null, fallback)
  }

  return React.createElement(React.Fragment, null, children)
}

// Mock user hook for development
export function useMockRBACUser(): RBACUser | null {
  // In a real app, this would come from authentication
  // For now, return a mock user
  return {
    id: '1',
    email: 'admin@bfng.com.gh',
    name: 'Admin User',
    role: 'super_admin', // Change this to test different roles
    permissions: ['*']
  }
}
