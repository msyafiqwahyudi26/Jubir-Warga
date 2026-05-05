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
import {
  computeAlignmentBreakdown,
  pendingReviewCount,
} from '@/lib/tagih/alignment-counter';
import {
  ALIGNMENT_SEED,
  alignmentSeedSize,
  lookupAlignmentSeed,
} from '@/lib/tagih/alignment-seed';
import { isAlignmentStatus } from '@/lib/tagih/alignment';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import { TagihSkeleton } from '@/components/skeletons/tagih-skeleton';
import { TagihHero } from './tagih-hero';
import { TagihStats } from './tagih-stats';
import { PetaIndonesia } from './peta-indonesia';
import { PartaiDashboard } from './partai-dashboard';
import { AlignmentStats } from './components/alignment-stats';
import { FilterAdvanced } from './components/filter-advanced';
import {
  JanjiCardWithBadge,
  type JanjiViewWithAlignment,
} from './components/janji-card-with-badge';

export const metadata: Metadata = {
  title: 'Tagih Janji — Jubir Warga',
  description:
    'Setiap janji punya jejak. Pantau alignment janji pejabat dengan RPJMN/RPJMD/Visi Misi — bareng warga muda Indonesia.',
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

      {/* Status breakdown (Sprint 3 carry-over) — count per Belum/Berjalan/dst */}
      <Suspense fallback={<TagihStatsLoading />}>
        <TagihStatsBlock />
      </Suspense>

      {/* Alignment breakdown (Spec #24-LIGHT phase 1) — frontend seed enrichment */}
      <Suspense fallback={<AlignmentStatsLoading />}>
        <AlignmentStatsBlock />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
        <PetaIndonesia />
        <PartaiDashboard />
      </div>

      <section id="daftar-janji" className="mt-12 scroll-mt-20">
        <header className="mb-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <span className="font-hand text-jw-coral text-base" aria-hidden="true">
              — daftar janji
            </span>
            <h2 className="font-display text-2xl font-bold text-jw-blue">
              Janji terlacak
            </h2>
          </div>
          <Link
            href="/tagih/baru"
            className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-coral text-white px-4 py-2 text-sm font-semibold hover:bg-jw-coral/90 active:scale-[0.97] transition-all duration-200"
          >
            <Plus size={14} aria-hidden /> Submit janji baru
          </Link>
        </header>

        <FilterAdvanced filter={filter} />

        <Suspense
          key={JSON.stringify(filter)}
          fallback={
            <div className="mt-4">
              <TagihSkeleton />
            </div>
          }
        >
          <JanjiList filter={filter} />
        </Suspense>
      </section>

      <NalaTriggerButton context="tentang Tagih Janji" />
    </main>
  );
}

// ─── Status (Belum/Berjalan/Mandek/Ditepati/Diingkari) ───────────────

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

// ─── Alignment (aligned/partial/drift/contradict) — phase 1 frontend seed ─

