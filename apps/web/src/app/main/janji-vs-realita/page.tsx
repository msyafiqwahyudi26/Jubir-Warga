import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft, Lock } from 'lucide-react';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import { JANJI_VS_REALITA_POOL } from '@/lib/main/janji-vs-realita/pool-seed';
import { pickJanjiOfDay } from '@/lib/main/janji-vs-realita/janji-of-day';
import { GameClient } from './game-client';
import { Leaderboard } from './leaderboard';

export const metadata: Metadata = {
  title: 'Janji vs Realita — Main Jubir Warga',
  description:
    'Tebak verdict 4-pilihan: Aligned / Partial / Drift / Contradict. Fact-grounded, harian, 30 detik.',
};

// Daily refresh — janji-of-day rotates per UTC day. revalidate 1 jam cukup;
// new day akan trigger fresh pick di next visitor.
export const revalidate = 3600;

export default function JanjiVsRealitaPage() {
  const target = pickJanjiOfDay(new Date(), JANJI_VS_REALITA_POOL);

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

      {target ? (
        <GameClient entry={target} />
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
      <p className="font-hand text-xl text-jw-coral">— belum ada janji</p>
      <p className="text-sm text-jw-ink/70 mt-2 max-w-sm">
        Game baru aktif besok! Tim editorial Jubir Warga lagi nyiapin janji buat
        ditebak.
      </p>
      <Link
        href="/tagih"
        className="inline-flex items-center gap-1 mt-6 rounded-jw-md bg-jw-coral px-4 py-2 text-sm font-semibold text-white hover:bg-jw-coral/90 transition active:scale-[0.97]"
      >
        Sambil itu, lihat Tagih Janji →
      </Link>
    </div>
  );
}
