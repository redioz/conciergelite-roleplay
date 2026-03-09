import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Public paths that don't require auth
  const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify', '/auth/callback'];
  const isPublicPath = publicPaths.some((p) => pathname.startsWith(p));

  // Admin page stays unprotected
  if (pathname.startsWith('/admin')) {
    return response;
  }

  // Not logged in → redirect to login
  if (!user && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in on auth pages → redirect to app
  if (user && isPublicPath && !pathname.startsWith('/auth/callback')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
