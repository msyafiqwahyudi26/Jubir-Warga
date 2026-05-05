'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const submitSchema = z.object({
  score: z.coerce.number().int().min(0).max(100),
  attempts: z.coerce.number().int().min(1).max(1),
  won: z.coerce.boolean(),
});

export type ActionResult =
  | { ok: true; synced: boolean }
  | { ok: false; error: string };

/**
 * Submit Janji vs Realita score. Anonymous-OK: kalau user belum login,
 * return synced=false (client tetap save ke localStorage). Kalau login,
 * insert ke game_scores + return synced=true.
 *
 * One-game-per-day enforced di server side untuk logged-in user.
 */
export async function submitJanjiVsRealitaScoreAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = submitSchema.safeParse({
    score: formData.get('score'),
    attempts: formData.get('attempts'),
    won: formData.get('won') === 'true',
  });
  if (!parsed.success) return { ok: false, error: 'Input tidak valid' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Anonymous play OK — game still works, just no leaderboard entry.
    return { ok: true, synced: false };
  }

  // One-game-per-day per user. DB game enum: 'janji-realita' (per 0001_init).
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const { data: existing } = await supabase
    .from('game_scores')
    .select('id')
    .eq('user_id', user.id)
    .eq('game', 'janji-realita')
    .gte('played_at', todayStart.toISOString())
    .maybeSingle();

  if (existing) {
    return {
      ok: false,
      error: 'Hari ini sudah dimainkan, balik besok!',
    };
  }

  const { error } = await supabase.from('game_scores').insert({
    user_id: user.id,
    game: 'janji-realita',
    score: parsed.data.score,
    attempts: parsed.data.attempts,
    won: parsed.data.won,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath('/main/janji-vs-realita');
  return { ok: true, synced: true };
}
