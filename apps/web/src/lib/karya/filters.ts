import type { KaryaType } from '@jw/data/types';
import { TYPE_OPTIONS } from './constants';

export type KaryaFilter = {
  type?: KaryaType;
  page?: number;
};

const VALID_TYPES = new Set<string>(TYPE_OPTIONS.map((o) => o.id));

export function parseKaryaFilter(
  params: Record<string, string | string[] | undefined>,
): KaryaFilter {
  const f: KaryaFilter = {};
  const type = typeof params.type === 'string' ? params.type : undefined;
  const pageStr = typeof params.page === 'string' ? params.page : undefined;

  if (type && VALID_TYPES.has(type)) f.type = type as KaryaType;
  if (pageStr) {
    const n = parseInt(pageStr, 10);
    if (Number.isFinite(n) && n >= 1) f.page = n;
  }
  return f;
}

export function buildKaryaUrl(filter: KaryaFilter): string {
  const params = new URLSearchParams();
  if (filter.type) params.set('type', filter.type);
  if (filter.page && filter.page > 1) params.set('page', String(filter.page));
  const qs = params.toString();
  return qs ? `/karya?${qs}` : '/karya';
}

export function toggleKaryaType(
  current: KaryaFilter,
  type: KaryaType | undefined,
): KaryaFilter {
  const next: KaryaFilter = { ...current };
  if (type === undefined || next.type === type) {
    delete next.type;
  } else {
    next.type = type;
  }
  delete next.page;
  return next;
}
