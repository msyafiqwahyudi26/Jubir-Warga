import Link from 'next/link';
import { Error404 } from '@/components/illustrations/error-404';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <Error404 size={300} />
      <p className="font-hand text-4xl text-jw-coral mt-4">404</p>
      <h1 className="font-display text-3xl font-bold text-jw-blue mt-2">
        Halaman tidak ditemukan
      </h1>
      <p className="text-jw-ink/70 mt-3 max-w-md">
        Mungkin halaman yang Mas/Mbak cari sudah pindah, atau memang belum ada di Phase 2.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-jw-lg bg-jw-blue px-5 py-2.5 font-semibold text-white hover:bg-jw-blue-soft transition"
      >
        Kembali ke beranda
      </Link>
    </main>
  );
}
