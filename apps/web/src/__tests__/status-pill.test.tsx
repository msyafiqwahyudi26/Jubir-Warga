import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusPill } from '@/app/tagih/status-pill';
import type { JanjiStatus } from '@jw/data/types';

describe('<StatusPill />', () => {
  const cases: { status: JanjiStatus; label: string }[] = [
    { status: 'Belum', label: 'Belum' },
    { status: 'Berjalan', label: 'Berjalan' },
    { status: 'Mandek', label: 'Mandek' },
    { status: 'Ditepati', label: 'Ditepati' },
    { status: 'Diingkari', label: 'Diingkari' },
  ];

  cases.forEach(({ status, label }) => {
    it(`renders ${status} pill with label`, () => {
      render(<StatusPill status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders an svg icon (Lucide) — NOT a unicode symbol', () => {
    const { container } = render(<StatusPill status="Berjalan" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    // Ensure none of the legacy Phase 1 unicode markers leaked through.
    const text = container.textContent ?? '';
    for (const symbol of ['✓', '↻', '⏸', '✕', '⌛']) {
      expect(text).not.toContain(symbol);
    }
  });
});
