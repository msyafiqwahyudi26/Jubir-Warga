import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { JanjiRow } from '@/app/tagih/janji-row';

// Spec #32 — 4 janji teratas (most recent) sebagai signal "lagi ditagih hari ini".
// Filter editorial_status=verified_curator akan ditambah saat Migration 0004 LIGHT
// (Window A Spec #34) landed. Untuk sekarang ambil 4 janji terbaru dari view.
export async function JanjiProminentCards() {
  const supabase = await createClient();
  const { data: janjiList } = await supabase
    .from('janji_with_pejabat')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <section className="py-12 border-b border-jw-line">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHead
          kicker="hari ini"
          title="Janji yang lagi ditagih"
          href="/tagih"
          hrefLabel="Lihat semua →"
        />

        {!janjiList || janjiList.length === 0 ? (
          <div className="rounded-jw-lg border border-dashed border-jw-line p-8 text-center">
            <p className="font-hand text-lg text-jw-coral">
              — belum ada janji terlacak
            </p>
            <p className="text-sm text-jw-muted mt-1">
              Tim editorial sedang seed data. Coba lagi nanti, atau{' '}
              <Link href="/tagih/baru" className="text-jw-coral font-semibold hover:underline">
                lapor janji baru
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {janjiList.map((j) => (
              <JanjiRow key={j.id ?? Math.random()} janji={j} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function JanjiProminentSkeleton() {
  return (
    <section className="py-12 border-b border-jw-line">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHead kicker="hari ini" title="Janji yang lagi ditagih" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-jw-lg border border-jw-line bg-white p-4 animate-pulse"
            >
              <div className="h-3 w-1/3 bg-jw-pill-grey-bg rounded mb-3" />
              <div className="h-5 w-full bg-jw-pill-grey-bg rounded mb-2" />
              <div className="h-5 w-4/5 bg-jw-pill-grey-bg rounded mb-3" />
              <div className="h-3 w-1/4 bg-jw-pill-grey-bg rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
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
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-6 gap-3 flex-wrap">
      <div>
        <span className="font-hand text-lg text-jw-coral" aria-hidden="true">
          — {kicker}
        </span>
        <h2 className="font-display text-3xl font-bold text-jw-blue">{title}</h2>
      </div>
      {href && hrefLabel && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline"
        >
          {hrefLabel}
          <ArrowRight size={14} aria-hidden />
        </Link>
      )}
    </div>
  );
}
