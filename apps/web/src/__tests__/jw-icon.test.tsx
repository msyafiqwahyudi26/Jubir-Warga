import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { JWIcon, type JWIconName } from '@/components/jw-icon/jw-icon';

describe('<JWIcon />', () => {
  const names: JWIconName[] = ['home', 'message', 'user', 'search', 'bell'];

  names.forEach((name) => {
    it(`renders ${name} icon as SVG`, () => {
      const { container } = render(<JWIcon name={name} />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
    });
  });

  it('respects size prop on width and height attributes', () => {
    const { container } = render(<JWIcon name="bell" size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('defaults size to 20', () => {
    const { container } = render(<JWIcon name="home" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '20');
  });

  it('applies className to the rendered svg', () => {
    const { container } = render(<JWIcon name="search" className="text-jw-coral" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('class')).toContain('text-jw-coral');
  });

  it('uses currentColor for stroke by default', () => {
    const { container } = render(<JWIcon name="user" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
  });

  it('uses 1.5 stroke-width (hand-drawn brand treatment)', () => {
    const { container } = render(<JWIcon name="home" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('stroke-width', '1.5');
  });

  it('returns null for invalid name (no crash)', () => {
    // @ts-expect-error testing invalid input fallback
    const { container } = render(<JWIcon name="invalid" />);
    expect(container.firstChild).toBeNull();
  });
});
