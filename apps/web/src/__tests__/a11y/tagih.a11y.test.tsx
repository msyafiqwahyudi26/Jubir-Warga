// Spec #21 — Tagih page a11y. Renders JanjiFilters + JanjiRow + StatusPill.
import { describe, it, expect, vi } from 'vitest';
import { renderAndScan } from './shared/render-with-axe';
import { JanjiFilters } from '@/app/tagih/janji-filters';
import { JanjiRow, type JanjiViewRow } from '@/app/tagih/janji-row';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/tagih',
  useSearchParams: () => new URLSearchParams(),
}));

const baseJanji: JanjiViewRow = {
  id: 'j1',
  pejabat_id: 'pj1',
  pejabat_nama: 'Budi Hartono',
  pejabat_jabatan: 'Wali Kota Bandung',
  pejabat_partai: 'PKB',
  janji_text: 'Akan bangun 50 km jalur sepeda dalam 2 tahun pertama menjabat.',
  status: 'berjalan',
  topik: 'Transportasi',
  tanggal_diucapkan: '2024-09-01',
  pemantau_count: 84,
  evidence_count: 3,
  created_at: '2026-04-01T00:00:00Z',
  is_demo: false,
} as never;

function TagihSurface() {
  return (
    <main id="main-content">
      <header>
        <h1>Tagih Janji</h1>
        <p>Setiap janji yang diucapkan, kita catat.</p>
      </header>
      <section aria-label="Filter janji">
        <JanjiFilters currentStatus={undefined} currentLevel={undefined} />
      </section>
      <section aria-label="Daftar janji">
        <h2>3 janji terlacak</h2>
        <JanjiRow janji={baseJanji} />
        <JanjiRow
          janji={{
            ...baseJanji,
            id: 'j2',
            janji_text: 'Akan tambah 1000 unit rusunawa di tahun 2025.',
            status: 'ditepati',
          }}
        />
        <JanjiRow
          janji={{
            ...baseJanji,
            id: 'j3',
            janji_text: 'Akan turunkan harga beras 10% sebelum lebaran.',
            status: 'diingkari',
          }}
        />
      </section>
    </main>
  );
}

describe('Tagih a11y', () => {
  it('has no accessibility violations', async () => {
    const { results } = await renderAndScan(<TagihSurface />);
    expect(results).toHaveNoViolations();
  });
});
