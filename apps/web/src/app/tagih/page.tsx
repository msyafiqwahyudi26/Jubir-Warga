import Link from 'next/link';
import type { Metadata } from 'next';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { parseTagihFilter } from '@/lib/tagih/filters';
import {
  emptyStatusBreakdown,
  isJanjiStatus,
  type StatusBreakdown,
} from '@/lib/tagih/constants';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
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
      // No pejabat at this level → guarantee empty result without round-trip.
      janjiQuery = janjiQuery.eq('id', '00000000-0000-0000-0000-000000000000');
    } else {
      janjiQuery = janjiQuery.in('pejabat_id', pejabatIds);
    }
  }

  const [janjiRes, statsRes] = await Promise.all([
    janjiQuery,
    supabase.from('janji').select('status'),
  ]);

  const janjiList = janjiRes.data ?? [];
  const total = statsRes.data?.length ?? 0;
  const breakdown: StatusBreakdown = (statsRes.data ?? []).reduce(
    (acc, row) => {
      if (isJanjiStatus(row.status)) acc[row.status] += 1;
      return acc;
    },
    emptyStatusBreakdown(),
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <TagihHero />

      <TagihStats total={total} breakdown={breakdown} className="mt-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
        <PetaIndonesia />
        <PartaiDashboard />
      </div>

      <section id="daftar-janji" className="mt-12 scroll-mt-20">
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
            className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-coral text-white px-4 py-2 text-sm font-semibold hover:bg-jw-coral/90 transition"
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
      </section>

      <NalaTriggerButton context="tentang Tagih Janji" />
    </div>
  );
}
