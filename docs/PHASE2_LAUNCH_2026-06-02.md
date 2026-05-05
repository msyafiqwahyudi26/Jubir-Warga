# Phase 2 launch checklist — target 2026-06-02

**Status**: Working draft — Window E + Mas drives execution. Updated as steps land.
**Target launch**: 2026-06-02 (per Sprint 4 SCOPE-REDUCED)
**Scope**: Phase 2 Next.js publik di `jubirbetaapp.spdindonesia.org` + self-host monitoring (GlitchTip + Umami) live.
**Not in scope**: Phase 1 rename (`jubir → mockupjubir`) — separate runbook `deploy/phase2/PHASE1_RENAME.md`, executed post-stable +14 hari.

---

## 0. Owner matrix

| Domain | Owner |
|---|---|
| Code + scaffold + config | Claude Code (Window E) |
| Spec / decision lock | Mas |
| DNS provider edits | Mas (only) |
| SSH ke VPS execute commands | Mas (only) |
| Fill `.env.production.local` (real secrets) | Mas (only) |
| Smoke test post-deploy via browser | Mas + Claude Code (verification) |
| Public launch announcement IG `@jubirwarga.id` | Mas |

---

## 1. Pre-launch — T-7 to T-3

### 1a. DNS setup (Mas)
- [ ] A record `jubirbetaapp.spdindonesia.org` → `76.13.196.172` (TTL 300)
- [ ] A record `glitchtip.spdindonesia.org` → `76.13.196.172` (TTL 300)
- [ ] A record `umami.spdindonesia.org` → `76.13.196.172` (TTL 300)
- [ ] All three resolve via `dig <domain> +short` returning `76.13.196.172`

### 1b. VPS prep (Mas via SSH)
- [ ] SSH ke `root@76.13.196.172` succeeds dengan key Phase 1
- [ ] Disk free `/var` >10GB (`df -h`)
- [ ] Disk free `/opt` >5GB
- [ ] Docker + docker-compose plugin installed (per `deploy/self-host/README.md` §1)

### 1c. Self-host monitoring deploy (Mas via SSH, runbook ready)
- [ ] GlitchTip stack up — `docker compose ps` di `/opt/glitchtip` shows web/worker/postgres/redis healthy
- [ ] GlitchTip Nginx + SSL — `https://glitchtip.spdindonesia.org` HTTP 200
- [ ] GlitchTip admin user dibuat — login OK
- [ ] GlitchTip project `jubir-warga-web` ada — DSN visible
- [ ] Umami stack up — `docker compose ps` di `/opt/umami` shows umami/postgres healthy
- [ ] Umami Nginx + SSL — `https://umami.spdindonesia.org` HTTP 200
- [ ] Umami admin password changed dari default `admin/umami`
- [ ] Umami website "Jubir Warga Beta" added — tracking UUID visible

### 1d. Phase 2 deploy (Mas via SSH, runbook ready)
- [ ] Repo cloned ke `/var/www/jubir-warga-phase2`
- [ ] `pnpm install --frozen-lockfile` success
- [ ] `pnpm --filter @jw/web build` success (no errors, build size reasonable)
- [ ] `.env.production.local` filled (Supabase keys + GlitchTip DSN + Umami UUID + chmod 600)
- [ ] PM2 started — `pm2 status` shows `jubir-warga-phase2 online`
- [ ] `curl http://localhost:3001` returns HTTP 200
- [ ] Nginx vhost copied + symlinked + `nginx -t` passes
- [ ] Certbot issued SSL — `https://jubirbetaapp.spdindonesia.org` HTTP 200
- [ ] PM2 startup script registered — survives `reboot` test (optional)

### 1e. CI/CD verification
- [ ] Test push to `main` triggers `.github/workflows/deploy-phase2.yml`
- [ ] Workflow run completes green
- [ ] PM2 restart confirmed via `pm2 logs --lines 5` showing recent restart
- [ ] `curl https://jubirbetaapp.spdindonesia.org` shows updated content

