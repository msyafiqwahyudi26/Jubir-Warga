import { createClient } from '@/lib/supabase/server';

export async function ChapterRegionalSection({
  className,
}: {
  className?: string;
}) {
  const supabase = await createClient();
  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .order('members_count', { ascending: false });

  return (
    <section className={className ?? ''}>
      <header className="mb-4">
        <span className="font-hand text-jw-coral text-base">
          — chapter regional
        </span>
        <h2 className="font-display text-2xl font-bold text-jw-blue">
          Ngumpul offline
        </h2>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(chapters ?? []).map((c) => (
          <div
            key={c.id}
            className={`rounded-jw-md border p-3 text-sm ${
              c.active
                ? 'bg-white border-jw-line'
                : 'bg-jw-line/20 border-jw-line opacity-60'
            }`}
          >
            <p className="font-semibold text-jw-blue">{c.name}</p>
            <p className="text-xs text-jw-muted mt-0.5">
              {c.active ? `${c.members_count} anggota` : 'Coming soon'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
