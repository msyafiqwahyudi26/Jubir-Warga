import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import { todayWord } from '@/lib/main/word-of-day';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import { TebakKataGame } from './tebak-kata-game';
import { LeaderboardTebakKata } from './leaderboard-tebak-kata';

export const metadata: Metadata = {
  title: 'Tebak Kata Hari Ini — Main Jubir Warga',
  description: 'Tebak kata warga 5 huruf, 6 percobaan. Daily.',
};

export default function TebakKataPage() {
  const answer = todayWord();

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
          Tebak Kata Hari Ini
        </h1>
        <p className="text-sm text-jw-muted mt-1">
          Kata warga 5 huruf · 6 percobaan
        </p>
      </header>

      <TebakKataGame answer={answer} />

      <section className="mt-10">
        <LeaderboardTebakKata />
      </section>

      <NalaTriggerButton context="tentang Tebak Kata" />
    </div>
  );
}
