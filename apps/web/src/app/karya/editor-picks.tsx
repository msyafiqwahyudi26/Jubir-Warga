import Link from 'next/link';
import type { KaryaType } from '@jw/data/types';
import { createClient } from '@/lib/supabase/server';
import { TYPE_PILL_COLOR, PILL_CLASS } from '@/lib/karya/constants';

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

export async function EditorPicks({ className }: { className?: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('karya')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(5);

  if (!data || data.length === 0) return null;

  return (
    <section className={className ?? ''}>
      <header className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-semibold text-jw-blue">
          Pilihan Editor
        </h2>
        <span className="font-hand text-sm text-jw-coral">— minggu ini</span>
      </header>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {data.map((k) => {
          const knownType = isKaryaType(k.type) ? k.type : null;
          const color = knownType ? TYPE_PILL_COLOR[knownType] : 'grey';
          const pillCls = PILL_CLASS[color];
          return (
            <Link
              key={k.id}
              href={`/karya/${k.id}`}
              className="flex-shrink-0 w-56 rounded-jw-lg border border-jw-line bg-white overflow-hidden hover:border-jw-coral transition"
            >
              <div
                className={`aspect-video w-full ${pillCls} flex items-center justify-center`}
              >
                <span className="font-display text-sm font-semibold opacity-70">
                  {knownType ?? 'Karya'}
                </span>
              </div>
              <div className="p-3">
                <p className="font-display font-semibold text-sm text-jw-blue line-clamp-2 leading-snug">
                  {k.title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
