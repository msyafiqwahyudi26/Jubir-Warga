// Spec #21 — Komunitas page a11y. Renders ThreadRow + VoteArrows surface
// so axe scans real interactive markup.
import { describe, it, expect, vi } from 'vitest';
import { renderAndScan } from './shared/render-with-axe';
import { ThreadRow } from '@/app/komunitas/thread-row';

vi.mock('@/app/komunitas/actions', () => ({
  voteThreadAction: vi.fn(async () => ({ ok: true })),
}));

const baseThread = {
  id: 't1',
  title: 'KRL malam ini delay 30 menit lagi. Solusinya?',
  preview: 'Tadi pagi udah delay, sekarang lagi. Kira-kira solusinya apa?',
  author_id: 'u1',
  author_name: 'Aulia',
  topic_id: null,
  chapter_id: null,
  chapter_name: 'Jakarta',
  format: 'tulisan',
  hot: false,
  upvotes: 12,
  downvotes: 2,
  reply_count: 5,
  created_at: '2026-05-01T00:00:00Z',
  is_demo: false,
};

function KomunitasSurface() {
  return (
    <main id="main-content">
      <header>
        <h1>Komunitas</h1>
        <p>3 thread · ngumpul, nimbrung, atau cuma baca</p>
      </header>
      <section aria-label="Daftar thread">
        <ThreadRow thread={baseThread as never} />
        <ThreadRow
          thread={{ ...baseThread, id: 't2', title: 'Pasal 28E itu apa sih?' } as never}
        />
        <ThreadRow
          thread={{ ...baseThread, id: 't3', title: 'Cara submit petisi yang efektif' } as never}
        />
      </section>
    </main>
  );
}

describe('Komunitas a11y', () => {
  it('has no accessibility violations', async () => {
    const { results } = await renderAndScan(<KomunitasSurface />);
    expect(results).toHaveNoViolations();
  });
});
