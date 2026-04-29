/**
 * Supabase browser client — dipakai di Client Component & event handler.
 * Auth session di-cookie supaya server bisa baca via createServerClient().
 */
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@jw/data/types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
