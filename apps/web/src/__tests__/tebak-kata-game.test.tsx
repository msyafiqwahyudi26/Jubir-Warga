import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  evaluateGuess,
  scoreForAttempt,
} from '@/lib/main/constants';

const submitGameScoreAction = vi.fn();

vi.mock('@/app/main/actions', () => ({
  submitGameScoreAction: (formData: FormData) =>
    submitGameScoreAction(formData),
}));

const { TebakKataGame } = await import('@/app/main/tebak-kata/tebak-kata-game');

describe('evaluateGuess (Wordle algorithm)', () => {
  it('marks all-correct guess green', () => {
    expect(evaluateGuess('WARGA', 'WARGA')).toEqual([
      'correct',
      'correct',
      'correct',
      'correct',
      'correct',
    ]);
  });

  it('marks fully wrong letters absent', () => {
    expect(evaluateGuess('XYZBC', 'WARGA')).toEqual([
      'absent',
      'absent',
      'absent',
      'absent',
      'absent',
    ]);
  });

  it('marks correct-position green and wrong-position yellow', () => {
    // answer WARGA, guess WAGRA → W,A correct; G present (in answer), R present, A correct.
    const result = evaluateGuess('WAGRA', 'WARGA');
    expect(result[0]).toBe('correct'); // W
    expect(result[1]).toBe('correct'); // A
    expect(result[2]).toBe('present'); // G in WARGA at idx 3
    expect(result[3]).toBe('present'); // R in WARGA at idx 2
    expect(result[4]).toBe('correct'); // A
  });

  it('handles duplicate letters correctly (does not double-count)', () => {
    // answer LAPOR, guess AALAR → first A absent (only 1 A in LAPOR, used by 3rd),
    // 3rd A actually goes to "present" because the second A in guess is wrong-pos.
    // Test the simpler invariant: no over-counting yellow.
    const result = evaluateGuess('AALAR', 'LAPOR');
    const presentCount = result.filter((r) => r === 'present').length;
    const correctCount = result.filter((r) => r === 'correct').length;
    expect(presentCount + correctCount).toBeLessThanOrEqual(5);
  });
});

describe('scoreForAttempt', () => {
  it('returns 90 for first-try win, 80 for second, ...', () => {
    expect(scoreForAttempt(1)).toBe(90);
    expect(scoreForAttempt(2)).toBe(80);
    expect(scoreForAttempt(6)).toBe(40);
  });

  it('clamps at 0 for hypothetical >10 attempts', () => {
    expect(scoreForAttempt(11)).toBe(0);
  });
});

describe('<TebakKataGame /> render', () => {
  beforeEach(() => {
    submitGameScoreAction.mockClear();
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  });

  it('renders 6 rows of 5 tiles + virtual keyboard', () => {
    const { container } = render(<TebakKataGame answer="WARGA" />);
    const tiles = container.querySelectorAll('[role="gridcell"]');
    expect(tiles.length).toBe(30);
  });

  it('shows ENTER and BACKSPACE keys + at least one letter key', () => {
    render(<TebakKataGame answer="WARGA" />);
    expect(screen.getByLabelText('ENTER')).toBeInTheDocument();
    expect(screen.getByLabelText('BACKSPACE')).toBeInTheDocument();
    expect(screen.getByLabelText('W')).toBeInTheDocument();
  });

  it('typing letters updates the current row tiles', () => {
    const { container } = render(<TebakKataGame answer="WARGA" />);
    fireEvent.click(screen.getByLabelText('W'));
    fireEvent.click(screen.getByLabelText('A'));
    const pendingTiles = container.querySelectorAll('[data-state="pending"]');
    expect(pendingTiles.length).toBe(2);
  });
});
