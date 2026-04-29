import type { User } from '@supabase/supabase-js';

export function HelloUser({ user }: { user: User | null }) {
  if (!user) return null;
  const name = user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'warga';
  return (
    <p className="mt-4 inline-block rounded-jw-md bg-jw-pill-mint-bg border border-jw-mint/30 px-3 py-1.5 text-sm text-jw-pill-mint-text">
      Hai, <strong>{name}</strong>! Senang lihat kamu balik. 🌱
    </p>
  );
}
