import Link from 'next/link';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { SiteHeader } from '@/components/site-header';
import { ThreadList, ThreadListSkeleton } from '@/components/beranda/thread-list';
import { PetisiPreview, PetisiSkeleton } from '@/components/beranda/petisi-preview';
import { JanjiTracker, JanjiSkeleton } from '@/components/beranda/janji-tracker';
import { HelloUser } from '@/components/beranda/hello-user';

export const revalidate = 60; // ISR — re-render setiap 60 detik

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function todayString() {
  const d = new Date();
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

export default async function HomePage() {
  // Auth status untuk personalized greeting
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-jw-cream text-jw-ink">
      <SiteHeader user={user} />

      {/* HERO */}
      <section className="border-b border-jw-line py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <span className="font-hand text-lg text-jw-coral">{todayString()}</span>
              <h1 className="font-display font-bold mt-2 leading-tight text-jw-blue text-5xl md:text-7xl">
                Hari ini,<br />
                <em>kita ngomongin</em><br />
                <span className="text-jw-coral">Pasal 28E.</span>
              </h1>
              <p className="mt-4 text-base md:text-lg max-w-md leading-relaxed text-jw-ink/80">
                Hak berekspresi yang dijamin konstitusi — tapi seberapa jauh sudah dipraktikkan?
              </p>
              <HelloUser user={user} />
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/komunitas"
                  className="rounded-jw-lg bg-jw-coral px-6 py-3 font-semibold text-white hover:bg-jw-coral/90 transition shadow-jw-md"
                >
                  Ikut diskusi →
                </Link>
                <Link
                  href="/kelas"
                  className="rounded-jw-lg border border-jw-line bg-white px-6 py-3 font-semibold text-jw-blue hover:bg-jw-pill-grey-bg transition"
                >
                  Baca lebih dalam
                </Link>
              </div>
            </div>

            {/* Illustration */}
            <div className="hidden md:flex w-72 aspect-[4/3] rounded-3xl flex-col items-center justify-center relative overflow-hidden border-2 border-dashed border-jw-line bg-jw-blue/[0.04]">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle cx="36" cy="24" r="14" fill="#1A2256" opacity=".14" />
                <rect x="16" y="42" width="40" height="24" rx="7" fill="#1A2256" opacity=".10" />
                <rect x="22" y="48" width="28" height="3" rx="1.5" fill="#1A2256" opacity=".35" />
                <rect x="22" y="54" width="20" height="3" rx="1.5" fill="#1A2256" opacity=".25" />
                <rect x="22" y="60" width="24" height="3" rx="1.5" fill="#1A2256" opacity=".18" />
              </svg>
              <span className="font-mono text-xs mt-2 text-jw-blue/30">warga baca dokumen</span>
              <span className="font-hand text-sm absolute top-2 right-3 text-jw-coral rotate-[4deg]">
                ← kamu juga bisa!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* THREADS — live dari Supabase */}
      <section className="py-12 border-b border-jw-line">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHead
            kicker="komunitas"
            title="Yang lagi rame minggu ini"
            href="/komunitas"
            hrefLabel="Lihat semua →"
          />
          <Suspense fallback={<ThreadListSkeleton />}>
            <ThreadList />
          </Suspense>
        </div>
      </section>

      {/* PETISI + JANJI — live counters */}
      <section className="py-12 border-b border-jw-line">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-6">
          <Suspense fallback={<PetisiSkeleton />}>
            <PetisiPreview />
          </Suspense>
          <Suspense fallback={<JanjiSkeleton />}>
            <JanjiTracker />
          </Suspense>
        </div>
      </section>

      <footer className="py-12 mt-8">
        <div className="mx-auto max-w-6xl px-4 text-sm text-jw-ink/60">
          © 2026 SPD Indonesia · Jubir Warga ·{' '}
          <Link href="/api/healthcheck" className="underline">
            Status sistem
          </Link>
        </div>
      </footer>
    </main>
  );
}

function SectionHead({
  kicker,
  title,
  href,
  hrefLabel,
}: {
  kicker: string;
  title: string;
  href: string;
  hrefLabel: string;
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <span className="font-hand text-lg text-jw-coral">— {kicker}</span>
        <h2 className="font-display text-3xl font-bold text-jw-blue">{title}</h2>
      </div>
      <Link href={href} className="text-sm font-semibold text-jw-coral hover:underline">
        {hrefLabel}
      </Link>
    </div>
  );
}
