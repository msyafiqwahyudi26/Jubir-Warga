import { describe, it, expect } from 'vitest';
import { calculateStreak } from '@/lib/main/streak';

const NOW = new Date('2026-05-02T12:00:00Z');

function dayBefore(offset: number): string {
  const d = new Date(NOW);
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString();
}

describe('calculateStreak', () => {
  it('returns 0 for empty scores', () => {
    expect(calculateStreak([], NOW)).toBe(0);
  });

  it('returns 1 for a single play today', () => {
    expect(calculateStreak([{ played_at: dayBefore(0) }], NOW)).toBe(1);
  });

  it('counts consecutive days backwards from today', () => {
    expect(
      calculateStreak(
        [
          { played_at: dayBefore(0) },
          { played_at: dayBefore(1) },
          { played_at: dayBefore(2) },
        ],
        NOW,
      ),
    ).toBe(3);
  });

  it('counts streak from yesterday when today is missing', () => {
    expect(
      calculateStreak(
        [
          { played_at: dayBefore(1) },
          { played_at: dayBefore(2) },
          { played_at: dayBefore(3) },
        ],
        NOW,
      ),
    ).toBe(3);
  });

  it('resets streak on a missed day in the past', () => {
    // Today + day-3 (skip day-1, day-2). Streak should be 1 (today only).
    expect(
      calculateStreak(
        [{ played_at: dayBefore(0) }, { played_at: dayBefore(3) }],
        NOW,
      ),
    ).toBe(1);
  });

  it('ignores invalid timestamps', () => {
    expect(
      calculateStreak(
        [
          { played_at: 'not-a-date' },
          { played_at: null },
          { played_at: dayBefore(0) },
        ],
        NOW,
      ),
    ).toBe(1);
  });

  it('caps lookback at 365 days', () => {
    // 400 consecutive days → result should never exceed 365.
    const scores = Array.from({ length: 400 }, (_, i) => ({
      played_at: dayBefore(i),
    }));
    expect(calculateStreak(scores, NOW)).toBeLessThanOrEqual(365);
  });
});
