import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const voteThreadAction = vi.fn();

vi.mock('@/app/komunitas/actions', () => ({
  voteThreadAction: (...args: unknown[]) => voteThreadAction(...args),
}));

const { VoteArrows } = await import('@/app/komunitas/vote-arrows');

describe('<VoteArrows />', () => {
  beforeEach(() => {
    voteThreadAction.mockReset();
  });

  it('renders initial score and accessible vote buttons', () => {
    render(
      <VoteArrows
        threadId="11111111-1111-1111-1111-111111111111"
        initialScore={5}
      />,
    );
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByLabelText('Upvote')).toBeInTheDocument();
    expect(screen.getByLabelText('Downvote')).toBeInTheDocument();
  });

  it('optimistically increments score on upvote click', async () => {
    voteThreadAction.mockResolvedValueOnce({ ok: true });
    render(
      <VoteArrows
        threadId="11111111-1111-1111-1111-111111111111"
        initialScore={5}
      />,
    );
    fireEvent.click(screen.getByLabelText('Upvote'));
    expect(screen.getByText('6')).toBeInTheDocument();
    await waitFor(() => expect(voteThreadAction).toHaveBeenCalledTimes(1));
  });

  it('reverts optimistic update when server action fails', async () => {
    voteThreadAction.mockResolvedValueOnce({ ok: false, error: 'boom' });
    render(
      <VoteArrows
        threadId="11111111-1111-1111-1111-111111111111"
        initialScore={5}
      />,
    );
    fireEvent.click(screen.getByLabelText('Upvote'));
    expect(screen.getByText('6')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('5')).toBeInTheDocument());
  });
});
