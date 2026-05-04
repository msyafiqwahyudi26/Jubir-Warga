# ADR — Phase 2 deploy platform decision

**Date**: 2026-05-04
**Status**: Accepted
**Sprint**: 3 — Spec #22
**Decision maker**: Mas (owner) per planner ↔ executor approval flow
**Spec**: `specs/SPRINT-3/22-phase2-deploy.md`

---

## Context

Phase 1 (vanilla CDN site) sudah live di `jubir.spdindonesia.org` via Hostinger VPS `76.13.196.172`. Phase 2 (Next.js + Supabase) dalam development di `apps/web/` dan butuh production deploy target untuk beta launch Juni 2026.

Dua opsi platform diaudit di Spec #22:
1. **Vercel** — managed Next.js platform (recommendation planner default)
2. **Hostinger VPS** — same infra Phase 1 (alternative)

---

## Decision

**Phase 2 di-deploy ke Hostinger VPS** yang sama dengan Phase 1, parallel sebagai vhost terpisah.

| Item | Value |
|---|---|
| Phase 2 production URL | `https://jubirbetaapp.spdindonesia.org` (BARU) |
| Phase 1 URL after rename | `https://mockupjubir.spdindonesia.org` (legacy/mockup) |
| Phase 1 URL old (transition) | `https://jubir.spdindonesia.org` (dual-listed 2 minggu, lalu redirect) |
| VPS IP | `76.13.196.172` |
| Phase 2 path on VPS | `/var/www/jubir-warga-phase2` |
| Internal port | `3001` (Next.js Node, behind Nginx reverse proxy) |
| Process manager | PM2 |
| SSL | Let's Encrypt via certbot |
| CI/CD | GitHub Actions (`.github/workflows/deploy-phase2.yml`) — webfactory/ssh-agent pattern, sama dengan Phase 1 |

---

## Rationale

### Why VPS, not Vercel

1. **Same infra Phase 1, sudah bayar.** VPS Hostinger sudah running 24/7 untuk Phase 1. Resource available (8GB RAM, 100GB disk) lebih dari cukup untuk Phase 2 paralel. Marginal cost = 0.
2. **No new vendor signup, no credit card needed.** Vercel free tier ada batas (100GB bandwidth, 1GB function invocation), dan tier berikutnya $20+/bulan per seat — tambah variable cost yang gak predictable post-launch.
3. **Mas familiar dengan setup Phase 1.** SSH, Nginx, certbot, PM2 — tooling yang sama. Onboarding cost = 0 vs Vercel dashboard + project config + monorepo build settings yang butuh learning curve.
4. **Data residency control.** VPS di Singapore (region `ap-southeast-1`, sama dengan Supabase project). Vercel global edge bisa cache di server US/EU — implication compliance kalau ada audit (low priority sekarang, tapi optionality preserved).
5. **Full control untuk operasional.** Custom Nginx rules, log access langsung, batch job di cron host yang sama — semua tersedia. Vercel masking ini di balik abstraksi managed.

### Trade-off accepted

