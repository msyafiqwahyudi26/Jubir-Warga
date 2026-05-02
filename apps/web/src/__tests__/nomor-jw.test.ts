import { describe, it, expect } from 'vitest';
import { generateJWNumber, currentJWYear } from '@/lib/profil/nomor-jw';

describe('generateJWNumber', () => {
  it('returns "JW-YYYY-NNNN" format', () => {
    const result = generateJWNumber(
      '11111111-1111-1111-1111-111111111111',
      2026,
    );
    expect(result).toMatch(/^JW-2026-\d{4}$/);
  });

  it('is deterministic — same input returns same output', () => {
    const a = generateJWNumber('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 2026);
    const b = generateJWNumber('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 2026);
    expect(a).toBe(b);
  });

  it('produces different numbers for different user ids', () => {
    const a = generateJWNumber('11111111-1111-1111-1111-111111111111', 2026);
    const b = generateJWNumber('22222222-2222-2222-2222-222222222222', 2026);
    expect(a).not.toBe(b);
  });

  it('embeds the requested year', () => {
    const a = generateJWNumber('user-x', 2025);
    const b = generateJWNumber('user-x', 2030);
    expect(a.startsWith('JW-2025-')).toBe(true);
    expect(b.startsWith('JW-2030-')).toBe(true);
  });

  it('pads the numeric suffix to 4 digits', () => {
    // Pick a userId that historically hashes to a small number; we just
    // assert the format always has 4 digits regardless of value.
    const result = generateJWNumber('a', 2026);
    const suffix = result.split('-')[2]!;
    expect(suffix.length).toBe(4);
  });
});

describe('currentJWYear', () => {
  it('returns current calendar year as a 4-digit number', () => {
    const y = currentJWYear();
    expect(Number.isInteger(y)).toBe(true);
    expect(y).toBeGreaterThanOrEqual(2025);
    expect(y).toBeLessThan(3000);
  });
});
