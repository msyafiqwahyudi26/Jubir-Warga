import { describe, it, expect } from 'vitest';
import {
  parseKelasFilter,
  buildKelasUrl,
  toggleKelasLevel,
} from '@/lib/kelas/filters';

describe('parseKelasFilter', () => {
  it('parses valid level', () => {
    expect(parseKelasFilter({ level: 'Pemula' })).toEqual({ level: 'Pemula' });
  });

  it('ignores invalid level', () => {
    expect(parseKelasFilter({ level: 'Master' })).toEqual({});
  });

  it('ignores array params', () => {
    expect(parseKelasFilter({ level: ['Pemula', 'Lanjut'] })).toEqual({});
  });
});

describe('buildKelasUrl', () => {
  it('returns base URL when filter empty', () => {
    expect(buildKelasUrl({})).toBe('/kelas');
  });

  it('builds query string with level', () => {
    expect(buildKelasUrl({ level: 'Menengah' })).toBe('/kelas?level=Menengah');
  });
});

describe('toggleKelasLevel', () => {
  it('sets level when none currently', () => {
    expect(toggleKelasLevel({}, 'Pemula')).toEqual({ level: 'Pemula' });
  });

  it('clears when same level passed (toggle off)', () => {
    expect(toggleKelasLevel({ level: 'Pemula' }, 'Pemula')).toEqual({});
  });

  it('clears when undefined passed (Semua)', () => {
    expect(toggleKelasLevel({ level: 'Lanjut' }, undefined)).toEqual({});
  });

  it('replaces with new level', () => {
    expect(toggleKelasLevel({ level: 'Pemula' }, 'Lanjut')).toEqual({
      level: 'Lanjut',
    });
  });
});
