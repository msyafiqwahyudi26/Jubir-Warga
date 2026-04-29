# Rencana 1 Bulan — Beta Public Launch Jubir Warga

**Tujuan akhir bulan:**
- Web beta `https://jubir.spdindonesia.org` live dengan **semua 9 pilar fungsional** (mock data full, semua fitur dapat di-klik & navigate)
- UI/UX **polished consistently** seluruh halaman
- Mobile-app-ready via **PWA** (installable, offline-friendly)
- **Folder structure professional** (siap di-handover ke developer profesional, siap migrate ke Next.js)
- **Auto-deploy GitHub → VPS** via webhook/Actions

**Dasar:** Sudah punya VPS Hostinger live, domain `jubir.spdindonesia.org` aktif dengan SSL, prototipe Standalone HTML jalan, brand guideline complete.

---

## Mindset: Build like a real product team

| Prinsip | Implementasi |
|---|---|
| **Mock data dulu, backend kemudian** | Semua fitur jalan dengan `data/seeds.jsx`. Backend Phase 2 (bulan 2-3). |
| **Mobile-first responsive** | Semua design test 375px dulu, baru desktop. |
| **PWA dari awal** | Installable di HP. Cocok untuk beta — gak perlu native dulu. |
| **Folder rapih, scalable** | Siap migrate ke Next.js + Supabase tanpa rebuild structure. |
| **Build in public** | Tiap minggu push ke GitHub, deploy auto ke VPS, share progress di IG. |

---

## Folder Structure Final (target end of week 1)

