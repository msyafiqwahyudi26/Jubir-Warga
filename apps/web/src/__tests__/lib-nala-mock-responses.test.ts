import { describe, it, expect } from 'vitest';
import { getMockResponse } from '@/lib/nala/mock-responses';

describe('getMockResponse', () => {
  it('matches keyword "pasal 28e" (case insensitive) and returns citation', () => {
    const result = getMockResponse('Apa itu pasal 28E?');
    expect(result.content).toContain('Pasal 28E');
    expect(result.citations).toHaveLength(1);
    expect(result.citations[0]).toMatchObject({ index: 1 });
  });

  it('matches keyword "kelas online"', () => {
    const result = getMockResponse('Saya cari kelas online publik');
    expect(result.content).toContain('Kelas online');
  });

  it('matches keyword "opini" and returns the editorial template', () => {
    const result = getMockResponse('Bantu draft opini buat aku');
    expect(result.content).toContain('Opini editorial');
  });

  it('returns fallback content + empty citations for unknown topic', () => {
    const result = getMockResponse('Cuaca hari ini gimana?');
    expect(result.content).toContain('mode beta');
    expect(result.citations).toEqual([]);
  });
});
