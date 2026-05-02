import { describe, it, expect } from 'vitest';
import {
  parseTagihFilter,
  buildTagihUrl,
  toggleStatusFilter,
  toggleLevelFilter,
} from '@/lib/tagih/filters';

describe('parseTagihFilter', () => {
  it('parses valid status + level', () => {
    expect(
      parseTagihFilter({ status: 'Berjalan', level: 'Provinsi' }),
    ).toEqual({ status: 'Berjalan', level: 'Provinsi' });
  });

  it('ignores invalid status + level values', () => {
    expect(
      parseTagihFilter({ status: 'Wibu', level: 'Galaxy' }),
    ).toEqual({});
  });

  it('ignores array params', () => {
    expect(
      parseTagihFilter({ status: ['Berjalan', 'Mandek'] }),
    ).toEqual({});
  });
});

describe('buildTagihUrl', () => {
  it('returns base URL when filter empty', () => {
    expect(buildTagihUrl({})).toBe('/tagih');
  });

  it('builds query with status only', () => {
    expect(buildTagihUrl({ status: 'Ditepati' })).toBe(
      '/tagih?status=Ditepati',
    );
  });

  it('builds query with status + level', () => {
    const url = buildTagihUrl({ status: 'Berjalan', level: 'Pusat' });
    expect(url).toContain('status=Berjalan');
    expect(url).toContain('level=Pusat');
  });
});

describe('toggleStatusFilter', () => {
  it('sets status when none currently', () => {
    expect(toggleStatusFilter({}, 'Berjalan')).toEqual({ status: 'Berjalan' });
  });

  it('clears status when same value passed (toggle off)', () => {
    expect(
      toggleStatusFilter({ status: 'Berjalan' }, 'Berjalan'),
    ).toEqual({});
  });

  it('clears status when undefined passed (Semua)', () => {
    expect(toggleStatusFilter({ status: 'Mandek' }, undefined)).toEqual({});
  });

  it('preserves level when toggling status', () => {
    expect(
      toggleStatusFilter({ status: 'Mandek', level: 'Pusat' }, 'Berjalan'),
    ).toEqual({ status: 'Berjalan', level: 'Pusat' });
  });
});

describe('toggleLevelFilter', () => {
  it('preserves status when toggling level', () => {
    expect(
      toggleLevelFilter({ status: 'Berjalan', level: 'Pusat' }, 'Provinsi'),
    ).toEqual({ status: 'Berjalan', level: 'Provinsi' });
  });

  it('clears level when same value passed', () => {
    expect(toggleLevelFilter({ level: 'Provinsi' }, 'Provinsi')).toEqual({});
  });
});
