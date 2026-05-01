import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NalaMessageBubble } from '@/components/nala/nala-message-bubble';

describe('<NalaMessageBubble />', () => {
  it('renders user message content', () => {
    render(
      <NalaMessageBubble
        message={{
          id: '1',
          role: 'user',
          content: 'Test pesan dari user',
          createdAt: '2026-05-01T00:00:00Z',
        }}
      />,
    );
    expect(screen.getByText('Test pesan dari user')).toBeInTheDocument();
  });

  it('renders nala message content with citation footnote', () => {
    render(
      <NalaMessageBubble
        message={{
          id: '2',
          role: 'nala',
          content: 'Penjelasan dengan rujukan [1]',
          citations: [
            { index: 1, title: 'Sumber X', url: 'https://example.org' },
          ],
          createdAt: '2026-05-01T00:00:00Z',
        }}
      />,
    );
    expect(screen.getByText(/Penjelasan dengan rujukan/i)).toBeInTheDocument();
    const citation = screen.getByRole('link', { name: 'Sumber X' });
    expect(citation).toHaveAttribute('href', 'https://example.org');
  });
});
