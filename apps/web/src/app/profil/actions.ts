'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const updateSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(60),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9_]{3,20}$/,
      'Username 3-20 karakter, lowercase / angka / underscore',
    ),
  bio: z.string().trim().max(280, 'Bio maks 280 karakter').optional(),
  chapter_id: z.string().trim().optional(),
});

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function updateProfileAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = updateSchema.safeParse({
    name: formData.get('name'),
    username: formData.get('username'),
    bio: formData.get('bio') ?? undefined,
    chapter_id: formData.get('chapter_id') ?? undefined,
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
  if (!user) redirect('/masuk?redirect=/profil');

  // Username uniqueness check (case-insensitive via lowercased input above).
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', parsed.data.username)
    .neq('id', user.id)
    .maybeSingle();

  if (existing) {
    return {
      ok: false,
      error: 'Username sudah dipakai',
      fieldErrors: { username: ['Pilih username lain'] },
    };
  }

  const update = {
    name: parsed.data.name,
    username: parsed.data.username,
    bio: parsed.data.bio || null,
    chapter_id: parsed.data.chapter_id || null,
  };

  const { error } = await supabase
    .from('profiles')
    .update(update)
    .eq('id', user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/profil');
  if (parsed.data.username) {
    revalidatePath(`/u/${parsed.data.username}`);
  }
  return { ok: true };
}
