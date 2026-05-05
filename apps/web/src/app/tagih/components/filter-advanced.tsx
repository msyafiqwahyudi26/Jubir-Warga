'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import type { JanjiStatus, PejabatLevel } from '@jw/data/types';
import {
  buildTagihUrl,
  isFilterEmpty,
  toggleTagihFilter,
  type TagihFilter,
} from '@/lib/tagih/filters';
import {
  JANJI_STATUSES,
  LEVEL_OPTIONS,
  PARTAI_HARD_CODED,
  STATUS_META,
} from '@/lib/tagih/constants';
import {
  ALIGNMENT_META,
  ALIGNMENT_STATUSES,
  TOPIK_OPTIONS,
  type AlignmentStatus,
  type TopikId,
} from '@/lib/tagih/alignment';

type Props = {
  filter: TagihFilter;
};

// Multi-filter URL-based per Spec #24-LIGHT. Kombinasi: status / topik /
// region (level) / partai / alignment. Setiap chip toggle nge-modify state
// + push URL baru. Server Component hulu re-fetch dengan filter baru.
//
// Decision: 5 filter rows. Mobile responsive — group label fleksibel,
// chip wrap. Reset all button kalau ada minimal 1 filter aktif.
export function FilterAdvanced({ filter }: Props) {
  const router = useRouter();

  const apply = (next: TagihFilter) => router.push(buildTagihUrl(next));

  const onStatus = (s: JanjiStatus | undefined) =>
    apply(toggleTagihFilter(filter, 'status', s));
  const onAlignment = (a: AlignmentStatus | undefined) =>
    apply(toggleTagihFilter(filter, 'alignment', a));
  const onTopik = (t: TopikId | undefined) =>
    apply(toggleTagihFilter(filter, 'topik', t));
  const onLevel = (l: PejabatLevel | undefined) =>
    apply(toggleTagihFilter(filter, 'level', l));
  const onPartai = (p: string | undefined) =>
    apply(toggleTagihFilter(filter, 'partai', p));

  const showReset = !isFilterEmpty(filter);

  return (
    <div
      role="group"
      aria-label="Filter janji"
      className="space-y-3 rounded-jw-lg border border-jw-line bg-white/60 p-4"
    >
      <FilterRow label="Status">
        <Chip label="Semua" active={!filter.status} onClick={() => onStatus(undefined)} />
        {JANJI_STATUSES.map((s) => (
          <Chip
            key={s}
            label={STATUS_META[s].label}
            active={filter.status === s}
            onClick={() => onStatus(s)}
          />
        ))}
      </FilterRow>

      <FilterRow label="Selaras agenda">
        <Chip
          label="Semua"
          active={!filter.alignment}
          onClick={() => onAlignment(undefined)}
        />
        {ALIGNMENT_STATUSES.map((a) => (
          <Chip
            key={a}
            label={ALIGNMENT_META[a].short}
            active={filter.alignment === a}
            onClick={() => onAlignment(a)}
          />
        ))}
      </FilterRow>

      <FilterRow label="Topik">
        <Chip
          label="Semua"
          active={!filter.topik}
          onClick={() => onTopik(undefined)}
        />
        {TOPIK_OPTIONS.map((t) => (
          <Chip
            key={t.id}
            label={t.label}
            active={filter.topik === t.id}
            onClick={() => onTopik(t.id)}
          />
        ))}
      </FilterRow>

      <FilterRow label="Region">
        <Chip
          label="Semua"
          active={!filter.level}
          onClick={() => onLevel(undefined)}
        />
        {LEVEL_OPTIONS.map((l) => (
          <Chip
            key={l.id}
            label={l.label}
            active={filter.level === l.id}
            onClick={() => onLevel(l.id)}
          />
        ))}
      </FilterRow>

      <FilterRow label="Partai">
        <Chip
          label="Semua"
          active={!filter.partai}
          onClick={() => onPartai(undefined)}
        />
        {PARTAI_HARD_CODED.map((p) => (
          <Chip
            key={p.id}
            label={p.name}
            active={filter.partai === p.name}
            onClick={() => onPartai(p.name)}
          />
        ))}
      </FilterRow>

      {showReset && (
        <div className="pt-1 flex items-center justify-end">
          <button
            type="button"
            onClick={() => apply({})}
            className="inline-flex items-center gap-1 text-xs font-semibold text-jw-coral hover:underline active:scale-[0.97] transition"
          >
            <X size={12} aria-hidden /> Reset semua filter
          </button>
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 flex-wrap">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-jw-muted mt-1.5 min-w-[68px]">
        {label}
      </span>
      <div className="flex items-center gap-1.5 flex-wrap flex-1">
        {children}
      </div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'rounded-jw-md px-3 py-1.5 text-xs font-semibold transition active:scale-[0.97]',
        active
          ? 'bg-jw-blue text-white'
          : 'text-jw-ink hover:bg-jw-line/40 border border-jw-line/50',
      ].join(' ')}
    >
      {label}
    </button>
  );
}