```
jubirwarga/
├── README.md                        ← project intro untuk developer baru
├── CARA_BUKA.md                     ← instruksi run lokal
├── package.json                     ← (kosong dulu, untuk Next.js eventually)
│
├── public/                          ← static assets, served by web server
│   ├── manifest.json                ← PWA manifest
│   ├── service-worker.js            ← PWA offline support
│   ├── icons/                       ← app icons (192, 512, etc)
│   ├── images/                      ← static images, ilustrasi SVG terpisah
│   └── fonts/                       ← optional: self-hosted brand fonts
│
├── src/
│   ├── components/                  ← reusable UI components
│   │   ├── ui/                      ← Button, Pill, Card, Avatar, dll
│   │   ├── layout/                  ← Header, Footer, MobileNav
│   │   ├── nala/                    ← Nala mascot (SVG, modes, chat)
│   │   ├── illustrations/           ← inline SVG ilustrasi kustom
│   │   └── icons/                   ← Lucide icon helper
│   │
│   ├── pages/                       ← per-page components
│   │   ├── Beranda.jsx
│   │   ├── komunitas/
│   │   │   ├── Index.jsx            ← /komunitas (forum hub)
│   │   │   ├── ThreadDetail.jsx     ← /komunitas/thread/:id
│   │   │   ├── ChapterDetail.jsx    ← /komunitas/chapter/:id
│   │   │   └── SubKomunitas.jsx
│   │   ├── karya/
│   │   │   ├── Index.jsx
│   │   │   ├── ReadingView.jsx      ← /karya/baca/:id
│   │   │   ├── VideoPlayer.jsx
│   │   │   └── Upload.jsx
│   │   ├── kelas/
│   │   │   ├── Index.jsx
│   │   │   ├── KelasDetail.jsx      ← /kelas/:id
│   │   │   └── LessonPlayer.jsx     ← /kelas/:id/modul/:lessonId
│   │   ├── aksi/
│   │   │   ├── Index.jsx
│   │   │   ├── PetisiDetail.jsx
│   │   │   ├── LaporDetail.jsx
│   │   │   └── LaporBaru.jsx        ← form lapor
│   │   ├── tagih/
│   │   │   ├── Index.jsx
│   │   │   ├── JanjiDetail.jsx      ← /tagih/:id
│   │   │   ├── PejabatProfile.jsx   ← /tagih/pejabat/:id
│   │   │   └── SubmitJanji.jsx      ← form submit
│   │   ├── nala/
│   │   │   ├── Index.jsx            ← /nala (4 mode + suggested)
│   │   │   ├── Chat.jsx             ← /nala/chat
│   │   │   └── Etika.jsx            ← /nala/etika
│   │   ├── main/
│   │   │   ├── Index.jsx
│   │   │   └── games/
│   │   │       ├── TebakKata.jsx    ← Citizen Wordle
│   │   │       ├── SpotHoaks.jsx    ← BARU
│   │   │       └── TebakPasal.jsx   ← BARU
│   │   ├── profil/
│   │   │   ├── Index.jsx            ← my profile
│   │   │   ├── PasporPublic.jsx     ← /paspor/:userId
│   │   │   └── Pengaturan.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx            ← mock untuk beta
│   │   │   ├── Daftar.jsx
│   │   │   └── Onboarding.jsx
│   │   └── statis/
│   │       ├── Tentang.jsx          ← /tentang
│   │       ├── Privasi.jsx          ← /privasi
│   │       └── Syarat.jsx           ← /syarat
│   │
│   ├── data/                        ← mock data (akan di-replace API call)
│   │   ├── threads.js
│   │   ├── karya.js
│   │   ├── kelas.js
│   │   ├── janji.js
│   │   ├── laporan.js
│   │   ├── users.js
│   │   ├── pejabat.js
│   │   └── seeds.js                 ← combined export
│   │
│   ├── lib/                         ← utilities
│   │   ├── format.js                ← date, number, currency
│   │   ├── nala-prompts.js          ← mock Nala responses
│   │   └── store.js                 ← simple state management
│   │
│   ├── styles/
│   │   ├── tokens.css               ← color, spacing, typography variables
│   │   └── global.css               ← reset + base styles
│   │
│   └── App.jsx                      ← router utama
│
├── docs/                            ← strategi, pitch, planning (NOT served)
│   ├── RENCANA_1_BULAN.md
│   ├── STRATEGI_v2.docx
│   ├── PITCH_DECK.pptx
│   ├── LANDING_COPY.md
│   └── BRAND_GUIDELINE.pdf
│
├── deploy/                          ← infra & deployment
│   ├── nginx-jubirwarga.conf
│   ├── setup-vps.sh
│   ├── jw-deploy.sh                 ← run di VPS untuk pull+sync
│   ├── webhook-listener.py          ← (week 4) auto-deploy from GitHub push
│   └── .github/workflows/deploy.yml
│
├── scripts/                         ← dev utilities
│   ├── build_standalone.py          ← combine ke single-file HTML
│   └── PUSH_TO_GITHUB.bat           ← Windows quick push
│
├── archive/                         ← old single-file versions (untouched, untuk safety)
│   └── Jubir_Warga_v1_archived.html
│
├── index.html                       ← entry dev mode (load script src dari src/)
└── Standalone.html                  ← single-file build output (auto-generated)
```

---

## Week-by-Week Plan

### 🛠️ Minggu 1 — Foundation Refactor + Detail Pages

**Hari 1-2: Restructure folder**
- Buat folder structure di atas
- Pindah file `*.jsx` ke `src/components/` & `src/pages/`
- Pisah mock data ke `src/data/`
- Update path di `index.html` & `Standalone.html`
- Update `build_standalone.py` ikuti struktur baru
- Test lokal: pastikan tidak ada yang broken

**Hari 3-5: Detail pages MISSING (8 pages)**
1. **`ThreadDetail`** — full thread dengan reply tree (4 level deep), vote arrow, "Mention Nala" untuk auto-summarize
2. **`KaryaReadingView`** — long-form artikel reader (max-width 680px, drop cap, pull quote, related)
3. **`KelasDetail`** — silabus 6 modul, mentor info, harga, daftar button
4. **`LessonPlayer`** — video player mock + transcript + quiz tab + diskusi cohort + Coach Nala sidebar
5. **`PetisiDetail`** — hero gradient, body markdown, timeline progres, signatory wall, share toolkit
6. **`JanjiDetail`** — hero pejabat, status panel, timeline, evidence, diskusi
7. **`PasporPublic`** — `/paspor/:userId` shareable view (cover + identitas + stempel + visa)
8. **`NalaChat`** — full chat interface dengan mock conversation

**Hari 6-7: Auth flow mock + Onboarding**
- Login screen (Google OAuth UI mock)
- Register screen
- Onboarding 3-step (sudah ada, polish)

