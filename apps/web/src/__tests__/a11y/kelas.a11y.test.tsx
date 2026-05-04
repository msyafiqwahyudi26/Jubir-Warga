// Spec #21 — Kelas page a11y. Renders KelasCard grid + filter chips.
import { describe, it, expect, vi } from 'vitest';
import { renderAndScan } from './shared/render-with-axe';
import { KelasCard, type KelasRow } from '@/app/kelas/kelas-card';
import { KelasFilters } from '@/app/kelas/kelas-filters';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/kelas',
  useSearchParams: () => new URLSearchParams(),
}));

const baseKelas: KelasRow = {
  id: 'kls-1',
  title: 'Bikin tulisan opini yang nendang',
  description:
    'Belajar struktur opini editorial dari briefing → outline → draft → finishing.',
  level: 'Pemula',
  duration: '2 jam',
  participant_count: 124,
  price_idr: 50000,
  featured: true,
  mentor_id: null,
  created_at: '2026-04-01T00:00:00Z',
  is_demo: false,
};

function KelasSurface() {
  return (
    <main id="main-content">
      <header>
        <h1>Kelas</h1>
        <p>Belajar dari sesama, eksekusi yang nyata-nyata kepake.</p>
      </header>
      <KelasFilters currentLevel={undefined} />
      <section aria-label="Daftar kelas">
        <h2>Semua kelas</h2>
        <KelasCard kelas={baseKelas} />
        <KelasCard
          kelas={{
            ...baseKelas,
            id: 'kls-2',
            title: 'Public speaking buat advokasi RT/RW',
            level: 'Menengah',
            featured: false,
          }}
        />
      </section>
    </main>
  );
}

describe('Kelas a11y', () => {
  it('has no accessibility violations', async () => {
    const { results } = await renderAndScan(<KelasSurface />);
    expect(results).toHaveNoViolations();
  });
});
