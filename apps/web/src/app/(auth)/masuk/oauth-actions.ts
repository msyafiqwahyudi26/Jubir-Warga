'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Initiate Google OAuth flow.
 * User akan di-redirect ke Google → consent → Supabase /callback → /auth/callback?code=...
 */
export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/masuk?error=oauth_${error.message.replace(/\s+/g, '_').toLowerCase()}`);
  }
  if (data?.url) {
    redirect(data.url);
  }
  redirect('/masuk?error=oauth_no_url');
}
