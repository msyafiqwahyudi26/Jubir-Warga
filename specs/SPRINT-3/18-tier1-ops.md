# Spec #18 — Tier 1 BLOCKER ops setup (Sentry + Plausible + error boundary)

**Sprint**: 3 (post-implementation)
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 2-3 jam
**Dependency**: Sprint 3 specs #7-#13 landed
**Source**: AUDIT_PRE_BETA_2026-05-01.md — Tier 1 BLOCKER, OPS cluster scoring 1.7/10
**Decisions Mas (approved 2026-05-04):**
1. ✅ Sentry init di Next.js — error tracking client + server
2. ✅ Plausible analytics — privacy-first, cookieless (sesuai positioning brand)
3. ✅ Error boundary — `error.tsx` + `global-error.tsx` di App Router
4. ✅ UptimeRobot setup — manual via dashboard (di luar codebase, doc only di runbook)

**Required reading sebelum mulai:**
1. `CLAUDE.md` §8 (security rules — env var handling)
2. `apps/legacy/src/main.jsx` Phase 1 — Sentry init reference (kalau ada)
3. AUDIT_PRE_BETA_2026-05-01.md — OPS cluster gap detail

---

## Goal

Tutup gap kritis ops cluster (1.7/10 di AUDIT_PRE_BETA) sebelum beta launch Juni 2026:

- **Sentry**: capture client + server error untuk Phase 2 production debugging
- **Plausible**: privacy-first analytics tanpa cookie banner — alignment dengan brand positioning
- **Error boundary**: graceful error UI (instead of Next.js default white screen)
- **UptimeRobot**: external monitoring uptime + response time (doc + runbook only, setup manual via dashboard)

Setelah spec ini selesai:
- Production error captured ke Sentry dashboard
- Pageview + custom events tracked di Plausible
- Error UI brand-aligned (Jubir Warga style, bukan Next.js default)
- UptimeRobot monitor production URL setelah Phase 2 deploy

---

## File yang dibuat

```
apps/web/src/lib/sentry/
├── client.ts                       Sentry client init (browser)
├── server.ts                       Sentry server init (Node)
└── edge.ts                         Sentry edge init (middleware)

apps/web/instrumentation.ts         Next.js 15 instrumentation hook (auto-loaded)
apps/web/sentry.client.config.ts    Sentry SDK client config
apps/web/sentry.server.config.ts    Sentry SDK server config
apps/web/sentry.edge.config.ts      Sentry SDK edge config

apps/web/src/app/
├── error.tsx                       Per-route error boundary (App Router)
└── global-error.tsx                Root error boundary (covers layout error)

apps/web/src/components/analytics/
├── plausible-script.tsx            Plausible inline script tag (client-only)
└── track-event.ts                  Helper untuk track custom event

deploy/runbooks/
└── uptime-monitoring.md            Doc: setup UptimeRobot monitor + alert routing

.env.example                        Add: NEXT_PUBLIC_SENTRY_DSN, SENTRY_AUTH_TOKEN, NEXT_PUBLIC_PLAUSIBLE_DOMAIN
```

## File yang diubah

```
apps/web/src/app/layout.tsx         Wire <PlausibleScript /> di <head>
apps/web/next.config.ts             Wire withSentryConfig() wrapper
apps/web/package.json               Add deps: @sentry/nextjs
```

## File yang TIDAK diubah (Window 1 + 2 territory)

- ❌ `apps/web/src/app/page.tsx` (Window 1)
- ❌ `apps/web/src/app/aksi/page.tsx`, `karya/page.tsx`, `tagih/page.tsx` (Window 1 + 2)
- ❌ `apps/web/src/components/site-header.tsx` (Window 1)
- ❌ `apps/web/src/components/site-footer.tsx` (Window 2 BARU)
- ❌ `apps/web/src/components/nala/*`, `komunitas/*`, `karya/*` (Window 2)
- ❌ `apps/web/src/styles/globals.css` (Window 2)

✅ Window 3 territory cleanly isolated di `lib/sentry/`, root config files, `app/error.tsx` + `global-error.tsx`, `components/analytics/`.

---

## Step-by-step

### 1. Sentry SDK install

```bash
cd apps/web
pnpm add @sentry/nextjs
```

**Verify versi**: pin `~9.x` atau latest stable. Jangan auto-update major.

### 2. Sentry config files

Run Sentry wizard sekali (interactive — Mas perlu approve):
```bash
npx @sentry/wizard@latest -i nextjs --saas --org spd-indonesia --project jubir-warga-web
```

