/**
 * Standardized Role Definitions for BFNG Platform
 * 
 * This file defines the official role structure used across the entire application.
 * All role checks and permissions should reference these constants to prevent
 * inconsistencies and role spoofing.
 */

/**
 * Official User Roles
 * These are the only valid roles that should exist in the system
 */
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  VENDOR: 'VENDOR'
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

/**
 * Role Display Information
 * Used for UI display and user-facing text
 */
export const ROLE_DISPLAY = {
  [USER_ROLES.ADMIN]: {
    label: 'Administrator',
    description: 'Full system administrator with access to admin panel',
    color: 'bg-red-100 text-red-800',
    icon: 'shield'
  },
  [USER_ROLES.CUSTOMER]: {
    label: 'Customer',
    description: 'Regular customer with shopping and ordering capabilities',
    color: 'bg-blue-100 text-blue-800',
    icon: 'user'
  },
  [USER_ROLES.VENDOR]: {
    label: 'Vendor',
    description: 'Product vendor with product management capabilities',
    color: 'bg-green-100 text-green-800',
    icon: 'store'
  }
} as const

/**
 * Role Permissions Matrix
 * Defines what each role can access
 */
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    'admin.access',
    'admin.users.read',
    'admin.users.write',
    'admin.orders.read',
    'admin.orders.write',
    'admin.products.read',
    'admin.products.write',
    'admin.vendors.read',
    'admin.vendors.write',
    'admin.analytics.read',
    'admin.settings.read',
    'admin.settings.write'
  ],
  [USER_ROLES.CUSTOMER]: [
    'shop.read',
    'shop.order',
    'orders.read.own',
    'profile.read.own',
    'profile.write.own',
    'subscriptions.read.own',
    'subscriptions.write.own'
  ],
  [USER_ROLES.VENDOR]: [
    'vendor.dashboard',
    'products.read.own',
    'products.write.own',
    'orders.read.own',
    'profile.read.own',
    'profile.write.own'
  ]
} as const

/**
 * Role Validation Helper Functions
 * These functions help prevent client-side role spoofing by validating
 * against the official role definitions
 */

/**
 * Check if a role is valid
 */
export function isValidRole(role: string): role is UserRole {
  return Object.values(USER_ROLES).includes(role as UserRole)
}

/**
 * Check if a user has admin privileges
 */
export function isAdminRole(role: string): boolean {
  return role === USER_ROLES.ADMIN
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(userRole: string, permission: string): boolean {
  if (!isValidRole(userRole)) return false
  
  const permissions = ROLE_PERMISSIONS[userRole as UserRole] as readonly string[]
  return permissions.includes(permission)
}

/**
 * Get role display information
 */
export function getRoleDisplay(role: string) {
  if (!isValidRole(role)) {
    return {
      label: 'Unknown',
      description: 'Invalid role',
      color: 'bg-gray-100 text-gray-800',
      icon: 'question-mark'
    }
  }
  
  return ROLE_DISPLAY[role]
}

/**
 * Server-side role validation
 * This should be used in API routes and server components
 * to prevent role spoofing
 */
export function validateServerRole(session: any): {
  isValid: boolean
  role?: UserRole
  error?: string
} {
  if (!session?.user?.role) {
    return { isValid: false, error: 'No role found in session' }
  }
  
  if (!isValidRole(session.user.role)) {
    return { 
      isValid: false, 
      error: `Invalid role: ${session.user.role}. Valid roles: ${Object.values(USER_ROLES).join(', ')}` 
    }
  }
  
  return { 
    isValid: true, 
    role: session.user.role as UserRole 
  }
}

/**
 * Client-side session validation helper
 * Used in client components to validate session data
 */
export function validateClientSession(session: any): {
  isAuthenticated: boolean
  isAdmin: boolean
  isCustomer: boolean
  isVendor: boolean
  role?: UserRole
  user?: any
} {
  if (!session?.user) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      isCustomer: false,
      isVendor: false
    }
  }

  const role = session.user.role
  const isValid = isValidRole(role)

  return {
    isAuthenticated: true,
    isAdmin: isValid && role === USER_ROLES.ADMIN,
    isCustomer: isValid && role === USER_ROLES.CUSTOMER,
    isVendor: isValid && role === USER_ROLES.VENDOR,
    role: isValid ? role as UserRole : undefined,
    user: session.user
  }
}

/**
 * Migration Helper
 * Converts old role names to new standardized roles
 */
export function migrateRole(oldRole: string): UserRole | null {
  const roleMap: Record<string, UserRole> = {
    'super_admin': USER_ROLES.ADMIN,
    'admin': USER_ROLES.ADMIN,
    'administrator': USER_ROLES.ADMIN,
    'customer': USER_ROLES.CUSTOMER,
    'client': USER_ROLES.CUSTOMER,
    'vendor': USER_ROLES.VENDOR,
    'supplier': USER_ROLES.VENDOR
  }
  
  return roleMap[oldRole] || null
}
