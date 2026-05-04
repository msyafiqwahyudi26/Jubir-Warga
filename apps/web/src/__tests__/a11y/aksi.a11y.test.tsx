// Spec #21 — Aksi page a11y. Renders polling card + petisi rows.
import { describe, it, expect } from 'vitest';
import { renderAndScan } from './shared/render-with-axe';
import { PollingFeaturedCard } from '@/app/aksi/polling-featured-card';
import { PetisiRow, type PetisiViewRow } from '@/app/aksi/petisi-row';

const polling = {
  id: 'p1',
  question: 'Setuju nggak kalau RT/RW elected, bukan ditunjuk?',
  total_votes: 432,
  status: 'active' as const,
  deadline: '2026-06-01T00:00:00Z',
  created_at: '2026-04-01T00:00:00Z',
  is_demo: false,
} as never;

const petisi: PetisiViewRow = {
  id: 'pt1',
  title: 'Stop razia kos di Tebet',
  summary: 'Razia kos kosong dini hari sudah marak. Kita usul moratorium 6 bulan.',
  current_count: 642,
  target: 1000,
  deadline: '2026-07-01T00:00:00Z',
  created_at: '2026-04-15T00:00:00Z',
  is_demo: false,
} as never;

function AksiSurface() {
  return (
    <main id="main-content">
      <header>
        <h1>Aksi</h1>
        <p>Bukan cuma ngomong, kita kerjain.</p>
      </header>
      <PollingFeaturedCard polling={polling} className="mb-12" />
      <section aria-labelledby="petisi-heading">
        <h2 id="petisi-heading">Petisi yang lagi jalan</h2>
        <PetisiRow petisi={petisi} />
        <PetisiRow petisi={{ ...petisi, id: 'pt2', title: 'Audit dana CSR PT KAI 2025' }} />
      </section>
    </main>
  );
}

describe('Aksi a11y', () => {
  it('has no accessibility violations', async () => {
    const { results } = await renderAndScan(<AksiSurface />);
    expect(results).toHaveNoViolations();
  });
});
