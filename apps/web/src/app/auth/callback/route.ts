/**
 * OAuth + magic link callback handler.
 *
 * Email/magic-link flow: Supabase redirect ke `/auth/callback?code=xxx`.
 * Kita exchange code → session, lalu redirect ke `/` atau `?next=/path`.
 *
 * Google OAuth flow: sama persis.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect dengan handling untuk forwarded host (kalau via proxy/CDN)
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Error case — redirect ke login dengan error message
  return NextResponse.redirect(`${origin}/masuk?error=auth_callback_failed`);
}
