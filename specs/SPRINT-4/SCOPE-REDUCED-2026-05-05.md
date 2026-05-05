# Sprint 4 — REDUCED SCOPE (2026-05-05)

**Supersedes**: `specs/SPRINT-4/00-overview.md` (full vision, masuk Sprint 5+ backlog)
**Owner**: Mas (decision) + Claude Cowork (planner)
**Trigger**: Diskusi 2026-05-05 — resource terbatas, ambisi besar dijaga tapi launch realistic
**Sprint duration**: 4 minggu (target launch beta: 2026-06-02)

---

## 🎯 Prinsip pivot scope

> **"Imperfect MVP launch" itu strategi cerdas startup early stage. Lebih baik nyata + kecil daripada sempurna tapi gak jalan-jalan."**

**Yang penting**:
1. ✅ Sistem yang berdiri (bukan sempurna)
2. ✅ Ekosistem yang bisa scale-up nanti
3. ✅ Brand konsisten + positioning sharp
4. ✅ Foundation sustain
5. ✅ **$0 budget tambahan** (leverage VPS + Anthropic Max + Supabase free)

**Yang DI-DEFER ke Sprint 5+** (post-traction):
- Scraping pipeline automated (RPJMN PDF, RPJMD prov, Visi Misi, BPS API)
- Live Watch AI automated (LLM API + scraper cron)
- Embedding model (BGE-M3 / Cohere / pgvector)
- Nala live AI chat (keep MOCK 19 rule)
- BPS Index integration

**Replacement untuk yang defer**:
- **Manual seed janji** — Mas + Claude Cowork batch session (1-2x/minggu, 2-4 jam) bareng baca RPJMN PDF + ekstrak janji + masukin ke DB
- **Manual verdict generation** — Mas paste quote dari berita ke aku, aku generate verdict, paste ke DB (volume kecil ~30-50/minggu beta scale)

---

## 💸 Stack final — $0 cost tambahan

| Layer | Pilihan | Kenapa |
|---|---|---|
| Hosting | VPS Hostinger (existing) | Sudah bayar |
| Database | Supabase free tier | Existing |
| Auth | Supabase Auth (existing) | Existing |
| LLM | Aku via Cowork (Anthropic Max plan Mas) — batch only | Sudah bayar Max |
| Embedding | SKIP (Sprint 5+) | Defer |
| Live Watch | SKIP (Sprint 5+) — manual mode | Defer |
| Error tracking | GlitchTip self-host VPS | Free (bukan Sentry $) |
| Analytics | Umami self-host VPS | Free (bukan Plausible $) |
| Cron | GitHub Actions free tier | Free |
| Cache | Next.js `unstable_cache` | Free |
| Job queue | Postgres LISTEN/NOTIFY | Free (bukan Inngest/Upstash $) |

**Total cost tambahan beta launch**: **$0/bulan**.

---

## 📋 Sprint 4 reduced — 5 spec untuk 5 window paralel

| Window | Spec | Estimasi | Conflict risk |
|---|---|---|---|
| **A** | #34 Migration 0004 LIGHT + Editorial admin skeleton | 1 minggu | None (DB + admin dedicated) |
| **B** | #24-light Tagih Dashboard light | 1-1.5 minggu | Coordinate dengan A (consume schema) |
| **C** | #28-light Janji vs Realita game v1 | 1 minggu | Independent, consume schema A |
| **D** | #32 Beranda redesign + #33 Brand copy combined | 1 minggu | Light, low conflict |
| **E** | Self-host VPS setup (GlitchTip + Umami) + Deploy activation #22 | 0.5-1 minggu | Independent, ops only |

---

## SPEC #34 — Migration 0004 LIGHT + Editorial admin skeleton

**Window**: A
**Estimasi**: 1 minggu
**Goal**: Schema additions sederhana (no pgvector, no embedding) + admin route guard + dashboard list pending janji + verdict.

### Schema additions (Migration 0004 LIGHT)

