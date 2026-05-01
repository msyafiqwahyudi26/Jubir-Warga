import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { formatRelative } from '@/lib/format';
import { NalaTriggerButton } from '@/components/nala/nala-trigger-button';
import type { KaryaRow } from '../karya-card';
import { ArticleBody } from './article-body';

export function ReadingView({ karya }: { karya: KaryaRow }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/karya"
        className="inline-flex items-center gap-1 text-sm font-semibold text-jw-coral hover:underline mb-6"
      >
        <ChevronLeft size={14} aria-hidden /> Kembali ke Karya
      </Link>

      <header className="mb-8">
        <span className="inline-block rounded-jw-sm bg-jw-pill-blue-bg text-jw-pill-blue-text text-xs font-semibold px-2 py-0.5 mb-3">
          {karya.type ?? 'Tulisan'}
        </span>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-jw-blue leading-tight">
          {karya.title}
        </h1>
        {karya.meta && (
          <p className="font-display text-lg italic text-jw-ink/70 mt-3">
            {karya.meta}
          </p>
        )}
        <p className="text-sm text-jw-muted mt-4">
          {formatRelative(karya.published_at)}
        </p>
      </header>

      <ArticleBody body={karya.body ?? ''} />

      <footer className="mt-12 pt-6 border-t border-jw-line text-sm text-jw-muted">
        <p>
          Tulisan ini dipublish di Jubir Warga. Mau ngobrol soal isinya?{' '}
          <Link
            href="/komunitas"
            className="text-jw-coral font-semibold hover:underline"
          >
            Diskusi di forum
          </Link>
          .
        </p>
      </footer>

      <NalaTriggerButton context={`karya "${karya.title}"`} />
    </div>
  );
}
