import Link from 'next/link';
import { Users, Clock } from 'lucide-react';
import type { Database } from '@jw/data/types';
import { isJanjiStatus } from '@/lib/tagih/constants';
import { Avatar } from '@/components/ui/avatar';
import { RegionTag, type RegionLevel } from '@/components/ui/region-tag';
import { formatRelativeTime } from '@/lib/util/format-relative-time';
import { StatusPill } from './status-pill';

export type JanjiViewRow =
  Database['public']['Views']['janji_with_pejabat']['Row'];

/**
 * Heuristik derive RegionLevel dari `pejabat_jabatan` text. Phase 1
 * placeholder — Sprint 5+ pejabat table dapat dedicated `level` column.
 *
 * Match keyword (case-insensitive):
 *   - "presiden" / "menteri" / "wakil presiden" → nasional
 *   - "gubernur" → provinsi
 *   - "walikota" / "bupati" / "wali kota" → kabupaten_kota
 *   - else → null (skip RegionTag render)
 */
export function deriveRegionLevel(
  jabatan: string | null | undefined,
): RegionLevel | null {
  if (!jabatan) return null;
  const j = jabatan.toLowerCase();
  if (
    j.includes('presiden') ||
    j.includes('menteri') ||
    j.includes('panglima') ||
    j.includes('kapolri')
  ) {
    return 'nasional';
  }
  if (j.includes('gubernur')) return 'provinsi';
  if (j.includes('walikota') || j.includes('wali kota') || j.includes('bupati')) {
    return 'kabupaten_kota';
  }
  return null;
}

/**
 * Derive avatar level (1-10) dari pejabat_skor (0-100). Default 5 kalau
 * skor null. Per Spec #34 fallback strategy — schema belum punya
 * `pejabat_level` column.
 */
export function derivePejabatLevel(skor: number | null | undefined): number {
  if (typeof skor !== 'number') return 5;
  return Math.max(1, Math.min(10, Math.round(skor / 10)));
}

export function JanjiRow({ janji }: { janji: JanjiViewRow }) {
  if (!janji.id || !janji.janji_text) return null;
  const status = isJanjiStatus(janji.status) ? janji.status : null;
  const region = deriveRegionLevel(janji.pejabat_jabatan);
  const level = derivePejabatLevel(janji.pejabat_skor);
  const timingAnchor = janji.verified_at ?? janji.created_at;
  const pejabatNama = janji.pejabat_nama ?? 'Pejabat tidak diketahui';

  return (
    <Link
      href={`/tagih/${janji.id}`}
      className="group block rounded-jw-lg border border-jw-line bg-white p-4 hover:border-jw-blue-soft/40 hover:-translate-y-0.5 hover:shadow-jw-md transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <Avatar name={pejabatNama} size="md" level={level} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-jw-muted flex-wrap">
            <span className="font-semibold text-jw-blue text-sm">
              {pejabatNama}
            </span>
            {janji.pejabat_jabatan && <span>· {janji.pejabat_jabatan}</span>}
            {janji.pejabat_partai && (
              <span className="text-jw-coral">· {janji.pejabat_partai}</span>
            )}
          </div>

          <p className="font-display italic text-base text-jw-ink leading-snug group-hover:text-jw-blue line-clamp-3 mt-1.5">
            {janji.janji_text}
          </p>

          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            {region && <RegionTag level={region} />}
            {status && <StatusPill status={status} />}
            {janji.topik && (
              <span className="inline-flex items-center rounded-jw-sm bg-jw-pill-grey-bg text-jw-pill-grey-text px-2 py-0.5 text-[11px] font-semibold">
                {janji.topik}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="inline-flex items-center gap-1 text-xs text-jw-muted">
            <Users size={11} aria-hidden /> {janji.pemantau_count ?? 0}
          </span>
          {timingAnchor && (
            <span
              className="inline-flex items-center gap-1 text-[11px] text-jw-muted whitespace-nowrap"
              title="Status terakhir berubah"
            >
              <Clock size={10} aria-hidden />{' '}
              {formatRelativeTime(timingAnchor)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
