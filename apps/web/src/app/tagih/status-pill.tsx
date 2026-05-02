import type { JanjiStatus } from '@jw/data/types';
import { STATUS_META } from '@/lib/tagih/constants';

export function StatusPill({ status }: { status: JanjiStatus }) {
  const meta = STATUS_META[status];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-jw-sm px-2 py-0.5 text-xs font-semibold ${meta.pillBg} ${meta.pillText}`}
    >
      <Icon size={11} aria-hidden /> {meta.label}
    </span>
  );
}
