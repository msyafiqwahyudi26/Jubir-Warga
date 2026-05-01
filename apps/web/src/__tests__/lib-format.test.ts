import { describe, it, expect } from 'vitest';
import { formatNumber, formatRupiah, formatDate, formatRelative } from '@/lib/format';

describe('formatNumber', () => {
  it('formats integer with Indonesian thousand separator', () => {
    expect(formatNumber(31990)).toBe('31.990');
  });

  it('handles zero and null', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(null)).toBe('0');
  });
});

describe('formatRupiah', () => {
  it('formats integer to Rupiah currency', () => {
    // Intl.NumberFormat may use either a regular space or a non-breaking
    // space between "Rp" and digits depending on the ICU build, so we
    // only assert the content shape rather than exact whitespace.
    expect(formatRupiah(150000)).toMatch(/^Rp\s*150\.000$/);
  });
});

describe('formatDate', () => {
  it('formats ISO string to Indonesian date', () => {
    const result = formatDate('2026-05-01T12:00:00Z');
    expect(result).toContain('Mei');
    expect(result).toContain('2026');
  });
});

describe('formatRelative', () => {
  it('returns "baru saja" for very recent timestamps', () => {
    expect(formatRelative(new Date())).toBe('baru saja');
  });
});
