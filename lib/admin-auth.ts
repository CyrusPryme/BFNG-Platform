import { authOptions } from '@/lib/auth'
import { USER_ROLES, validateServerRole, validateClientSession } from './roles'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Type guard for admin user
 */
export function isAdminUser(session: any): session is {
  user: {
    id: string
    email: string
    role: typeof USER_ROLES.ADMIN
    firstName: string
    lastName: string
  }
} {
  return session?.user?.role === USER_ROLES.ADMIN
}

/**
 * Admin session validation helper
 * For use in client components with useSession data
 */
export function validateAdminSession(session: any) {
  const clientValidation = validateClientSession(session)
  
  if (!clientValidation.isAuthenticated) {
    return { valid: false, reason: 'No session found' }
  }
  
  if (!clientValidation.isAdmin) {
    return { valid: false, reason: 'User does not have ADMIN role' }
  }
  
  return { valid: true, session }
}

/**
 * Server-side admin validation
 * For use in API routes and server components
 */
export function requireAdminSession(session: any) {
  const validation = validateServerRole(session)
  
  if (!validation.isValid) {
    throw new Error(`Access denied: ${validation.error}`)
  }
  
  if (validation.role !== USER_ROLES.ADMIN) {
    throw new Error('Access denied: ADMIN role required')
  }
  
  return session
}

/**
 * API route helper to validate admin access
 * Returns NextResponse with appropriate error if validation fails
 */
export function validateAdminApiAccess(request: NextRequest) {
  try {
    // Get session from Authorization header or cookies
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      )
    }

    // Extract token from Bearer token
    const token = authHeader.replace('Bearer ', '')
    
    // For now, we'll decode the token (in production, use proper JWT verification)
    // This is a simplified version - in production, use proper JWT verification
    const session = decodeJWT(token)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Validate admin role
    const validation = validateServerRole(session)
    
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 403 }
      )
    }
    
    if (validation.role !== USER_ROLES.ADMIN) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    return { valid: true, session }
  } catch (error) {
    console.error('API auth validation error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

/**
 * Simplified JWT decoder (for demo purposes)
 * In production, use proper JWT library like jose or jsonwebtoken
 */
function decodeJWT(token: string): any {
  try {
    // This is a simplified version - in production, use proper JWT verification
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }
    
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch (error) {
    console.error('JWT decode error:', error)
    return null
  }
}
