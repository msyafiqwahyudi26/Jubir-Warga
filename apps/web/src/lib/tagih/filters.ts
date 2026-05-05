import type { JanjiStatus, PejabatLevel } from '@jw/data/types';
import {
  JANJI_STATUSES,
  PEJABAT_LEVELS,
} from './constants';
import {
  ALIGNMENT_STATUSES,
  isPartaiName,
  isTopikId,
  type AlignmentStatus,
  type TopikId,
} from './alignment';

// Spec #24-LIGHT extends TagihFilter dari Sprint 3 dengan:
// - topik (RPJMN-aligned categories)
// - partai (per-partai pejabat)
// - alignment (4-tier verdict)
//
// Backward compatible: filter `status` + `level` existing tetap jalan.
export type TagihFilter = {
  status?: JanjiStatus;
  level?: PejabatLevel;
  topik?: TopikId;
  partai?: string;
  alignment?: AlignmentStatus;
};

const VALID_STATUS = new Set<string>(JANJI_STATUSES);
const VALID_LEVEL = new Set<string>(PEJABAT_LEVELS);
const VALID_ALIGNMENT = new Set<string>(ALIGNMENT_STATUSES);

export function parseTagihFilter(
  params: Record<string, string | string[] | undefined>,
): TagihFilter {
  const f: TagihFilter = {};
  const status = typeof params.status === 'string' ? params.status : undefined;
  const level = typeof params.level === 'string' ? params.level : undefined;
  const topik = typeof params.topik === 'string' ? params.topik : undefined;
  const partai = typeof params.partai === 'string' ? params.partai : undefined;
  const alignment =
    typeof params.alignment === 'string' ? params.alignment : undefined;

  if (status && VALID_STATUS.has(status)) f.status = status as JanjiStatus;
  if (level && VALID_LEVEL.has(level)) f.level = level as PejabatLevel;
  if (topik && isTopikId(topik)) f.topik = topik;
  if (partai && isPartaiName(partai)) f.partai = partai;
  if (alignment && VALID_ALIGNMENT.has(alignment))
    f.alignment = alignment as AlignmentStatus;
  return f;
}

export function buildTagihUrl(filter: TagihFilter): string {
  const params = new URLSearchParams();
  if (filter.status) params.set('status', filter.status);
  if (filter.level) params.set('level', filter.level);
  if (filter.topik) params.set('topik', filter.topik);
  if (filter.partai) params.set('partai', filter.partai);
  if (filter.alignment) params.set('alignment', filter.alignment);
  const qs = params.toString();
  return qs ? `/tagih?${qs}` : '/tagih';
}

// Generic toggle: kalau key sudah aktif dengan value yang sama, clear it.
// Jika beda value atau belum ada, set ke value. Pass undefined untuk
// explicit clear (dipakai chip "Semua").
export function toggleTagihFilter<K extends keyof TagihFilter>(
  current: TagihFilter,
  key: K,
  value: TagihFilter[K] | undefined,
): TagihFilter {
  const next: TagihFilter = { ...current };
  if (value === undefined || next[key] === value) {
    delete next[key];
  } else {
    next[key] = value;
  }
  return next;
}

// Convenience wrappers untuk backward compat dengan komponen Sprint 3 yang
// import nama lama. Tidak dipakai di komponen baru — pakai `toggleTagihFilter`.
export function toggleStatusFilter(
  current: TagihFilter,
  status: JanjiStatus | undefined,
): TagihFilter {
  return toggleTagihFilter(current, 'status', status);
}

export function toggleLevelFilter(
  current: TagihFilter,
  level: PejabatLevel | undefined,
): TagihFilter {
  return toggleTagihFilter(current, 'level', level);
}

export function isFilterEmpty(filter: TagihFilter): boolean {
  return (
    !filter.status &&
    !filter.level &&
    !filter.topik &&
    !filter.partai &&
    !filter.alignment
  );
}