**Atau manual** kalau wizard issue. Generate file:

**`apps/web/sentry.client.config.ts`**:
```ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,             // 10% transaction sampling — adjust based on volume
  replaysSessionSampleRate: 0.0,     // No session replay yet (privacy concern)
  replaysOnErrorSampleRate: 1.0,     // Capture replay on error
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'development',
  // PII filter — jangan capture email, nama
  beforeSend(event) {
    if (event.user) {
      delete event.user.email;
      delete event.user.username;
      delete event.user.ip_address;
    }
    return event;
  },
});
```

**`apps/web/sentry.server.config.ts`**:
```ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'development',
  beforeSend(event) {
    if (event.user) {
      delete event.user.email;
      delete event.user.username;
      delete event.user.ip_address;
    }
    return event;
  },
});
```

**`apps/web/sentry.edge.config.ts`**: same as server, tapi untuk edge runtime (middleware).

**`apps/web/instrumentation.ts`**:
```ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  } else if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
```

**`apps/web/next.config.ts`** wrapper:
```ts
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  // ... existing config
};

export default withSentryConfig(nextConfig, {
  org: 'spd-indonesia',
  project: 'jubir-warga-web',
  silent: !process.env.CI,
  hideSourceMaps: true,
  disableLogger: true,
});
```

### 3. Error boundary (App Router)

**`apps/web/src/app/error.tsx`** — per-route error boundary:
```tsx
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="font-hand text-jw-coral text-2xl mb-2">— ada yang error</span>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-jw-blue mb-3">
        Hmm, ada yang nggak beres.
      </h1>
      <p className="text-base text-jw-ink/70 max-w-md mb-6">
        Aku udah catat error-nya buat tim Jubir Warga. Sementara itu, kamu bisa coba refresh atau balik ke beranda.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-jw-md bg-jw-coral px-4 py-2 text-sm font-semibold text-white hover:bg-jw-coral/90 transition active:scale-[0.97]"
        >
          Coba lagi
        </button>
        <Link
          href="/"
          className="rounded-jw-md border border-jw-line bg-white px-4 py-2 text-sm font-semibold text-jw-ink hover:bg-jw-pill-grey-bg transition"
        >
          Balik ke beranda
        </Link>
      </div>
      {process.env.NODE_ENV === 'development' && error.digest && (
        <p className="mt-6 text-xs text-jw-muted font-mono">
          Error digest: {error.digest}
        </p>
      )}
    </div>
  );
}
```

**`apps/web/src/app/global-error.tsx`** — root error boundary (covers layout error):
```tsx
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="id">
      <body style={{ margin: 0, padding: '40px 20px', fontFamily: 'system-ui, sans-serif', background: '#FFFAEE', color: '#2A2D3A', textAlign: 'center' }}>
        <h1 style={{ color: '#1A2256', fontSize: '24px' }}>Maaf, ada error sistem.</h1>
        <p>Tim Jubir Warga akan segera benerin. Coba refresh halaman.</p>
        <button
          onClick={() => window.location.href = '/'}
          style={{ marginTop: 16, padding: '8px 16px', background: '#E8632B', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}
        >
          Balik ke beranda
        </button>
      </body>
    </html>
  );
}
```

### 4. Plausible analytics

**`apps/web/src/components/analytics/plausible-script.tsx`** — inline script tag:
```tsx
import Script from 'next/script';

export function PlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <>
      <Script
        defer
        data-domain={domain}
        src="https://plausible.io/js/script.tagged-events.js"
        strategy="afterInteractive"
      />
      {/* Helper untuk track custom event dari client */}
      <Script id="plausible-helper" strategy="afterInteractive">
        {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
      </Script>
    </>
  );
}
```

**`apps/web/src/components/analytics/track-event.ts`**:
```ts
type EventName =
  | 'thread_view'
  | 'karya_view'
  | 'kelas_enroll'
  | 'janji_pantau'
  | 'petisi_sign'
  | 'polling_vote'
  | 'game_play'
  | 'nala_open'
  | 'auth_signup'
  | 'auth_signin';

export function trackEvent(name: EventName, props?: Record<string, string | number>) {
  if (typeof window === 'undefined') return;
  if (typeof window.plausible !== 'function') return;
  window.plausible(name, { props });
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
  }
}
```

**Wire** di `apps/web/src/app/layout.tsx`:
```diff
+ import { PlausibleScript } from '@/components/analytics/plausible-script';

  <html>
    <head>
+     <PlausibleScript />
    </head>
    <body>
      ...
    </body>
  </html>
```

