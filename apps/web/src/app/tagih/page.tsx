import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { parseTagihFilter, type TagihFilter } from '@/lib/tagih/filters';
import {
  emptyStatusBreakdown,
  isJanjiStatus,
  type StatusBreakdown,
} from '@/lib/tagih/constants';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import { TagihSkeleton } from '@/components/skeletons/tagih-skeleton';
import { TagihHero } from './tagih-hero';
import { TagihStats } from './tagih-stats';
import { PetaIndonesia } from './peta-indonesia';
import { PartaiDashboard } from './partai-dashboard';
import { JanjiFilters } from './janji-filters';
import { JanjiRow } from './janji-row';

export const metadata: Metadata = {
  title: 'Tagih Janji — Jubir Warga',
  description:
    'Setiap janji yang diucapkan, kita catat. Yang ditepati, kita rayakan. Yang diingkari, kita ingatkan.',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const LIST_LIMIT = 50;

export default async function TagihPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filter = parseTagihFilter(sp);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <TagihHero />

      <Suspense fallback={<TagihStatsLoading />}>
        <TagihStatsBlock />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
        <PetaIndonesia />
        <PartaiDashboard />
      </div>

      <section id="daftar-janji" className="mt-12 scroll-mt-20">
        <Suspense
          key={JSON.stringify(filter)}
          fallback={<JanjiListLoading filter={filter} />}
        >
          <JanjiList filter={filter} />
        </Suspense>
      </section>

      <NalaTriggerButton context="tentang Tagih Janji" />
    </main>
  );
}

function TagihStatsLoading() {
  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-jw-lg border border-jw-line bg-white p-4 animate-pulse"
        >
          <div className="h-3 w-1/2 bg-jw-pill-grey-bg rounded mb-2" />
          <div className="h-6 w-2/3 bg-jw-pill-grey-bg rounded" />
        </div>
      ))}
    </div>
  );
}

async function TagihStatsBlock() {
  const supabase = await createClient();
  const { data } = await supabase.from('janji').select('status');
  const total = data?.length ?? 0;
  const breakdown: StatusBreakdown = (data ?? []).reduce((acc, row) => {
    if (isJanjiStatus(row.status)) acc[row.status] += 1;
    return acc;
  }, emptyStatusBreakdown());
  return <TagihStats total={total} breakdown={breakdown} className="mt-8" />;
}

function JanjiListLoading({ filter }: { filter: TagihFilter }) {
  return (
    <>
      <header className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <span className="font-hand text-jw-coral text-base">
            — daftar janji
          </span>
          <h2 className="font-display text-2xl font-bold text-jw-blue">
            Memuat janji…
          </h2>
        </div>
      </header>
      <JanjiFilters
        currentStatus={filter.status}
        currentLevel={filter.level}
      />
      <div className="mt-4">
        <TagihSkeleton />
      </div>
    </>
  );
}

async function JanjiList({ filter }: { filter: TagihFilter }) {
  const supabase = await createClient();

  // Level filter is on `pejabat.level` which the view doesn't expose. Sprint 3
  // workaround: pre-select pejabat ids by level, then `.in()` on janji query.
  let pejabatIds: string[] | null = null;
  if (filter.level) {
    const { data: filteredPejabat } = await supabase
      .from('pejabat')
      .select('id')
      .eq('level', filter.level);
    pejabatIds = (filteredPejabat ?? []).map((p) => p.id);
  }

  let janjiQuery = supabase
    .from('janji_with_pejabat')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(LIST_LIMIT);
  if (filter.status) janjiQuery = janjiQuery.eq('status', filter.status);
  if (pejabatIds !== null) {
    if (pejabatIds.length === 0) {
      janjiQuery = janjiQuery.eq('id', '00000000-0000-0000-0000-000000000000');
    } else {
      janjiQuery = janjiQuery.in('pejabat_id', pejabatIds);
    }
  }

  const janjiRes = await janjiQuery;
  const janjiList = janjiRes.data ?? [];

  return (
    <>
      <header className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <span className="font-hand text-jw-coral text-base">
            — daftar janji
          </span>
          <h2 className="font-display text-2xl font-bold text-jw-blue">
            {janjiRes.count ?? 0} janji terlacak
          </h2>
        </div>
        <Link
          href="/tagih/baru"
          className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-coral text-white px-4 py-2 text-sm font-semibold hover:bg-jw-coral/90 active:scale-[0.97] transition-all duration-200"
        >
          <Plus size={14} aria-hidden /> Submit janji baru
        </Link>
      </header>

      <JanjiFilters
        currentStatus={filter.status}
        currentLevel={filter.level}
      />

      {janjiList.length === 0 ? (
        <div className="mt-6 rounded-jw-lg border border-dashed border-jw-line p-10 text-center">
          <p className="font-hand text-xl text-jw-coral">
            — belum ada janji sesuai filter
          </p>
          <p className="text-sm text-jw-muted mt-2">
            Coba reset filter atau submit janji baru.
          </p>
          {(filter.status || filter.level) && (
            <Link
              href="/tagih"
              className="inline-block mt-4 text-sm font-semibold text-jw-coral hover:underline"
            >
              Reset filter
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {janjiList.map((j) => (
            <JanjiRow key={j.id ?? Math.random()} janji={j} />
          ))}
        </div>
      )}
    </>
  );
}