---

## 2. Smoke test — T-2 (Mas + Claude Code via Chrome)

Visit each route, verify render + DevTools no critical errors. Mark blocking failures sebagai P0.

### 2a. Public pages (15 routes)
- [ ] `/` Beranda — hero + thread-list + CTA render
- [ ] `/komunitas` — thread grid + sidebar filter render
- [ ] `/komunitas/[id]` — thread detail + reply tree (pick a real thread UUID dari demo seed)
- [ ] `/karya` — karya grid render
- [ ] `/karya/[slug]` — reading view render dengan body + author
- [ ] `/kelas` — kelas grid + FREE badge render
- [ ] `/kelas/[id]` — kelas detail + silabus render
- [ ] `/aksi` — petisi + polling render
- [ ] `/aksi/[type]/[id]` — detail render
- [ ] `/tagih` — janji tracker render
- [ ] `/tagih/[id]` — janji detail render
- [ ] `/main` — game lobby render
- [ ] `/main/tebak-kata` — playable
- [ ] `/main/tebak-pejabat` — playable
- [ ] `/profil` (logged in) — paspor render

### 2b. Auth flow
- [ ] `/daftar` — form render, submit dengan email dummy → success message
- [ ] `/masuk` — form render, login dengan dummy account → redirect ke Beranda
- [ ] Logout flow OK

### 2c. DevTools verification
- [ ] Network: 0 × 404 (manifest.json, icons, fonts all 200)
- [ ] Console: no critical errors (warn OK; React hydration warning P1)
- [ ] Sentry/GlitchTip script load: request ke `glitchtip.spdindonesia.org` visible
- [ ] Umami script load: kalau script swap landed (Window D), request ke `umami.spdindonesia.org/script.js` visible. Kalau belum, leave for follow-up.
- [ ] HTTPS: cert valid, no mixed content warning

### 2d. Monitoring active capture
- [ ] Trigger sengaja error: visit `/__error_test` → error event muncul di GlitchTip dashboard dalam <60 detik
- [ ] Visit Beranda: pageview muncul di Umami "Active visitors" (kalau script swap landed)
- [ ] PM2 logs no panic / crash loop

### 2e. Mobile responsive (375px iPhone SE)
- [ ] Spot-check 3 page (Beranda + Komunitas + Tagih) di 375px viewport — no horizontal scroll, hero text fit
- [ ] Touch target ≥44x44px untuk CTA primary

---

## 3. Soft launch — T-1 (internal SPD team)

- [ ] Mas share URL ke internal SPD team (Slack / WA group)
- [ ] Collect feedback 24 jam
- [ ] Triage P0 (block launch) vs P1 (post-launch fix) vs P2 (nice-to-have)
- [ ] Resolve P0 atau decision: defer launch +1 hari per P0

---

## 4. Public launch — T+0 (2026-06-02)

- [ ] Final smoke test ulang section 2 — tidak ada regression
- [ ] UptimeRobot monitor active untuk:
  - [ ] `https://jubirbetaapp.spdindonesia.org` (5 min interval)
  - [ ] `https://glitchtip.spdindonesia.org` (15 min interval, info-level alert)
  - [ ] `https://umami.spdindonesia.org` (15 min interval, info-level alert)
- [ ] Mas IG `@jubirwarga.id` post launch announcement (copy ready in `apps/legacy/docs/Landing_Page_Beta_Copy.md` adapt)
- [ ] Mas internal email blast ke SPD network
- [ ] On-call Mas + Claude Code standby selama 24 jam first-day untuk hot-fix

---

## 5. Post-launch monitoring — T+1 to T+7

- [ ] Daily: review GlitchTip event count (P0 if any unhandled exception >5/hari)
- [ ] Daily: review Umami pageview trend (sanity check, gak hard target)
- [ ] Daily: PM2 memory + CPU (`pm2 monit`)
- [ ] T+3: review feedback dari Beta users (GitHub issue / IG DM / email `info@jubirwarga.id`)
- [ ] T+7: post-mortem singkat — write up di `docs/POSTMORTEM_BETA_LAUNCH_2026-06-02.md` (apa yang work, apa yang gak)

