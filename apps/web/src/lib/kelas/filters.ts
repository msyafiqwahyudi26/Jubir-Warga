import type { KelasLevel } from '@jw/data/types';
import { LEVEL_OPTIONS } from './constants';

export type KelasFilter = {
  level?: KelasLevel;
};

const VALID_LEVELS = new Set<string>(LEVEL_OPTIONS.map((o) => o.id));

export function parseKelasFilter(
  params: Record<string, string | string[] | undefined>,
): KelasFilter {
  const level = typeof params.level === 'string' ? params.level : undefined;
  if (level && VALID_LEVELS.has(level)) {
    return { level: level as KelasLevel };
  }
  return {};
}

export function buildKelasUrl(filter: KelasFilter): string {
  if (!filter.level) return '/kelas';
  return `/kelas?level=${filter.level}`;
}

export function toggleKelasLevel(
  current: KelasFilter,
  level: KelasLevel | undefined,
): KelasFilter {
  if (level === undefined || current.level === level) return {};
  return { level };
}