| Vercel feature | Lost by choosing VPS | Mitigation |
|---|---|---|
| Auto preview deploy per PR | None — GitHub Actions on PR ke staging slot Sprint 4 | Defer ke Sprint 4 kalau perlu |
| Built-in analytics | None — pakai Plausible (per Spec #18) | Already covered |
| Image optimization CDN | Self-host via Next.js + Nginx cache | Sprint 4: pasang Cloudflare di depan VPS |
| Geographic edge | Singapore only | Sprint 4: Cloudflare CDN cache global |
| 30-min setup | 2-3 jam manual setup | One-time cost; CI/CD auto setelah itu |
| Zero maintenance | Ongoing: SSL renew (auto), security patch (manual), log rotation | Documented runbook; certbot timer auto |

### Why these specific domains (`.org` not `.id`)

Per CLAUDE.md §12: brand domain `jubirwarga.id` adalah **target launch Juni 2026**, belum dibeli. Sekarang semua subdomain di-host di SPD-owned `spdindonesia.org` zone (Phase 1 already established). Decision: tetap pakai `.org` untuk Phase 2 staging sampai `jubirwarga.id` dibeli + DNS dipindah (post-launch consideration, separate spec).

Subdomain naming:
- `jubirbetaapp.spdindonesia.org` — eksplisit "beta app" supaya jelas ini bukan landing publik. Mirror naming pattern `app.jubirwarga.id` yang akan dipakai post-launch.
- `mockupjubir.spdindonesia.org` — Phase 1 reposisikan sebagai mockup/legacy. Naming jujur: ini PRA-launch demo, BUKAN produk live final.

---

## Alternatives considered

### Alternative 1 — Vercel (rejected)

**Pros**: 30-min setup, auto preview deploy, free tier cukup beta scale, built-in image optimization, global edge.

**Cons**: New vendor + billing relationship, learning curve dashboard, masking ops abstraction (debug harder), variable cost post-launch.

**Why rejected**: Same-infra reuse + Mas familiarity outweighs setup convenience. Migration ke Vercel later remains optionable kalau VPS hit scale ceiling — not a one-way door.

### Alternative 2 — Coolify PaaS on same VPS (rejected)

**Pros**: Vercel-like experience self-hosted, dashboard, auto-deploy, one-click Postgres.

**Cons**: Tambah layer abstraksi + service yang harus maintained, memory overhead 1-2GB, learning curve baru, deviation dari pattern Phase 1.

**Why rejected**: Over-spec untuk beta. Plain Nginx + PM2 + GitHub Actions cukup, lebih transparent untuk debug.

### Alternative 3 — Cloudflare Pages / Workers (rejected)

**Pros**: Edge runtime, generous free tier, integrated CDN.

**Cons**: Edge runtime constraints (no Node-only API, Server Actions limitation), cold start, breaking change risk untuk Next.js 15 features.

**Why rejected**: Belum mature untuk Next.js 15 + Server Actions production. Re-evaluate Sprint 5+.

---

## Migration plan

### Phase 1 retire → Phase 2 cutover

**Trigger**: Phase 2 di `jubirbetaapp.spdindonesia.org` running 14 hari tanpa critical bug (P0 atau P1 unresolved).

**Steps** (per `deploy/phase2/PHASE1_RENAME.md`):

| Day | Action |
|---|---|
| T+0 (deploy day) | Phase 2 live di `jubirbetaapp.spdindonesia.org`. Phase 1 tetap di `jubir.spdindonesia.org`. Both monitored UptimeRobot. |
| T+0 to T+3 | Smoke test Phase 2 daily. Critical bug → rollback path tersedia. |
| T+3 | Add DNS `mockupjubir.spdindonesia.org` → VPS (additive). Update Nginx vhost dual-listed (`jubir` + `mockupjubir` serve Phase 1 same content). Issue cert. |
| T+3 to T+14 | Dual-list window. Both URLs Phase 1 alive. Mas + tester verify Phase 2 tetap stable. |
| T+14 | Cutover: `jubir.spdindonesia.org` → 301 redirect ke `jubirbetaapp.spdindonesia.org`. `mockupjubir.spdindonesia.org` retain Phase 1 sebagai mockup reference. |
| T+30 (post-stable) | Re-evaluate: simpan Phase 1 sebagai `mockupjubir` permanent, atau retire fully. Decision deferred ke Sprint 4 review. |

### Vercel migration optionality

Kalau cost VPS > $50/bulan post-launch (mis. traffic spike + storage fill): migrate Phase 2 ke Vercel **sebagai re-platform, not rebuild**. Codebase Next.js portable — env var copy + build settings di Vercel dashboard + DNS swap.

**Trigger**: Cost > $50/bulan **OR** specific feature butuh Vercel-only (mis. ISR per-tenant, edge middleware kompleks).

---

## Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| VPS single-region (Singapore) latency dari Sumatra/Papua user | Medium | Low (small target audience initially) | Sprint 4: Cloudflare CDN di depan VPS |
| VPS single-instance — DDoS / resource exhaustion | Low | High (downtime) | Sprint 4: Cloudflare DDoS protection + UFW rate limit |
| Memory pressure 8GB shared with Phase 1 + Postgres co-host | Medium | Medium | PM2 `max_memory_restart: 800M` Phase 2; monitor disk + RAM via VPS dashboard |
| SSL renewal fail (certbot) | Low | High (HTTPS down) | systemd timer auto + manual `certbot renew --dry-run` quarterly |
| GitHub Actions deploy fail mid-build (broken state) | Medium | Medium | Workflow has health check `curl localhost:3001` after PM2 restart; runbook untuk rollback (`git reset --hard <sha>` + rebuild) |
| Mas SSH key compromised | Low | Critical | Rotate key Sprint 4; consider GitHub-hosted runner with deploy user (not root) |
| Phase 1 + Phase 2 port collision | Low | High | Phase 1 = 80/443 (Nginx static), Phase 2 = 3001 (PM2 Node), Nginx 443 routes by `server_name` — no conflict |

---

## Out of scope for this ADR

- ❌ Domain `jubirwarga.id` purchase + cutover plan (separate decision, post-launch)
- ❌ Database backup automation (Sprint 4 — Supabase has built-in PITR for now)
- ❌ Disaster recovery runbook (Sprint 4)
- ❌ Load testing + SLA targets (separate spec pre-launch)
- ❌ CDN architecture (Cloudflare in front of VPS) — Sprint 4
- ❌ Geo-replication Supabase region — over-spec untuk beta

---

## Acceptance signals

- [ ] Phase 2 accessible publik di `https://jubirbetaapp.spdindonesia.org`
- [ ] Auto-deploy via GitHub Actions verified (test push commit)
- [ ] Phase 1 still accessible (rename runbook execution deferred to Mas)
- [ ] Sentry capture verified, Plausible script load verified
- [ ] UptimeRobot monitor active for both domains
- [ ] No critical bug 14 hari → cutover decision

---

## Reference

- Spec: `specs/SPRINT-3/22-phase2-deploy.md`
- Phase 1 ops reference: `deploy/README.md`, `deploy/nginx-jubirwarga.conf`, `.github/workflows/deploy.yml`
- Phase 2 scaffold: `deploy/phase2/`
- Phase 1 rename runbook: `deploy/phase2/PHASE1_RENAME.md`
- Sentry + Plausible setup: Spec #18 (commit `f87bd69`)
- AUDIT_PRE_BETA OPS-5 — original gap that motivated this spec

---

_Authored by Claude Code (planner ↔ executor flow). Decision approved by Mas via chat 2026-05-04. Activation pending Mas execution of VPS setup commands per `deploy/phase2/README.md`._
