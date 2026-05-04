import Link from 'next/link';
import type { Database, KaryaType } from '@jw/data/types';
import { TYPE_PILL_COLOR, PILL_CLASS } from '@/lib/karya/constants';
import { formatRelative } from '@/lib/format';

export type KaryaRow = Database['public']['Tables']['karya']['Row'];

export function KaryaCard({ karya }: { karya: KaryaRow }) {
  const knownType = isKaryaType(karya.type) ? karya.type : null;
  const color = knownType ? TYPE_PILL_COLOR[knownType] : 'grey';
  const pillCls = PILL_CLASS[color];
  const label = knownType ?? 'Karya';

  return (
    <Link
      href={`/karya/${karya.id}`}
      className="group rounded-jw-lg border border-jw-line bg-white overflow-hidden hover:border-jw-blue-soft/40 hover:-translate-y-0.5 hover:shadow-jw-md transition-all duration-200 flex flex-col"
    >
      {karya.cover_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={karya.cover_url}
          alt=""
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div
          className={`aspect-video w-full ${pillCls} flex items-center justify-center`}
        >
          <span className="font-display text-lg font-semibold opacity-70">
            {label}
          </span>
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        <span
          className={`inline-flex self-start rounded-jw-sm px-2 py-0.5 text-xs font-semibold ${pillCls}`}
        >
          {label}
        </span>
        <h3 className="font-display font-semibold text-jw-blue mt-2 leading-snug group-hover:underline">
          {karya.title}
        </h3>
        {karya.meta && (
          <p className="text-xs text-jw-muted mt-1">{karya.meta}</p>
        )}
        <div className="mt-auto pt-3 text-xs text-jw-muted">
          {formatRelative(karya.published_at)}
        </div>
      </div>
    </Link>
  );
}

const KARYA_TYPES: readonly KaryaType[] = [
  'Tulisan',
  'Vlog',
  'Ilustrasi',
  'Podcast',
  'Zine',
];

function isKaryaType(v: string | null | undefined): v is KaryaType {
  return typeof v === 'string' && (KARYA_TYPES as readonly string[]).includes(v);
}
