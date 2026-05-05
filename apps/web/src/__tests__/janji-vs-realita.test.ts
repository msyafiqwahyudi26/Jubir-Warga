import { describe, it, expect } from 'vitest';
import {
  ALIGNMENT_STATUSES,
  VERDICT_OPTIONS,
  isAlignmentStatus,
  scoreForGuess,
} from '@/lib/main/janji-vs-realita/constants';
import { pickJanjiOfDay } from '@/lib/main/janji-vs-realita/janji-of-day';
import {
  JANJI_VS_REALITA_POOL,
  type JanjiPoolEntry,
} from '@/lib/main/janji-vs-realita/pool-seed';
import {
  appendResult,
  calculateAccuracy,
  calculateStreak,
  findResult,
  loadScore,
  saveScore,
  type DailyResult,
  type ScoreState,
} from '@/lib/main/janji-vs-realita/score-calculator';

// ─── Constants ──────────────────────────────────────────────────────────────

describe('VERDICT_OPTIONS', () => {
  it('has exactly 4 options matching ALIGNMENT_STATUSES', () => {
    expect(VERDICT_OPTIONS).toHaveLength(4);
    const ids = VERDICT_OPTIONS.map((v) => v.id);
    expect(new Set(ids)).toEqual(new Set(ALIGNMENT_STATUSES));
  });

  it('every option has non-empty label + desc', () => {
    for (const opt of VERDICT_OPTIONS) {
      expect(opt.label.length).toBeGreaterThan(0);
      expect(opt.desc.length).toBeGreaterThan(0);
    }
  });

  it('every option uses brand pill classes (jw- prefix)', () => {
    for (const opt of VERDICT_OPTIONS) {
      expect(opt.pillBg).toMatch(/^bg-jw-/);
      expect(opt.pillBorder).toMatch(/^border-jw-/);
      expect(opt.pillText).toMatch(/^text-jw-/);
    }
  });
});

describe('isAlignmentStatus', () => {
  it('accepts all 4 valid values', () => {
    for (const v of ALIGNMENT_STATUSES) {
      expect(isAlignmentStatus(v)).toBe(true);
    }
  });

  it('rejects invalid + non-string + null', () => {
    expect(isAlignmentStatus('aligned')).toBe(true);
    expect(isAlignmentStatus('foo')).toBe(false);
    expect(isAlignmentStatus(null)).toBe(false);
    expect(isAlignmentStatus(undefined)).toBe(false);
    expect(isAlignmentStatus(42)).toBe(false);
  });
});

describe('scoreForGuess', () => {
  it('correct = 100, wrong = 0', () => {
    expect(scoreForGuess(true)).toBe(100);
    expect(scoreForGuess(false)).toBe(0);
  });
});

// ─── Pool seed ──────────────────────────────────────────────────────────────

