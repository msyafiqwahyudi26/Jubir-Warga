import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JwLogo } from '@/components/jw-logo';

describe('<JwLogo />', () => {
  it('renders the brand wordmark text', () => {
    render(<JwLogo />);
    expect(screen.getByText(/Jubir Warga/i)).toBeInTheDocument();
  });

  it('exposes accessible label on the wrapper', () => {
    render(<JwLogo />);
    expect(screen.getByLabelText(/Jubir Warga/i)).toBeInTheDocument();
  });
});
