import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { parseKaryaFilter, buildKaryaUrl } from '@/lib/karya/filters';
import { EmptyKarya } from '@/components/illustrations/empty-karya';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import { KaryaTabs } from './karya-tabs';
import { KaryaCard } from './karya-card';
import { EditorPicks } from './editor-picks';
import { TopKreatorSidebar } from './top-kreator-sidebar';

const PAGE_SIZE = 18;

export const metadata: Metadata = {
  title: 'Karya — Jubir Warga',
  description: 'Tulisan, vlog, ilustrasi, podcast, dan zine dari warga.',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function KaryaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filter = parseKaryaFilter(sp);
  const page = filter.page ?? 1;
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  let q = supabase
    .from('karya')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (filter.type) q = q.eq('type', filter.type);

  const { data: karyaList, count, error } = await q;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <header className="mb-8 flex items-end justify-between gap-4 flex-wrap border-b border-jw-line pb-6">
        <div>
          <span className="font-hand text-jw-coral text-base">
            — karya warga
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-jw-blue leading-tight">
            Karya
          </h1>
          <p className="text-base md:text-lg text-jw-ink/70 mt-2 max-w-xl">
            Panggung anak muda yang punya isi.
          </p>
        </div>
        <button
          type="button"
          disabled
          title="Submit Karya (segera tersedia)"
          aria-label="Upload karya (segera tersedia)"
          className="inline-flex items-center gap-1.5 rounded-jw-md border border-jw-line bg-jw-line/30 px-4 py-2 text-sm font-semibold text-jw-muted cursor-not-allowed"
        >
          + Upload karya (segera)
        </button>
      </header>

      <KaryaTabs currentType={filter.type} />

      <EditorPicks className="mt-6" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 mt-10">
        <main>
          <h2 className="font-display text-xl font-semibold text-jw-blue mb-4">
            {filter.type ?? 'Semua karya'}
            {count != null && (
              <span className="ml-2 text-sm font-normal text-jw-muted">
                ({count})
              </span>
            )}
          </h2>

          {error ? (
            <div className="rounded-jw-lg bg-jw-pill-coral-bg border border-jw-coral/30 p-4 text-sm text-jw-pill-coral-text">
              Gagal memuat karya: {error.message}
            </div>
          ) : !karyaList || karyaList.length === 0 ? (
            <div className="rounded-jw-lg border border-dashed border-jw-line p-10 text-center flex flex-col items-center">
              <EmptyKarya size={220} />
              <p className="font-hand text-xl text-jw-coral mt-3">
                — belum ada karya {filter.type ?? ''}
              </p>
              {filter.type && (
                <Link
                  href="/karya"
                  className="inline-block mt-4 text-sm font-semibold text-jw-coral hover:underline"
                >
                  Lihat semua karya
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {karyaList.map((k) => (
                <KaryaCard key={k.id} karya={k} />
              ))}
            </div>
          )}

          {count != null && count > PAGE_SIZE && (
            <nav className="mt-6 flex items-center justify-between text-sm">
              {page > 1 ? (
                <Link
                  href={buildKaryaUrl({ ...filter, page: page - 1 })}
                  className="text-jw-coral font-semibold hover:underline"
                >
                  ← Sebelumnya
                </Link>
              ) : (
                <span />
              )}
              <span className="text-jw-muted">
                Page {page} dari {Math.ceil(count / PAGE_SIZE)}
              </span>
              {offset + PAGE_SIZE < count ? (
                <Link
                  href={buildKaryaUrl({ ...filter, page: page + 1 })}
                  className="text-jw-coral font-semibold hover:underline"
                >
                  Selanjutnya →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </main>

        <aside>
          <TopKreatorSidebar />
        </aside>
      </div>

      <NalaTriggerButton context="tentang Karya" />
    </div>
  );
}