function AlignmentStatsLoading() {
  return (
    <div className="mt-8">
      <div className="h-5 w-48 bg-jw-pill-grey-bg rounded animate-pulse mb-3" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-jw-lg border border-jw-line bg-white p-4 animate-pulse"
          >
            <div className="h-4 w-24 bg-jw-pill-grey-bg rounded mb-3" />
            <div className="h-7 w-12 bg-jw-pill-grey-bg rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

async function AlignmentStatsBlock() {
  const supabase = await createClient();
  // Fetch janji ids untuk hitung total + cross-check seed coverage. Phase 1
  // stay frontend-only — alignment_status enrichment murni dari ALIGNMENT_SEED.
  const { data } = await supabase.from('janji').select('id');
  const allIds = (data ?? []).map((r) => r.id).filter((x): x is string => !!x);

  // Build pseudo-rows: lookup seed per id; pakai id ini supaya counter
  // bisa hitung dari single source of truth.
  const enriched = allIds.map((id) => ({
    alignment_status: lookupAlignmentSeed(id)?.status ?? null,
  }));

  const breakdown = computeAlignmentBreakdown(enriched);
  const pending = pendingReviewCount(enriched);
  return <AlignmentStats breakdown={breakdown} pendingCount={pending} />;
}

// ─── Janji list ──────────────────────────────────────────────────────

async function JanjiList({ filter }: { filter: TagihFilter }) {
  const supabase = await createClient();

  // Level + partai filter on `pejabat.level/partai` (view doesn't expose level).
  // Pre-select pejabat ids by predicate, then `.in()` on view query.
  const needsPejabatLookup = !!(filter.level || filter.partai);
  let pejabatIds: string[] | null = null;
  if (needsPejabatLookup) {
    let pq = supabase.from('pejabat').select('id');
    if (filter.level) pq = pq.eq('level', filter.level);
    if (filter.partai) pq = pq.eq('partai', filter.partai);
    const { data: filteredPejabat } = await pq;
    pejabatIds = (filteredPejabat ?? []).map((p) => p.id);
  }

  // Status + topik filter di-apply di DB. Alignment filter di-apply
  // post-fetch karena alignment_status enrichment frontend-only di phase 1.
  let janjiQuery = supabase
    .from('janji_with_pejabat')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(LIST_LIMIT);

  if (filter.status) janjiQuery = janjiQuery.eq('status', filter.status);
  if (filter.topik) janjiQuery = janjiQuery.eq('topik', filter.topik);
  if (pejabatIds !== null) {
    if (pejabatIds.length === 0) {
      janjiQuery = janjiQuery.eq('id', '00000000-0000-0000-0000-000000000000');
    } else {
      janjiQuery = janjiQuery.in('pejabat_id', pejabatIds);
    }
  }

  const janjiRes = await janjiQuery;
  const dbRows = janjiRes.data ?? [];

  // Enrich tiap row dengan ALIGNMENT_SEED lookup. Row tanpa entry seed
  // tetap di-render dengan badge "— belum ditelaah" (transparent UX).
  const enrichedRows: JanjiViewWithAlignment[] = dbRows.map((row) => {
    const seed = row.id ? lookupAlignmentSeed(row.id) : undefined;
    return {
      ...row,
      alignment_status: seed?.status ?? null,
      editorial_status: seed?.editorial_status ?? null,
      source_doc_url: seed?.source_doc_url ?? null,
    };
  });

  // Apply alignment filter di sisi frontend (post-enrichment). DB tidak
  // tahu tentang alignment, jadi filter ini tidak bisa di-push ke query.
  const filteredRows = filter.alignment
    ? enrichedRows.filter(
        (r) =>
          isAlignmentStatus(r.alignment_status) &&
          r.alignment_status === filter.alignment,
      )
    : enrichedRows;

  return (
    <div className="mt-4">
      <p className="text-xs text-jw-muted mb-3">
        {filteredRows.length} janji ditampilkan
        {Object.keys(filter).length > 0 ? ' dengan filter aktif' : ''}.{' '}
        <span className="text-jw-ink/60">
          {alignmentSeedSize()} dari {Object.keys(ALIGNMENT_SEED).length + 2}{' '}
          janji prioritas sudah ditelaah editorial.
        </span>
      </p>

      {filteredRows.length === 0 ? (
        <div className="rounded-jw-lg border border-dashed border-jw-line bg-white/50 p-10 text-center">
          <p className="font-hand text-xl text-jw-coral" aria-hidden="true">
            — belum ada janji sesuai filter
          </p>
          <p className="text-sm text-jw-muted mt-2">
            Coba longgarkan filter atau submit janji baru ke daftar pantau
            warga.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/tagih"
              className="inline-block text-sm font-semibold text-jw-coral hover:underline"
            >
              Reset filter
            </Link>
            <span className="text-jw-line">·</span>
            <Link
              href="/tagih/baru"
              className="inline-block text-sm font-semibold text-jw-coral hover:underline"
            >
              Submit janji baru
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRows.map((j) => (
            <JanjiCardWithBadge key={j.id ?? Math.random()} janji={j} />
          ))}
        </div>
      )}
    </div>
  );
}
