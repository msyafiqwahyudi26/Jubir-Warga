'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const followSchema = z.object({ janjiId: z.string().uuid() });

const submitSchema = z.object({
  pejabat_id: z.string().uuid(),
  topik: z.string().trim().min(2, 'Topik minimal 2 karakter').max(50),
  janji_text: z
    .string()
    .trim()
    .min(30, 'Kutipan janji minimal 30 karakter')
    .max(1000),
  source_url: z
    .string()
    .url('Sumber URL harus valid (mulai dengan http:// atau https://)')
    .optional()
    .or(z.literal('')),
  source_quote: z.string().trim().max(500).optional().or(z.literal('')),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Deadline format YYYY-MM-DD')
    .optional()
    .or(z.literal('')),
});

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

const PG_UNIQUE_VIOLATION = '23505';

export async function followJanjiAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = followSchema.safeParse({ janjiId: formData.get('janjiId') });
  if (!parsed.success) return { ok: false, error: 'Input tidak valid' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/masuk?redirect=/tagih/${parsed.data.janjiId}`);
  }

  // Idempotent via PK (janji_id, user_id) unique-violation pattern.
  const { error } = await supabase.from('janji_pemantau').insert({
    janji_id: parsed.data.janjiId,
    user_id: user.id,
  });

  if (error && error.code !== PG_UNIQUE_VIOLATION) {
    return { ok: false, error: error.message };
  }

  // First-time follow → bump pemantau_count.
  if (!error) {
    const { data: janji } = await supabase
      .from('janji')
      .select('pemantau_count')
      .eq('id', parsed.data.janjiId)
      .maybeSingle();
    if (janji) {
      await supabase
        .from('janji')
        .update({ pemantau_count: (janji.pemantau_count ?? 0) + 1 })
        .eq('id', parsed.data.janjiId);
    }
  }

  revalidatePath(`/tagih/${parsed.data.janjiId}`);
  revalidatePath('/tagih');
  return { ok: true };
}

export async function unfollowJanjiAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = followSchema.safeParse({ janjiId: formData.get('janjiId') });
  if (!parsed.success) return { ok: false, error: 'Input tidak valid' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Login dulu' };

  // Use delete().match to detect whether the row actually existed.
  const { count, error } = await supabase
    .from('janji_pemantau')
    .delete({ count: 'exact' })
    .match({ janji_id: parsed.data.janjiId, user_id: user.id });
  if (error) return { ok: false, error: error.message };

  if ((count ?? 0) > 0) {
    const { data: janji } = await supabase
      .from('janji')
      .select('pemantau_count')
      .eq('id', parsed.data.janjiId)
      .maybeSingle();
    if (janji) {
      await supabase
        .from('janji')
        .update({
          pemantau_count: Math.max(0, (janji.pemantau_count ?? 0) - 1),
        })
        .eq('id', parsed.data.janjiId);
    }
  }

  revalidatePath(`/tagih/${parsed.data.janjiId}`);
  revalidatePath('/tagih');
  return { ok: true };
}

export async function submitJanjiAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = submitSchema.safeParse({
    pejabat_id: formData.get('pejabat_id'),
    topik: formData.get('topik'),
    janji_text: formData.get('janji_text'),
    source_url: formData.get('source_url') ?? undefined,
    source_quote: formData.get('source_quote') ?? undefined,
    deadline: formData.get('deadline') ?? undefined,
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Validasi gagal',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/masuk?redirect=/tagih/baru');
  }

  const insert = {
    pejabat_id: parsed.data.pejabat_id,
    topik: parsed.data.topik,
    janji_text: parsed.data.janji_text,
    source_url: parsed.data.source_url || null,
    source_quote: parsed.data.source_quote || null,
    deadline: parsed.data.deadline || null,
    submitted_by: user.id,
    status: 'Belum',
    is_demo: false,
  };

  const { data, error } = await supabase
    .from('janji')
    .insert(insert)
    .select('id')
    .single();
  if (error) return { ok: false, error: error.message };

  revalidatePath('/tagih');
  return { ok: true, id: data?.id };
}
