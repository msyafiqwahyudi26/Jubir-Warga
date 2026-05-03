import { describe, it, expect } from 'vitest';
import { pickWordOfDay } from '@/lib/main/word-of-day';
import { WORDS_OF_DAY, WORD_LENGTH } from '@/lib/main/constants';

describe('WORDS_OF_DAY dictionary', () => {
  it('has at least 50 entries', () => {
    expect(WORDS_OF_DAY.length).toBeGreaterThanOrEqual(50);
  });

  it('every word is exactly 5 letters uppercase A-Z', () => {
    for (const w of WORDS_OF_DAY) {
      expect(w).toMatch(/^[A-Z]{5}$/);
      expect(w.length).toBe(WORD_LENGTH);
    }
  });

  it('has no duplicates', () => {
    const set = new Set(WORDS_OF_DAY);
    expect(set.size).toBe(WORDS_OF_DAY.length);
  });
});

describe('pickWordOfDay', () => {
  it('is deterministic — same date returns same word', () => {
    const d1 = new Date('2026-05-02T08:00:00Z');
    const d2 = new Date('2026-05-02T20:00:00Z');
    expect(pickWordOfDay(d1)).toBe(pickWordOfDay(d2));
  });

  it('returns different words for consecutive dates', () => {
    const a = pickWordOfDay(new Date('2026-05-02T00:00:00Z'));
    const b = pickWordOfDay(new Date('2026-05-03T00:00:00Z'));
    // Adjacent days hit different dictionary indices (50+ entries, idx+=1).
    expect(a).not.toBe(b);
  });

  it('cycles through the dictionary modulo length', () => {
    const a = pickWordOfDay(new Date('2026-01-01T00:00:00Z'));
    const b = pickWordOfDay(
      new Date(
        new Date('2026-01-01T00:00:00Z').getTime() +
          WORDS_OF_DAY.length * 24 * 60 * 60 * 1000,
      ),
    );
    expect(a).toBe(b);
  });

  it('returns a word from the dictionary for any valid date', () => {
    for (const offset of [0, 1, 7, 30, 100, 365]) {
      const d = new Date('2026-01-01T00:00:00Z');
      d.setUTCDate(d.getUTCDate() + offset);
      const word = pickWordOfDay(d);
      expect(WORDS_OF_DAY).toContain(word);
    }
  });
});
