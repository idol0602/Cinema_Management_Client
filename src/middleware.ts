import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl

  const accessToken = request.cookies.get("access_token")?.value
  if(pathname.startsWith("/profile") && !accessToken) {
    console.log("chưa login")
    return NextResponse.redirect(new URL("/auth/login", request.url))
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
