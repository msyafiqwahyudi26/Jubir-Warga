import type { AlignmentStatus } from './constants';

// localStorage shape — version supaya bisa migrate kalau format berubah.
const SCHEMA_VERSION = 1;

export type DailyResult = {
  date: string; // YYYY-MM-DD
  guess: AlignmentStatus;
  correct: boolean;
  janjiId: string;
};

export type ScoreState = {
  version: number;
  history: DailyResult[]; // newest first
};

const EMPTY: ScoreState = { version: SCHEMA_VERSION, history: [] };

export function loadScore(storage: Pick<Storage, 'getItem'>, key: string): ScoreState {
  try {
    const raw = storage.getItem(key);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<ScoreState>;
    if (parsed.version !== SCHEMA_VERSION || !Array.isArray(parsed.history)) {
      return { ...EMPTY };
    }
    return { version: SCHEMA_VERSION, history: [...parsed.history] };
  } catch {
    return { ...EMPTY };
  }
}

export function saveScore(
  storage: Pick<Storage, 'setItem'>,
  key: string,
  state: ScoreState,
): void {
  try {
    storage.setItem(key, JSON.stringify(state));
  } catch {
    // Storage quota / disabled — silent. Game tetap playable, history-only loss.
  }
}

/**
 * Append today's result. Idempotent: kalau sudah ada entry hari yang sama,
 * tidak di-append lagi (guard untuk one-game-per-day).
 */
export function appendResult(state: ScoreState, result: DailyResult): ScoreState {
  if (state.history.some((h) => h.date === result.date)) return state;
  return {
    version: SCHEMA_VERSION,
    history: [result, ...state.history].slice(0, 365),
  };
}

export function findResult(
  state: ScoreState,
  date: string,
): DailyResult | null {
  return state.history.find((h) => h.date === date) ?? null;
}

/**
 * Streak = consecutive days played from today backwards. Today not yet
 * played is OK — count from yesterday. Skip a day in past breaks streak.
 */
export function calculateStreak(
  state: ScoreState,
  now: Date = new Date(),
): number {
  if (state.history.length === 0) return 0;
  const dates = new Set(state.history.map((h) => h.date));
  let streak = 0;
  let started = false;
  for (let offset = 0; offset < 365; offset++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - offset);
    const key = d.toISOString().slice(0, 10);
    if (dates.has(key)) {
      streak++;
      started = true;
    } else if (started) {
      break;
    } else if (offset > 0) {
      break;
    }
  }
  return streak;
}

export function calculateAccuracy(state: ScoreState): {
  total: number;
  correct: number;
  pct: number;
} {
  const total = state.history.length;
  if (total === 0) return { total: 0, correct: 0, pct: 0 };
  const correct = state.history.filter((h) => h.correct).length;
  return { total, correct, pct: Math.round((correct / total) * 100) };
}
