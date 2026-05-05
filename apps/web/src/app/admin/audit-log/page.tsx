import Link from 'next/link';
import { ArrowRight, History } from 'lucide-react';
import { fetchRecentReviews } from '@/lib/admin/audit-logger';

const ACTION_LABEL: Record<string, string> = {
  approve: 'Approve',
  modify: 'Modify',
  reject: 'Reject',
  flag: 'Flag',
};

const ACTION_TONE: Record<string, string> = {
  approve: 'bg-jw-pill-mint-bg text-jw-pill-mint-text',
  modify: 'bg-jw-pill-blue-bg text-jw-pill-blue-text',
  reject: 'bg-jw-pill-coral-bg text-jw-pill-coral-text',
  flag: 'bg-jw-pill-marigold-bg text-jw-pill-marigold-text',
};

export default async function AuditLogPage() {
  const rows = await fetchRecentReviews(100);

  return (
    <div className="space-y-6">
      <header>
        <span className="font-hand text-jw-coral text-base">— audit</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue leading-tight inline-flex items-center gap-2">
          <History size={28} aria-hidden /> Audit Log
        </h1>
        <p className="text-base text-jw-ink/70 mt-2 max-w-xl">
          Riwayat moderation actions ({rows.length} terbaru). Catatan
          immutable — sumber kebenaran untuk akuntabilitas internal.
        </p>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-jw-lg border border-dashed border-jw-line p-10 text-center">
          <p className="font-hand text-xl text-jw-coral">
            — belum ada review tercatat
          </p>
          <p className="text-sm text-jw-muted mt-2">
            Setiap approve/modify/reject di /admin/janji bakal muncul di sini.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => {
            const actionLabel = ACTION_LABEL[r.action] ?? r.action;
            const actionTone =
              ACTION_TONE[r.action] ??
              'bg-jw-pill-grey-bg text-jw-pill-grey-text';
            return (
              <li
                key={r.id}
                className="rounded-jw-md border border-jw-line bg-white p-4 flex items-start gap-3 flex-wrap"
              >
                <span
                  className={`inline-flex items-center text-xs font-bold rounded-jw-sm px-2 py-0.5 ${actionTone}`}
                >
                  {actionLabel}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    <span className="text-jw-muted">
                      {r.target_type} ·{' '}
                    </span>
                    {r.target_type === 'janji' ? (
                      <Link
                        href={`/admin/janji/${r.target_id}`}
                        className="font-mono text-xs text-jw-coral hover:underline"
                      >
                        {r.target_id.slice(0, 8)}…{' '}
                        <ArrowRight size={11} className="inline" aria-hidden />
                      </Link>
                    ) : (
                      <span className="font-mono text-xs text-jw-ink/80">
                        {r.target_id.slice(0, 8)}…
                      </span>
                    )}
                  </div>
                  {r.notes && (
                    <p className="text-sm text-jw-ink/80 mt-1 leading-relaxed">
                      {r.notes}
                    </p>
                  )}
                </div>
                <span className="text-xs text-jw-muted whitespace-nowrap">
                  {r.reviewed_at
                    ? new Date(r.reviewed_at).toLocaleString('id-ID', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })
                    : '—'}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
