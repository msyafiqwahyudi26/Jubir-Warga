import { describe, it, expect } from 'vitest';
import {
  pickPejabatOfDay,
  pickDistractors,
} from '@/lib/main/pejabat-of-day';
import type { Database } from '@jw/data/types';

type PejabatRow = Database['public']['Tables']['pejabat']['Row'];

function makePejabat(id: string, nama: string): PejabatRow {
  return {
    id,
    nama,
    jabatan: null,
    partai: null,
    level: null,
    dapil: null,
    photo_url: null,
    skor: null,
    is_demo: false,
    created_at: null,
  };
}

const SAMPLE: PejabatRow[] = Array.from({ length: 14 }, (_, i) =>
  makePejabat(
    `00000000-0000-0000-0000-${String(i).padStart(12, '0')}`,
    `Pejabat ${i + 1}`,
  ),
);

describe('pickPejabatOfDay', () => {
  it('returns null for empty list', () => {
    expect(pickPejabatOfDay(new Date('2026-05-02T00:00:00Z'), [])).toBeNull();
  });

  it('is deterministic for the same date', () => {
    const a = pickPejabatOfDay(new Date('2026-05-02T08:00:00Z'), SAMPLE);
    const b = pickPejabatOfDay(new Date('2026-05-02T20:00:00Z'), SAMPLE);
    expect(a?.id).toBe(b?.id);
  });

  it('cycles through the list modulo length', () => {
    const a = pickPejabatOfDay(new Date('2026-01-01T00:00:00Z'), SAMPLE);
    const b = pickPejabatOfDay(
      new Date(
        new Date('2026-01-01T00:00:00Z').getTime() +
          SAMPLE.length * 24 * 60 * 60 * 1000,
      ),
      SAMPLE,
    );
    expect(a?.id).toBe(b?.id);
  });
});

describe('pickDistractors', () => {
  it('returns the requested count of distractors', () => {
    const target = SAMPLE[0]!;
    const result = pickDistractors(
      new Date('2026-05-02T00:00:00Z'),
      SAMPLE,
      target.id,
      3,
    );
    expect(result).toHaveLength(3);
  });

  it('never includes the target', () => {
    const target = SAMPLE[5]!;
    const result = pickDistractors(
      new Date('2026-05-02T00:00:00Z'),
      SAMPLE,
      target.id,
      3,
    );
    expect(result.find((p) => p.id === target.id)).toBeUndefined();
  });

  it('returns distinct distractors', () => {
    const target = SAMPLE[2]!;
    const result = pickDistractors(
      new Date('2026-05-02T00:00:00Z'),
      SAMPLE,
      target.id,
      3,
    );
    const ids = new Set(result.map((p) => p.id));
    expect(ids.size).toBe(result.length);
  });

  it('handles small lists gracefully', () => {
    const tiny = SAMPLE.slice(0, 2);
    const target = tiny[0]!;
    const result = pickDistractors(
      new Date('2026-05-02T00:00:00Z'),
      tiny,
      target.id,
      3,
    );
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe(tiny[1]!.id);
  });
});
