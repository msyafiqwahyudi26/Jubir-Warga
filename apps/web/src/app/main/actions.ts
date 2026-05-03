'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const submitSchema = z.object({
  game: z.enum(['tebak-kata', 'tebak-pejabat']),
  score: z.coerce.number().int().min(0).max(100),
  attempts: z.coerce.number().int().min(1).max(10),
  won: z.coerce.boolean(),
});

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function submitGameScoreAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = submitSchema.safeParse({
    game: formData.get('game'),
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
    redirect(`/masuk?redirect=/main/${parsed.data.game}`);
  }

  // One-game-per-day per user. Server-side check; client localStorage is
  // best-effort UI only.
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const { data: existing } = await supabase
    .from('game_scores')
    .select('id')
    .eq('user_id', user.id)
    .eq('game', parsed.data.game)
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
    game: parsed.data.game,
    score: parsed.data.score,
    attempts: parsed.data.attempts,
    won: parsed.data.won,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/main/${parsed.data.game}`);
  revalidatePath('/main');
  return { ok: true };
}
