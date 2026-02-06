import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { USER_ROLES } from '@/lib/roles'

/**
 * Middleware for role-based route protection and redirects
 * 
 * This middleware:
 * 1. Protects /admin routes - only ADMIN role can access
 * 2. Protects /vendor routes - only VENDOR or ADMIN role can access
 * 3. Handles role-based redirects after login
 * 4. Prevents admin users from accessing customer-specific pages
 * 5. Redirects unauthenticated users to login
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow static assets, API routes, and Next.js internals to pass through
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') || // static files
    pathname.startsWith('/auth/') // auth pages
  ) {
    return NextResponse.next()
  }

  try {
    // Get the JWT token from the request
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    // If no token, redirect to login for protected routes
    if (!token) {
      // Only protect specific routes, not public pages
      const protectedRoutes = ['/admin', '/vendor', '/shop/cart', '/customer']
      if (protectedRoutes.some(route => pathname.startsWith(route))) {
        const loginUrl = new URL('/auth/signin', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }
      return NextResponse.next()
    }

    const userRole = token.role as string

    // Protect /admin routes - only ADMIN role can access
    if (pathname.startsWith('/admin')) {
      if (userRole !== USER_ROLES.ADMIN) {
        const unauthorizedUrl = new URL('/unauthorized', request.url)
        unauthorizedUrl.searchParams.set('message', 'Admin access required')
        return NextResponse.redirect(unauthorizedUrl)
      }
      return NextResponse.next()
    }

    // Protect /vendor routes - only VENDOR or ADMIN role can access
    if (pathname.startsWith('/vendor')) {
      if (userRole !== USER_ROLES.VENDOR && userRole !== USER_ROLES.ADMIN) {
        const unauthorizedUrl = new URL('/unauthorized', request.url)
        unauthorizedUrl.searchParams.set('message', 'Vendor access required')
        return NextResponse.redirect(unauthorizedUrl)
      }
      return NextResponse.next()
    }

    // Prevent admin users from accessing customer-specific pages
    // This ensures admins don't accidentally land on user pages
    if (userRole === USER_ROLES.ADMIN) {
      const customerOnlyRoutes = ['/shop/cart', '/customer/orders', '/customer/subscriptions']
      if (customerOnlyRoutes.some(route => pathname.startsWith(route))) {
        // Redirect admin users to admin dashboard instead of customer pages
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }

    // Allow access to all other routes
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    
    // On any error, redirect to login for safety
    const loginUrl = new URL('/auth/signin', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

// Configure the middleware to run on specific routes
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     * - API routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