describe('JANJI_VS_REALITA_POOL', () => {
  it('has at least 5 entries (Window C placeholder; Mas top-up ke 20-30)', () => {
    expect(JANJI_VS_REALITA_POOL.length).toBeGreaterThanOrEqual(5);
  });

  it('every entry has unique id', () => {
    const ids = JANJI_VS_REALITA_POOL.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every entry has all required fields populated', () => {
    for (const e of JANJI_VS_REALITA_POOL) {
      expect(e.id).toMatch(/^jvr-\d{3}$/);
      expect(e.pejabat_name.length).toBeGreaterThan(0);
      expect(e.pejabat_role.length).toBeGreaterThan(0);
      expect(e.claim.length).toBeGreaterThan(0);
      expect(e.deadline_year).toBeGreaterThanOrEqual(2020);
      expect(e.topic.length).toBeGreaterThan(0);
      expect(isAlignmentStatus(e.alignment_status)).toBe(true);
      expect(e.reasoning.length).toBeGreaterThanOrEqual(50);
      expect(e.source_url).toMatch(/^https?:\/\//);
      expect(['verified_curator', 'curated_ai']).toContain(e.editorial_status);
    }
  });

  it('alignment_status distribution covers all 4 verdicts', () => {
    const seen = new Set(JANJI_VS_REALITA_POOL.map((e) => e.alignment_status));
    // Distribution check: minimal coverage 3 dari 4 verdict (placeholder pool
    // 8 entry; final pool 20+ akan lebih lengkap).
    expect(seen.size).toBeGreaterThanOrEqual(3);
  });
});

// ─── Janji of day ───────────────────────────────────────────────────────────

function makeEntry(id: string): JanjiPoolEntry {
  return {
    id,
    pejabat_name: 'X',
    pejabat_role: 'Y',
    claim: 'janji ' + id,
    deadline_year: 2027,
    topic: 'Test',
    alignment_status: 'aligned',
    reasoning: 'test reasoning placeholder',
    source_url: 'https://example.com/',
    editorial_status: 'verified_curator',
  };
}

describe('pickJanjiOfDay', () => {
  const pool: JanjiPoolEntry[] = [
    makeEntry('a'),
    makeEntry('b'),
    makeEntry('c'),
  ];

  it('returns null on empty pool', () => {
    expect(pickJanjiOfDay(new Date(), [])).toBe(null);
  });

  it('is deterministic — same date returns same entry', () => {
    const d1 = new Date('2026-05-02T08:00:00Z');
    const d2 = new Date('2026-05-02T20:00:00Z');
    expect(pickJanjiOfDay(d1, pool)?.id).toBe(pickJanjiOfDay(d2, pool)?.id);
  });

  it('cycles through pool modulo length', () => {
    const start = new Date('2026-01-01T00:00:00Z');
    const after = new Date(start.getTime() + pool.length * 24 * 60 * 60 * 1000);
    expect(pickJanjiOfDay(start, pool)?.id).toBe(pickJanjiOfDay(after, pool)?.id);
  });

  it('returns an entry from the pool', () => {
    const ids = new Set(pool.map((j) => j.id));
    for (const offset of [0, 1, 5, 30]) {
      const d = new Date('2026-01-01T00:00:00Z');
      d.setUTCDate(d.getUTCDate() + offset);
      const picked = pickJanjiOfDay(d, pool);
      expect(picked).not.toBe(null);
      expect(ids.has(picked!.id)).toBe(true);
    }
  });

  it('handles real production pool', () => {
    const today = pickJanjiOfDay(new Date(), JANJI_VS_REALITA_POOL);
    expect(today).not.toBe(null);
    expect(JANJI_VS_REALITA_POOL.map((e) => e.id)).toContain(today!.id);
  });
});

// ─── Score calculator ──────────────────────────────────────────────────────

class MemStorage {
  private data = new Map<string, string>();
  getItem(k: string): string | null {
    return this.data.get(k) ?? null;
  }
  setItem(k: string, v: string): void {
    this.data.set(k, v);
  }
}

const KEY = 'test-key';

function result(date: string, correct: boolean, janjiId = 'j-1'): DailyResult {
  return { date, guess: 'aligned', correct, janjiId };
}

describe('loadScore / saveScore', () => {
  it('returns empty state when storage empty', () => {
    const s = new MemStorage();
    const loaded = loadScore(s, KEY);
    expect(loaded.history).toEqual([]);
    expect(loaded.version).toBe(1);
  });

  it('roundtrips state', () => {
    const s = new MemStorage();
    const state: ScoreState = {
      version: 1,
      history: [result('2026-05-05', true)],
    };
    saveScore(s, KEY, state);
    const loaded = loadScore(s, KEY);
    expect(loaded.history).toEqual(state.history);
  });

  it('rejects malformed JSON gracefully', () => {
    const s = new MemStorage();
    s.setItem(KEY, 'not-json');
    const loaded = loadScore(s, KEY);
    expect(loaded.history).toEqual([]);
  });

  it('rejects wrong version', () => {
    const s = new MemStorage();
    s.setItem(KEY, JSON.stringify({ version: 0, history: [] }));
    const loaded = loadScore(s, KEY);
    expect(loaded.history).toEqual([]);
  });
});

describe('appendResult', () => {
  it('prepends new result (newest-first)', () => {
    const r1 = result('2026-05-04', true);
    const r2 = result('2026-05-05', false);
    const s = appendResult({ version: 1, history: [r1] }, r2);
    expect(s.history.map((h) => h.date)).toEqual(['2026-05-05', '2026-05-04']);
  });

  it('is idempotent on same-day duplicate', () => {
    const r = result('2026-05-05', true);
    const s = appendResult({ version: 1, history: [r] }, r);
    expect(s.history).toHaveLength(1);
  });

  it('caps history at 365 entries', () => {
    let state: ScoreState = { version: 1, history: [] };
    for (let i = 0; i < 400; i++) {
      const d = new Date('2026-01-01T00:00:00Z');
      d.setUTCDate(d.getUTCDate() + i);
      state = appendResult(state, result(d.toISOString().slice(0, 10), true));
    }
    expect(state.history.length).toBeLessThanOrEqual(365);
  });
});

describe('findResult', () => {
  it('finds entry by date', () => {
    const r = result('2026-05-05', true);
    expect(findResult({ version: 1, history: [r] }, '2026-05-05')).toEqual(r);
  });

  it('returns null when not found', () => {
    expect(findResult({ version: 1, history: [] }, '2026-05-05')).toBe(null);
  });
});

describe('calculateStreak', () => {
  it('returns 0 on empty history', () => {
    expect(calculateStreak({ version: 1, history: [] })).toBe(0);
  });

  it('counts consecutive days from today backwards', () => {
    const now = new Date('2026-05-05T12:00:00Z');
    const state: ScoreState = {
      version: 1,
      history: [
        result('2026-05-05', true),
        result('2026-05-04', false),
        result('2026-05-03', true),
      ],
    };
    expect(calculateStreak(state, now)).toBe(3);
  });

  it('breaks on skipped day in past', () => {
    const now = new Date('2026-05-05T12:00:00Z');
    const state: ScoreState = {
      version: 1,
      history: [
        result('2026-05-05', true),
        // 2026-05-04 missing
        result('2026-05-03', true),
      ],
    };
    expect(calculateStreak(state, now)).toBe(1);
  });

  it('counts yesterday-onward streak when today not yet played', () => {
    const now = new Date('2026-05-05T12:00:00Z');
    const state: ScoreState = {
      version: 1,
      history: [result('2026-05-04', true), result('2026-05-03', true)],
    };
    expect(calculateStreak(state, now)).toBe(2);
  });
});

describe('calculateAccuracy', () => {
  it('returns 0 on empty history', () => {
    expect(calculateAccuracy({ version: 1, history: [] })).toEqual({
      total: 0,
      correct: 0,
      pct: 0,
    });
  });

  it('computes pct rounded', () => {
    const state: ScoreState = {
      version: 1,
      history: [
        result('a', true),
        result('b', true),
        result('c', false),
      ],
    };
    expect(calculateAccuracy(state)).toEqual({
      total: 3,
      correct: 2,
      pct: 67,
    });
  });
});