---

## 6. Rollback plan

Kalau P0 critical bug muncul post-launch:

### 6a. Code rollback (cepat — 5 menit)
```bash
ssh root@76.13.196.172
cd /var/www/jubir-warga-phase2
git log --oneline -10
git reset --hard <last-known-good-sha>
pnpm install --frozen-lockfile
pnpm --filter @jw/web build
pm2 restart jubir-warga-phase2
```

### 6b. DNS rollback (lebih lambat — 30 menit propagation)
Edit DNS provider: temporarily point `jubirbetaapp.spdindonesia.org` ke maintenance page (gak ada — fallback bisa ke 503 page Nginx kalau bikin).

Belum disiapkan maintenance page → Sprint 4 backlog kalau perlu.

### 6c. Communication
Kalau down >15 menit:
- IG Story announcement: "Lagi maintenance, balik dalam jam X."
- Update banner di Phase 1 mockup site (`mockupjubir.spdindonesia.org`)

---

## 7. Known limitations launch beta

Documented limitations supaya Mas + tim tidak surprise:

1. **Plausible script swap belum landed** — `apps/web/src/components/plausible-script.tsx` masih hardcoded ke `plausible.io`. Workaround: kalau Plausible SaaS aktif, biarkan; kalau gak aktif, script load gagal silent (no analytics). Follow-up: spec swap ke Umami script tag.
2. **Live Watch AI defer Sprint 5+** — `/live-watch` route gak ada / placeholder. Per SCOPE-REDUCED.
3. **RPJMN/RPJMD scraping defer Sprint 5+** — janji DB di-seed manual via Mas + Claude Cowork session.
4. **Nala live AI defer** — chat panel pakai 19 mock rule (per Spec #15). Real LLM integration Sprint 5+.
5. **B2B API gak ada** — UI dashboard public-only, tidak ada `/api/v1/janji` external endpoint untuk NGO/peneliti. Sprint 5+.
6. **Push notification gak ada** — game streak, janji updates pakai polling/Supabase realtime kalau perlu, no native push.

---

## 8. Backlog (Sprint 5+ post-launch trigger)

Trigger upgrade kalau traction >5K MAU atau funding/grant masuk. Lihat `specs/SPRINT-4/SCOPE-REDUCED-2026-05-05.md` §"Sprint 5+ backlog".

---

## 9. Reference docs

| Doc | Purpose |
|---|---|
| `specs/SPRINT-3/22-phase2-deploy.md` | Original deploy spec |
| `specs/SPRINT-4/SCOPE-REDUCED-2026-05-05.md` | Sprint 4 scope + Spec #38 self-host |
| `deploy/phase2/README.md` | Phase 2 VPS setup runbook |
| `deploy/self-host/README.md` | GlitchTip + Umami setup runbook |
| `deploy/phase2/PHASE1_RENAME.md` | Phase 1 rename plan (executed post-stable +14d) |
| `docs/DEPLOY_DECISION_2026-05-04.md` | ADR — VPS over Vercel rationale |
| `apps/legacy/docs/Landing_Page_Beta_Copy.md` | Launch announcement copy source |

---

## Sign-off

Target sign-off date: **2026-06-02 EOD**.

Gate criteria — semua harus ✅ sebelum public launch:
- [ ] Section 1 (pre-launch) — all done
- [ ] Section 2 (smoke test) — 0 P0, ≤2 P1
- [ ] Section 3 (soft launch) — internal feedback positive atau neutral
- [ ] Section 4 (public launch ops) — UptimeRobot active, on-call standby

Sign-off Mas: ___ (date / time)
Sign-off Claude Code (technical): ___ (date / time)

---

_Last updated: 2026-05-05 by Claude Code (Spec #38 launch checklist scaffold). Updated as execution progresses._
