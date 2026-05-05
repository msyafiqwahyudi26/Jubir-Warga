import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar, avatarHue, avatarInitials } from '@/components/ui/avatar';

describe('avatarInitials', () => {
  it('returns 2-char uppercase from full name', () => {
    expect(avatarInitials('Anies Baswedan')).toBe('AB');
  });

  it('returns 1-char from single name', () => {
    expect(avatarInitials('Ridwan')).toBe('R');
  });

  it('caps at 2 chars even for 3+ word names', () => {
    expect(avatarInitials('Joko Widodo Saputra')).toBe('JW');
  });

  it('handles empty string', () => {
    expect(avatarInitials('')).toBe('');
  });

  it('handles extra whitespace', () => {
    expect(avatarInitials('  Anies   Baswedan  ')).toBe('AB');
  });
});

describe('avatarHue', () => {
  it('returns same hue for same input (deterministic)', () => {
    expect(avatarHue('Anies Baswedan')).toBe(avatarHue('Anies Baswedan'));
  });

  it('returns hue in 0-359 range', () => {
    const samples = ['A', 'AB', 'Ridwan Kamil', 'Tri Rismaharini', 'Z'];
    for (const s of samples) {
      const h = avatarHue(s);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThan(360);
    }
  });

  it('returns 0 for empty string', () => {
    expect(avatarHue('')).toBe(0);
  });
});

describe('<Avatar />', () => {
  it('renders initials', () => {
    render(<Avatar name="Anies Baswedan" />);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('shows level dot when level provided', () => {
    render(<Avatar name="Ridwan" level={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('hides level dot when level undefined', () => {
    const { container } = render(<Avatar name="Ridwan" />);
    // Hanya 1 div text element (initials wrapper), tidak ada level dot.
    expect(container.querySelectorAll('span').length).toBe(0);
  });

  it('hides level dot when showLevel=false even if level given', () => {
    render(<Avatar name="Ridwan" level={3} showLevel={false} />);
    expect(screen.queryByText('3')).not.toBeInTheDocument();
  });

  it('exposes accessible name via aria-label', () => {
    render(<Avatar name="Anies Baswedan" level={4} />);
    expect(
      screen.getByLabelText('Avatar Anies Baswedan, level 4'),
    ).toBeInTheDocument();
  });

  it('size prop changes pixel dimensions', () => {
    const { container, rerender } = render(<Avatar name="A" size="sm" />);
    const small = container.firstChild?.firstChild as HTMLElement;
    expect(small.style.width).toBe('24px');

    rerender(<Avatar name="A" size="xl" />);
    const xl = container.firstChild?.firstChild as HTMLElement;
    expect(xl.style.width).toBe('56px');
  });
});
