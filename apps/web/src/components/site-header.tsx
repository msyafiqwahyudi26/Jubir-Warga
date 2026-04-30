import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { signOut } from '@/app/(auth)/masuk/actions';
import { JwLogo } from './jw-logo';

export function SiteHeader({ user }: { user: User | null }) {
  return (
    <header className="border-b border-jw-line bg-jw-cream/80 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" aria-label="Jubir Warga — beranda" className="flex-shrink-0">
          <JwLogo size={28} />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/komunitas" className="text-jw-ink hover:text-jw-coral transition">
            Komunitas
          </Link>
          <Link href="/karya" className="text-jw-ink hover:text-jw-coral transition">
            Karya
          </Link>
          <Link href="/kelas" className="text-jw-ink hover:text-jw-coral transition">
            Kelas
          </Link>
          <Link href="/tagih" className="text-jw-ink hover:text-jw-coral transition">
            Janji
          </Link>
          <Link href="/aksi" className="text-jw-ink hover:text-jw-coral transition">
            Aksi
          </Link>
        </nav>
        {user ? (
          <div className="flex items-center gap-3">
            <Link
              href="/profil"
              className="hidden sm:block text-sm font-medium text-jw-blue hover:underline"
            >
              {user.user_metadata?.name ?? user.email?.split('@')[0]}
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
