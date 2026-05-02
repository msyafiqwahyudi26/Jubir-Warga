import { CheckCircle, Loader, AlertTriangle, Activity } from 'lucide-react';
import {
  tagihStatPercent,
  type StatusBreakdown,
} from '@/lib/tagih/constants';

type Props = {
  total: number;
  breakdown: StatusBreakdown;
  className?: string;
};

export function TagihStats({ total, breakdown, className }: Props) {
  const ditepatiPct = tagihStatPercent(breakdown.Ditepati, total);
  const berjalanPct = tagihStatPercent(breakdown.Berjalan, total);
  const stuckCount = breakdown.Mandek + breakdown.Diingkari;
  const stuckPct = tagihStatPercent(stuckCount, total);

  return (
    <div
      className={`grid grid-cols-2 lg:grid-cols-4 gap-3 ${className ?? ''}`}
    >
      <StatCard
        label="Total janji"
        value={total.toLocaleString('id-ID')}
        Icon={Activity}
        accent="text-jw-blue"
      />
      <StatCard
        label="% Ditepati"
        value={`${ditepatiPct}%`}
        sub={`${breakdown.Ditepati.toLocaleString('id-ID')} dari ${total.toLocaleString('id-ID')}`}
        Icon={CheckCircle}
        accent="text-jw-pill-mint-text"
      />
      <StatCard
        label="% Berjalan"
        value={`${berjalanPct}%`}
        sub={`${breakdown.Berjalan.toLocaleString('id-ID')} dari ${total.toLocaleString('id-ID')}`}
        Icon={Loader}
        accent="text-jw-pill-marigold-text"
      />
      <StatCard
        label="% Mandek/diingkari"
        value={`${stuckPct}%`}
        sub={`${stuckCount.toLocaleString('id-ID')} dari ${total.toLocaleString('id-ID')}`}
        Icon={AlertTriangle}
        accent="text-jw-pill-coral-text"
      />
    </div>
  );
}

type LucideIcon = typeof CheckCircle;

function StatCard({
  label,
  value,
  sub,
  Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  Icon: LucideIcon;
  accent: string;
}) {
  return (
    <article className="rounded-jw-lg border border-jw-line bg-white p-4">
      <div className="flex items-center gap-2 text-xs text-jw-muted">
        <Icon size={14} aria-hidden className={accent} />
        {label}
      </div>
      <div className="mt-2 font-display text-2xl md:text-3xl font-bold text-jw-blue leading-none">
        {value}
      </div>
      {sub && <p className="text-[11px] text-jw-muted mt-1">{sub}</p>}
    </article>
  );
}
