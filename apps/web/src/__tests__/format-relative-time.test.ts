import { describe, it, expect } from 'vitest';
import { formatRelativeTime } from '@/lib/util/format-relative-time';

const NOW = new Date('2026-05-05T12:00:00Z').getTime();

describe('formatRelativeTime', () => {
  it('returns "baru saja" untuk < 60 detik', () => {
    expect(formatRelativeTime(NOW - 30_000, NOW)).toBe('baru saja');
    expect(formatRelativeTime(NOW - 59_000, NOW)).toBe('baru saja');
  });

  it('returns Xmnt lalu untuk < 60 menit', () => {
    expect(formatRelativeTime(NOW - 1 * 60_000, NOW)).toBe('1mnt lalu');
    expect(formatRelativeTime(NOW - 30 * 60_000, NOW)).toBe('30mnt lalu');
    expect(formatRelativeTime(NOW - 59 * 60_000, NOW)).toBe('59mnt lalu');
  });

  it('returns Xj lalu untuk < 24 jam', () => {
    expect(formatRelativeTime(NOW - 1 * 3_600_000, NOW)).toBe('1j lalu');
    expect(formatRelativeTime(NOW - 12 * 3_600_000, NOW)).toBe('12j lalu');
    expect(formatRelativeTime(NOW - 23 * 3_600_000, NOW)).toBe('23j lalu');
  });

  it('returns Xh lalu untuk < 30 hari', () => {
    expect(formatRelativeTime(NOW - 1 * 86_400_000, NOW)).toBe('1h lalu');
    expect(formatRelativeTime(NOW - 7 * 86_400_000, NOW)).toBe('7h lalu');
    expect(formatRelativeTime(NOW - 29 * 86_400_000, NOW)).toBe('29h lalu');
  });

  it('returns Xb lalu untuk < 12 bulan (30-day months approx)', () => {
    expect(formatRelativeTime(NOW - 30 * 86_400_000, NOW)).toBe('1b lalu');
    expect(formatRelativeTime(NOW - 6 * 30 * 86_400_000, NOW)).toBe('6b lalu');
  });

  it('returns Xt lalu untuk >= 12 bulan', () => {
    expect(formatRelativeTime(NOW - 12 * 30 * 86_400_000, NOW)).toBe('1t lalu');
    expect(formatRelativeTime(NOW - 24 * 30 * 86_400_000, NOW)).toBe('2t lalu');
  });

  it('handles ISO string input', () => {
    expect(formatRelativeTime('2026-05-05T11:30:00Z', NOW)).toBe('30mnt lalu');
  });

  it('handles Date object input', () => {
    expect(formatRelativeTime(new Date(NOW - 5 * 60_000), NOW)).toBe(
      '5mnt lalu',
    );
  });

  it('handles future timestamp (clock skew defensive)', () => {
    expect(formatRelativeTime(NOW + 60_000, NOW)).toBe('sebentar lagi');
  });

  it('returns em dash untuk invalid date string', () => {
    expect(formatRelativeTime('not-a-date', NOW)).toBe('—');
  });
});
