'use client';

import { useRouter } from 'next/navigation';
import type { KaryaType } from '@jw/data/types';
import { TYPE_OPTIONS } from '@/lib/karya/constants';
import {
  buildKaryaUrl,
  toggleKaryaType,
  type KaryaFilter,
} from '@/lib/karya/filters';

type Props = {
  currentType: KaryaType | undefined;
};

export function KaryaTabs({ currentType }: Props) {
  const router = useRouter();

  const onSelect = (type: KaryaType | undefined) => {
    const next: KaryaFilter = toggleKaryaType({ type: currentType }, type);
    router.push(buildKaryaUrl(next));
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-jw-line">
      <Tab
        label="Semua"
        active={!currentType}
        onClick={() => onSelect(undefined)}
      />
      {TYPE_OPTIONS.map((opt) => (
        <Tab
          key={opt.id}
          label={opt.label}
          active={currentType === opt.id}
          onClick={() => onSelect(opt.id)}
        />
      ))}
    </div>
  );
}

function Tab({
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
      className={`flex-shrink-0 rounded-jw-md px-4 py-2 text-sm font-semibold transition ${
        active ? 'bg-jw-blue text-white' : 'text-jw-ink hover:bg-jw-line/40'
      }`}
    >
      {label}
    </button>
  );
}
