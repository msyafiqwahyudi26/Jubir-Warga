import Link from 'next/link';
import { ArrowRight, Gamepad2, Sparkles } from 'lucide-react';

/**
 * Beranda promo card untuk /main/janji-vs-realita game (Spec #28-LIGHT).
 * Drop-in replacement untuk inline `JanjiVsRealitaPromoCard()` di
 * apps/web/src/app/page.tsx (Window D placeholder).
 *
 * Visual: blue section + cream text + coral CTA, prominent + brand-aligned.
 * Mobile-first: right "?" teaser hidden < md (avoid overflow di 375px).
 */
export function JanjiVsRealitaCard() {
  return (
    <section
      className="py-12 border-b border-jw-line bg-jw-blue text-jw-cream"
      aria-labelledby="jvr-card-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-jw-sm bg-jw-cream/15 text-jw-cream text-xs font-bold px-2 py-0.5">
              <Sparkles size={11} aria-hidden /> GAME HARI INI
            </span>
            <h2
              id="jvr-card-heading"
              className="font-display text-3xl md:text-4xl font-bold mt-3 leading-tight"
            >
              Janji vs Realita
            </h2>
            <p className="mt-3 text-base md:text-lg text-jw-cream/85 leading-relaxed max-w-xl">
              Tebak janji ini ditepati atau diingkari, terus lihat data + reasoning-nya.
              30 detik, harian, fact-grounded.
            </p>
            <Link
              href="/main/janji-vs-realita"
              className="inline-flex items-center gap-1.5 mt-6 rounded-jw-lg bg-jw-coral px-6 py-3 font-semibold text-white hover:bg-jw-coral/90 transition active:scale-[0.97] duration-200"
            >
              <Gamepad2 size={18} aria-hidden /> Main sekarang
              <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="rounded-jw-xl bg-jw-cream/10 border border-jw-cream/20 p-8 text-center w-72">
              <div
                className="font-display text-7xl font-bold text-jw-coral leading-none"
                aria-hidden="true"
              >
                ?
              </div>
              <p className="mt-3 font-hand text-lg text-jw-cream/90">
                kira-kira ditepati nggak ya?
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
