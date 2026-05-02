'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { parsePollingOptions } from '@/lib/aksi/constants';

const signPetisiSchema = z.object({ petisiId: z.string().uuid() });
const votePollingSchema = z.object({
  pollingId: z.string().uuid(),
  optionId: z.string().min(1),
});

export type ActionResult = { ok: true } | { ok: false; error: string };

const PG_UNIQUE_VIOLATION = '23505';

export async function signPetisiAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = signPetisiSchema.safeParse({
    petisiId: formData.get('petisiId'),
  });
  if (!parsed.success) return { ok: false, error: 'Input tidak valid' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/masuk?redirect=/aksi/petisi/${parsed.data.petisiId}`);
  }

  // Idempotency leverages PK (petisi_id, user_id). Unique violation = already
  // signed; treat as success.
  const { error } = await supabase.from('petisi_signatures').insert({
    petisi_id: parsed.data.petisiId,
    user_id: user.id,
  });
  if (error && error.code !== PG_UNIQUE_VIOLATION) {
    return { ok: false, error: error.message };
  }

  // Increment petisi.current_count if first time. The unique violation
  // pathway means we don't bump twice — matches "one signature per user".
  if (!error) {
    const { data: petisi } = await supabase
      .from('petisi')
      .select('current_count')
      .eq('id', parsed.data.petisiId)
      .maybeSingle();
    if (petisi) {
      await supabase
        .from('petisi')
        .update({ current_count: (petisi.current_count ?? 0) + 1 })
        .eq('id', parsed.data.petisiId);
    }
  }

  revalidatePath(`/aksi/petisi/${parsed.data.petisiId}`);
  revalidatePath('/aksi');
  return { ok: true };
}

export async function votePollingAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = votePollingSchema.safeParse({
    pollingId: formData.get('pollingId'),
    optionId: formData.get('optionId'),
  });
  if (!parsed.success) return { ok: false, error: 'Input tidak valid' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/masuk?redirect=/aksi/polling/${parsed.data.pollingId}`);
  }

  // PK (polling_id, user_id) enforces one-vote-per-user — duplicate insert
  // throws unique violation, which we treat as idempotent ack.
  const { error: insertError } = await supabase.from('polling_votes').insert({
    polling_id: parsed.data.pollingId,
    user_id: user.id,
    option_id: parsed.data.optionId,
  });

  if (insertError) {
    if (insertError.code === PG_UNIQUE_VIOLATION) {
      return { ok: true };
    }
    return { ok: false, error: insertError.message };
  }

  // First-time vote — bump options[].votes + total_votes. TOCTOU race
  // possible under high concurrency; Sprint 4 should move to a Postgres
  // function/trigger for atomic update.
  const { data: polling } = await supabase
    .from('polling')
    .select('options, total_votes')
    .eq('id', parsed.data.pollingId)
    .maybeSingle();

  if (polling) {
    const options = parsePollingOptions(polling.options);
    const updated = options.map((o) =>
      o.id === parsed.data.optionId ? { ...o, votes: o.votes + 1 } : o,
    );
    await supabase
      .from('polling')
      .update({
        options: updated,
        total_votes: (polling.total_votes ?? 0) + 1,
      })
      .eq('id', parsed.data.pollingId);
  }

  revalidatePath(`/aksi/polling/${parsed.data.pollingId}`);
  revalidatePath('/aksi');
  return { ok: true };
}
