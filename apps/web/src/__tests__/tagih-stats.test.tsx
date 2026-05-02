import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  emptyStatusBreakdown,
  tagihStatPercent,
} from '@/lib/tagih/constants';
import { TagihStats } from '@/app/tagih/tagih-stats';

describe('tagihStatPercent', () => {
  it('returns 0 for total=0', () => {
    expect(tagihStatPercent(5, 0)).toBe(0);
  });

  it('rounds to nearest integer', () => {
    expect(tagihStatPercent(1, 3)).toBe(33);
  });

  it('clamps to 100', () => {
    expect(tagihStatPercent(150, 100)).toBe(100);
  });

  it('clamps to 0 for negative', () => {
    expect(tagihStatPercent(-5, 100)).toBe(0);
  });
});

describe('<TagihStats />', () => {
  it('renders all 4 stat cards with correct percentages', () => {
    const breakdown = emptyStatusBreakdown();
    breakdown.Ditepati = 25;
    breakdown.Berjalan = 50;
    breakdown.Mandek = 10;
    breakdown.Diingkari = 15;
    const total = 100;

    render(<TagihStats total={total} breakdown={breakdown} />);
    expect(screen.getByText('Total janji')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    // Ditepati = 25/100 = 25%, Mandek+Diingkari = 25/100 = 25% → 2 occurrences.
    expect(screen.getAllByText('25%').length).toBe(2);
  });

  it('handles zero-total gracefully (all percentages = 0%)', () => {
    render(
      <TagihStats total={0} breakdown={emptyStatusBreakdown()} />,
    );
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getAllByText('0%').length).toBe(3);
  });
});
