import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import {
  eligibleForGame,
  pickJanjiOfDay,
  type JanjiWithAlignment,
} from '@/lib/main/janji-vs-realita/janji-of-day';
import { isAlignmentStatus } from '@/lib/main/janji-vs-realita/constants';
import { GameClient } from './game-client';
import { Leaderboard } from './leaderboard';

export const metadata: Metadata = {
  title: 'Janji vs Realita — Main Jubir Warga',
  description:
    'Tebak verdict 4-pilihan: Aligned/Partial/Drift/Contradict. Fact-grounded, harian, 30 detik.',
};

// Re-fetch every 5 menit selama beta (cheap; Sprint 5+ pindah ke ISR + tag invalidation
// saat admin verify janji baru).
export const revalidate = 300;

export default async function JanjiVsRealitaPage() {
  const supabase = await createClient();

  // Fetch all janji, then filter client-side untuk eligibility. Window A
  // schema (Migration 0004 LIGHT) tambah alignment_status + editorial_status —
  // sebelum landed, semua row gagal eligibleForGame() → empty pool → empty state.
  const { data: rawList } = await supabase
    .from('janji')
    .select('*')
    .order('id', { ascending: true });

  const pool = ((rawList ?? []) as unknown as JanjiWithAlignment[]).filter(
    eligibleForGame,
  );

  const target = pickJanjiOfDay(new Date(), pool);

  // Pejabat untuk attribution (only kalau ada target)
  let pejabatNama: string | null = null;
  let pejabatJabatan: string | null = null;
  if (target?.pejabat_id) {
    const { data: pejabat } = await supabase
      .from('pejabat')
      .select('nama, jabatan')
      .eq('id', target.pejabat_id)
      .maybeSingle();
    pejabatNama = pejabat?.nama ?? null;
    pejabatJabatan = pejabat?.jabatan ?? null;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link
        href="/main"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-4"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke Main
      </Link>

      <header className="mb-6 text-center">
        <span className="font-hand text-jw-coral text-base">— hari ini</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue leading-tight">
          Janji vs Realita
        </h1>
        <p className="text-sm text-jw-muted mt-1">
          Tebak: Aligned · Partial · Drift · Contradict
        </p>
      </header>

      {target &&
      isAlignmentStatus(target.alignment_status) &&
      target.alignment_reasoning &&
      (target.editorial_status === 'verified_curator' ||
        target.editorial_status === 'curated_ai') ? (
        <GameClient
          janjiId={target.id}
          janjiText={target.janji_text}
          topik={target.topik}
          pejabatNama={pejabatNama}
          pejabatJabatan={pejabatJabatan}
          truthVerdict={target.alignment_status}
          reasoning={target.alignment_reasoning}
          sourceUrl={target.source_doc_url ?? target.source_url}
          sourcePage={target.source_doc_page}
          editorialStatus={
            target.editorial_status === 'verified_curator'
              ? 'verified_curator'
              : 'curated_ai'
          }
        />
      ) : (
        <EmptyPool />
      )}

      <section className="mt-10">
        <Leaderboard />
      </section>

      <NalaTriggerButton context="tentang Janji vs Realita" />
    </div>
  );
}

function EmptyPool() {
  return (
    <div className="rounded-jw-lg border border-dashed border-jw-line bg-white p-10 text-center flex flex-col items-center">
      <div className="rounded-full bg-jw-pill-grey-bg p-4 mb-3">
        <Lock size={28} aria-hidden className="text-jw-muted" />
      </div>
      <p className="font-hand text-xl text-jw-coral">— belum bisa main</p>
      <p className="text-sm text-jw-ink/70 mt-2 max-w-sm">
        Game akan tersedia setelah ada janji terverifikasi.
      </p>
      <p className="text-xs text-jw-muted italic mt-4 max-w-md">
        Tim editorial Jubir Warga lagi menyiapkan janji + verdict. Balik
        beberapa hari lagi atau ikut bantu via Tagih Janji.
      </p>
      <Link
        href="/tagih"
        className="inline-flex items-center gap-1 mt-6 rounded-jw-md bg-jw-coral px-4 py-2 text-sm font-semibold text-white hover:bg-jw-coral/90 transition active:scale-[0.97]"
      >
        Lihat Tagih Janji
      </Link>
    </div>
  );
}
