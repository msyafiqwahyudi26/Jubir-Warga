import Link from 'next/link';
import { Users } from 'lucide-react';
import type { Database } from '@jw/data/types';
import { calculatePercent } from '@/lib/aksi/constants';
import { formatDeadline } from '@/lib/aksi/deadline';

export type PetisiViewRow =
  Database['public']['Views']['petisi_with_progress']['Row'];

export function PetisiRow({ petisi }: { petisi: PetisiViewRow }) {
  if (!petisi.id || !petisi.title) return null;
  const current = petisi.current_count ?? 0;
  const target = petisi.target ?? 1000;
  const pct = calculatePercent(current, target);

  return (
    <Link
      href={`/aksi/petisi/${petisi.id}`}
      className="group rounded-jw-lg border border-jw-line bg-white p-5 hover:border-jw-coral/40 hover:-translate-y-0.5 hover:shadow-jw-md transition-all duration-200 flex flex-col"
    >
      <h3 className="font-display text-lg font-semibold text-jw-blue leading-snug group-hover:underline">
        {petisi.title}
      </h3>
      {petisi.summary && (
        <p className="text-sm text-jw-ink/70 mt-2 line-clamp-2">
          {petisi.summary}
        </p>
      )}
      <div className="mt-4">
        <div
          className="h-2 w-full rounded-full bg-jw-pill-grey-bg overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct.toFixed(1)}% dari target tanda tangan`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-jw-coral to-jw-marigold transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-jw-muted mt-2">
          <span className="inline-flex items-center gap-1 font-semibold text-jw-blue">
            <Users size={11} aria-hidden /> {current.toLocaleString('id-ID')} /{' '}
            {target.toLocaleString('id-ID')}
          </span>
          <span>{pct.toFixed(1)}%</span>
        </div>
        <p className="text-xs text-jw-muted mt-1">
          {formatDeadline(petisi.deadline)}
        </p>
      </div>
    </Link>
  );
}