**Output minggu 1:** Struktur rapi + 8 detail page baru. Semua link/button punya destination.

---

### 🎨 Minggu 2 — UI/UX Polish + Mobile-First + PWA

**Hari 8-9: PWA setup**
- `public/manifest.json` (icons, theme color, display: standalone)
- `public/service-worker.js` (cache static assets, offline fallback)
- Install prompt UI ("Tambah ke Home Screen")
- Test installable di Android Chrome + iOS Safari

**Hari 10-11: Mobile responsive audit**
- Test setiap halaman di 375px (iPhone SE), 414px (iPhone 14), 768px (iPad)
- Fix overflow, font size, touch targets
- Bottom nav 5 ikon di mobile (sudah ada, polish)
- Hamburger menu untuk hidden nav

**Hari 12-13: Visual consistency pass**
- Audit warna — pastikan 11 token saja, no random colors
- Audit tipografi — Vollkorn display only, Inter UI only, Caveat anotasi only
- Audit spacing — pakai 4px scale (4, 8, 12, 16, 24, 32, 48, 64)
- Audit ilustrasi SVG — semua hand-drawn, no emoji-as-decoration
- Audit interaksi — hover states, focus states, loading states, empty states

**Hari 14: Loading states + Empty states + Error handling**
- Loading skeleton untuk semua list
- Empty state ilustrasi + copy ramah ("Belum ada yang mulai. Kamu duluan?")
- 404 page kustom dengan ilustrasi
- Generic error boundary

**Output minggu 2:** Web feels like a polished product. Installable di HP.

---

### ⚡ Minggu 3 — Mock Backend + AI Integration + Interaktivitas

**Hari 15-17: Local state management (mock backend)**
- Simple store via React context atau Zustand
- Mock CRUD: post thread, comment, vote, follow chapter, sign petisi, submit lapor
- Simulate API delay (loading state visible)
- LocalStorage untuk persist (user preferences, draft, dll)

**Hari 18-19: AI Nala mock conversation flow**
- 4 mode aktif: Tanya / Coach / Writing / Advocacy
- Pre-canned responses untuk 20 prompts populer
- Streaming animation (text appear word-by-word)
- Save chat history di localStorage
- Suggested follow-up questions

**Hari 20-21: Mini games full**
- Tebak Kata (Wordle) — sudah ada, polish + share scorecard
- Spot the Hoaks — BARU: 5 headline, klik mana hoaks
- Tebak Pasal — BARU: 4 pilihan, tebak pasal yang benar
- Daily challenge logic (rotate kata setiap hari)

**Output minggu 3:** Semua interaktif. Vote, comment, sign, submit, chat — semua works (frontend-only state).

---

### 🚀 Minggu 4 — Testing + Auto-Deploy + Soft Launch

**Hari 22-23: QA & bug fixes**
- Test seluruh flow user (sign-up → onboarding → forum → komunitas → bersuara → claim paspor)
- Cross-browser: Chrome, Firefox, Safari, Edge
- Lighthouse score: target 90+ Performance, Accessibility, Best Practices, SEO
- Fix anything yang gak match brand guideline

**Hari 24-25: Auto-deploy infrastructure**
- GitHub webhook listener di VPS (atau GitHub Actions push to VPS)
- Push to main → auto-deploy in <2 menit
- Slack/WhatsApp notification kalau deploy fail
- Rollback mechanism (`/root/jw-rollback.sh`)

**Hari 26-27: Pre-launch checklist**
- Backup VPS snapshot
- Setup Uptime Robot monitoring
- Setup analytics (Plausible, free tier privacy-friendly)
- SEO basics: og image, meta tags, sitemap.xml, robots.txt
- Privacy policy + Terms of Service draft
- Email setup (info@jubirwarga.id)

**Hari 28-30: Soft Launch Beta**
- Day 28: invite alumni Jubir Warga 2024 closed test (50 orang via WA)
- Day 29: collect feedback, fix critical issues
- Day 30: public soft launch — IG announcement, Twitter post, newsletter
  - Post: "Jubir Warga 2.0 BETA sudah live. Coba sekarang di jubir.spdindonesia.org"
  - DM ke 30 mitra & jurnalis

