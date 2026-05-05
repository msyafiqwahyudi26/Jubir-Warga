import { describe, it, expect } from 'vitest';
import {
  ALIGNMENT_STATUSES,
  EDITORIAL_STATUSES,
  emptyAlignmentBreakdown,
  isAlignmentStatus,
  isEditorialStatus,
  isPartaiName,
  isTopikId,
  TOPIK_OPTIONS,
} from '@/lib/tagih/alignment';
import {
  alignmentPercent,
  alignmentTotal,
  computeAlignmentBreakdown,
  pendingReviewCount,
} from '@/lib/tagih/alignment-counter';
import {
  buildTagihUrl,
  isFilterEmpty,
  parseTagihFilter,
  toggleTagihFilter,
} from '@/lib/tagih/filters';

describe('alignment guards', () => {
  it('isAlignmentStatus accepts canonical values', () => {
    for (const a of ALIGNMENT_STATUSES) expect(isAlignmentStatus(a)).toBe(true);
  });

  it('isAlignmentStatus rejects unknown', () => {
    expect(isAlignmentStatus('balanced')).toBe(false);
    expect(isAlignmentStatus(null)).toBe(false);
    expect(isAlignmentStatus(undefined)).toBe(false);
    expect(isAlignmentStatus('')).toBe(false);
  });

  it('isEditorialStatus accepts canonical values', () => {
    for (const e of EDITORIAL_STATUSES) expect(isEditorialStatus(e)).toBe(true);
  });

  it('isTopikId follows whitelist', () => {
    expect(isTopikId(TOPIK_OPTIONS[0].id)).toBe(true);
    expect(isTopikId('Pertanahan')).toBe(false);
  });

  it('isPartaiName matches hard-coded list', () => {
    expect(isPartaiName('PDIP')).toBe(true);
    expect(isPartaiName('Partai Imajiner')).toBe(false);
  });
});

describe('computeAlignmentBreakdown', () => {
  it('returns empty breakdown for empty input', () => {
    expect(computeAlignmentBreakdown([])).toEqual(emptyAlignmentBreakdown());
  });

  it('counts each alignment status', () => {
    const rows = [
      { alignment_status: 'aligned' },
      { alignment_status: 'aligned' },
      { alignment_status: 'partial' },
      { alignment_status: 'drift' },
      { alignment_status: 'contradict' },
    ];
    expect(computeAlignmentBreakdown(rows)).toEqual({
      aligned: 2,
      partial: 1,
      drift: 1,
      contradict: 1,
    });
  });

  it('skips null / unknown alignment_status', () => {
    const rows = [
      { alignment_status: 'aligned' },
      { alignment_status: null },
      { alignment_status: 'unknown_value' },
      { alignment_status: undefined },
    ];
    expect(computeAlignmentBreakdown(rows)).toEqual({
      aligned: 1,
      partial: 0,
      drift: 0,
      contradict: 0,
    });
  });
});

describe('alignmentTotal + alignmentPercent', () => {
  it('total counts only reviewed', () => {
    const breakdown = { aligned: 5, partial: 3, drift: 2, contradict: 0 };
    expect(alignmentTotal(breakdown)).toBe(10);
  });

  it('returns 0 percent when total is zero', () => {
    expect(alignmentPercent('aligned', emptyAlignmentBreakdown())).toBe(0);
  });

  it('rounds percent to integer', () => {
    const breakdown = { aligned: 1, partial: 1, drift: 1, contradict: 0 };
    expect(alignmentPercent('aligned', breakdown)).toBe(33);
    expect(alignmentPercent('contradict', breakdown)).toBe(0);
  });

  it('clamps percent between 0 and 100', () => {
    // synthetic over-count input; counter still clamps
    const breakdown = { aligned: 200, partial: 0, drift: 0, contradict: 0 };
    expect(alignmentPercent('aligned', breakdown)).toBeLessThanOrEqual(100);
    expect(alignmentPercent('drift', breakdown)).toBeGreaterThanOrEqual(0);
  });
});

