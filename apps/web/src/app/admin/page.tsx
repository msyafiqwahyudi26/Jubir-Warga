import Link from 'next/link';
import { ArrowRight, FileCheck, History, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { ExtendedJanjiRow } from '@/lib/admin/types';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Editorial fields belum di Database type sampai post-migration typegen.
  // Cast via unknown agar typecheck pass — RLS + check constraint enforce
  // shape di DB level.
  const allRes = (await supabase
    .from('janji')
    .select('id, editorial_status')) as unknown as {
    data: Pick<ExtendedJanjiRow, 'id' | 'editorial_status'>[] | null;
  };

  const rows = allRes.data ?? [];
  const counts = rows.reduce(
    (acc, r) => {
      const status = r.editorial_status ?? 'pending';
      acc[status] = (acc[status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalJanji = rows.length;
  const pendingCount = counts.pending ?? 0;
  const verifiedCount = counts.verified_curator ?? 0;
  const aiCount = counts.curated_ai ?? 0;

  return (
    <div className="space-y-8">
      <header>
        <span className="font-hand text-jw-coral text-base">— overview</span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-jw-blue leading-tight">
          Dashboard Editorial
        </h1>
        <p className="text-base md:text-lg text-jw-ink/70 mt-2 max-w-xl">
          Pantau janji yang butuh review, set verification badge, dan jaga audit
          trail tetap rapih.
        </p>
      </header>

      <section
        aria-label="Statistik editorial"
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        <StatCard label="Total janji" value={totalJanji} tone="ink" />
        <StatCard
          label="Menunggu review"
          value={pendingCount}
          tone="coral"
          highlight
        />
        <StatCard
          label="Terverifikasi Kurator"
          value={verifiedCount}
          tone="mint"
        />
        <StatCard label="Kurasi AI" value={aiCount} tone="blue" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/janji?status=pending"
          className="group rounded-jw-lg border border-jw-line bg-white p-5 hover:shadow-jw-md hover:-translate-y-[2px] transition"
        >
          <div className="flex items-center gap-2">
            <FileCheck size={18} className="text-jw-coral" aria-hidden />
            <h2 className="font-display text-lg font-semibold text-jw-blue">
              Review janji pending
            </h2>
          </div>
          <p className="mt-2 text-sm text-jw-ink/80">
            Set alignment_status + reasoning, lalu naikin ke "Terverifikasi
            Kurator" atau "Kurasi AI".
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-jw-coral group-hover:gap-2 transition-all">
            Buka <ArrowRight size={14} aria-hidden />
          </span>
        </Link>

        <Link
          href="/admin/audit-log"
          className="group rounded-jw-lg border border-jw-line bg-white p-5 hover:shadow-jw-md hover:-translate-y-[2px] transition"
        >
          <div className="flex items-center gap-2">
            <History size={18} className="text-jw-blue" aria-hidden />
            <h2 className="font-display text-lg font-semibold text-jw-blue">
              Audit log
            </h2>
          </div>
          <p className="mt-2 text-sm text-jw-ink/80">
            Riwayat moderation actions — siapa, kapan, apa yang di-approve,
            modify, atau reject.
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-jw-coral group-hover:gap-2 transition-all">
            Buka <ArrowRight size={14} aria-hidden />
          </span>
        </Link>
      </section>

      <section className="rounded-jw-lg border border-jw-line bg-jw-blue/5 p-5">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-jw-blue" aria-hidden />
          <h2 className="font-display text-base font-semibold text-jw-blue">
            Catatan untuk reviewer
          </h2>
        </div>
        <ul className="mt-2 list-disc list-inside text-sm text-jw-ink/80 space-y-1">
          <li>
            <strong>Terverifikasi Kurator</strong> — manual review dengan
            cross-check dokumen resmi (RPJMN/RPJMD/Visi Misi).
          </li>
          <li>
            <strong>Kurasi AI</strong> — auto-generated alignment, mark
            transparan biar pembaca tau ini bukan manual.
          </li>
          <li>
            <strong>Reject</strong> — kembalikan ke pending; wajib isi notes
            (disimpan di audit log).
          </li>
        </ul>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
  highlight = false,
}: {
  label: string;
  value: number;
  tone: 'ink' | 'coral' | 'mint' | 'blue';
  highlight?: boolean;
}) {
  const toneClass = {
    ink: 'text-jw-ink',
    coral: 'text-jw-coral',
    mint: 'text-jw-mint',
    blue: 'text-jw-blue',
  }[tone];
  return (
    <div
      className={`rounded-jw-lg border p-4 bg-white ${
        highlight ? 'border-jw-coral/40' : 'border-jw-line'
      }`}
    >
      <p className="text-xs uppercase tracking-wider text-jw-muted font-semibold">
        {label}
      </p>
      <p className={`font-mono font-bold text-3xl mt-1 ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}
