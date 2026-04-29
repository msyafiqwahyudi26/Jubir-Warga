'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Mail, Lock, User } from 'lucide-react';
import { signUpWithPassword } from './actions';
import type { ActionState } from '../masuk/actions';
import { signInWithGoogle } from '../masuk/oauth-actions';

export function SignUpForm() {
  const [state, action] = useActionState<ActionState | null, FormData>(
    signUpWithPassword,
    null,
  );
  // Client-only mount — hindari hydration mismatch dari browser extension
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="bg-white rounded-jw-xl shadow-jw-md border border-jw-line p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-12 rounded-jw-md bg-jw-pill-grey-bg" />
          <div className="h-12 rounded-jw-md bg-jw-pill-grey-bg" />
          <div className="h-12 rounded-jw-md bg-jw-pill-grey-bg" />
          <div className="h-11 rounded-jw-md bg-jw-pill-grey-bg" />
        </div>
        <div className="my-6 h-px bg-jw-line" />
        <div className="h-11 rounded-jw-md bg-jw-pill-grey-bg" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-jw-xl shadow-jw-md border border-jw-line p-6">
      <form action={action} className="space-y-4">
        <Field
          label="Nama (untuk profile)"
          name="name"
          type="text"
          icon={<User size={16} />}
          placeholder="Misal: Budi Santoso"
          autoComplete="name"
          error={state && !state.ok ? state.fieldErrors?.name?.[0] : undefined}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          icon={<Mail size={16} />}
          placeholder="kamu@contoh.com"
          autoComplete="email"
          error={state && !state.ok ? state.fieldErrors?.email?.[0] : undefined}
        />
        <Field
          label="Password (min. 8 karakter)"
          name="password"
          type="password"
          icon={<Lock size={16} />}
          placeholder="••••••••"
          autoComplete="new-password"
          error={state && !state.ok ? state.fieldErrors?.password?.[0] : undefined}
        />

        {state?.ok && state.message && (
          <div className="rounded-jw-md bg-jw-pill-mint-bg border border-jw-mint/30 px-3 py-2 text-sm text-jw-pill-mint-text">
            {state.message}
          </div>
        )}
        {state && !state.ok && !state.fieldErrors && (
          <div className="rounded-jw-md bg-jw-pill-coral-bg border border-jw-coral/30 px-3 py-2 text-sm text-jw-pill-coral-text">
            {state.error}
          </div>
        )}

        <SubmitButton />

        <p className="text-xs text-jw-ink/60 text-center leading-relaxed">
          Dengan daftar, kamu setuju dengan{' '}
          <a href="/syarat" className="underline">
            Syarat Layanan
          </a>{' '}
          dan{' '}
          <a href="/privasi" className="underline">
            Kebijakan Privasi
          </a>
          .
        </p>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-jw-line" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-jw-ink/60">atau</span>
        </div>
      </div>

      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-jw-md border border-jw-line bg-white px-4 py-2.5 font-medium text-jw-ink hover:bg-jw-pill-grey-bg transition"
        >
          <GoogleIcon />
          <span>Daftar dengan Google</span>
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  icon,
  placeholder,
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-jw-ink mb-1.5">{label}</span>
      <span className="relative block">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-jw-ink/40">
          {icon}
        </span>
        <input
          name={name}
          type={type}
          required
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full pl-9 pr-3 py-2.5 rounded-jw-md border ${
            error ? 'border-jw-coral' : 'border-jw-line'
          } bg-white focus:outline-none focus:border-jw-blue focus:ring-2 focus:ring-jw-blue/10 transition`}
        />
      </span>
      {error && <span className="block text-xs text-jw-coral mt-1">{error}</span>}
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-jw-md bg-jw-coral px-4 py-2.5 font-semibold text-white hover:bg-jw-coral/90 transition disabled:opacity-60"
    >
      {pending ? 'Membuat akun…' : 'Daftar sekarang'}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.346l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
