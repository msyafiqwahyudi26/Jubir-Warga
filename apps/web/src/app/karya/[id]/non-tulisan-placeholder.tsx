import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { KaryaRow } from '../karya-card';

const MESSAGES: Record<string, string> = {
  Vlog: 'Player video penuh di Sprint 4. Sementara, link sumber kalau ada:',
  Ilustrasi:
    'Galeri ilustrasi penuh di Sprint 4. Sementara, link sumber kalau ada:',
  Podcast:
    'Player audio + transkrip di Sprint 4. Sementara, link sumber kalau ada:',
  Zine: 'Pembaca PDF in-app di Sprint 4. Sementara, link unduh kalau ada:',
};

export function NonTulisanPlaceholder({ karya }: { karya: KaryaRow }) {
  const msg =
    (karya.type && MESSAGES[karya.type]) ??
    'Konten tipe ini akan tersedia di Sprint 4.';

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/karya"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-6"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke Karya
      </Link>

      <header className="mb-6">
        <span className="inline-block rounded-jw-sm bg-jw-pill-coral-bg text-jw-pill-coral-text text-xs font-semibold px-2 py-0.5 mb-3">
          {karya.type ?? 'Karya'}
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue leading-tight">
          {karya.title}
        </h1>
        {karya.meta && (
          <p className="text-sm text-jw-muted mt-2">{karya.meta}</p>
        )}
      </header>

      <div className="rounded-jw-lg border border-dashed border-jw-line bg-jw-cream/40 p-6 text-center">
        <p className="text-sm text-jw-ink/80 max-w-md mx-auto">{msg}</p>
        {karya.cover_url && (
          <a
            href={karya.cover_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 rounded-jw-md bg-jw-coral px-4 py-2 text-sm font-semibold text-white hover:bg-jw-coral/90"
          >
            Buka sumber asli ↗
          </a>
        )}
      </div>
    </div>
  );
}
