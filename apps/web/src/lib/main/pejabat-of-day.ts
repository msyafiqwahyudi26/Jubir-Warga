import type { Database } from '@jw/data/types';

type PejabatRow = Database['public']['Tables']['pejabat']['Row'];

const EPOCH = new Date('2026-01-01T00:00:00Z').getTime();

/**
 * Deterministic pick: same date + same pejabat list = same target.
 * Caller provides a stable-ordered list (e.g. order by id ASC) to keep
 * the rotation reproducible across server restarts.
 */
export function pickPejabatOfDay(
  date: Date,
  pejabatList: readonly PejabatRow[],
): PejabatRow | null {
  if (pejabatList.length === 0) return null;
  const dayIndex = Math.floor(
    (date.getTime() - EPOCH) / (1000 * 60 * 60 * 24),
  );
  const idx = ((dayIndex % pejabatList.length) + pejabatList.length) %
    pejabatList.length;
  return pejabatList[idx] ?? null;
}

/**
 * Pick `count` distinct distractor pejabat IDs for the multiple-choice options.
 * Deterministic per (date, target). Excludes the target itself.
 */
export function pickDistractors(
  date: Date,
  pejabatList: readonly PejabatRow[],
  targetId: string,
  count: number,
): PejabatRow[] {
  const candidates = pejabatList.filter((p) => p.id !== targetId);
  if (candidates.length <= count) return [...candidates];

  const dayIndex = Math.floor(
    (date.getTime() - EPOCH) / (1000 * 60 * 60 * 24),
  );
  // Stride-based deterministic sampling.
  const stride = (dayIndex * 7 + 1) % candidates.length || 1;
  const picked: PejabatRow[] = [];
  let cursor = (dayIndex * 3) % candidates.length;
  const seen = new Set<string>();
  while (picked.length < count) {
    const next = candidates[cursor];
    if (next && !seen.has(next.id)) {
      picked.push(next);
      seen.add(next.id);
    }
    cursor = (cursor + stride) % candidates.length;
  }
  return picked;
}
