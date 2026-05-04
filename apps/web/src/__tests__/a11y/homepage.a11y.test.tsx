// Spec #21 — Beranda (homepage) a11y test.
// Renders a representative composition of the homepage UI surface so axe-core
// can scan landmarks, ARIA, headings, and labels. Server Component data-fetch
// (Supabase) is intentionally outside scope — covered separately in unit tests.
import { describe, it, expect } from 'vitest';
import Link from 'next/link';
import { renderAndScan } from './shared/render-with-axe';
import { SkipLink } from '@/components/skip-link';
import { SiteFooter } from '@/components/site-footer';

function HomepageSurface() {
  return (
    <>
      <SkipLink />
      <header role="banner" className="border-b">
        <nav aria-label="Navigasi utama">
          <Link href="/komunitas">Komunitas</Link>
          <Link href="/karya">Karya</Link>
          <Link href="/kelas">Kelas</Link>
        </nav>
      </header>
      <main id="main-content">
        <section aria-labelledby="hero-title">
          <h1 id="hero-title">Hari ini, kita ngomongin Pasal 28E.</h1>
          <p>Hak berekspresi yang dijamin konstitusi.</p>
          <Link href="/komunitas">Ikut diskusi</Link>
        </section>
        <section aria-labelledby="threads-title">
          <h2 id="threads-title">Yang lagi rame minggu ini</h2>
          <ul>
            <li>
              <Link href="/komunitas/1">KRL malam ini delay 30 menit lagi.</Link>
            </li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

describe('Beranda a11y', () => {
  it('has no accessibility violations', async () => {
    const { results } = await renderAndScan(<HomepageSurface />);
    expect(results).toHaveNoViolations();
  });
});
