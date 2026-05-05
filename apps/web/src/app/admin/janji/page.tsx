import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import {
  EDITORIAL_STATUSES,
  isEditorialStatus,
  type EditorialStatus,
  type ExtendedJanjiRow,
} from '@/lib/admin/types';
import { VerificationBadge } from '@/components/admin/badge-verification';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type AdminJanjiRow = Pick<
  ExtendedJanjiRow,
  | 'id'
  | 'janji_text'
  | 'topik'
  | 'status'
  | 'editorial_status'
  | 'alignment_status'
  | 'editorial_reviewed_at'
>;

export default async function AdminJanjiListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filterRaw = typeof sp.status === 'string' ? sp.status : undefined;
  const filter: EditorialStatus | null = isEditorialStatus(filterRaw)
    ? filterRaw
    : null;

  const supabase = await createClient();

  // Editorial fields belum di Database type sampai post-migration typegen.
  // Cast unknown di builder — RLS + check constraint enforce shape.
  type Builder = {
    eq: (col: string, val: string) => Builder;
    order: (
      col: string,
      opts: { ascending: boolean; nullsFirst?: boolean },
    ) => Builder;
    then: Promise<{ data: AdminJanjiRow[] | null }>['then'];
  };

  let q = supabase
    .from('janji')
    .select(
      'id, janji_text, topik, status, editorial_status, alignment_status, editorial_reviewed_at',
    ) as unknown as Builder;

  q = q.order('editorial_reviewed_at', {
    ascending: false,
    nullsFirst: true,
  });
  if (filter) {
    q = q.eq('editorial_status', filter);
  }

  const res = (await (q as unknown as Promise<{
    data: AdminJanjiRow[] | null;
  }>)) ?? { data: null };
  const rows = res.data ?? [];

  return (
    <div className="space-y-6">
      <header>
        <span className="font-hand text-jw-coral text-base">— moderation</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue leading-tight">
          Janji ({rows.length}
          {filter ? ` di ${filter.replace('_', ' ')}` : ' total'})
        </h1>
        <p className="text-base text-jw-ink/70 mt-2">
          Klik baris untuk edit alignment + set verification badge.
        </p>
      </header>

      {/* Status filter */}
      <nav
        aria-label="Filter editorial status"
        className="flex flex-wrap gap-2"
      >
        <FilterPill href="/admin/janji" label="Semua" active={!filter} />
        {EDITORIAL_STATUSES.map((s) => (
          <FilterPill
            key={s}
            href={`/admin/janji?status=${s}`}
            label={s.replace('_', ' ')}
            active={filter === s}
          />
        ))}
      </nav>

      {rows.length === 0 ? (
        <div className="rounded-jw-lg border border-dashed border-jw-line p-10 text-center">
          <p className="font-hand text-xl text-jw-coral">
            — gak ada janji {filter ?? ''}
          </p>
          <p className="text-sm text-jw-muted mt-2">
            Filter aktif: {filter ?? 'semua'}.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li
              key={r.id}
              className="rounded-jw-lg border border-jw-line bg-white hover:border-jw-coral/50 hover:-translate-y-[1px] transition"
            >
              <Link
                href={`/admin/janji/${r.id}`}
                className="block p-4 flex items-start gap-4 flex-wrap"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <VerificationBadge
                      status={r.editorial_status ?? 'pending'}
                      size="sm"
                    />
                    {r.topik && (
                      <span className="text-xs text-jw-muted uppercase tracking-wider font-semibold">
                        {r.topik}
                      </span>
                    )}
                    {r.alignment_status && (
                      <span className="text-xs text-jw-blue font-semibold">
                        Alignment: {r.alignment_status}
                      </span>
                    )}
                  </div>
                  <p className="font-display text-base text-jw-blue mt-1.5 line-clamp-2 leading-snug">
                    {r.janji_text}
                  </p>
                  <p className="text-xs text-jw-muted mt-1">
                    Status pelaksanaan: {r.status ?? 'Belum'}
                    {r.editorial_reviewed_at && (
                      <>
                        {' · '}
                        Reviewed{' '}
                        {new Date(r.editorial_reviewed_at).toLocaleDateString(
                          'id-ID',
                        )}
                      </>
                    )}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-jw-coral mt-2 flex-shrink-0"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterPill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-jw-sm px-3 py-1 text-sm font-semibold transition ${
        active
          ? 'bg-jw-blue text-jw-cream'
          : 'border border-jw-line bg-white text-jw-ink hover:border-jw-coral/50'
      }`}
    >
      {label}
    </Link>
  );
}
