// Spec #21 — Karya page a11y. Renders KaryaCard grid.
import { describe, it, expect } from 'vitest';
import Link from 'next/link';
import { renderAndScan } from './shared/render-with-axe';
import { KaryaCard, type KaryaRow } from '@/app/karya/karya-card';

const baseKarya: KaryaRow = {
  id: 'k1',
  author_id: null,
  type: 'Tulisan',
  title: 'Kenapa kita resah dengan KPK?',
  body: null,
  meta: '7 mnt baca',
  cover_url: null,
  tags: null,
  views: 0,
  featured: false,
  published_at: '2026-05-01T00:00:00Z',
  is_demo: false,
};

function KaryaSurface() {
  return (
    <main id="main-content">
      <header>
        <h1>Karya</h1>
        <p>Panggung anak muda yang punya isi.</p>
      </header>
      <nav aria-label="Filter tipe karya">
        <Link href="/karya">Semua</Link>
        <Link href="/karya?type=Tulisan">Tulisan</Link>
        <Link href="/karya?type=Vlog">Vlog</Link>
      </nav>
      <section aria-label="Daftar karya">
        <h2>Semua karya</h2>
        <KaryaCard karya={baseKarya} />
        <KaryaCard
          karya={{ ...baseKarya, id: 'k2', title: 'Vlog: keliling kantor lurah', type: 'Vlog' }}
        />
        <KaryaCard
          karya={{ ...baseKarya, id: 'k3', title: 'Ilustrasi UU Cipta Kerja', type: 'Ilustrasi' }}
        />
      </section>
    </main>
  );
}

describe('Karya a11y', () => {
  it('has no accessibility violations', async () => {
    const { results } = await renderAndScan(<KaryaSurface />);
    expect(results).toHaveNoViolations();
  });
});
