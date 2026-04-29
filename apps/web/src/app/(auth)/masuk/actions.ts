'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

// ─── Schemas ──────────────────────────────────────────────────────
const emailPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

const emailSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

const phoneSchema = z.object({
  phone: z
    .string()
    .regex(/^\+62[0-9]{9,13}$/, 'Format: +62812xxxxxxxx (kode negara wajib)'),
});

const otpVerifySchema = z.object({
  phone: z.string(),
  token: z.string().length(6, 'OTP harus 6 digit'),
});

// ─── Types ────────────────────────────────────────────────────────
export type ActionState =
  | { ok: true; message?: string; data?: unknown }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

// ─── Email + password ────────────────────────────────────────────
export async function signInWithPassword(
  _: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const parsed = emailPasswordSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { ok: false, error: 'Data tidak valid', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { ok: false, error: errorMessage(error.message) };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

// ─── Magic link ──────────────────────────────────────────────────
export async function signInWithMagicLink(
  _: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const parsed = emailSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) {
    return { ok: false, error: 'Email tidak valid' };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) return { ok: false, error: errorMessage(error.message) };
  return {
    ok: true,
    message: 'Link login terkirim ke email. Cek inbox (atau folder spam) ya.',
  };
}

// ─── WhatsApp OTP — request ──────────────────────────────────────
export async function requestWhatsAppOtp(
  _: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const parsed = phoneSchema.safeParse({ phone: formData.get('phone') });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? 'Nomor tidak valid' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone: parsed.data.phone,
    options: { channel: 'whatsapp' },
  });

  if (error) return { ok: false, error: errorMessage(error.message) };
  return {
    ok: true,
    message: `Kode OTP dikirim ke WhatsApp ${parsed.data.phone}. Cek dan masukkan di bawah.`,
    data: { phone: parsed.data.phone },
  };
}

// ─── WhatsApp OTP — verify ───────────────────────────────────────
export async function verifyWhatsAppOtp(
  _: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const parsed = otpVerifySchema.safeParse({
    phone: formData.get('phone'),
    token: formData.get('token'),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? 'OTP tidak valid' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    phone: parsed.data.phone,
    token: parsed.data.token,
    type: 'sms', // Supabase uses 'sms' type for WhatsApp too
  });

  if (error) return { ok: false, error: errorMessage(error.message) };

  revalidatePath('/', 'layout');
  redirect('/');
}

// ─── Sign out ────────────────────────────────────────────────────
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

// ─── Helper: humanize Supabase errors ────────────────────────────
function errorMessage(raw: string): string {
  if (raw.includes('Invalid login credentials')) return 'Email atau password salah.';
  if (raw.includes('Email not confirmed')) return 'Email belum diverifikasi. Cek inbox.';
  if (raw.includes('User already registered')) return 'Email sudah terdaftar.';
  if (raw.includes('rate limit')) return 'Terlalu banyak percobaan. Coba lagi sebentar.';
  return raw;
}
