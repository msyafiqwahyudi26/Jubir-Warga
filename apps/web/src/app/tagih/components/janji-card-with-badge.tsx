import Link from 'next/link';
import { Users, ExternalLink } from 'lucide-react';
import type { Database } from '@jw/data/types';
import { isJanjiStatus } from '@/lib/tagih/constants';
import {
  ALIGNMENT_META,
  isAlignmentStatus,
  isEditorialStatus,
  type AlignmentStatus,
  type EditorialStatus,
} from '@/lib/tagih/alignment';
import { VerificationBadge } from '@/components/admin/badge-verification';
import { StatusPill } from '../status-pill';

// Frontend-first phase 1: alignment field di-enrich di Server Component
// hulu via ALIGNMENT_SEED lookup (lib/tagih/alignment-seed.ts), bukan
// dari DB. Saat phase 2 + Migration 0004 LIGHT applied, enrichment shift
// ke DB column natural.
type JanjiViewBase = Database['public']['Views']['janji_with_pejabat']['Row'];
export type JanjiViewWithAlignment = JanjiViewBase & {
  alignment_status?: AlignmentStatus | null;
  editorial_status?: EditorialStatus | null;
  source_doc_url?: string | null;
};

type Props = {
  janji: JanjiViewWithAlignment;
};

export function JanjiCardWithBadge({ janji }: Props) {
  if (!janji.id || !janji.janji_text) return null;
  const status = isJanjiStatus(janji.status) ? janji.status : null;
  const alignment = isAlignmentStatus(janji.alignment_status)
    ? janji.alignment_status
    : null;
  const editorial = isEditorialStatus(janji.editorial_status)
    ? janji.editorial_status
    : 'pending';

  return (
    <Link
      href={`/tagih/${janji.id}`}
      className="group block rounded-jw-lg border border-jw-line bg-white p-4 hover:border-jw-blue-soft/40 hover:-translate-y-0.5 hover:shadow-jw-md transition-all duration-200"
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
            {janji.janji_text}
          </p>

          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            {alignment ? (
              <AlignmentPill status={alignment} />
            ) : (
              <span
                title="Janji ini belum ditelaah terhadap RPJMN/RPJMD/Visi Misi"
                className="inline-flex items-center gap-1 rounded-jw-sm bg-jw-pill-grey-bg/60 text-jw-muted px-2 py-0.5 text-[11px] font-semibold"
              >
                — belum ditelaah
              </span>
            )}
            <VerificationBadge status={editorial} size="sm" />
            {janji.topik && (
              <span className="inline-flex items-center rounded-jw-sm bg-jw-pill-grey-bg text-jw-pill-grey-text px-2 py-0.5 text-[11px] font-semibold">
                {janji.topik}
              </span>
            )}
            {janji.source_doc_url && (
              <span
                title="Janji ini punya rujukan dokumen resmi"
                className="inline-flex items-center gap-0.5 rounded-jw-sm bg-jw-pill-blue-bg text-jw-pill-blue-text px-2 py-0.5 text-[11px] font-semibold"
              >
                <ExternalLink size={10} aria-hidden /> Sumber
              </span>
            )}
          </div>
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

// Inline alignment pill — kept private to card karena tampilannya simple.
// Detail page pakai variant lebih besar dengan reasoning + source link.
function AlignmentPill({ status }: { status: AlignmentStatus }) {
  const meta = ALIGNMENT_META[status];
  const Icon = meta.icon;
  return (
    <span
      title={meta.desc}
      className={[
        'inline-flex items-center gap-1 rounded-jw-sm px-2 py-0.5 text-[11px] font-semibold',
        meta.pillBg,
        meta.pillText,
      ].join(' ')}
    >
      <Icon size={11} aria-hidden />
      {meta.short}
    </span>
  );
}
