import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { signOut } from '@/app/(auth)/masuk/actions';
import { JwLogo } from './jw-logo';
import { NalaPanelTrigger } from './nala/nala-panel-trigger';
import { NavLinks } from './nav-links';
import { Avatar } from './ui/avatar';

export function SiteHeader({ user }: { user: User | null }) {
  const userName =
    (user?.user_metadata?.name as string | undefined) ??
    user?.email?.split('@')[0] ??
    '';

  return (
    <header
      className="border-b border-jw-line bg-jw-cream/80 backdrop-blur sticky top-0 z-20"
      role="banner"
    >
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Jubir Warga — beranda"
          className="flex-shrink-0"
        >
          <JwLogo size={28} />
        </Link>
        <NavLinks />
        {user ? (
          <div className="flex items-center gap-3">
            <NalaPanelTrigger />
            <Link
              href="/profil"
              aria-label={`Profil ${userName}`}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-jw-blue hover:opacity-80 transition"
            >
              <Avatar name={userName} size="sm" showLevel={false} />
              <span className="hidden lg:inline">{userName}</span>
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-jw-md border border-jw-line bg-white px-3 py-1.5 text-sm font-medium text-jw-ink hover:bg-jw-pill-grey-bg transition"
              >
                Keluar
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NalaPanelTrigger />
            <Link
              href="/masuk"
              className="rounded-jw-md px-3 py-2 text-sm text-jw-blue hover:bg-jw-pill-blue-bg transition"
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="rounded-jw-md bg-jw-coral px-4 py-2 text-sm font-semibold text-white hover:bg-jw-coral/90 transition"
            >
              Daftar
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
