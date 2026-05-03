import { WORDS_OF_DAY } from './constants';

const EPOCH = new Date('2026-01-01T00:00:00Z').getTime();

/**
 * Deterministic word of the day. Same calendar date (UTC) → same word for all
 * users globally. Sprint 4 add admin override via DB `daily_word_override`.
 */
export function pickWordOfDay(date: Date): string {
  const dayIndex = Math.floor(
    (date.getTime() - EPOCH) / (1000 * 60 * 60 * 24),
  );
  const idx = ((dayIndex % WORDS_OF_DAY.length) + WORDS_OF_DAY.length) %
    WORDS_OF_DAY.length;
  // WORDS_OF_DAY is non-empty by construction; assert via fallback.
  return WORDS_OF_DAY[idx] ?? WORDS_OF_DAY[0]!;
}

export function todayWord(): string {
  return pickWordOfDay(new Date());
}

/** ISO date string (YYYY-MM-DD) for the day, used as localStorage key. */
export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