**Usage example** (di komponen client):
```ts
import { trackEvent } from '@/components/analytics/track-event';

function ThreadCard({ thread }) {
  return (
    <Link
      href={`/komunitas/${thread.id}`}
      onClick={() => trackEvent('thread_view', { thread_id: thread.id })}
    >
      ...
    </Link>
  );
}
```

**Usage opsional** — tidak block landing kalau belum di-wire ke setiap interaction. Sprint 3 cukup setup foundation, Sprint 4+ tambah event tracking per surface.

### 5. Env vars

**`apps/web/.env.example`** add:
```
# Sentry — error tracking
NEXT_PUBLIC_SENTRY_DSN=https://example@sentry.io/123456
SENTRY_AUTH_TOKEN=                    # Server-side, untuk source map upload (CI)
SENTRY_ORG=spd-indonesia
SENTRY_PROJECT=jubir-warga-web

# Plausible — privacy-first analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=jubirwarga.id    # Production domain. Beta: app.jubirwarga.id atau jubir.spdindonesia.org
```

**Mas perlu setup di env actual**:
- `.env.local` (development) — mungkin OK tanpa NEXT_PUBLIC_SENTRY_DSN biar local error gak ke-spam
- `.env.production` (CI/Vercel) — semua filled

### 6. UptimeRobot runbook (no code, doc only)

**`deploy/runbooks/uptime-monitoring.md`**:

```markdown
# Uptime Monitoring Runbook

## Setup (manual via UptimeRobot dashboard)

1. Account: https://uptimerobot.com — login dengan account SPD Indonesia
2. Dashboard → "Add New Monitor"
3. Per environment, create monitor:

### Phase 1 (current production)
- Type: HTTP(s)
- URL: https://jubir.spdindonesia.org
- Friendly Name: "Jubir Warga Phase 1 (Hostinger VPS)"
- Monitoring Interval: 5 minutes
- Alert contacts: admin@spdindonesia.org (email) + WA Mas

### Phase 2 (post-deploy)
- Type: HTTP(s)
- URL: https://jubirwarga.id (atau staging URL)
- Friendly Name: "Jubir Warga Phase 2 (Vercel/VPS)"
- Monitoring Interval: 5 minutes
- Keyword Monitoring: "Jubir Warga" (substring untuk verify page render bukan blank)
- Alert contacts: admin@spdindonesia.org + WA Mas

## Alert routing

- Down notification → email + WhatsApp Mas dalam 5 menit
- Up notification → email konfirmasi
- Maintenance window: schedule via dashboard kalau ada deploy

## SLO target (beta)

- Uptime ≥ 99% (allow ~7 jam downtime/bulan)
- Response time p50 < 500ms, p95 < 2s
- Error rate (Sentry) < 1% per 1000 page view

Pasca-launch publik (Juni 2026), tightening:
- Uptime ≥ 99.5%
- Response time p50 < 300ms

## Escalation

Kalau monitor down > 15 menit:
1. Cek Sentry dashboard untuk error spike
2. Cek Vercel/Hostinger status page
3. Cek Supabase status (https://status.supabase.com)
4. Kalau infra issue: post di status page, communicate ke user via IG @jubirwarga.id
```

### 7. Smoke test

1. `pnpm install` (verify @sentry/nextjs installed)
2. `pnpm typecheck` 0 error
3. `pnpm lint` 0 new warning
4. `pnpm test` 195/195 pass (no test break)
5. `pnpm build` (verify Sentry source map upload step jalan kalau auth token set)
6. `pnpm dev`:
   - Throw error sengaja di route handler → verify error.tsx tampil + Sentry capture
   - Open DevTools console → verify Plausible script load (check Network: `script.tagged-events.js`)
7. Sentry dashboard: verify error baru muncul (kalau DSN set)

---

## Acceptance checklist

