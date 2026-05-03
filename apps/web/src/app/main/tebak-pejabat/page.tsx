import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import {
  pickPejabatOfDay,
  pickDistractors,
} from '@/lib/main/pejabat-of-day';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import { TebakPejabatGame } from './tebak-pejabat-game';
import { LeaderboardTebakPejabat } from './leaderboard-tebak-pejabat';

export const metadata: Metadata = {
  title: 'Tebak Pejabat — Main Jubir Warga',
  description: 'Foto blur + 3 clue + 4 pilihan. Tebak pejabat publik hari ini.',
};

export default async function TebakPejabatPage() {
  const supabase = await createClient();
  const { data: pejabatList } = await supabase
    .from('pejabat')
    .select('*')
    .order('id', { ascending: true });

  const list = pejabatList ?? [];
  const today = new Date();
  const target = pickPejabatOfDay(today, list);

  if (!target) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link
          href="/main"
          className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-4"
        >
          <ChevronLeft size={14} aria-hidden /> Kembali ke Main
        </Link>
        <p className="text-sm text-jw-muted italic">
          Belum ada pejabat di database. Game tersedia setelah seed pejabat.
        </p>
      </div>
    );
  }

  // Build 3 progressive clues + 4-choice list (target + 3 distractors).
  const clues: string[] = [
    target.jabatan ?? 'Jabatan publik (jabatan tidak tercatat).',
    `Level: ${target.level ?? '—'}${target.dapil ? ' · Dapil ' + target.dapil : ''}`,
    `Partai: ${target.partai ?? '—'}${target.skor != null ? ' · Skor janji ' + target.skor + '/100' : ''}`,
  ];

  const distractors = pickDistractors(today, list, target.id, 3);
  const allChoices = [target, ...distractors];

  // Stable shuffle by id-derived hash so order is deterministic per day.
  const dayIndex = Math.floor(
    (today.getTime() - new Date('2026-01-01T00:00:00Z').getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const shuffled = [...allChoices].sort((a, b) => {
    const ha = (a.id.charCodeAt(0) + dayIndex) % 7;
    const hb = (b.id.charCodeAt(0) + dayIndex) % 7;
    return ha - hb;
  });

  const choices = shuffled.map((p) => ({ id: p.id, nama: p.nama }));

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
          Tebak Pejabat
        </h1>
        <p className="text-sm text-jw-muted mt-1">
          Foto blur + 3 clue · 4 pilihan
        </p>
      </header>

      <TebakPejabatGame
        targetId={target.id}
        targetNama={target.nama}
        targetPhotoUrl={target.photo_url}
        clues={clues}
        choices={choices}
      />

      <section className="mt-10">
        <LeaderboardTebakPejabat />
      </section>

      <NalaTriggerButton context="tentang Tebak Pejabat" />
    </div>
  );
}
