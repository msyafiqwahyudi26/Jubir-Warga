import type { JanjiPoolEntry } from './pool-seed';

const EPOCH = new Date('2026-01-01T00:00:00Z').getTime();

/**
 * Deterministic pick: same date + same pool = same target. Pool harus
 * stable-ordered (e.g. sorted by id) supaya rotasi reproducible
 * cross-server-restart.
 *
 * Empty pool atau day-index out-of-range → null (caller render empty state).
 */
export function pickJanjiOfDay(
  date: Date,
  pool: readonly JanjiPoolEntry[],
): JanjiPoolEntry | null {
  if (pool.length === 0) return null;
  const dayIndex = Math.floor(
    (date.getTime() - EPOCH) / (1000 * 60 * 60 * 24),
  );
  const idx = ((dayIndex % pool.length) + pool.length) % pool.length;
  return pool[idx] ?? null;
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
