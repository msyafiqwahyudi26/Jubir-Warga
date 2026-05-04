import type { JanjiStatus } from '@jw/data/types';
import { STATUS_META } from '@/lib/tagih/constants';

export function StatusTimeline({
  status,
  verifiedAt,
  createdAt,
}: {
  status: JanjiStatus;
  verifiedAt: string | null;
  createdAt: string | null;
}) {
  const meta = STATUS_META[status];
  const Icon = meta?.icon;

  return (
    <article className="rounded-jw-lg border border-jw-line bg-white p-5">
      <header className="mb-3">
        <span className="font-hand text-jw-coral text-sm">— status</span>
        <h3 className="font-display text-lg font-semibold text-jw-blue">
          Status saat ini
        </h3>
      </header>
      <div className="flex items-center gap-3">
        {Icon && (
          <span
            className={`flex-shrink-0 w-10 h-10 rounded-full ${meta.pillBg} ${meta.pillText} flex items-center justify-center`}
          >
            <Icon size={20} aria-hidden />
          </span>
        )}
        <div>
          <p className="font-display font-semibold text-jw-blue">
            {meta?.label ?? status}
          </p>
          {verifiedAt && (
            <p className="text-xs text-jw-muted">
              Diverifikasi:{' '}
              {new Date(verifiedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          )}
          {!verifiedAt && createdAt && (
            <p className="text-xs text-jw-muted">
              Tercatat:{' '}
              {new Date(createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
