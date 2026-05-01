'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame } from 'lucide-react';
import {
  TOPIK_OPTIONS,
  LOKASI_OPTIONS,
  FORMAT_OPTIONS,
} from '@/lib/komunitas/constants';
import {
  buildFilterUrl,
  toggleFilter,
  type KomunitasFilter,
} from '@/lib/komunitas/filters';

type Props = {
  currentFilter: KomunitasFilter;
};

export function KomunitasSidebar({ currentFilter }: Props) {
  const router = useRouter();

  const onSelect = <K extends keyof KomunitasFilter>(
    key: K,
    value: KomunitasFilter[K],
  ) => {
    const next = toggleFilter(currentFilter, key, value);
    router.push(buildFilterUrl(next));
  };

  const hasFilter =
    !!currentFilter.topic ||
    !!currentFilter.chapter ||
    !!currentFilter.format ||
    !!currentFilter.hot;

  return (
    <div className="space-y-6 lg:sticky lg:top-20">
      <button
        type="button"
        onClick={() => onSelect('hot', true)}
        className={`w-full flex items-center justify-center gap-2 rounded-jw-md px-3 py-2 text-sm font-semibold transition ${
          currentFilter.hot
            ? 'bg-jw-coral text-white'
            : 'bg-jw-pill-coral-bg/60 text-jw-coral hover:bg-jw-pill-coral-bg'
        }`}
      >
        <Flame size={14} aria-hidden /> Lagi panas
      </button>

      <FilterGroup
        label="Topik"
        options={TOPIK_OPTIONS}
        currentValue={currentFilter.topic}
        onSelect={(v) => onSelect('topic', v)}
      />
      <FilterGroup
        label="Lokasi"
        options={LOKASI_OPTIONS}
        currentValue={currentFilter.chapter}
        onSelect={(v) => onSelect('chapter', v)}
      />
      <FilterGroup
        label="Format"
        options={FORMAT_OPTIONS}
        currentValue={currentFilter.format}
        onSelect={(v) => onSelect('format', v)}
      />

      {hasFilter && (
        <Link
          href="/komunitas"
          className="block text-xs text-jw-coral font-semibold hover:underline"
        >
          Reset semua filter
        </Link>
      )}
    </div>
  );
}

function FilterGroup<T extends string>({
  label,
  options,
  currentValue,
  onSelect,
}: {
  label: string;
  options: readonly { id: T; label: string }[];
  currentValue: T | undefined;
  onSelect: (v: T) => void;
}) {
  return (
    <div>
      <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-jw-muted mb-2">
        {label}
      </h3>
      <ul className="space-y-1">
        {options.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              onClick={() => onSelect(o.id)}
              className={`w-full text-left text-sm rounded-jw-sm px-2 py-1 transition ${
                currentValue === o.id
                  ? 'bg-jw-blue text-white font-semibold'
                  : 'text-jw-ink hover:bg-jw-line/40'
              }`}
            >
              {o.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
