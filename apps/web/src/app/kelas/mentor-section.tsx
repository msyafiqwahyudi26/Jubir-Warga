import { createClient } from '@/lib/supabase/server';

export async function MentorSection({ className }: { className?: string }) {
  const supabase = await createClient();
  // Sprint 3 proxy: pull profiles dengan flag is_admin (akan jadi role-based
  // mentor table di Sprint 5).
  const { data: mentors } = await supabase
    .from('profiles')
    .select('id, name, username, bio, level, chapter_id')
    .eq('is_admin', true)
    .limit(6);

  if (!mentors || mentors.length === 0) return null;

  return (
    <section className={className ?? ''}>
      <header className="mb-4">
        <span className="font-hand text-jw-coral text-base">— mentor</span>
        <h2 className="font-display text-2xl font-bold text-jw-blue">
          Belajar dari yang sudah jalan
        </h2>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mentors.map((m) => (
          <article
            key={m.id}
            className="rounded-jw-lg border border-jw-line bg-white p-4"
          >
            <h3 className="font-display font-semibold text-jw-blue">
              {m.name ?? m.username ?? 'Mentor'}
            </h3>
            <p className="text-xs text-jw-muted">
              Level {m.level ?? 1} · {m.chapter_id ?? '—'}
            </p>
            {m.bio && (
              <p className="text-sm text-jw-ink/70 mt-2 line-clamp-3">{m.bio}</p>
            )}
          </article>
        ))}
      </div>
      <p className="mt-3 text-xs text-jw-muted italic">
        Mentor table dedicated Sprint 5 — sekarang pakai profiles.is_admin
        sebagai proxy.
      </p>
    </section>
  );
}
