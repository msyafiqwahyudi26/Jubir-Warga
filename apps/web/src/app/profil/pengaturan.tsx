import { Bell, Lock } from 'lucide-react';
import { signOut } from '@/app/(auth)/masuk/actions';

export function Pengaturan() {
  return (
    <div className="space-y-4">
      <article className="rounded-jw-lg border border-jw-line bg-white p-5">
        <header className="flex items-center gap-2 mb-2">
          <Bell size={16} aria-hidden className="text-jw-coral" />
          <h3 className="font-display font-semibold text-jw-blue">
            Notifikasi
          </h3>
        </header>
        <p className="text-sm text-jw-muted">
          Atur pemberitahuan email + push notification. Tersedia Sprint 4.
        </p>
      </article>

      <article className="rounded-jw-lg border border-jw-line bg-white p-5">
        <header className="flex items-center gap-2 mb-2">
          <Lock size={16} aria-hidden className="text-jw-coral" />
          <h3 className="font-display font-semibold text-jw-blue">Privasi</h3>
        </header>
        <p className="text-sm text-jw-muted">
          Profil privat, sembunyikan stats, dan ekspor data (UU PDP) tersedia
          Sprint 4-5.
        </p>
      </article>

      <article className="rounded-jw-lg border border-jw-line bg-white p-5">
        <h3 className="font-display font-semibold text-jw-blue mb-2">Akun</h3>
        <p className="text-sm text-jw-muted mb-3">
          Keluar dari semua perangkat di sini.
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-jw-md border border-jw-coral bg-white px-4 py-2 text-sm font-semibold text-jw-coral hover:bg-jw-pill-coral-bg/40 transition"
          >
            Keluar dari akun
          </button>
        </form>
      </article>
    </div>
  );
}
