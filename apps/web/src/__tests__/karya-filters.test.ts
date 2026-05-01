import { describe, it, expect } from 'vitest';
import {
  parseKaryaFilter,
  buildKaryaUrl,
  toggleKaryaType,
} from '@/lib/karya/filters';

describe('parseKaryaFilter', () => {
  it('parses valid type + page', () => {
    expect(parseKaryaFilter({ type: 'Tulisan', page: '2' })).toEqual({
      type: 'Tulisan',
      page: 2,
    });
  });

  it('ignores invalid type values', () => {
    expect(parseKaryaFilter({ type: 'Komik' })).toEqual({});
  });

  it('ignores array params (only string accepted)', () => {
    expect(parseKaryaFilter({ type: ['Tulisan', 'Vlog'] })).toEqual({});
  });
});

describe('buildKaryaUrl', () => {
  it('returns base URL when filter empty', () => {
    expect(buildKaryaUrl({})).toBe('/karya');
  });

  it('builds query string with type', () => {
    expect(buildKaryaUrl({ type: 'Vlog' })).toBe('/karya?type=Vlog');
  });

  it('omits page=1 from URL', () => {
    expect(buildKaryaUrl({ type: 'Vlog', page: 1 })).toBe('/karya?type=Vlog');
  });

  it('includes page when > 1', () => {
    const url = buildKaryaUrl({ type: 'Vlog', page: 3 });
    expect(url).toContain('type=Vlog');
    expect(url).toContain('page=3');
  });
});

describe('toggleKaryaType', () => {
  it('sets type when none currently selected', () => {
    expect(toggleKaryaType({}, 'Tulisan')).toEqual({ type: 'Tulisan' });
  });

  it('clears when same type passed (toggle off)', () => {
    expect(toggleKaryaType({ type: 'Tulisan' }, 'Tulisan')).toEqual({});
  });

  it('clears when undefined type passed (Semua)', () => {
    expect(toggleKaryaType({ type: 'Tulisan' }, undefined)).toEqual({});
  });

  it('replaces with new type and resets page', () => {
    expect(toggleKaryaType({ type: 'Vlog', page: 4 }, 'Tulisan')).toEqual({
      type: 'Tulisan',
    });
  });
});
