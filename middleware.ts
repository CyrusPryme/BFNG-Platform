import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { USER_ROLES } from '@/lib/roles'

/**
 * Middleware to protect all /admin routes
 * 
 * This middleware:
 * 1. Checks if user is authenticated via JWT token
 * 2. Validates user has ADMIN role
 * 3. Redirects unauthenticated users to login
 * 4. Redirects non-admin users to unauthorized page
 * 5. Allows access to authenticated admin users
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes and their sub-routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow static assets and API routes within admin to pass through
  if (
    pathname.startsWith('/admin/_next/') ||
    pathname.startsWith('/admin/api/') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next()
  }

  try {
    // Get the JWT token from the request
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/auth/signin', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Validate the token and check for ADMIN role
    if (token.role !== USER_ROLES.ADMIN) {
      // User is authenticated but not an admin
      const unauthorizedUrl = new URL('/unauthorized', request.url)
      unauthorizedUrl.searchParams.set('message', 'Admin access required')
      return NextResponse.redirect(unauthorizedUrl)
    }

    // User is authenticated and has ADMIN role - allow access
    return NextResponse.next()
  } catch (error) {
    console.error('Admin middleware error:', error)
    
    // On any error, redirect to login for safety
    const loginUrl = new URL('/auth/signin', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

// Configure the middleware to run on all /admin routes
export const config = {
  matcher: [
    /*
     * Match all paths that start with /admin
     * Exclude static files, API routes, and Next.js internals
     */
    '/admin/:path*',
  ],
}
