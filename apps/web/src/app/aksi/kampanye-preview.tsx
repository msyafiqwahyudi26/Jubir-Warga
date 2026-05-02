import { Megaphone, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export async function KampanyePreview({ className }: { className?: string }) {
  const supabase = await createClient();
  const { data: kampanye } = await supabase
    .from('kampanye')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  if (!kampanye || kampanye.length === 0) return null;

  return (
    <section className={className ?? ''}>
      <header className="mb-4">
        <span className="font-hand text-jw-coral text-base">— kampanye</span>
        <h2 className="font-display text-2xl font-bold text-jw-blue">
          Gerakan kolektif
        </h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kampanye.map((k) => (
          <article
            key={k.id}
            className="rounded-jw-lg border border-jw-line bg-white p-5"
          >
            {/* Phase 1 stored a native unicode emoji in `kampanye.icon` —
                Sprint 3 ignores that field per brand policy and uses Lucide.
                Tier 2 (Sprint 4-5): swap in a custom SVG kampanye icon set. */}
            <Megaphone size={20} aria-hidden className="text-jw-coral mb-3" />
            <h3 className="font-display font-semibold text-jw-blue text-lg leading-snug">
              {k.title}
            </h3>
            {k.description && (
              <p className="text-sm text-jw-ink/70 mt-2 line-clamp-3">
                {k.description}
              </p>
            )}
            <div className="mt-4 text-xs text-jw-muted inline-flex items-center gap-1">
              <Users size={11} aria-hidden /> {k.participant_count ?? 0} peserta
            </div>
            <p className="mt-3 text-xs text-jw-muted italic">
              Detail page: Sprint 4
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