describe('pendingReviewCount', () => {
  it('counts only rows missing alignment_status', () => {
    const rows = [
      { alignment_status: 'aligned' },
      { alignment_status: null },
      { alignment_status: 'unknown' },
      { alignment_status: undefined },
    ];
    expect(pendingReviewCount(rows)).toBe(3);
  });
});

describe('parseTagihFilter — extended', () => {
  it('parses topik when valid', () => {
    expect(parseTagihFilter({ topik: 'Ekonomi' })).toEqual({
      topik: 'Ekonomi',
    });
  });

  it('ignores topik when invalid', () => {
    expect(parseTagihFilter({ topik: 'NotInList' })).toEqual({});
  });

  it('parses partai when matches whitelist', () => {
    expect(parseTagihFilter({ partai: 'PDIP' })).toEqual({ partai: 'PDIP' });
  });

  it('parses alignment when valid', () => {
    expect(parseTagihFilter({ alignment: 'aligned' })).toEqual({
      alignment: 'aligned',
    });
  });

  it('parses combo of all 5 filters', () => {
    expect(
      parseTagihFilter({
        status: 'Berjalan',
        level: 'Pusat',
        topik: 'Pendidikan',
        partai: 'Gerindra',
        alignment: 'partial',
      }),
    ).toEqual({
      status: 'Berjalan',
      level: 'Pusat',
      topik: 'Pendidikan',
      partai: 'Gerindra',
      alignment: 'partial',
    });
  });
});

describe('buildTagihUrl — extended', () => {
  it('serializes all 5 filter dimensions', () => {
    const url = buildTagihUrl({
      status: 'Ditepati',
      level: 'Provinsi',
      topik: 'Lingkungan',
      partai: 'PDIP',
      alignment: 'aligned',
    });
    expect(url).toContain('status=Ditepati');
    expect(url).toContain('level=Provinsi');
    expect(url).toContain('topik=Lingkungan');
    expect(url).toContain('partai=PDIP');
    expect(url).toContain('alignment=aligned');
  });

  it('encodes URI components correctly', () => {
    const url = buildTagihUrl({ partai: 'NasDem' });
    expect(url).toBe('/tagih?partai=NasDem');
  });
});

describe('toggleTagihFilter generic', () => {
  it('sets new value when key empty', () => {
    expect(toggleTagihFilter({}, 'topik', 'Ekonomi')).toEqual({
      topik: 'Ekonomi',
    });
  });

  it('clears when same value passed', () => {
    expect(toggleTagihFilter({ topik: 'Ekonomi' }, 'topik', 'Ekonomi')).toEqual(
      {},
    );
  });

  it('clears when undefined passed', () => {
    expect(toggleTagihFilter({ partai: 'PDIP' }, 'partai', undefined)).toEqual(
      {},
    );
  });

  it('replaces value when different one passed', () => {
    expect(
      toggleTagihFilter({ alignment: 'aligned' }, 'alignment', 'drift'),
    ).toEqual({ alignment: 'drift' });
  });

  it('preserves other filters when toggling one', () => {
    expect(
      toggleTagihFilter(
        { status: 'Berjalan', topik: 'Ekonomi' },
        'topik',
        'Pendidikan',
      ),
    ).toEqual({ status: 'Berjalan', topik: 'Pendidikan' });
  });
});

describe('isFilterEmpty', () => {
  it('returns true for empty object', () => {
    expect(isFilterEmpty({})).toBe(true);
  });

  it('returns false when any filter is set', () => {
    expect(isFilterEmpty({ topik: 'Ekonomi' })).toBe(false);
    expect(isFilterEmpty({ alignment: 'drift' })).toBe(false);
    expect(isFilterEmpty({ partai: 'Golkar' })).toBe(false);
  });
});
