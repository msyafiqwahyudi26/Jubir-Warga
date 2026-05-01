'use client';

import { useRouter } from 'next/navigation';
import type { KelasLevel } from '@jw/data/types';
import { LEVEL_OPTIONS } from '@/lib/kelas/constants';
import { buildKelasUrl, toggleKelasLevel } from '@/lib/kelas/filters';

type Props = {
  currentLevel: KelasLevel | undefined;
};

export function KelasFilters({ currentLevel }: Props) {
  const router = useRouter();

  const onSelect = (level: KelasLevel | undefined) => {
    router.push(buildKelasUrl(toggleKelasLevel({ level: currentLevel }, level)));
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <FilterChip
        label="Semua"
        active={!currentLevel}
        onClick={() => onSelect(undefined)}
      />
      {LEVEL_OPTIONS.map((opt) => (
        <FilterChip
          key={opt.id}
          label={opt.label}
          active={currentLevel === opt.id}
          onClick={() => onSelect(opt.id)}
        />
      ))}
    </div>
  );
}

function FilterChip({
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
      className={`rounded-jw-md px-3 py-1.5 text-sm font-semibold transition ${
        active ? 'bg-jw-blue text-white' : 'text-jw-ink hover:bg-jw-line/40'
      }`}
    >
      {label}
    </button>
  );
}
