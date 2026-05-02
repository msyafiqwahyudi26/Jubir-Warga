import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { JanjiForm } from './janji-form';

export const metadata: Metadata = {
  title: 'Submit janji baru — Tagih Janji Jubir Warga',
  description:
    'Catat janji pejabat publik yang perlu kamu tagih. Admin akan review sebelum tampil publik.',
};

export default async function TagihBaruPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/masuk?redirect=/tagih/baru');
  }

  const { data: pejabat } = await supabase
    .from('pejabat')
    .select('id, nama, jabatan, partai')
    .order('nama', { ascending: true })
    .limit(200);

  const pejabatOptions = (pejabat ?? []).map((p) => ({
    id: p.id,
    nama: p.nama,
    jabatan: p.jabatan,
    partai: p.partai,
  }));

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link
        href="/tagih"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-4"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke Tagih Janji
      </Link>

      <header className="mb-6">
        <span className="font-hand text-jw-coral text-base">— submit</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue leading-tight">
          Catat janji baru
        </h1>
        <p className="text-base text-jw-ink/80 mt-3">
          Janji yang kamu submit akan direview admin dulu (cek validitas sumber)
          sebelum tampil publik. Sprint 3 = pending review; panel moderasi
          dedicated Sprint 4.
        </p>
      </header>

      <JanjiForm pejabatOptions={pejabatOptions} />
    </div>
  );
}
