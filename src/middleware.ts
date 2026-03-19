import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for access token in multiple places
  const accessTokenCookie = request.cookies.get("access_token")?.value
  const authStorageCookie = request.cookies.get("auth-storage")?.value
  
  // Verify authentication
  const isAuthenticated = !!(accessTokenCookie || authStorageCookie)

  // Protected routes that require authentication
  const protectedRoutes = ['/profile', '/bookings', '/orders']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // If accessing protected route without auth, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Allow access to auth routes when already authenticated
  if (pathname.startsWith('/auth') && isAuthenticated && 
      !pathname.endsWith('/logout') && 
      !pathname.endsWith('/forgot-password')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const response = NextResponse.next()
  response.headers.set('x-custom-header', 'my-custom-value')
  
  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
