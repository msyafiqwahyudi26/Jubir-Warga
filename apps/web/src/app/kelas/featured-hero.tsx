import Link from 'next/link';
import { ArrowRight, Award, Clock, Users } from 'lucide-react';
import { BETA_PRICING_NOTE } from '@/lib/kelas/constants';
import type { KelasRow } from './kelas-card';

export function FeaturedHero({
  kelas,
  className,
}: {
  kelas: KelasRow;
  className?: string;
}) {
  const [primary, ...rest] = kelas.title.split(':');
  const subtitle = rest.length > 0 ? rest.join(':').trim() : null;
  const price = kelas.price_idr ?? 0;

  return (
    <section
      className={`rounded-jw-xl bg-jw-blue text-jw-cream p-6 md:p-8 ${className ?? ''}`}
    >
      <span className="inline-block rounded-jw-sm bg-jw-marigold/20 text-jw-marigold text-xs font-bold px-2 py-0.5 mb-3">
        KELAS UNGGULAN
      </span>
      <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight">
        {primary}
        {subtitle && (
          <em className="block text-xl md:text-2xl mt-1 opacity-80">
            {subtitle}
          </em>
        )}
      </h2>

      {kelas.description && (
        <p className="mt-4 text-sm md:text-base opacity-90 max-w-2xl">
          {kelas.description}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
        {kelas.duration && (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} aria-hidden /> {kelas.duration}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Award size={14} aria-hidden /> Sertifikat
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users size={14} aria-hidden /> {kelas.participant_count ?? 0} peserta
        </span>
      </div>

      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <Link
          href={`/kelas/${kelas.id}`}
          className="inline-flex items-center gap-1.5 rounded-jw-md bg-jw-coral text-white px-5 py-2.5 text-sm font-semibold hover:bg-jw-coral/90 transition"
        >
          Daftar gratis <ArrowRight size={14} aria-hidden />
        </Link>
        <Link
          href={`/kelas/${kelas.id}#silabus`}
          className="inline-flex items-center rounded-jw-md border border-jw-cream/40 px-5 py-2.5 text-sm font-semibold hover:bg-jw-cream/10 transition"
        >
          Lihat silabus
        </Link>
        {price > 0 && (
          <span className="text-xs opacity-70">
            <span className="line-through">
              Rp {price.toLocaleString('id-ID')}
            </span>{' '}
            · {BETA_PRICING_NOTE}
          </span>
        )}
      </div>
    </section>
  );
}
