import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware agora apenas passa requisições através
  // Proteção de rota é feita no lado do cliente com ProtectedRoute component
  // Isso evita race condition entre server-side cookie verification e client-side state
  
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
