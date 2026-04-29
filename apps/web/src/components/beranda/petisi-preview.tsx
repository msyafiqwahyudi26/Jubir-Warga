import Link from 'next/link';
import { Users, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export async function PetisiPreview() {
  const supabase = await createClient();

  const { data: petisi, error } = await supabase
    .from('petisi_with_progress')
    .select('*')
    .eq('status', 'active')
    .order('current_count', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return (
      <Card>
        <p className="text-sm text-jw-pill-coral-text">Gagal load petisi: {error.message}</p>
      </Card>
    );
  }

  if (!petisi) {
    return (
      <Card kicker="petisi">
        <h3 className="font-display text-2xl font-bold text-jw-blue">Belum ada petisi aktif</h3>
        <p className="text-sm text-jw-ink/70 mt-2">
          Mulai gerakan dengan petisi pertama. Kumpulkan suara warga untuk isu yang penting.
        </p>
        <Link
          href="/aksi"
          className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-jw-coral hover:underline"
        >
          Bikin petisi <ArrowRight size={14} />
        </Link>
      </Card>
    );
  }

  return (
    <Card kicker="petisi" icon={petisi.icon}>
      <h3 className="font-display text-2xl font-bold text-jw-blue leading-tight">
        {petisi.title}
      </h3>
      {petisi.summary && (
        <p className="text-sm text-jw-ink/70 mt-2 line-clamp-2">{petisi.summary}</p>
      )}
      <div className="mt-5">
        <ProgressBar current={petisi.current_count ?? 0} target={petisi.target ?? 1000} />
        <div className="flex items-center justify-between text-xs text-jw-ink/60 mt-2">
          <span className="inline-flex items-center gap-1 font-semibold text-jw-blue">
            <Users size={12} /> {(petisi.current_count ?? 0).toLocaleString('id-ID')} dari{' '}
            {(petisi.target ?? 1000).toLocaleString('id-ID')}
          </span>
          <span>{petisi.progress_pct?.toFixed(1)}%</span>
        </div>
      </div>
      <Link
        href={`/aksi/${petisi.id}`}
        className="inline-flex items-center gap-1 mt-5 text-sm font-semibold text-jw-coral hover:underline"
      >
        Tanda tangan <ArrowRight size={14} />
      </Link>
    </Card>
  );
}

export function PetisiSkeleton() {
  return <Card><div className="animate-pulse space-y-3"><div className="h-4 w-1/4 bg-jw-pill-grey-bg rounded" /><div className="h-7 w-full bg-jw-pill-grey-bg rounded" /><div className="h-3 w-3/4 bg-jw-pill-grey-bg rounded" /><div className="h-2 w-full bg-jw-pill-grey-bg rounded" /></div></Card>;
}

// ─── Helpers ─────────────────────────────────────────────────────
function Card({
  kicker,
  icon,
  children,
}: {
  kicker?: string;
  icon?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-jw-xl bg-white border border-jw-line p-6 shadow-jw-sm">
      {(kicker ?? icon) && (
        <div className="flex items-center gap-2 mb-3">
          {icon && <span className="text-2xl">{icon}</span>}
          {kicker && <span className="font-hand text-lg text-jw-coral">— {kicker}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

function ProgressBar({ current, target }: { current: number; target: number }) {
  const pct = Math.min(100, target > 0 ? (current / target) * 100 : 0);
  return (
    <div className="h-2 w-full rounded-full bg-jw-pill-grey-bg overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-jw-coral to-jw-marigold transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
