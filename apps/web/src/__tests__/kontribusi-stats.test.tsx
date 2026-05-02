import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KontribusiStats } from '@/app/profil/kontribusi-stats';

describe('<KontribusiStats />', () => {
  it('renders all 5 metric cards with formatted counts', () => {
    render(
      <KontribusiStats
        counts={{
          threads: 12,
          karya: 4,
          petisi: 28,
          janji: 7,
          kelas: 2,
          kelasCompleted: 1,
        }}
      />,
    );
    expect(screen.getByText('Thread')).toBeInTheDocument();
    expect(screen.getByText('Karya')).toBeInTheDocument();
    expect(screen.getByText('Petisi ditandatangani')).toBeInTheDocument();
    expect(screen.getByText('Janji dipantau')).toBeInTheDocument();
    expect(screen.getByText('Kelas')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('28')).toBeInTheDocument();
  });

  it('renders kelas completion sub-label only when > 0', () => {
    const { rerender } = render(
      <KontribusiStats
        counts={{
          threads: 0,
          karya: 0,
          petisi: 0,
          janji: 0,
          kelas: 3,
          kelasCompleted: 2,
        }}
      />,
    );
    expect(screen.getByText('2 selesai')).toBeInTheDocument();

    rerender(
      <KontribusiStats
        counts={{
          threads: 0,
          karya: 0,
          petisi: 0,
          janji: 0,
          kelas: 1,
          kelasCompleted: 0,
        }}
      />,
    );
    expect(screen.queryByText(/selesai/i)).toBeNull();
  });

  it('formats large numbers with Indonesian thousand separator', () => {
    render(
      <KontribusiStats
        counts={{
          threads: 1234,
          karya: 0,
          petisi: 0,
          janji: 0,
          kelas: 0,
          kelasCompleted: 0,
        }}
      />,
    );
    expect(screen.getByText('1.234')).toBeInTheDocument();
  });
});
