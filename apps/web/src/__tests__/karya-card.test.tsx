import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KaryaCard, type KaryaRow } from '@/app/karya/karya-card';

const baseKarya: KaryaRow = {
  id: 'k1',
  author_id: null,
  type: 'Tulisan',
  title: 'Sample Tulisan',
  body: null,
  meta: '7 mnt baca',
  cover_url: null,
  tags: null,
  views: 0,
  featured: false,
  published_at: '2026-05-01T00:00:00Z',
  is_demo: false,
};

describe('<KaryaCard />', () => {
  it('renders title + meta + type pill', () => {
    render(<KaryaCard karya={baseKarya} />);
    expect(screen.getByText('Sample Tulisan')).toBeInTheDocument();
    expect(screen.getByText('7 mnt baca')).toBeInTheDocument();
  });

  it('shows the type label twice (placeholder bg + pill chip)', () => {
    render(<KaryaCard karya={baseKarya} />);
    const labels = screen.getAllByText('Tulisan');
    expect(labels.length).toBeGreaterThanOrEqual(2);
  });

  it('links to /karya/<id>', () => {
    render(<KaryaCard karya={baseKarya} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/karya/k1');
  });
});
