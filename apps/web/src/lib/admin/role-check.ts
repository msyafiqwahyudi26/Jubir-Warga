/**
 * Admin role check helpers — Server-side only. Reads profiles.is_admin
 * (existing column from migration 0001).
 *
 * Use `requireAdmin()` di Server Component / layout untuk redirect non-admin
 * keluar dari /admin/* tree. Use `isCurrentUserAdmin()` kalau perlu boolean
 * tanpa redirect (mis. untuk conditionally render link Admin di header).
 */
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type AdminContext = {
  userId: string;
  email: string | null;
  name: string | null;
};

/**
 * Check current session has profiles.is_admin = true. Redirects to /masuk
 * (kalau anonymous) atau / (kalau logged in tapi bukan admin).
 *
 * Returns the admin context (userId + email + name) untuk dipakai oleh
 * downstream Server Action / audit logger.
 */
export async function requireAdmin(): Promise<AdminContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/masuk?redirect=/admin');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, name, is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    redirect('/');
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    name: profile.name ?? null,
  };
}

/**
 * Boolean check tanpa redirect. Useful untuk conditionally render link
 * "Admin Panel" di SiteHeader untuk admin user.
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  return profile?.is_admin === true;
}
