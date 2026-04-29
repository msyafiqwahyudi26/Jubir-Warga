// ─────────────────────────────────────────────────────────
// Jubir Warga — Data Layer (barrel export)
// ─────────────────────────────────────────────────────────

// Client init + auth
export {
  initJWClient,
  getJWClient,
  resetJWClient,
  getCurrentUser,
  onAuthChange,
  type JWClientConfig,
} from './client';

// Types
export * from './types';

// Zod schemas (form validation)
export * from './schemas';

// Query functions (pure, framework-agnostic)
export * as queries from './queries';
export type { ThreadsFilter, JanjiFilter } from './queries';

// React hooks (TanStack Query wrapper)
export * as hooks from './hooks';
export { qk } from './hooks';

// Mock adapter (fallback ke window.JWData saat Supabase belum init)
export { mockClient, isMockMode } from './mock';