- [ ] `@sentry/nextjs` installed di `apps/web/package.json`
- [ ] `sentry.client.config.ts` + `server.ts` + `edge.ts` ada
- [ ] `instrumentation.ts` register Sentry per runtime
- [ ] `next.config.ts` wrapped dengan `withSentryConfig`
- [ ] `apps/web/src/app/error.tsx` render brand-aligned UI + capture Sentry
- [ ] `apps/web/src/app/global-error.tsx` render fallback layout + capture Sentry
- [ ] `apps/web/src/components/analytics/plausible-script.tsx` render `<Script>` kalau ENV set
- [ ] `track-event.ts` helper exported dengan typed event names
- [ ] `apps/web/src/app/layout.tsx` wire `<PlausibleScript />`
- [ ] `.env.example` updated dengan NEXT_PUBLIC_SENTRY_DSN, SENTRY_AUTH_TOKEN, NEXT_PUBLIC_PLAUSIBLE_DOMAIN
- [ ] `deploy/runbooks/uptime-monitoring.md` doc lengkap dengan setup + escalation
- [ ] PII filter di Sentry beforeSend (no email, username, IP)
- [ ] Error boundary brand voice ("Hmm, ada yang nggak beres", "kamu bisa coba refresh")
- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm test` pass
- [ ] `pnpm build` pass (with or without Sentry token)

## Out of scope (defer)

- ❌ Sentry session replay enable — privacy review dulu
- ❌ Plausible custom dashboard / goal setup — di dashboard UI, post-deploy
- ❌ Hooking trackEvent ke setiap interaction — Sprint 4 fine-grain
- ❌ A/B testing infrastructure — post-launch
- ❌ Server-side Sentry transaction tracing tuning — post-monitoring data
- ❌ UptimeRobot setup actual (manual Mas via dashboard, doc only di repo)

## Notes untuk planner audit

Aku akan audit:
- Sentry SDK file ada + config valid (typecheck pass)
- Error boundary render visual brand-aligned (manual smoke)
- Plausible script tag emit kalau ENV set (DOM inspector)
- PII filter beforeSend ada (read source)
- env.example complete
- Runbook uptime ada di `deploy/runbooks/`

## Commit message

```
feat(ops): tier 1 BLOCKER — Sentry + Plausible + error boundary + uptime runbook

Per AUDIT_PRE_BETA_2026-05-01 (OPS cluster 1.7/10 → fix gap):

- Sentry: client + server + edge config, auto-capture exception, PII filter
- error.tsx + global-error.tsx: brand-aligned error UI, capture ke Sentry
- Plausible: cookieless analytics script, trackEvent helper typed
- next.config wrapped withSentryConfig (source map upload via auth token)
- instrumentation.ts: Next.js 15 runtime hook
- Runbook deploy/runbooks/uptime-monitoring.md: UptimeRobot setup + SLO + escalation
- env.example: NEXT_PUBLIC_SENTRY_DSN, SENTRY_AUTH_TOKEN, NEXT_PUBLIC_PLAUSIBLE_DOMAIN

Per Spec #18. Decisions Mas approved 2026-05-04.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## WAJIB INCLUDE spec file

```bash
git add apps/web/src/lib/sentry/ \
        apps/web/instrumentation.ts \
        apps/web/sentry.*.config.ts \
        apps/web/src/app/error.tsx \
        apps/web/src/app/global-error.tsx \
        apps/web/src/components/analytics/ \
        apps/web/next.config.ts \
        apps/web/package.json \
        apps/web/.env.example \
        deploy/runbooks/uptime-monitoring.md \
        specs/SPRINT-3/18-tier1-ops.md
```

## Coordinate paralel — file ownership map

**Window 3 (this spec) territory** — clean isolation:
- `apps/web/src/lib/sentry/*` (BARU)
- `apps/web/instrumentation.ts` (BARU)
- `apps/web/sentry.*.config.ts` (BARU)
- `apps/web/src/app/error.tsx` (BARU)
- `apps/web/src/app/global-error.tsx` (BARU)
- `apps/web/src/components/analytics/*` (BARU)
- `apps/web/next.config.ts` (modify — wrap withSentryConfig)
- `apps/web/package.json` (add deps)
- `.env.example`
- `deploy/runbooks/uptime-monitoring.md` (BARU)

**Conflict risk**: `apps/web/src/app/layout.tsx` — Window 2 wire `<SiteFooter />`, Window 3 wire `<PlausibleScript />`.

**Resolution**: 
- Sequential: Window 2 commit dulu, push. Window 3 pull rebase, add PlausibleScript di lokasi yang sudah include Footer.
- Atau: Pisahin di layout.tsx — Footer di body bottom, PlausibleScript di head. Conflict scope berbeda, merge auto-resolved kalau git pintar.

**Pull-rebase reflex** wajib sebelum push setiap window.

---

## Update STATUS.md

Setelah commit, update `specs/SPRINT-3/STATUS.md`:
- Add row Spec #18 status DONE dengan commit hash
- Note: tier 1 BLOCKER ops gap closed
