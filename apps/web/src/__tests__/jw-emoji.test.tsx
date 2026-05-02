import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { JWEmoji, type JWEmojiName } from '@/components/jw-emoji/jw-emoji';

// 11 brand color tokens — JANGAN extend (CLAUDE.md Section 5.1).
const BRAND_PALETTE = new Set(
  [
    '#1A2256',
    '#FFFAEE',
    '#3B4A8A',
    '#2A2D3A',
    '#6B6860',
    '#E6DECB',
    '#E8632B',
    '#F2B137',
    '#7FB69E',
    '#C44434',
    '#8A9099',
  ].map((c) => c.toLowerCase())
);

describe('<JWEmoji />', () => {
  const names: JWEmojiName[] = [
    'kategori-transport',
    'kategori-pangan',
    'status-ditepati',
    'status-mandek',
    'reaksi-love',
  ];

  names.forEach((name) => {
    it(`renders ${name} emoji as SVG`, () => {
      const { container } = render(<JWEmoji name={name} />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
    });
  });

  it('respects size prop on width and height attributes', () => {
    const { container } = render(<JWEmoji name="status-ditepati" size={48} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '48');
    expect(svg).toHaveAttribute('height', '48');
  });

  it('defaults size to 24', () => {
    const { container } = render(<JWEmoji name="reaksi-love" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
  });

  it('applies className to the rendered svg', () => {
    const { container } = render(
      <JWEmoji name="kategori-pangan" className="opacity-80" />
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toContain('opacity-80');
  });

  it('uses 32x32 viewBox (consistent emoji canvas)', () => {
    names.forEach((name) => {
      const { container } = render(<JWEmoji name={name} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 32 32');
    });
  });

  it('only uses colors from the 11-token brand palette', () => {
    names.forEach((name) => {
      const { container } = render(<JWEmoji name={name} />);
      const allElements = container.querySelectorAll('*');
      allElements.forEach((el) => {
        const fill = el.getAttribute('fill');
        const stroke = el.getAttribute('stroke');
        for (const value of [fill, stroke]) {
          if (!value) continue;
          if (value === 'none' || value === 'currentColor') continue;
          expect(
            BRAND_PALETTE.has(value.toLowerCase()),
            `${name}: color ${value} is outside the 11 brand palette tokens`
          ).toBe(true);
        }
      });
    });
  });

  it('returns null for invalid name (no crash)', () => {
    // @ts-expect-error testing invalid input fallback
    const { container } = render(<JWEmoji name="invalid-name" />);
    expect(container.firstChild).toBeNull();
  });
});
