import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PasporFlip } from '@/app/profil/paspor-flip';
import type { Database } from '@jw/data/types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

const baseProfile: Pick<
  ProfileRow,
  'name' | 'username' | 'chapter_id' | 'level' | 'avatar_url' | 'created_at'
> = {
  name: 'Aulia',
  username: 'aulia_b',
  chapter_id: 'bandung',
  level: 3,
  avatar_url: null,
  created_at: '2025-01-15T00:00:00Z',
};

describe('<PasporFlip />', () => {
  it('renders Cover by default with JW number visible', () => {
    render(
      <PasporFlip
        profile={baseProfile}
        jwNumber="JW-2026-0042"
        badges={[]}
        visaEntries={[]}
      />,
    );
    expect(screen.getByText('JW-2026-0042')).toBeInTheDocument();
    expect(screen.getByText(/Suara warga/i)).toBeInTheDocument();
  });

  it('switches to Identitas tab on click', () => {
    render(
      <PasporFlip
        profile={baseProfile}
        jwNumber="JW-2026-0042"
        badges={[]}
        visaEntries={[]}
      />,
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Identitas' }));
    expect(screen.getByText('Aulia')).toBeInTheDocument();
    expect(screen.getByText('@aulia_b')).toBeInTheDocument();
    expect(screen.getByText('Level 3')).toBeInTheDocument();
  });

  it('switches to Stempel tab and shows empty state when no badges', () => {
    render(
      <PasporFlip
        profile={baseProfile}
        jwNumber="JW-2026-0042"
        badges={[]}
        visaEntries={[]}
      />,
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Stempel' }));
    expect(screen.getByText(/Belum ada stempel/i)).toBeInTheDocument();
  });

  it('switches to Visa tab and lists chronological entries', () => {
    render(
      <PasporFlip
        profile={baseProfile}
        jwNumber="JW-2026-0042"
        badges={[]}
        visaEntries={[
          {
            id: 't1',
            type: 'thread',
            label: 'Diskusi awal pasal 28E',
            at: '2026-04-15T00:00:00Z',
          },
          {
            id: 'p1',
            type: 'petisi',
            label: 'Stop bansos jadi alat politik',
            at: '2026-04-20T00:00:00Z',
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole('tab', { name: 'Visa' }));
    expect(screen.getByText(/Diskusi awal pasal 28E/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Stop bansos jadi alat politik/i),
    ).toBeInTheDocument();
  });
});
