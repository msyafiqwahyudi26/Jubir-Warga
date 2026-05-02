import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PollingResultBars } from '@/app/aksi/polling/[id]/polling-result-bars';
import { calculatePercent } from '@/lib/aksi/constants';

describe('calculatePercent', () => {
  it('returns 0 for total=0', () => {
    expect(calculatePercent(5, 0)).toBe(0);
  });

  it('returns expected percentage', () => {
    expect(calculatePercent(25, 100)).toBe(25);
    expect(calculatePercent(1, 4)).toBe(25);
  });

  it('clamps to 100 when current exceeds total', () => {
    expect(calculatePercent(150, 100)).toBe(100);
  });
});

describe('<PollingResultBars />', () => {
  const options = [
    { id: 'a', label: 'Opsi A', votes: 30 },
    { id: 'b', label: 'Opsi B', votes: 60 },
    { id: 'c', label: 'Opsi C', votes: 10 },
  ];

  it('sorts options descending by votes (highest first)', () => {
    const { container } = render(
      <PollingResultBars options={options} totalVotes={100} />,
    );
    const labels = Array.from(
      container.querySelectorAll('.font-medium.text-jw-ink'),
    ).map((el) => el.textContent);
    expect(labels).toEqual(['Opsi B', 'Opsi A', 'Opsi C']);
  });

  it('renders percent + vote count per option', () => {
    render(<PollingResultBars options={options} totalVotes={100} />);
    expect(screen.getByText(/60 \(60\.0%\)/)).toBeInTheDocument();
    expect(screen.getByText(/30 \(30\.0%\)/)).toBeInTheDocument();
    expect(screen.getByText(/10 \(10\.0%\)/)).toBeInTheDocument();
  });

  it('omits ack message by default', () => {
    render(<PollingResultBars options={options} totalVotes={100} />);
    expect(
      screen.queryByText(/Suaramu sudah tercatat/i),
    ).toBeNull();
  });

  it('shows ack message when showAck=true', () => {
    render(
      <PollingResultBars
        options={options}
        totalVotes={100}
        showAck={true}
      />,
    );
    expect(
      screen.getByText(/Suaramu sudah tercatat/i),
    ).toBeInTheDocument();
  });
});
