# Uptime Monitoring Runbook

External monitoring uptime + response time untuk Phase 1 (live) & Phase 2 (post-deploy). Setup manual via dashboard UptimeRobot — tidak ada code di repo, hanya doc ini.

## Setup (manual via UptimeRobot dashboard)

1. Account: https://uptimerobot.com — login dengan account SPD Indonesia (`admin@spdindonesia.org`).
2. Dashboard → "Add New Monitor".
3. Per environment, create monitor sesuai template di bawah.

### Phase 1 (current production — Hostinger VPS)

- **Type**: HTTP(s)
- **URL**: https://jubir.spdindonesia.org
- **Friendly Name**: "Jubir Warga Phase 1 (Hostinger VPS)"
- **Monitoring Interval**: 5 minutes
- **Keyword Monitoring**: "Jubir Warga" (substring untuk verify page render bukan blank)
- **Alert contacts**: admin@spdindonesia.org (email) + WhatsApp Mas

### Phase 2 (post-deploy — TBD provider)

- **Type**: HTTP(s)
- **URL**: https://jubirwarga.id (production) atau staging URL
- **Friendly Name**: "Jubir Warga Phase 2 (Vercel/VPS)"
- **Monitoring Interval**: 5 minutes
- **Keyword Monitoring**: "Jubir Warga"
- **Alert contacts**: admin@spdindonesia.org + WhatsApp Mas

## Alert routing

- **Down notification** → email + WhatsApp Mas dalam ≤5 menit
- **Up notification** → email konfirmasi
- **Maintenance window**: schedule via dashboard kalau ada deploy planned

## SLO target (beta, sampai Juni 2026)

- Uptime ≥ 99% (allow ~7 jam downtime/bulan)
- Response time p50 < 500ms, p95 < 2s
- Error rate (Sentry) < 1% per 1000 page view

Pasca-launch publik (Juni 2026), tightening:
- Uptime ≥ 99.5%
- Response time p50 < 300ms

## Escalation

Kalau monitor down > 15 menit:

1. Cek Sentry dashboard untuk error spike (https://sentry.io org `spd-indonesia` project `jubir-warga-web`).
2. Cek Vercel/Hostinger status page sesuai provider.
3. Cek Supabase status (https://status.supabase.com).
4. Kalau infra issue: post di status page, communicate ke user via IG `@jubirwarga.id`.

## Cross-reference

- Sentry config: `apps/web/sentry.*.config.ts` + `apps/web/instrumentation.ts`
- Error boundary brand-aligned: `apps/web/src/app/error.tsx` + `apps/web/src/app/global-error.tsx`
- Spec: `specs/SPRINT-3/18-tier1-ops.md` (Tier 1 BLOCKER ops setup)
