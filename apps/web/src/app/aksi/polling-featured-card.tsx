import Link from 'next/link';
import { Vote, ArrowRight } from 'lucide-react';
import type { Database } from '@jw/data/types';
import { formatDeadline } from '@/lib/aksi/deadline';

type PollingRow = Database['public']['Tables']['polling']['Row'];

export function PollingFeaturedCard({
  polling,
  className,
}: {
  polling: PollingRow;
  className?: string;
}) {
  return (
    <section
      className={`rounded-jw-xl border-2 border-jw-coral/40 bg-jw-pill-coral-bg/30 p-6 md:p-8 ${className ?? ''}`}
    >
      <span className="inline-flex items-center gap-1.5 rounded-jw-sm bg-jw-coral text-white text-xs font-bold px-2 py-0.5 mb-3">
        <Vote size={11} aria-hidden /> POLLING HARI INI
      </span>
      <h3 className="font-display text-xl md:text-2xl font-bold text-jw-blue leading-snug">
        {polling.question}
      </h3>
      <p className="text-xs text-jw-muted mt-2">
        {polling.total_votes ?? 0} suara · {formatDeadline(polling.deadline)}
      </p>
      <Link
        href={`/aksi/polling/${polling.id}`}
        className="inline-flex items-center gap-1.5 mt-4 rounded-jw-md bg-jw-coral text-white px-5 py-2.5 text-sm font-semibold hover:bg-jw-coral/90 active:scale-[0.97] transition-all duration-200"
      >
        Vote sekarang <ArrowRight size={14} aria-hidden />
      </Link>
    </section>
  );
}
