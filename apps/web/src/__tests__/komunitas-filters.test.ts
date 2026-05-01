import { describe, it, expect } from 'vitest';
import {
  parseFilterFromSearchParams,
  buildFilterUrl,
  toggleFilter,
} from '@/lib/komunitas/filters';

describe('parseFilterFromSearchParams', () => {
  it('parses valid topic + chapter + format + hot + page', () => {
    const f = parseFilterFromSearchParams({
      topic: 'politik',
      chapter: 'jakarta',
      format: 'diskusi',
      hot: 'true',
      page: '2',
    });
    expect(f).toEqual({
      topic: 'politik',
      chapter: 'jakarta',
      format: 'diskusi',
      hot: true,
      page: 2,
    });
  });

  it('ignores invalid topic + chapter values', () => {
    const f = parseFilterFromSearchParams({ topic: 'invalid', chapter: 'mars' });
    expect(f).toEqual({});
  });

  it('treats array search params as missing (only string is accepted)', () => {
    const f = parseFilterFromSearchParams({
      topic: ['politik', 'kerja'],
    });
    expect(f.topic).toBeUndefined();
  });

  it('rejects non-numeric page', () => {
    const f = parseFilterFromSearchParams({ page: 'abc' });
    expect(f.page).toBeUndefined();
  });
});

describe('buildFilterUrl', () => {
  it('returns base URL when filter empty', () => {
    expect(buildFilterUrl({})).toBe('/komunitas');
  });

  it('builds query string with all filters set', () => {
    const url = buildFilterUrl({ topic: 'politik', hot: true, page: 2 });
    expect(url).toMatch(/^\/komunitas\?/);
    expect(url).toContain('topic=politik');
    expect(url).toContain('hot=true');
    expect(url).toContain('page=2');
  });

  it('omits page=1 from URL', () => {
    expect(buildFilterUrl({ topic: 'politik', page: 1 })).toBe(
      '/komunitas?topic=politik',
    );
  });
});

describe('toggleFilter', () => {
  it('sets value when key is empty', () => {
    expect(toggleFilter({}, 'topic', 'politik')).toEqual({ topic: 'politik' });
  });

  it('unsets value when same value passed (toggle off)', () => {
    expect(toggleFilter({ topic: 'politik' }, 'topic', 'politik')).toEqual({});
  });

  it('replaces value when different value passed', () => {
    expect(toggleFilter({ topic: 'politik' }, 'topic', 'kerja')).toEqual({
      topic: 'kerja',
    });
  });

  it('resets page on filter change', () => {
    const result = toggleFilter(
      { topic: 'politik', page: 3 },
      'chapter',
      'jakarta',
    );
    expect(result.page).toBeUndefined();
  });
});
