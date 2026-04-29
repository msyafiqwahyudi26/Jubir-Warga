'use client';

import { use, useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Mail, Lock, Phone, Sparkles } from 'lucide-react';
import {
  signInWithPassword,
  signInWithMagicLink,
  requestWhatsAppOtp,
  verifyWhatsAppOtp,
  type ActionState,
} from './actions';
import { signInWithGoogle } from './oauth-actions';

type Tab = 'password' | 'magic' | 'whatsapp';

export function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const params = use(searchParams);
  const [tab, setTab] = useState<Tab>('password');
  // Client-only mount — hindari hydration mismatch dari browser extension
  // (Bitdefender/Norton/dll yang inject attribute ke <input>).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <FormSkeleton />;

  return (
    <div className="bg-white rounded-jw-xl shadow-jw-md border border-jw-line p-6">
      {params.error === 'auth_callback_failed' && (
        <div className="mb-4 rounded-jw-md bg-jw-pill-coral-bg border border-jw-coral/30 p-3 text-sm text-jw-pill-coral-text">
          Gagal verifikasi link. Coba minta link baru atau gunakan password.
        </div>
      )}

      {/* Tab switcher */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-jw-md bg-jw-pill-grey-bg mb-6">
        <TabButton active={tab === 'password'} onClick={() => setTab('password')}>
          <Lock size={14} /> Password
        </TabButton>
        <TabButton active={tab === 'magic'} onClick={() => setTab('magic')}>
          <Sparkles size={14} /> Link
        </TabButton>
        <TabButton active={tab === 'whatsapp'} onClick={() => setTab('whatsapp')}>
          <Phone size={14} /> WA
        </TabButton>
      </div>

      {tab === 'password' && <PasswordForm />}
      {tab === 'magic' && <MagicLinkForm />}
      {tab === 'whatsapp' && <WhatsAppForm />}

      {/* Divider */}
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
          <span>Lanjut dengan Google</span>
        </button>
      </form>
    </div>
  );
}

// ─── Tab button ──────────────────────────────────────────────────
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded text-sm py-1.5 transition ${
        active
          ? 'bg-white shadow-jw-sm text-jw-blue font-semibold'
          : 'text-jw-ink/60 hover:text-jw-ink'
      }`}
    >
      {children}
    </button>
  );
}

// ─── Password form ───────────────────────────────────────────────
function PasswordForm() {
  const [state, action] = useActionState<ActionState | null, FormData>(
    signInWithPassword,
    null,
  );
  return (
    <form action={action} className="space-y-4">
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
        label="Password"
        name="password"
        type="password"
        icon={<Lock size={16} />}
        placeholder="••••••••"
        autoComplete="current-password"
        error={state && !state.ok ? state.fieldErrors?.password?.[0] : undefined}
      />
      {state && !state.ok && !state.fieldErrors && <ErrorBanner>{state.error}</ErrorBanner>}
      <SubmitButton>Masuk</SubmitButton>
    </form>
  );
}

// ─── Magic link form ─────────────────────────────────────────────
function MagicLinkForm() {
  const [state, action] = useActionState<ActionState | null, FormData>(
    signInWithMagicLink,
    null,
  );
  return (
    <form action={action} className="space-y-4">
      <Field
        label="Email"
        name="email"
        type="email"
        icon={<Mail size={16} />}
        placeholder="kamu@contoh.com"
        autoComplete="email"
      />
      {state?.ok && state.message && <SuccessBanner>{state.message}</SuccessBanner>}
      {state && !state.ok && <ErrorBanner>{state.error}</ErrorBanner>}
      <SubmitButton>Kirim Magic Link</SubmitButton>
      <p className="text-xs text-jw-ink/60 text-center">
        Kami akan kirim link login ke email — sekali klik, langsung masuk.
      </p>
    </form>
  );
}

// ─── WhatsApp OTP form (2 step) ──────────────────────────────────
function WhatsAppForm() {
  const [requestState, requestAction] = useActionState<ActionState | null, FormData>(
    requestWhatsAppOtp,
    null,
  );
  const [verifyState, verifyAction] = useActionState<ActionState | null, FormData>(
    verifyWhatsAppOtp,
    null,
  );

  const phoneFromRequest =
    requestState?.ok && requestState.data
      ? (requestState.data as { phone: string }).phone
      : null;

  if (phoneFromRequest) {
    return (
      <form action={verifyAction} className="space-y-4">
        <SuccessBanner>{requestState!.message}</SuccessBanner>
        <input type="hidden" name="phone" value={phoneFromRequest} />
        <Field
          label="Kode OTP (6 digit)"
          name="token"
          type="text"
          inputMode="numeric"
          icon={<Sparkles size={16} />}
          placeholder="123456"
          maxLength={6}
          autoComplete="one-time-code"
        />
        {verifyState && !verifyState.ok && <ErrorBanner>{verifyState.error}</ErrorBanner>}
        <SubmitButton>Verifikasi & Masuk</SubmitButton>
      </form>
    );
  }

  return (
    <form action={requestAction} className="space-y-4">
      <Field
        label="Nomor WhatsApp"
        name="phone"
        type="tel"
        icon={<Phone size={16} />}
        placeholder="+628123456789"
        autoComplete="tel"
      />
      {requestState && !requestState.ok && <ErrorBanner>{requestState.error}</ErrorBanner>}
      <SubmitButton>Kirim OTP via WhatsApp</SubmitButton>
      <p className="text-xs text-jw-ink/60 text-center">
        Format: kode negara dulu (+62), lalu nomor tanpa 0 di depan.
      </p>
    </form>
  );
}

// ─── Reusable bits ───────────────────────────────────────────────
function Field({
  label,
  name,
  type,
  icon,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  error,
}: {
  label: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'numeric' | 'text' | 'tel' | 'email';
  maxLength?: number;
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
          inputMode={inputMode}
          maxLength={maxLength}
          className={`w-full pl-9 pr-3 py-2.5 rounded-jw-md border ${
            error ? 'border-jw-coral' : 'border-jw-line'
          } bg-white focus:outline-none focus:border-jw-blue focus:ring-2 focus:ring-jw-blue/10 transition`}
        />
      </span>
      {error && <span className="block text-xs text-jw-coral mt-1">{error}</span>}
    </label>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-jw-md bg-jw-blue px-4 py-2.5 font-semibold text-white hover:bg-jw-blue-soft transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Memproses…' : children}
    </button>
  );
}

function ErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-jw-md bg-jw-pill-coral-bg border border-jw-coral/30 px-3 py-2 text-sm text-jw-pill-coral-text">
      {children}
    </div>
  );
}

function SuccessBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-jw-md bg-jw-pill-mint-bg border border-jw-mint/30 px-3 py-2 text-sm text-jw-pill-mint-text">
      {children}
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="bg-white rounded-jw-xl shadow-jw-md border border-jw-line p-6 animate-pulse">
      <div className="h-9 w-full rounded-jw-md bg-jw-pill-grey-bg mb-6" />
      <div className="space-y-4">
        <div className="h-12 rounded-jw-md bg-jw-pill-grey-bg" />
        <div className="h-12 rounded-jw-md bg-jw-pill-grey-bg" />
        <div className="h-11 rounded-jw-md bg-jw-pill-grey-bg" />
      </div>
      <div className="my-6 h-px bg-jw-line" />
      <div className="h-11 rounded-jw-md bg-jw-pill-grey-bg" />
    </div>
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
