import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

const STATUS_CONFIG: Record<string, { color: string; icon: React.ComponentType<{ size?: number }>; label: string }> = {
  Belum: { color: 'text-jw-pill-grey-text', icon: HelpCircle, label: 'Belum' },
  Berjalan: { color: 'text-jw-pill-marigold-text', icon: Clock, label: 'Berjalan' },
  Mandek: { color: 'text-jw-pill-coral-text', icon: AlertTriangle, label: 'Mandek' },
  Ditepati: { color: 'text-jw-pill-mint-text', icon: CheckCircle2, label: 'Ditepati' },
  Diingkari: { color: 'text-jw-pill-coral-text', icon: XCircle, label: 'Diingkari' },
};

export async function JanjiTracker() {
  const supabase = await createClient();

  // Aggregate counts by status
  const { data: counts } = await supabase
    .from('janji')
    .select('status')
    .limit(500);

  if (!counts) {
    return (
      <Card>
        <p className="text-sm text-jw-ink/60">Memuat data janji…</p>
      </Card>
    );
  }

  const breakdown: Record<string, number> = {
    Belum: 0,
    Berjalan: 0,
    Mandek: 0,
    Ditepati: 0,
    Diingkari: 0,
  };
  counts.forEach((row) => {
    if (row.status && row.status in breakdown) {
      breakdown[row.status]! += 1;
    }
  });
  const total = counts.length;

  return (
    <Card kicker="tagih">
      <h3 className="font-display text-2xl font-bold text-jw-blue leading-tight">
        Janji yang sedang dipantau
      </h3>
      <p className="text-sm text-jw-ink/70 mt-1">
        Total <strong className="text-jw-blue">{total}</strong> janji dari pejabat publik —
        warga ikut pantau, jejaknya tercatat.
      </p>

      <ul className="mt-5 grid grid-cols-2 gap-3">
        {Object.entries(breakdown).map(([status, count]) => {
          const cfg = STATUS_CONFIG[status]!;
          const Icon = cfg.icon;
          return (
            <li
              key={status}
              className="rounded-jw-md border border-jw-line bg-jw-cream/40 p-3 flex items-center gap-3"
            >
              <Icon size={18} />
              <div>
                <div className="text-2xl font-display font-bold text-jw-blue leading-none">
                  {count}
                </div>
                <div className={`text-xs ${cfg.color}`}>{cfg.label}</div>
              </div>
            </li>
          );
        })}
      </ul>

      <Link
        href="/tagih"
        className="inline-flex items-center gap-1 mt-5 text-sm font-semibold text-jw-coral hover:underline"
      >
        Pantau janji <ArrowRight size={14} />
      </Link>
    </Card>
  );
}

export function JanjiSkeleton() {
  return (
    <Card>
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-1/4 bg-jw-pill-grey-bg rounded" />
        <div className="h-7 w-full bg-jw-pill-grey-bg rounded" />
        <div className="h-3 w-3/4 bg-jw-pill-grey-bg rounded" />
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-jw-pill-grey-bg rounded" />
          ))}
        </div>
      </div>
    </Card>
  );
}

function Card({ kicker, children }: { kicker?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-jw-xl bg-white border border-jw-line p-6 shadow-jw-sm">
      {kicker && <span className="font-hand text-lg text-jw-coral block mb-3">— {kicker}</span>}
      {children}
    </div>
  );
}
