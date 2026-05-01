import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ArticleBody } from '@/app/karya/[id]/article-body';

describe('<ArticleBody />', () => {
  it('renders paragraphs separated by blank line', () => {
    render(<ArticleBody body={'Para 1.\n\nPara 2.'} />);
    expect(screen.getByText('Para 1.')).toBeInTheDocument();
    expect(screen.getByText('Para 2.')).toBeInTheDocument();
  });

  it('renders ## h2 as level-2 heading', () => {
    render(<ArticleBody body={'## My Heading\n\nBody.'} />);
    expect(
      screen.getByRole('heading', { level: 2, name: /My Heading/ }),
    ).toBeInTheDocument();
  });

  it('renders > quote as blockquote element', () => {
    const { container } = render(<ArticleBody body={'> Quote text.'} />);
    const quote = container.querySelector('blockquote');
    expect(quote).not.toBeNull();
    expect(quote).toHaveTextContent('Quote text.');
  });

  it('renders **bold** as <strong>', () => {
    const { container } = render(<ArticleBody body={'Hello **world**.'} />);
    const strong = container.querySelector('strong');
    expect(strong).not.toBeNull();
    expect(strong).toHaveTextContent('world');
  });

  it('renders graceful fallback for empty body', () => {
    render(<ArticleBody body={'   \n\n   '} />);
    expect(
      screen.getByText(/Tulisan belum tersedia/i),
    ).toBeInTheDocument();
  });
});
