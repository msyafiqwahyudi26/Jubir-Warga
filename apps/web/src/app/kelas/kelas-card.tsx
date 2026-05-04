import Link from 'next/link';
import { Clock, Users } from 'lucide-react';
import type { Database, KelasLevel } from '@jw/data/types';
import {
  LEVEL_OPTIONS,
  LEVEL_PILL_CLASS,
  BETA_PRICING_NOTE,
} from '@/lib/kelas/constants';

export type KelasRow = Database['public']['Tables']['kelas']['Row'];

const KELAS_LEVELS: readonly KelasLevel[] = ['Pemula', 'Menengah', 'Lanjut'];

function isKelasLevel(v: string | null | undefined): v is KelasLevel {
  return typeof v === 'string' && (KELAS_LEVELS as readonly string[]).includes(v);
}

export function KelasCard({ kelas }: { kelas: KelasRow }) {
  const knownLevel = isKelasLevel(kelas.level) ? kelas.level : null;
  const levelOpt = knownLevel
    ? LEVEL_OPTIONS.find((l) => l.id === knownLevel)
    : null;
  const price = kelas.price_idr ?? 0;

  return (
    <Link
      href={`/kelas/${kelas.id}`}
      className="group rounded-jw-lg border border-jw-line bg-white p-5 hover:border-jw-blue-soft/40 hover:-translate-y-0.5 hover:shadow-jw-md transition-all duration-200 flex flex-col"
    >
      <div className="flex items-center gap-2 mb-3">
        {levelOpt && (
          <span
            className={`inline-flex rounded-jw-sm px-2 py-0.5 text-xs font-semibold ${LEVEL_PILL_CLASS[levelOpt.color]}`}
          >
            {levelOpt.label}
          </span>
        )}
        {kelas.featured && (
          <span className="inline-flex rounded-jw-sm px-2 py-0.5 text-xs font-semibold bg-jw-pill-blue-bg text-jw-pill-blue-text">
            Unggulan
          </span>
        )}
      </div>

      <h3 className="font-display text-lg font-semibold text-jw-blue leading-snug group-hover:underline">
        {kelas.title}
      </h3>

      {kelas.description && (
        <p className="text-sm text-jw-ink/70 mt-2 line-clamp-2">
          {kelas.description}
        </p>
      )}

      <div className="mt-3 flex items-center gap-3 text-xs text-jw-muted flex-wrap">
        {kelas.duration && (
          <span className="inline-flex items-center gap-1">
            <Clock size={11} aria-hidden /> {kelas.duration}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Users size={11} aria-hidden /> {kelas.participant_count ?? 0} peserta
        </span>
      </div>

      <div className="mt-auto pt-4 flex items-baseline gap-2 flex-wrap">
        {price > 0 && (
          <span className="text-xs text-jw-muted line-through">
            Rp {price.toLocaleString('id-ID')}
          </span>
        )}
        <span className="rounded-jw-sm bg-jw-coral text-white px-2 py-0.5 text-xs font-bold">
          FREE selama beta
        </span>
      </div>
      <p className="text-[10px] text-jw-muted italic mt-1">
        {BETA_PRICING_NOTE}
      </p>
    </Link>
  );
}
