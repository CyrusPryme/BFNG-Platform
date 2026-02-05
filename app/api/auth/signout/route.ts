import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Create a response that clears the session cookie
    const response = NextResponse.json({ success: true })
    
    // Clear the session cookie
    response.cookies.set('next-auth.session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })
    
    // Clear the CSRF token cookie
    response.cookies.set('next-auth.csrf-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })
    
    return response
  } catch (error) {
    console.error('Signout error:', error)
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    )
  }
}
