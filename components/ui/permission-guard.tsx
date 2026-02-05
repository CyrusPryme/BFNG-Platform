'use client'

import React from 'react'
import { useRBAC } from '@/hooks/use-rbac'
import { Permission } from '@/lib/rbac'

interface PermissionGuardProps {
  children: React.ReactNode
  permission: Permission
  fallback?: React.ReactNode
  mode?: 'hide' | 'disable'
}

export function PermissionGuard({ 
  children, 
  permission, 
  fallback = null,
  mode = 'hide'
}: PermissionGuardProps) {
  const { hasPermission } = useRBAC(useMockRBACUser())

  const canAccess = hasPermission(permission)

  if (mode === 'disable') {
    return (
      <div className={canAccess ? '' : 'opacity-50 pointer-events-none'}>
        {children}
      </div>
    )
  }

  return canAccess ? <>{children}</> : <>{fallback}</>
}

interface RoleGuardProps {
  children: React.ReactNode
  roles: string[]
  fallback?: React.ReactNode
  mode?: 'hide' | 'disable'
}

export function RoleGuard({ 
  children, 
  roles, 
  fallback = null,
  mode = 'hide'
}: RoleGuardProps) {
  const rbac = useRBAC(useMockRBACUser())

  const canAccess = rbac.user && roles.includes(rbac.user.role)

  if (mode === 'disable') {
    return (
      <div className={canAccess ? '' : 'opacity-50 pointer-events-none'}>
        {children}
      </div>
    )
  }

  return canAccess ? <>{children}</> : <>{fallback}</>
}

interface ActionGuardProps {
  children: React.ReactNode
  action: string
  fallback?: React.ReactNode
  mode?: 'hide' | 'disable'
}

export function ActionGuard({ 
  children, 
  action, 
  fallback = null,
  mode = 'hide'
}: ActionGuardProps) {
  const { canPerformAction } = useRBAC(useMockRBACUser())

  const canAccess = canPerformAction(action)

  if (mode === 'disable') {
    return (
      <div className={canAccess ? '' : 'opacity-50 pointer-events-none'}>
        {children}
      </div>
    )
  }

  return canAccess ? <>{children}</> : <>{fallback}</>
}

// Mock user function - in real app this would come from auth context
function useMockRBACUser() {
  return {
    id: '1',
    email: 'admin@bfng.com.gh',
    name: 'Admin User',
    role: 'super_admin' as const,
    permissions: ['*' as Permission]
  }
}

// Conditional button component
interface ConditionalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  permission?: Permission
  action?: string
  roles?: string[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function ConditionalButton({ 
  permission, 
  action, 
  roles, 
  fallback,
  children,
  ...props 
}: ConditionalButtonProps) {
  const rbac = useRBAC(useMockRBACUser())

  let canAccess = true

  if (permission && !rbac.hasPermission(permission)) {
    canAccess = false
  }

  if (action && !rbac.canPerformAction(action)) {
    canAccess = false
  }

  if (roles && rbac.user && !roles.includes(rbac.user.role)) {
    canAccess = false
  }

  if (!canAccess) {
    return <>{fallback || null}</>
  }

  return <button {...props}>{children}</button>
}

// Section guard for navigation
interface SectionGuardProps {
  children: React.ReactNode
  section: string
  fallback?: React.ReactNode
}

export function SectionGuard({ 
  children, 
  section, 
  fallback = null 
}: SectionGuardProps) {
  const { canAccessSection } = useRBAC(useMockRBACUser())

  const canAccess = canAccessSection(section)

  return canAccess ? <>{children}</> : <>{fallback}</>
}
