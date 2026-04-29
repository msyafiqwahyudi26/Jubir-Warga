// ─────────────────────────────────────────────────────────
// Jubir Warga — Supabase client wrapper
// Singleton init + helper untuk auth state + realtime channel
// ─────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

let _client: SupabaseClient<Database> | null = null;

export interface JWClientConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  /** Storage key untuk persist auth session di localStorage */
  storageKey?: string;
}

/**
 * Initialize Supabase client (singleton). Panggil sekali di app init.
 *
 * Pakai di Next.js: di `app/layout.tsx` atau di provider.
 * Pakai di beta lama: panggil di index.html setelah Supabase script loaded.
 */
export function initJWClient(config: JWClientConfig): SupabaseClient<Database> {
  if (_client) return _client;
  _client = createClient<Database>(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: config.storageKey ?? 'jw-auth',
    },
    db: { schema: 'public' },
  });
  return _client;
}

/** Get active client. Throws kalau belum di-init. */
export function getJWClient(): SupabaseClient<Database> {
  if (!_client) {
    throw new Error('JWClient not initialized. Call initJWClient() first.');
  }
  return _client;
}

/** Reset client (untuk testing). */
export function resetJWClient(): void {
  _client = null;
}

/** Helper: check if auth session aktif */
export async function getCurrentUser() {
  const client = getJWClient();
  const { data: { user } } = await client.auth.getUser();
  return user;
}

/** Helper: subscribe ke auth state change */
export function onAuthChange(callback: (user: any) => void) {
  const client = getJWClient();
  const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => subscription.unsubscribe();
}
