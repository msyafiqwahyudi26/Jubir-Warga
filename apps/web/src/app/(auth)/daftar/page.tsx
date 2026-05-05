import Link from 'next/link';
import { SignUpForm } from './signup-form';

export const metadata = {
  title: 'Daftar',
};

export default function DaftarPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <p className="font-hand text-2xl text-jw-coral" aria-hidden="true">— senang ketemu kamu</p>
        <h1 className="font-display text-3xl font-bold text-jw-blue mt-1">Bikin akun warga</h1>
        <p className="text-sm text-jw-ink/70 mt-2">
          Ngumpul, bersuara, berkarya, belajar — bareng warga muda Indonesia. Gratis, tanpa iklan. Datamu kamu yang punya.
        </p>
      </div>
      <SignUpForm />
      <p className="text-center text-sm text-jw-ink/70 mt-6">
        Sudah punya akun?{' '}
        <Link href="/masuk" className="text-jw-coral font-semibold hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
