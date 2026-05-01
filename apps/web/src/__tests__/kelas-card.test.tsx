import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KelasCard, type KelasRow } from '@/app/kelas/kelas-card';

const baseKelas: KelasRow = {
  id: 'k1',
  title: 'Menulis Opini Editorial',
  description: 'Bantu kamu draft opini yang nyampe ke editor.',
  duration: '4 minggu',
  level: 'Pemula',
  price_idr: 250000,
  participant_count: 42,
  featured: false,
  mentor_id: null,
  is_demo: false,
  created_at: '2026-04-15T00:00:00Z',
};

describe('<KelasCard />', () => {
  it('renders title + description + level pill', () => {
    render(<KelasCard kelas={baseKelas} />);
    expect(screen.getByText('Menulis Opini Editorial')).toBeInTheDocument();
    expect(
      screen.getByText(/Bantu kamu draft opini/i),
    ).toBeInTheDocument();
    expect(screen.getByText('Pemula')).toBeInTheDocument();
  });

  it('shows price strikethrough + FREE badge for paid kelas', () => {
    const { container } = render(<KelasCard kelas={baseKelas} />);
    const strikethrough = container.querySelector('.line-through');
    expect(strikethrough).not.toBeNull();
    expect(strikethrough).toHaveTextContent(/Rp\s*250\.000/);
    expect(screen.getByText(/FREE selama beta/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Gratis selamanya untuk pengguna awal/i),
    ).toBeInTheDocument();
  });

  it('shows FREE badge but no strikethrough when price is 0/null', () => {
    const { container } = render(
      <KelasCard kelas={{ ...baseKelas, price_idr: 0 }} />,
    );
    expect(container.querySelector('.line-through')).toBeNull();
    expect(screen.getByText(/FREE selama beta/i)).toBeInTheDocument();
  });

  it('links to /kelas/<id>', () => {
    render(<KelasCard kelas={baseKelas} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/kelas/k1');
  });
});
