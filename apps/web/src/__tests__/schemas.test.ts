import { describe, it, expect } from 'vitest';
import {
  submitThreadSchema,
  submitLaporanSchema,
  updateProfileSchema,
} from '@jw/data/schemas';

describe('submitThreadSchema', () => {
  it('accepts valid input', () => {
    const result = submitThreadSchema.safeParse({
      title: 'Diskusi awal soal pasal 28E',
      body: 'Body content yang panjangnya cukup untuk lolos validasi minimum.',
      topic_id: 'politik',
      chapter_id: 'jakarta',
      format: 'diskusi',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty title', () => {
    const result = submitThreadSchema.safeParse({
      title: '',
      body: 'Body content yang panjangnya cukup untuk lolos validasi minimum.',
      topic_id: 'politik',
    });
    expect(result.success).toBe(false);
  });
});

describe('submitLaporanSchema', () => {
  it('accepts valid input with default is_anonim', () => {
    const result = submitLaporanSchema.safeParse({
      category: 'banjir',
      title: 'Banjir di Jl. Mawar setinggi 50cm',
      description: 'Air masuk rumah sejak subuh, sudah lapor RT tapi belum surut.',
      location: 'Jl. Mawar No. 12, RT 03 RW 02',
      city: 'jakarta',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.is_anonim).toBe(false);
    }
  });
});

describe('updateProfileSchema', () => {
  it('rejects username with invalid characters', () => {
    const result = updateProfileSchema.safeParse({
      name: 'Aulia',
      username: 'aulia bandung',
    });
    expect(result.success).toBe(false);
  });
});
