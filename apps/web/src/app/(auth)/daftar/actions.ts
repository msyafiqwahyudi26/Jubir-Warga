'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import type { ActionState } from '../masuk/actions';

const signUpSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  name: z.string().min(2, 'Nama minimal 2 karakter').max(80),
});

export async function signUpWithPassword(
  _: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Data tidak valid',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { name: parsed.data.name },
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      return { ok: false, error: 'Email sudah terdaftar. Silakan masuk.' };
    }
    return { ok: false, error: error.message };
  }

  // Confirmation email dikirim. Profile auto-bikin oleh trigger handle_new_user
  // setelah user verify email.
  revalidatePath('/', 'layout');
  return {
    ok: true,
    message:
      'Email konfirmasi terkirim. Klik link di email untuk mengaktifkan akun, lalu kembali ke sini untuk masuk.',
  };
}