**Output minggu 4:** Live beta publik dengan ratusan user pertama, feedback channel aktif.

---

## Mobile App Infrastructure

**Tahap 1 (di-include dalam 1 bulan ini):**
- **PWA** (Progressive Web App)
- Installable di Android & iOS via "Add to Home Screen"
- Standalone mode (no browser chrome)
- Offline support untuk konten yang sudah di-load
- Push notification ready (butuh backend Phase 2 untuk send)
- App-like splash screen
- Cost: Rp 0 (built into web)

**Tahap 2 (Bulan 2-3, post-funding):**
- **React Native + Expo** native app
- Reuse 70% React component code
- iOS App Store + Google Play submission
- Kompleksitas:
  - Navigation: React Navigation
  - State: shared dengan web (Zustand/Redux)
  - Storage: AsyncStorage
  - Push: Expo Push Notifications
  - Build: EAS Build (free tier)
- Estimasi: 8-12 minggu development + 2-4 minggu review
- Cost: ~Rp 50K (dev license iOS + Android)

**Tahap 3 (Tahun 2):**
- App fully native features (camera, biometrik, deep linking, dll)
- Backend dedicated mobile endpoint
- Optimasi performa native

---

## Tech Stack Decisions (final untuk 1 bulan)

| Layer | Sekarang (beta) | Bulan 2-3 (production) |
|---|---|---|
| **Framework** | React + Babel CDN (multi-file) | Next.js 14 App Router |
| **Styling** | Tailwind CDN | Tailwind compiled + shadcn/ui |
| **State** | React state + localStorage | Zustand + Supabase realtime |
| **Backend** | Mock data (jsx files) | Supabase (Postgres + Auth + Storage + RLS) |
| **AI** | Mock canned responses | Claude API + Pinecone RAG |
| **Auth** | Mock login (no real backend) | Supabase Auth (Email + Google + WhatsApp OTP) |
| **Hosting** | Nginx static (VPS Hostinger) | Vercel atau Coolify-on-VPS |
| **CDN/Cache** | Nginx + browser cache | + Cloudflare CDN |
| **Mobile** | PWA (installable) | + React Native via Expo |
| **Analytics** | Plausible (privacy-friendly) | + PostHog (product analytics) |
| **Deploy** | git pull + manual reload | GitHub Actions auto-deploy |
| **Monitoring** | Uptime Robot | + Sentry error tracking |

---

## Risk Mitigation

| Risiko | Probabilitas | Mitigasi |
|---|---|---|
| Bug di production saat soft launch | Tinggi | Closed beta minggu 4 hari 28 dengan alumni dulu |
| User churn pertama (UI kurang) | Sedang | Mobile-first audit minggu 2 |
| AI Nala respons gak bagus | Sedang | Pre-canned dulu, integrasi Claude API bulan 2 |
| Server overload kalau viral | Rendah | Cloudflare CDN free tier + Nginx cache |
| Skill gap (1 dev tunggal) | Tinggi | Recruit junior dev kontrak minggu 3-4 |

---

## Success Metrics (akhir 1 bulan)

| Metrik | Target |
|---|---|
| Halaman live & functional | 17 (9 utama + 8 detail) |
| Lighthouse Performance | ≥90 |
| Lighthouse Accessibility | ≥95 |
| Mobile responsive | 100% (375px-1920px) |
| PWA installable | ✓ Android + iOS |
| User beta pertama | 50 (closed) → 500 (soft launch) |
| Bug critical | 0 |
| Auto-deploy uptime | 99%+ |

---

## Daily Standup Template (untuk solo dev)

Setiap hari, 15 menit:
```
Kemarin selesai: [...]
Hari ini target: [...]
Blocker: [...]
Need help on: [...]
```
Tulis di notes pribadi atau Discord channel #standup.

---

## Setelah Beta Launch (Bulan 2 onwards)

- Migrate ke Next.js (component-by-component)
- Setup Supabase backend
- Connect Claude API real
- Onboard tim full-time (post-funding)
- React Native mobile app
- Expand chapter regional
- Tagih Janji 5 → 34 provinsi
- Pemilu 2029 prep tools
