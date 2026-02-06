import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { USER_ROLES } from '@/lib/roles'

/**
 * Enhanced middleware for strict role-based route protection
 * 
 * This middleware:
 * 1. Protects /admin routes - only ADMIN role can access
 * 2. Protects /vendor routes - only VENDOR or ADMIN role can access
 * 3. COMPLETELY BLOCKS admin users from customer-facing pages
 * 4. Protects customer-specific routes from unauthorized access
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
      const protectedRoutes = ['/admin', '/vendor', '/shop/cart', '/customer', '/subscriptions']
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

    // COMPLETELY BLOCK admin users from customer-facing pages
    // Admin users should only see admin functionality
    if (userRole === USER_ROLES.ADMIN) {
      const customerOnlyRoutes = [
        '/shop',
        '/subscriptions',
        '/customer',
        '/shop/cart',
        '/customer/orders',
        '/customer/subscriptions',
        '/customer/profile'
      ]
      
      if (customerOnlyRoutes.some(route => pathname.startsWith(route))) {
        // Redirect admin users to admin dashboard
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }

    // Protect customer-specific routes from non-customer users
    if (pathname.startsWith('/customer')) {
      if (userRole !== USER_ROLES.CUSTOMER && userRole !== USER_ROLES.ADMIN) {
        const unauthorizedUrl = new URL('/unauthorized', request.url)
        unauthorizedUrl.searchParams.set('message', 'Customer access required')
        return NextResponse.redirect(unauthorizedUrl)
      }
      return NextResponse.next()
    }

    // Protect subscription routes
    if (pathname.startsWith('/subscriptions')) {
      if (userRole !== USER_ROLES.CUSTOMER && userRole !== USER_ROLES.ADMIN) {
        const unauthorizedUrl = new URL('/unauthorized', request.url)
        unauthorizedUrl.searchParams.set('message', 'Customer access required')
        return NextResponse.redirect(unauthorizedUrl)
      }
      return NextResponse.next()
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
