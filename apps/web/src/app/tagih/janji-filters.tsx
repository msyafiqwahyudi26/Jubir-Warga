'use client';

import { useRouter } from 'next/navigation';
import type { JanjiStatus, PejabatLevel } from '@jw/data/types';
import {
  buildTagihUrl,
  toggleStatusFilter,
  toggleLevelFilter,
} from '@/lib/tagih/filters';
import {
  JANJI_STATUSES,
  LEVEL_OPTIONS,
  STATUS_META,
} from '@/lib/tagih/constants';

type Props = {
  currentStatus: JanjiStatus | undefined;
  currentLevel: PejabatLevel | undefined;
};

export function JanjiFilters({ currentStatus, currentLevel }: Props) {
  const router = useRouter();

  const onStatus = (status: JanjiStatus | undefined) => {
    router.push(
      buildTagihUrl(
        toggleStatusFilter({ status: currentStatus, level: currentLevel }, status),
      ),
    );
  };

  const onLevel = (level: PejabatLevel | undefined) => {
    router.push(
      buildTagihUrl(
        toggleLevelFilter({ status: currentStatus, level: currentLevel }, level),
      ),
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wider text-jw-muted mr-1">
          Status
        </span>
        <Chip
          label="Semua"
          active={!currentStatus}
          onClick={() => onStatus(undefined)}
        />
        {JANJI_STATUSES.map((s) => (
          <Chip
            key={s}
            label={STATUS_META[s].label}
            active={currentStatus === s}
            onClick={() => onStatus(s)}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold uppercase tracking-wider text-jw-muted mr-1">
          Level
        </span>
        <Chip
          label="Semua"
          active={!currentLevel}
          onClick={() => onLevel(undefined)}
        />
        {LEVEL_OPTIONS.map((opt) => (
          <Chip
            key={opt.id}
            label={opt.label}
            active={currentLevel === opt.id}
            onClick={() => onLevel(opt.id)}
          />
        ))}
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
      className={`rounded-jw-md px-3 py-1.5 text-xs font-semibold transition ${
        active ? 'bg-jw-blue text-white' : 'text-jw-ink hover:bg-jw-line/40'
      }`}
    >
      {label}
    </button>
  );
}
