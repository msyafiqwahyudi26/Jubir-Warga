import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { parseKelasFilter } from '@/lib/kelas/filters';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import { KelasFilters } from './kelas-filters';
import { KelasCard } from './kelas-card';
import { FeaturedHero } from './featured-hero';
import { MentorSection } from './mentor-section';

export const metadata: Metadata = {
  title: 'Kelas — Jubir Warga',
  description: 'Belajar dari sesama, eksekusi yang nyata-nyata kepake.',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function KelasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filter = parseKelasFilter(sp);

  const supabase = await createClient();

  const { data: featured } = await supabase
    .from('kelas')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let q = supabase
    .from('kelas')
    .select('*')
    .order('participant_count', { ascending: false });
  if (filter.level) q = q.eq('level', filter.level);
  if (featured) q = q.neq('id', featured.id);

  const { data: kelasList, error } = await q;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <header className="mb-8 border-b border-jw-line pb-6">
        <span className="font-hand text-jw-coral text-base">
          — belajar bareng
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-jw-blue leading-tight">
          Kelas
        </h1>
        <p className="text-base md:text-lg text-jw-ink/70 mt-2 max-w-xl">
          Belajar dari sesama, eksekusi yang nyata-nyata kepake.
        </p>
      </header>

      {featured && <FeaturedHero kelas={featured} className="mb-10" />}

      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <h2 className="font-display text-xl font-semibold text-jw-blue">
          Semua kelas
          {kelasList && (
            <span className="ml-2 text-sm font-normal text-jw-muted">
              ({kelasList.length})
            </span>
          )}
        </h2>
        <KelasFilters currentLevel={filter.level} />
      </div>

      {error ? (
        <div className="rounded-jw-lg bg-jw-pill-coral-bg border border-jw-coral/30 p-4 text-sm text-jw-pill-coral-text">
          Gagal memuat kelas: {error.message}
        </div>
      ) : !kelasList || kelasList.length === 0 ? (
        <div className="rounded-jw-lg border border-dashed border-jw-line p-10 text-center">
          <p className="font-hand text-xl text-jw-coral">
            — belum ada kelas {filter.level ?? ''}
          </p>
          <p className="text-sm text-jw-muted mt-2">
            Kelas baru akan ditambah selama beta.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kelasList.map((k) => (
            <KelasCard key={k.id} kelas={k} />
          ))}
        </div>
      )}

      <MentorSection className="mt-16" />

      <NalaTriggerButton context="tentang Kelas" />
    </div>
  );
}
