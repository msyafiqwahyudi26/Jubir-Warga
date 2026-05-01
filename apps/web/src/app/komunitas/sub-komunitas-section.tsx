import { Users } from 'lucide-react';
import { SUBCOMMUNITIES } from '@/lib/komunitas/constants';

export function SubKomunitasSection({ className }: { className?: string }) {
  return (
    <section className={className ?? ''}>
      <header className="mb-4">
        <span className="font-hand text-jw-coral text-base">
          — sub-komunitas
        </span>
        <h2 className="font-display text-2xl font-bold text-jw-blue">
          Komunitas khusus, fokus topik
        </h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUBCOMMUNITIES.map((s) => (
          <article
            key={s.id}
            className="rounded-jw-lg border border-jw-line bg-white p-5"
          >
            <h3 className="font-display font-semibold text-jw-blue text-lg">
              {s.name}
            </h3>
            <p className="text-sm text-jw-ink/70 mt-2 line-clamp-3">{s.desc}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-jw-muted">
              <span className="inline-flex items-center gap-1">
                <Users size={12} aria-hidden /> {s.members} anggota
              </span>
              <span>· Mod: {s.moderator}</span>
            </div>
            <button
              type="button"
              disabled
              title="Coming soon — Sprint 5"
              aria-label={`${s.apply === 'open' ? 'Gabung' : 'Apply'} ${s.name} (segera)`}
              className="mt-4 w-full rounded-jw-sm border border-jw-line text-xs font-semibold text-jw-muted py-2 cursor-not-allowed"
            >
              {s.apply === 'open' ? 'Gabung (segera)' : 'Apply (segera)'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