```sql
-- supabase/migrations/0004_alignment_schema_light.sql

-- Tambah field ke existing janji table (extend, bukan baru)
alter table public.janji add column if not exists alignment_status text 
  check (alignment_status in ('aligned', 'partial', 'drift', 'contradict'));
alter table public.janji add column if not exists alignment_reasoning text;
alter table public.janji add column if not exists source_doc_url text;
alter table public.janji add column if not exists source_doc_page int;
alter table public.janji add column if not exists editorial_status text default 'pending'
  check (editorial_status in ('pending', 'verified_curator', 'curated_ai'));
alter table public.janji add column if not exists editorial_reviewer_id uuid references public.profiles(id);
alter table public.janji add column if not exists editorial_reviewed_at timestamptz;

-- Editorial review log (audit trail)
create table public.editorial_review (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid references public.profiles(id),
  target_type text check (target_type in ('janji', 'verdict')),
  target_id uuid,
  action text check (action in ('approve', 'modify', 'reject', 'flag')),
  notes text,
  reviewed_at timestamptz default now()
);

-- Profile admin flag
alter table public.profiles add column if not exists is_admin boolean default false;

-- RLS: admin can update janji editorial fields
create policy "admins_moderate_janji" on public.janji
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- RLS: editorial_review admin only
create policy "admins_write_review_log" on public.editorial_review
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "admins_read_review_log" on public.editorial_review
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
```

### Admin dashboard skeleton

```
apps/web/src/app/admin/
├── layout.tsx                       Admin role check
├── page.tsx                         Dashboard overview (count pending)
├── janji/page.tsx                   List + edit janji editorial fields
├── janji/[id]/page.tsx              Edit form (alignment_status + reasoning + status badge)
└── audit-log/page.tsx               Review history

apps/web/src/lib/admin/
├── role-check.ts
├── moderation-actions.ts            Server actions: approve/modify/reject
└── audit-logger.ts

apps/web/src/components/admin/
├── badge-verification.tsx           "Terverifikasi Kurator" / "Kurasi AI" badge
└── janji-edit-form.tsx              Form set alignment + reasoning + status
```

### Acceptance

