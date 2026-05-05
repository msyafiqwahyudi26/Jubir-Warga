import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import { HeroTagihSpotlight } from '@/components/beranda/hero-tagih-spotlight';
import {
  JanjiProminentCards,
  JanjiProminentSkeleton,
} from '@/components/beranda/janji-prominent-cards';
import { JanjiVsRealitaCard } from '@/components/beranda/janji-vs-realita-card';
import { ThreadList, ThreadListSkeleton } from '@/components/beranda/thread-list';
import { FiturPendukungGrid } from '@/components/beranda/fitur-pendukung-grid';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';

// Spec #32+33 dual-layer Beranda. SiteHeader/SiteFooter di-wire global via
// app/layout.tsx (commit a85e988). Page tinggal isi konten utama:
//   1. Hero — brand-wide tagline + Sprint 4 Tagih spotlight card
//   2. Janji prominent (Tagih spotlight)
//   3. Janji vs Realita game card
//   4. Komunitas threads — yang lagi rame minggu ini (ekosistem visible)
//   5. Ekosistem grid — Karya/Kelas/Aksi/Komunitas (4 fitur lainnya)
export const revalidate = 60;

export default function HomePage() {
  return (
    <div className="bg-jw-cream text-jw-ink">
      <HeroTagihSpotlight />

      <Suspense fallback={<JanjiProminentSkeleton />}>
        <JanjiProminentCards />
      </Suspense>

      <JanjiVsRealitaCard />

      {/* Komunitas threads — ekosistem visible, bukan cuma Tagih spotlight */}
      <section className="py-12 border-b border-jw-line">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between mb-6 gap-3 flex-wrap">
            <div>
              <span
                className="font-hand text-lg text-jw-coral"
                aria-hidden="true"
              >
                — komunitas
              </span>
              <h2 className="font-display text-3xl font-bold text-jw-blue">
                Yang lagi rame minggu ini
              </h2>
            </div>
            <Link
              href="/komunitas"
              className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline"
            >
              Lihat semua <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
          <Suspense fallback={<ThreadListSkeleton />}>
            <ThreadList />
          </Suspense>
        </div>
      </section>

      <FiturPendukungGrid />

      <NalaTriggerButton context="tentang halaman ini" />
    </div>
  );
}
