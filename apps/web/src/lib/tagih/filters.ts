import type { JanjiStatus, PejabatLevel } from '@jw/data/types';
import {
  JANJI_STATUSES,
  PEJABAT_LEVELS,
} from './constants';

export type TagihFilter = {
  status?: JanjiStatus;
  level?: PejabatLevel;
};

const VALID_STATUS = new Set<string>(JANJI_STATUSES);
const VALID_LEVEL = new Set<string>(PEJABAT_LEVELS);

export function parseTagihFilter(
  params: Record<string, string | string[] | undefined>,
): TagihFilter {
  const f: TagihFilter = {};
  const status = typeof params.status === 'string' ? params.status : undefined;
  const level = typeof params.level === 'string' ? params.level : undefined;
  if (status && VALID_STATUS.has(status)) f.status = status as JanjiStatus;
  if (level && VALID_LEVEL.has(level)) f.level = level as PejabatLevel;
  return f;
}

export function buildTagihUrl(filter: TagihFilter): string {
  const params = new URLSearchParams();
  if (filter.status) params.set('status', filter.status);
  if (filter.level) params.set('level', filter.level);
  const qs = params.toString();
  return qs ? `/tagih?${qs}` : '/tagih';
}

export function toggleStatusFilter(
  current: TagihFilter,
  status: JanjiStatus | undefined,
): TagihFilter {
  const next: TagihFilter = { ...current };
  if (status === undefined || next.status === status) {
    delete next.status;
  } else {
    next.status = status;
  }
  return next;
}

export function toggleLevelFilter(
  current: TagihFilter,
  level: PejabatLevel | undefined,
): TagihFilter {
  const next: TagihFilter = { ...current };
  if (level === undefined || next.level === level) {
    delete next.level;
  } else {
    next.level = level;
  }
  return next;
}
