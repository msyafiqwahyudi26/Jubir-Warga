import Link from 'next/link';
import { LoginForm } from './login-form';

export const metadata = {
  title: 'Masuk',
};

export default function MasukPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  return (
    <div>
      <div className="text-center mb-8">
        <p className="font-hand text-2xl text-jw-coral">— selamat datang kembali</p>
        <h1 className="font-display text-3xl font-bold text-jw-blue mt-1">Masuk ke Jubir Warga</h1>
      </div>
      <LoginForm searchParams={searchParams} />
      <p className="text-center text-sm text-jw-ink/70 mt-6">
        Belum punya akun?{' '}
        <Link href="/daftar" className="text-jw-coral font-semibold hover:underline">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}
