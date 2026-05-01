'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { calcTargetProgress } from '@/lib/kelas/constants';

const enrollSchema = z.object({
  kelasId: z.string().uuid(),
});

const markCompleteSchema = z.object({
  kelasId: z.string().uuid(),
  modulId: z.string().uuid(),
  modulOrd: z.coerce.number().int().min(1),
  totalModul: z.coerce.number().int().min(1),
});

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function enrollKelasAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = enrollSchema.safeParse({ kelasId: formData.get('kelasId') });
  if (!parsed.success) return { ok: false, error: 'Input tidak valid' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/masuk?redirect=/kelas/${parsed.data.kelasId}`);
  }

  const { data: existing } = await supabase
    .from('kelas_enrollment')
    .select('kelas_id')
    .match({ kelas_id: parsed.data.kelasId, user_id: user.id })
    .maybeSingle();

  if (existing) {
    return { ok: true };
  }

  const { error } = await supabase
    .from('kelas_enrollment')
    .insert({ kelas_id: parsed.data.kelasId, user_id: user.id, progress: 0 });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/kelas/${parsed.data.kelasId}`);
  return { ok: true };
}

// TODO Sprint 4: refactor ke modul-level completion table dengan quiz score.
// Sprint 3 idempotency lewat target-progress comparison: kalau current
// progress >= target untuk modul ini, no-op (cuma ack).
export async function markModulCompleteAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = markCompleteSchema.safeParse({
    kelasId: formData.get('kelasId'),
    modulId: formData.get('modulId'),
    modulOrd: formData.get('modulOrd'),
    totalModul: formData.get('totalModul'),
  });
  if (!parsed.success) return { ok: false, error: 'Input tidak valid' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(
      `/masuk?redirect=/kelas/${parsed.data.kelasId}/modul/${parsed.data.modulId}`,
    );
  }

  const { data: enrollment } = await supabase
    .from('kelas_enrollment')
    .select('progress')
    .match({ kelas_id: parsed.data.kelasId, user_id: user.id })
    .maybeSingle();

  if (!enrollment) {
    return { ok: false, error: 'Kamu belum daftar kelas ini.' };
  }

  const target = calcTargetProgress(
    parsed.data.modulOrd,
    parsed.data.totalModul,
  );
  const current = enrollment.progress ?? 0;

  if (current >= target) {
    // Idempotent — modul sudah ke-cover.
    return { ok: true };
  }

  const { error } = await supabase
    .from('kelas_enrollment')
    .update({
      progress: target,
      ...(target >= 100 ? { completed_at: new Date().toISOString() } : {}),
    })
    .match({ kelas_id: parsed.data.kelasId, user_id: user.id });

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/kelas/${parsed.data.kelasId}/modul/${parsed.data.modulId}`);
  revalidatePath(`/kelas/${parsed.data.kelasId}`);
  return { ok: true };
}
