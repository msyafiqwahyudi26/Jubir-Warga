import { Trophy, Medal, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

const RANK_ICON: Record<number, LucideIcon> = {
  0: Trophy,
  1: Medal,
  2: Award,
};

const RANK_COLOR: Record<number, string> = {
  0: 'text-jw-marigold',
  1: 'text-jw-blue-soft',
  2: 'text-jw-coral',
};

const TOP_LIMIT = 10;

export async function Leaderboard() {
  const supabase = await createClient();
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  // game_scores `game` enum di 0001_init: 'janji-realita' (bukan janji-vs-realita).
  // Filter `won=true` only — leaderboard untuk yang tepat tebak.
  const { data } = await supabase
    .from('game_scores')
    .select(
      'id, user_id, score, attempts, played_at, profiles(name, username, chapter_id)',
    )
    .eq('game', 'janji-realita')
    .eq('won', true)
    .gte('played_at', todayStart.toISOString())
    .order('score', { ascending: false })
    .order('played_at', { ascending: true })
    .limit(TOP_LIMIT);

  return (
    <article className="rounded-jw-lg border border-jw-line bg-white p-5">
      <header className="mb-3">
        <span className="font-hand text-jw-coral text-sm">— leaderboard</span>
        <h3 className="font-display text-lg font-semibold text-jw-blue">
          Top {TOP_LIMIT} hari ini
        </h3>
        <p className="text-xs text-jw-muted mt-0.5">
          Yang berhasil tebak verdict tepat. Reset jam 00:00 UTC.
        </p>
      </header>

      {!data || data.length === 0 ? (
        <p className="text-sm text-jw-muted italic">
          Belum ada yang berhasil hari ini. Jadi yang pertama!
        </p>
      ) : (
        <ol className="space-y-2">
          {data.map((row, i) => {
            const Icon = RANK_ICON[i] ?? Award;
            const color = RANK_COLOR[i] ?? 'text-jw-muted';
            const profile = Array.isArray(row.profiles)
              ? row.profiles[0]
              : row.profiles;
            const name = profile?.name ?? profile?.username ?? 'Anonim';
            return (
              <li
                key={row.id}
                className="flex items-center gap-3 rounded-jw-sm border border-jw-line p-3"
              >
                <span className="flex-shrink-0 w-6 text-center font-mono text-sm font-bold text-jw-muted">
                  {i + 1}
                </span>
                <Icon size={18} aria-hidden className={`flex-shrink-0 ${color}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-jw-blue truncate">{name}</p>
                  <p className="text-xs text-jw-muted">
                    {profile?.chapter_id ?? '—'}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono font-bold text-jw-blue">
                    {row.score ?? 0}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </article>
  );
}
