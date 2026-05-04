// Spec #21 — Main (game hub) page a11y. Renders the two game tile cards.
import { describe, it, expect } from 'vitest';
import { Gamepad2, Flame, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { renderAndScan } from './shared/render-with-axe';

function MainSurface() {
  const streak = 7;
  return (
    <main id="main-content" className="max-w-5xl mx-auto px-6 py-8">
      <header className="mb-8 flex items-end justify-between gap-4 flex-wrap border-b border-jw-line pb-6">
        <div>
          <span className="font-hand text-jw-coral text-base" aria-hidden="true">
            — main bareng
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-jw-blue leading-tight">
            Main
          </h1>
          <p className="text-base md:text-lg text-jw-ink/70 mt-2 max-w-xl">
            Ringan, harian, tetap ada bobotnya.
          </p>
        </div>
        <div className="text-right">
          <div
            className="inline-flex items-center gap-1.5 text-jw-coral"
            aria-label={`Streak ${streak} hari berturut-turut`}
          >
            <Flame size={20} aria-hidden />
            <span className="font-mono font-bold text-2xl">{streak}</span>
          </div>
          <p className="text-xs text-jw-muted">hari berturut-turut</p>
        </div>
      </header>

      <section aria-label="Daftar game" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/main/tebak-kata"
          className="group rounded-jw-xl bg-jw-blue text-jw-cream p-6 hover:bg-jw-blue-soft transition flex flex-col"
        >
          <span className="inline-flex items-center gap-1.5 rounded-jw-sm bg-jw-cream/15 text-jw-cream text-xs font-bold px-2 py-0.5 self-start">
            <Gamepad2 size={11} aria-hidden /> GAME HARI INI
          </span>
          <h2 className="font-display text-2xl font-bold mt-3 leading-tight">
            Tebak Kata Hari Ini
          </h2>
          <p className="text-sm opacity-80 mt-2">Kata warga 5 huruf · 6 percobaan</p>
          <span className="inline-flex items-center gap-1 mt-auto pt-4 text-sm font-semibold text-jw-coral">
            Main sekarang <ArrowRight size={14} aria-hidden />
          </span>
        </Link>

        <Link
          href="/main/tebak-pejabat"
          className="group rounded-jw-xl bg-jw-coral text-white p-6 hover:bg-jw-coral/90 transition flex flex-col"
        >
          <span className="inline-flex items-center gap-1.5 rounded-jw-sm bg-white/15 text-white text-xs font-bold px-2 py-0.5 self-start">
            <Trophy size={11} aria-hidden /> GAME #2
          </span>
          <h2 className="font-display text-2xl font-bold mt-3 leading-tight">
            Tebak Pejabat
          </h2>
          <p className="text-sm opacity-90 mt-2">Foto blur + 3 clue · 4 pilihan</p>
          <span className="inline-flex items-center gap-1 mt-auto pt-4 text-sm font-semibold text-jw-cream">
            Main sekarang <ArrowRight size={14} aria-hidden />
          </span>
        </Link>
      </section>
    </main>
  );
}

describe('Main a11y', () => {
  it('has no accessibility violations', async () => {
    const { results } = await renderAndScan(<MainSurface />);
    expect(results).toHaveNoViolations();
  });
});
