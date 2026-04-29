import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths kecuali:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon, icons, manifest, sw
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|service-worker.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
