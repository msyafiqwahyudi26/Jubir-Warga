import Link from 'next/link';
import { Users } from 'lucide-react';
import type { Database } from '@jw/data/types';
import { isJanjiStatus } from '@/lib/tagih/constants';
import { StatusPill } from './status-pill';

export type JanjiViewRow =
  Database['public']['Views']['janji_with_pejabat']['Row'];

export function JanjiRow({ janji }: { janji: JanjiViewRow }) {
  if (!janji.id || !janji.janji_text) return null;
  const status = isJanjiStatus(janji.status) ? janji.status : null;

  return (
    <Link
      href={`/tagih/${janji.id}`}
      className="group block rounded-jw-lg border border-jw-line bg-white p-4 hover:border-jw-blue-soft/40 transition"
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-jw-muted mb-1.5 flex-wrap">
            <span className="font-semibold text-jw-blue">
              {janji.pejabat_nama ?? 'Pejabat tidak diketahui'}
            </span>
            {janji.pejabat_jabatan && <span>· {janji.pejabat_jabatan}</span>}
            {janji.pejabat_partai && (
              <span className="text-jw-coral">· {janji.pejabat_partai}</span>
            )}
          </div>
          <p className="font-display text-base text-jw-ink leading-snug group-hover:text-jw-blue line-clamp-3">
            &ldquo;{janji.janji_text}&rdquo;
          </p>
          {janji.topik && (
            <p className="text-xs text-jw-muted mt-2">
              Topik: <span className="font-semibold text-jw-blue">{janji.topik}</span>
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {status && <StatusPill status={status} />}
          <span className="inline-flex items-center gap-1 text-xs text-jw-muted">
            <Users size={11} aria-hidden /> {janji.pemantau_count ?? 0} pemantau
          </span>
        </div>
      </div>
    </Link>
  );
}
