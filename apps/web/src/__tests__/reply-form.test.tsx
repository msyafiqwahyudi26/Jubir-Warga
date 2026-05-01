import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/komunitas/actions', () => ({
  submitReplyAction: vi.fn(async () => ({ ok: true })),
}));

const { ReplyForm } = await import('@/app/komunitas/[id]/reply-form');

describe('<ReplyForm />', () => {
  it('renders textarea with helpful placeholder + submit button', () => {
    render(<ReplyForm threadId="11111111-1111-1111-1111-111111111111" />);
    const textarea = screen.getByLabelText(/Tulis balasan/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('placeholder');
    expect(
      screen.getByRole('button', { name: /Kirim balasan/i }),
    ).toBeEnabled();
  });

  it('exposes the threadId via a hidden input so the action receives it', () => {
    const { container } = render(
      <ReplyForm threadId="22222222-2222-2222-2222-222222222222" />,
    );
    const hidden = container.querySelector(
      'input[type="hidden"][name="threadId"]',
    );
    expect(hidden).not.toBeNull();
    expect(hidden).toHaveValue('22222222-2222-2222-2222-222222222222');
  });
});