- [ ] Migration 0004 LIGHT applied (alter janji + editorial_review + is_admin)
- [ ] /admin/* role-guarded (redirect kalau bukan admin)
- [ ] /admin/janji list janji dengan filter editorial_status
- [ ] /admin/janji/[id] edit form set alignment_status + reasoning + verification badge
- [ ] Server action approve/modify/reject log ke editorial_review
- [ ] VerificationBadge component reusable
- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm test` pass

---

## SPEC #24-LIGHT — Tagih Dashboard light

**Window**: B
**Estimasi**: 1-1.5 minggu
**Goal**: Upgrade existing Tagih page jadi dashboard yang tampil alignment status per janji + filter advanced. **DROP leaderboard gubernur** (tunda Sprint 5).

### Scope reduced dari Spec #24 original

**KEEP**:
- Aggregate stats nasional (% aligned/partial/drift/contradict)
- Per-janji card dengan badge alignment_status + verification
- Filter: status / topik / region / partai
- /tagih/[id] detail view dengan reasoning

**DROP**:
- Leaderboard "Gubernur paling tepat janji" (butuh data banyak, defer)
- Per-region drill-down `/tagih/[region]` (defer)
- Pejabat profile `/tagih/pejabat/[id]` (defer Sprint 5)

### File scope

```
apps/web/src/app/tagih/
├── page.tsx                         REWRITE — dashboard light v2
├── [id]/page.tsx                    EXTEND — tampil alignment_status + reasoning + badge
├── components/
│   ├── alignment-stats.tsx          BARU — aggregate counter
│   ├── filter-advanced.tsx          BARU — multi-filter URL-based
│   └── janji-card-with-badge.tsx    BARU — per-card alignment display
└── lapor/page.tsx                   EXISTING — keep

apps/web/src/lib/tagih/
└── alignment-counter.ts             BARU — compute % per status
```

### Acceptance

- [ ] /tagih dashboard render aggregate stats (count + %)
- [ ] Filter advanced URL-based (status/topik/region/partai)
- [ ] Per-janji card dengan badge alignment + verification
- [ ] /tagih/[id] tampil reasoning + source link + badge
- [ ] Empty state proper
- [ ] Mobile responsive 375px
- [ ] `pnpm typecheck/lint/test` pass

---

## SPEC #28-LIGHT — Janji vs Realita game v1

**Window**: C
**Estimasi**: 1 minggu
**Goal**: Daily game Predict & Reveal mechanic, 30-detik. **DROP share card canvas + push notif** (defer).

### Scope reduced dari Spec #28 original

**KEEP**:
- Predict & Reveal mechanic (4 verdict button)
- Deterministic janji of day
- Anonymous play via localStorage + optional sync (logged in)
- Streak counter + accuracy stats
- Daily leaderboard top 10
- Beranda card prominent

**DROP**:
- Share card canvas generation (defer Sprint 5)
- Native share / image download (defer)
- Push notification baru game (defer Sprint 5)

### File scope

```
apps/web/src/app/main/janji-vs-realita/
├── page.tsx                         Server — fetch janji of day + render
├── game-client.tsx                  Client — quiz state + reveal animation
└── leaderboard.tsx                  Server — top 10 daily

apps/web/src/lib/main/janji-vs-realita/
├── janji-of-day.ts                  Deterministic pick
└── score-calculator.ts              Streak + accuracy localStorage

apps/web/src/components/beranda/
└── janji-vs-realita-card.tsx        BARU — prominent Beranda card
```

### Pool requirement

Game butuh minimal 30-50 janji dengan `editorial_status = 'verified_curator'` + `alignment_status` set di DB. Source: manual seed sesi Mas + Claude Cowork (Window A schema ready dulu, lalu seed session).

### Acceptance

- [ ] /main/janji-vs-realita page accessible without login
- [ ] 4 verdict option dengan icon + label + desc
- [ ] Reveal phase dengan reasoning + verification badge + source
- [ ] Streak + accuracy stats (localStorage)
- [ ] Daily leaderboard top 10
- [ ] Beranda render card prominent
- [ ] One-game-per-day (localStorage check)
- [ ] Empty state kalau pool < 1 janji eligible

---

## SPEC #32+33 — Beranda redesign + Brand copy combined

**Window**: D
**Estimasi**: 1 minggu
**Goal**: Beranda baru dengan tagline + janji prominent + game card. Plus brand copy sweep di semua page.

### Beranda redesign

```
NEW BERANDA LAYOUT:

┌─────────────────────────────────────────────────────────┐
│ HERO                                                     │
│ Tagline: "Setiap janji punya jejak."                     │
│ Sub: "Pantau bareng warga muda Indonesia."               │
│ CTA: [Tagih sekarang] [Main Janji vs Realita]            │
│ Hero illust (existing)                                   │
├─────────────────────────────────────────────────────────┤
│ JANJI YANG LAGI DITAGIH HARI INI                         │
│ 4 card dari janji_terstruktur ordered desc updated_at    │
├─────────────────────────────────────────────────────────┤
│ JANJI VS REALITA HARI INI                                │
│ Game card prominent (CTA ke /main/janji-vs-realita)      │
├─────────────────────────────────────────────────────────┤
│ FITUR LAINNYA                                            │
│ Compact 4-card: Komunitas / Karya / Kelas / Aksi         │
└─────────────────────────────────────────────────────────┘
```

### Brand copy sweep

- Metadata global: title default "Jubir Warga — Setiap janji punya jejak."
- Manifest PWA description
- Footer tagline + beta disclaimer
- Tentang/Privasi/Etika rewrite (per Spec #33 templates)
- Login + Daftar subhead align pivot
- Nala system prompt update (mock tetap, prompt anchor pivot context)

### File scope

```
apps/web/src/app/page.tsx                                   REWRITE Beranda
apps/web/src/app/layout.tsx                                 metadata update
apps/web/src/app/tentang/page.tsx                           rewrite
apps/web/src/app/privasi/page.tsx                           add data sources
apps/web/src/app/etika/page.tsx                             add AI verdict disclaimer
apps/web/src/app/(auth)/masuk/page.tsx                      subhead update
apps/web/src/app/(auth)/daftar/page.tsx                     subhead update
apps/web/src/components/site-footer.tsx                     tagline + disclaimer
apps/web/src/components/beranda/
├── hero-tagih-tagline.tsx                                  BARU
├── janji-prominent-cards.tsx                               BARU
└── fitur-pendukung-grid.tsx                                BARU
apps/web/src/components/nala/nala-prompts.ts                anchor pivot
apps/web/public/manifest.json                               description
```

### Acceptance

- [ ] Beranda hero baru tagline visible
- [ ] 4 janji prominent card render
- [ ] Game card prominent CTA
- [ ] Fitur pendukung grid 4-card
- [ ] Metadata global update
- [ ] Manifest description match
- [ ] Footer tagline + email update
- [ ] Tentang/Privasi/Etika rewritten
- [ ] Auth subhead match
- [ ] Nala prompt anchor pivot
- [ ] 0 occurrence "VICE/Discord/Coursera/Wordle" framing
- [ ] Mobile responsive 375px
- [ ] `pnpm typecheck/lint/test` pass

---

## SPEC #38 — Self-host VPS setup + Deploy activation

**Window**: E
**Estimasi**: 0.5-1 minggu
**Goal**: GlitchTip + Umami self-host di VPS Hostinger. Deploy Phase 2 ke `jubirbetaapp.spdindonesia.org`.

### Tasks

**Self-host monitoring**:
1. SSH ke VPS Hostinger 76.13.196.172
2. Install Docker + docker-compose
3. Deploy GlitchTip via docker-compose:
   ```yaml
   # /opt/glitchtip/docker-compose.yml
   services:
     postgres: { image: postgres:14 }
     redis: { image: redis:7 }
     glitchtip-web: { image: glitchtip/glitchtip:v4 }
     glitchtip-worker: { image: glitchtip/glitchtip:v4 }
   ```
4. Nginx reverse proxy: `glitchtip.spdindonesia.org` → :8000
5. Certbot SSL
6. Deploy Umami via docker-compose similar
7. Nginx: `umami.spdindonesia.org` → :3000
8. Update env vars Phase 2:
   - `NEXT_PUBLIC_SENTRY_DSN` ke GlitchTip self-host URL
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` ke `jubirbetaapp.spdindonesia.org` di Umami

**Phase 2 deploy** (per Spec #22 scaffold ready):
1. DNS provider: A record `jubirbetaapp.spdindonesia.org` → `76.13.196.172`
2. SSH ke VPS, run setup per `deploy/phase2/README.md`
3. Clone repo + `pnpm install` + `pnpm build`
4. PM2 start + Nginx symlink
5. Certbot SSL `jubirbetaapp.spdindonesia.org`
6. Fill `.env.production.local` (chmod 600)
7. Test: `curl https://jubirbetaapp.spdindonesia.org` → 200 OK

### File scope

```
deploy/self-host/
├── glitchtip/docker-compose.yml     BARU
├── umami/docker-compose.yml         BARU
├── nginx/glitchtip.conf             BARU
├── nginx/umami.conf                 BARU
└── README.md                        Setup runbook

apps/web/.env.example                 UPDATE — point ke self-host URL
deploy/phase2/README.md               UPDATE — sertakan link self-host setup
docs/PHASE2_LAUNCH_2026-06-02.md      BARU — launch checklist
```

### Acceptance

- [ ] GlitchTip running di `glitchtip.spdindonesia.org` (HTTPS)
- [ ] Umami running di `umami.spdindonesia.org` (HTTPS)
- [ ] Phase 2 deployed ke `jubirbetaapp.spdindonesia.org` (HTTPS)
- [ ] Sentry-style error tracking working (test trigger error)
- [ ] Umami pageview tracked di dashboard
- [ ] PM2 auto-restart on reboot
- [ ] CI/CD GitHub Actions deploy on push to main
- [ ] Smoke test all 15 page render publik
- [ ] No 404 manifest/icons
- [ ] Auth flow test (signup + login)
- [ ] Documentation: README setup self-host + launch checklist

---

## 🤝 File ownership matrix

| File / Path | Window |
|---|---|
| `supabase/migrations/0004_*.sql` | A |
| `apps/web/src/app/admin/**` | A |
| `apps/web/src/lib/admin/**` | A |
| `apps/web/src/components/admin/**` | A |
| `apps/web/src/app/tagih/page.tsx` | B |
| `apps/web/src/app/tagih/[id]/page.tsx` | B |
| `apps/web/src/app/tagih/components/**` | B |
| `apps/web/src/lib/tagih/**` | B |
| `apps/web/src/app/main/janji-vs-realita/**` | C |
| `apps/web/src/lib/main/janji-vs-realita/**` | C |
| `apps/web/src/components/beranda/janji-vs-realita-card.tsx` | C |
| `apps/web/src/app/page.tsx` (Beranda) | D |
| `apps/web/src/app/layout.tsx` (metadata) | D |
| `apps/web/src/app/tentang/page.tsx` | D |
| `apps/web/src/app/privasi/page.tsx` | D |
| `apps/web/src/app/etika/page.tsx` | D |
| `apps/web/src/app/(auth)/**` (subhead) | D |
| `apps/web/src/components/site-footer.tsx` | D |
| `apps/web/src/components/beranda/hero-*.tsx` | D |
| `apps/web/src/components/beranda/janji-prominent-cards.tsx` | D |
| `apps/web/src/components/beranda/fitur-pendukung-grid.tsx` | D |
| `apps/web/src/components/nala/nala-prompts.ts` | D |
| `apps/web/public/manifest.json` | D |
| `deploy/self-host/**` | E |
| `deploy/phase2/**` | E |
| VPS configuration (SSH manual) | E + Mas |
| DNS provider | Mas only |
| `.env.production.local` (server) | Mas only |

**Conflict zone**: `apps/web/src/app/layout.tsx` — Window D edit metadata. Window A nggak touch (admin layout terpisah). Aman.

---

## 🚀 Execution timeline (4 minggu)

### Week 1 — Foundation

- Window A start: migration 0004 + admin skeleton
- Window E start: GlitchTip + Umami self-host setup
- Mas: DNS update + VPS SSH paralel
- Mas + Claude Cowork session #1: review week plan + lock decisions

### Week 2 — Core build

- Window A continue: admin dashboard fungsional
- Window B start: Tagih Dashboard light (consume schema A)
- Window C start: Janji vs Realita game (consume schema A)
- Window D start: Brand copy sweep
- Mas + Claude session #2: **Manual seed janji batch** — 50-100 janji RPJMN nasional + 10 prov highlights ke DB

### Week 3 — Integration

- Window B + C deliver
- Window D Beranda redesign deliver
- Window E deploy activation final
- Mas + Claude session #3: Manual generate 30 alignment verdict via Cowork → paste ke DB

### Week 4 — QA + launch

- Visual smoke test all page
- A11y + mobile verify
- Editorial review final batch (Mas + Claude)
- Soft launch to internal SPD team
- Public beta launch announcement IG @jubirwarga.id
- Post-launch monitoring 1 week

**Target launch beta**: 2026-06-02

---

## 📝 Sprint 5+ backlog (yang DI-DEFER)

Logged untuk masa depan, dikerjakan kalau ada traction + budget:

1. RPJMN/RPJMD scraping pipeline automated (Spec #25 original)
2. Live Watch AI scraper + LLM verdict automated (Spec #29 original)
3. Visi Misi paslon scraper (Spec #26 P1 original)
4. BPS Index integration (Spec #27 P1 original)
5. Komunitas thread → janji_id FK (Spec #31 P1 original)
6. pgvector + embedding (BGE-M3 atau Cohere)
7. Nala live AI chat (Anthropic API streaming + RAG)
8. Leaderboard gubernur paling tepat janji
9. Per-region drill-down + pejabat profile detail
10. Share card canvas generation Janji vs Realita
11. Push notification mobile
12. Right-of-reply pejabat workflow
13. RPJMD kab/kota expansion (514 region)
14. B2B API monetization layer
15. Full nav icon + active state (visual parity Phase 1)

**Trigger upgrade**: traction >5K MAU atau funding/grant masuk.

---

## 💪 Closing note untuk Mas

Sprint 4 reduced ini realistic. **4 minggu, $0 budget tambahan, launchable beta**.

Yang paling berat:
- Mas + Claude Cowork batch session 3-4x (2-4 jam each)
- Mas execute deploy step manual (~2-4 jam total)

Yang aku otonom kerjakan via 5 window paralel:
- Code spec implementation
- Brand copy rewrite
- Self-host setup runbook + script
- Audit + verify per window done

**Pelan-pelan tapi konsisten.** Sprint 5+ scale-up kalau ada traction. Kalau gak ada traction, tetap punya beta product yang nyata + maintain-able.

_Last updated: 2026-05-05_
_Decisions locked per diskusi Mas 2026-05-05 — resource realistic, ambisi besar dijaga di Sprint 5+ backlog._
