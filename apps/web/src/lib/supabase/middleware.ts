/**
 * Auth middleware helper — refresh expired tokens dan attach session ke
 * request supaya Server Component bisa baca user. Dipanggil dari middleware.ts.
 */
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@jw/data/types';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // CRITICAL: jangan ada apapun antara createServerClient dan getUser().
  // Token refresh harus dilakukan tanpa side-effect lain.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes — redirect ke /masuk kalau belum login
  const path = request.nextUrl.pathname;
  const isProtected =
    path.startsWith('/profil') ||
    path.startsWith('/lapor/baru') ||
    path.startsWith('/janji/submit') ||
    path.startsWith('/buat');

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/masuk';
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  // Auth pages — redirect ke / kalau sudah login
  const isAuthPage = path === '/masuk' || path === '/daftar';
  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return response;
}
