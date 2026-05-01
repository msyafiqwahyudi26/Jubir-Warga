import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import {
  parseFilterFromSearchParams,
  buildFilterUrl,
} from '@/lib/komunitas/filters';
import { EmptyForum } from '@/components/illustrations/empty-forum';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import { KomunitasSidebar } from './komunitas-sidebar';
import { ThreadRow } from './thread-row';
import { SubKomunitasSection } from './sub-komunitas-section';
import { ChapterRegionalSection } from './chapter-regional-section';

const PAGE_SIZE = 20;

export const metadata: Metadata = {
  title: 'Komunitas — Jubir Warga',
  description:
    'Forum diskusi warga: politik, kerja, kreatif, sampai mental health.',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function KomunitasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filter = parseFilterFromSearchParams(sp);
  const page = filter.page ?? 1;
  const offset = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  let q = supabase
    .from('threads_with_author')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (filter.topic) q = q.eq('topic_id', filter.topic);
  if (filter.chapter) q = q.eq('chapter_id', filter.chapter);
  if (filter.format) q = q.eq('format', filter.format);
  if (filter.hot) q = q.eq('hot', true);

  const { data: threads, count, error } = await q;

  const hasFilter =
    !!filter.topic || !!filter.chapter || !!filter.format || !!filter.hot;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside>
          <KomunitasSidebar currentFilter={filter} />
        </aside>

        <main>
          <header className="mb-6 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue">
                Komunitas
              </h1>
              <p className="text-sm text-jw-muted mt-1">
                {count ?? 0} thread · ngumpul, nimbrung, atau cuma baca
              </p>
            </div>
            <Link
              href="/komunitas/baru"
              className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-coral px-4 py-2 text-sm font-semibold text-white hover:bg-jw-coral/90 transition"
            >
              + Mulai thread
            </Link>
          </header>

          {error ? (
            <div className="rounded-jw-lg bg-jw-pill-coral-bg border border-jw-coral/30 p-4 text-sm text-jw-pill-coral-text">
              Gagal memuat thread: {error.message}
            </div>
          ) : !threads || threads.length === 0 ? (
            <div className="rounded-jw-lg border border-dashed border-jw-line p-10 text-center flex flex-col items-center">
              <EmptyForum size={240} />
              <p className="font-hand text-xl text-jw-coral mt-3">
                — belum ada thread sesuai filter
              </p>
              <p className="text-sm text-jw-muted mt-1">
                Coba reset filter atau jadi yang pertama.
              </p>
              {hasFilter && (
                <Link
                  href="/komunitas"
                  className="inline-block mt-4 text-sm font-semibold text-jw-coral hover:underline"
                >
                  Reset filter
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {threads.map((t) => (
                <ThreadRow key={t.id ?? Math.random()} thread={t} />
              ))}
            </div>
          )}

          {count != null && count > PAGE_SIZE && (
            <nav className="mt-6 flex items-center justify-between text-sm">
              {page > 1 ? (
                <Link
                  href={buildFilterUrl({ ...filter, page: page - 1 })}
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
                  href={buildFilterUrl({ ...filter, page: page + 1 })}
                  className="text-jw-coral font-semibold hover:underline"
                >
                  Selanjutnya →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}

          <SubKomunitasSection className="mt-12" />
          <ChapterRegionalSection className="mt-12" />
        </main>
      </div>

      <NalaTriggerButton context="tentang Komunitas" />
    </div>
  );
}
