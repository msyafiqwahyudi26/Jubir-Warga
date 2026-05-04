import { createClient } from '@/lib/supabase/server';

export async function TopKreatorSidebar() {
  const supabase = await createClient();

  // TODO Sprint 4: query view `profiles_with_karya_count` untuk aggregate akurat
  // (count karya per author). Sementara pakai xp sebagai proxy kreator aktif —
  // user yang sering kontribusi (thread + karya + reply + petisi sign) punya
  // xp tinggi, jadi reasonable proxy untuk Sprint 3.
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, username, level, chapter_id')
    .order('xp', { ascending: false })
    .limit(5);

  return (
    <div className="rounded-jw-lg border border-jw-line bg-white p-5 lg:sticky lg:top-20">
      <header className="mb-3">
        <span className="font-hand text-jw-coral text-sm">— top kreator</span>
        <h3 className="font-display text-base font-semibold text-jw-blue">
          Yang sering kasih karya
        </h3>
      </header>
      <ol className="space-y-3">
        {(profiles ?? []).map((p, i) => (
          <li key={p.id} className="flex items-center gap-3 text-sm">
            <span className="flex-shrink-0 w-6 text-center font-mono font-bold text-jw-coral">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-jw-blue truncate">
                {p.name ?? p.username ?? 'Anonim'}
              </p>
              <p className="text-xs text-jw-muted">
                Level {p.level ?? 1} · {p.chapter_id ?? '—'}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
