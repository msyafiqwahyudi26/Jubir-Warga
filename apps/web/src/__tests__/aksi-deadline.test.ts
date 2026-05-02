import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { isClosed, formatDeadline } from '@/lib/aksi/deadline';

const FROZEN_NOW = new Date('2026-05-01T12:00:00Z').getTime();

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FROZEN_NOW);
});

afterAll(() => {
  vi.useRealTimers();
});

describe('isClosed', () => {
  it('returns false for null deadline', () => {
    expect(isClosed(null)).toBe(false);
  });

  it('returns true for past deadline', () => {
    expect(isClosed('2026-04-30T00:00:00Z')).toBe(true);
  });

  it('returns false for future deadline', () => {
    expect(isClosed('2026-05-15T00:00:00Z')).toBe(false);
  });

  it('returns false for invalid string', () => {
    expect(isClosed('not-a-date')).toBe(false);
  });
});

describe('formatDeadline', () => {
  it('returns "Tanpa deadline" for null', () => {
    expect(formatDeadline(null)).toBe('Tanpa deadline');
  });

  it('returns "Sudah selesai" for past deadline', () => {
    expect(formatDeadline('2026-04-15T00:00:00Z')).toBe('Sudah selesai');
  });

  it('returns "Berakhir besok" for ~1 day away', () => {
    // FROZEN_NOW = 2026-05-01T12:00:00Z; +23h = ceil(23/24) = 1 day.
    expect(formatDeadline('2026-05-02T11:00:00Z')).toBe('Berakhir besok');
  });

  it('returns "Berakhir N hari lagi" within 7 days', () => {
    expect(formatDeadline('2026-05-06T11:00:00Z')).toMatch(
      /Berakhir \d hari lagi/,
    );
  });

  it('returns formatted Indonesian date for >7 days away', () => {
    const result = formatDeadline('2026-06-15T13:00:00Z');
    expect(result).toContain('Berakhir');
    expect(result).toContain('Jun');
    expect(result).toContain('2026');
  });
});
