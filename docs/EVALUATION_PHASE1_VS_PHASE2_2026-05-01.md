# Evaluation Report — Phase 1 vs Phase 2 + Gap Analysis Super Web/App

**Tanggal:** 2026-05-01
**Auditor:** planner (Claude Cowork)
**Method:** side-by-side capture Phase 1 (jubir.spdindonesia.org live) vs Phase 2 (localhost:3000) + cross-check vision super web/super app dari CLAUDE.md + HANDOVER.md + BACKLOG.md
**Sprint context:** Sprint 3 jalan 4/10 spec (#6 typegen + #6.5 test + #7 Komunitas + #8 Karya done)

---

## A. Executive summary

Phase 2 sekarang **70% feature-parity Beranda + 80% feature-parity Komunitas Index + 70% feature-parity Karya** (3 page port done), tapi kalau dihitung holistic terhadap full Phase 1 vision, **baru ~30% scope** yang dipindahkan. Plus aku temukan ada **8-10 fitur kritis** di Phase 1 yang **belum masuk plan Sprint 3-4 sama sekali** — perlu masuk audit pre-beta.

**Skor coverage per area:**

| Area | Phase 1 Live | Phase 2 Local | Gap |
|---|---|---|---|
| Beranda | 100% | 70% | 30% (game widget, leaderboard, Tanya Nala strip integration) |
| Komunitas | 100% | 50% | 50% (4 sub-tab missing, trending sidebar, aturan, bookmark/share) |
| Karya | 100% | 70% | 30% (Follow per kreator, type icon di cover, reactions) |
| Kelas | 100% | 0% | 100% |
| Aksi | 100% | 0% | 100% |
| Tagih Janji | 100% | 0% | 100% |
| Main games | 100% | 0% | 100% |
| Profil/KTP Warga | 100% | 0% | 100% |
| Notif + Onboarding | 100% | 0% | 100% |

---

## B. Per-page comparison detail

### B1. Beranda

| Element | Phase 1 ✅ | Phase 2 ✅ | Gap |
|---|---|---|---|
| Hero topic harian | ✅ "Hari ini, kita ngomongin Pasal 28E" | ✅ identik | — |
| Hero illustration (orang baca dokumen) | ✅ | ✅ | — |
| Hero annotation Caveat | ✅ "← baca!" + "kamu juga bisa" | ✅ identik | — |
| Section **Game Hari Ini** (Tebak Kata + tile grid) | ✅ inline di Beranda | ❌ | **MISSING** — embed game widget |
| Section **Top 3 hari ini** leaderboard | ✅ dengan rank 🥇🥈🥉 + score | ❌ | **MISSING** |
| 3-column section: Forum + Karya + Aksi preview | ✅ | ⚠️ partial (cuma ThreadList + PetisiPreview + JanjiTracker, gak ada KaryaList preview) | **PORT KaryaList preview ke Beranda** |
| Tanya Nala strip (mascot + headline italic) | ✅ "Beo curhatmu — dengar kabar, ngasih tahu" | ⚠️ ada `NalaTriggerButton` floating, tapi gak ada strip section di main flow | **PORT strip section** |
| Footer | ✅ | ✅ basic | — |
| Floating "Baru di sini? Mulai onboarding" | ✅ kiri-bawah | ❌ | **MISSING — onboarding flow** |

### B2. Komunitas

| Element | Phase 1 ✅ | Phase 2 ✅ | Gap |
|---|---|---|---|
| Hero header + count thread | ✅ | ✅ "225 thread" | — |
| "+ Mulai Diskusi Baru" CTA | ✅ | ⚠️ ada tapi link `/komunitas/baru` 404 (Spec #7c defer) | **DESIGN later, OK now** |
| Sidebar Topik filter | ✅ | ✅ identik | — |
| Sidebar Lokasi filter | ✅ | ✅ identik | — |
| Sidebar Format filter | ✅ | ✅ identik | — |
| **Sub-tab Forum / Chapter Regional / Sub-komunitas / Event / Direktori Mitra** | ✅ 5 tab | ❌ cuma Forum default | **MISSING — 4 sub-tab** |
| Vote arrows + score | ✅ | ✅ | — |
| **"Ramai" pill di hot thread** | ✅ | ❌ | **MISSING — hot indicator** |
| Bookmark + Bagikan per thread | ✅ | ❌ | **MISSING** |
| **Trending Hari Ini sidebar** (top 3 right) | ✅ | ❌ | **MISSING** |
| **Aturan Komunitas sidebar** | ✅ | ❌ | **MISSING — penting buat moderation cue** |
| Floating compose `+` button (bottom-right) | ✅ | ❌ | **MISSING** |
| Sub-komunitas section | ✅ 3 card | ✅ identik | — |
| Chapter regional section | ✅ | ✅ identik | — |
| ThreadDetail dengan reply tree | ✅ | ✅ | — |
| **Bookmark/Share di ThreadDetail** | ✅ | ❌ | **MISSING** |

### B3. Karya

| Element | Phase 1 ✅ | Phase 2 ✅ | Gap |
|---|---|---|---|
| Hero + kicker Caveat | ✅ | ✅ | — |
| "Upload Karya Kamu" CTA | ✅ active | ⚠️ disabled (per Mas decision Sprint 4) | OK |
| Tab nav 6 (Semua + 5 type) | ✅ | ✅ identik | — |
| **Pilihan Editor 5 cards horizontal scroll** | ✅ | ✅ identik | — |
| **Type icon di cover card** (📄/▶️/🎨/🎙️/📖) | ✅ emoji | ❌ Phase 2 pakai colored placeholder | **REPLACE emoji dengan Lucide icon proper** |
| Grid karya regular | ✅ | ✅ | — |
| Sidebar **"Kreator lagi naik" dengan Follow button** | ✅ | ⚠️ ada TopKreator tapi tanpa Follow button | **MISSING — Follow system** |
| ReadingView Tulisan dengan typography proper | ✅ | ✅ | — |
| **Reactions (like/save/share) di ReadingView** | ✅ | ❌ | **MISSING** |

### B4. Kelas (BELUM di Phase 2)

Phase 1 punya:
- Hero KELAS UNGGULAN biru full-width dengan italic title "Kelas Jubir Warga: dari Resah, ke Suara, ke Aksi"
- Info modul: 6 minggu / 6 modul / Sertifikat / 6 mentor / Rp 350.000
- Dual CTA "Daftar Gelombang Berikutnya" + "Lihat Silabus"
- Note: "* Atau gratis dengan aplikasi beasiswa"

🚨 **Bug content Phase 1**: subtitle "Belajar civic & ekspresi yang nyata-nyata kepake." — kata **"civic"** dilarang per CLAUDE.md! Saat port ke Phase 2, ganti dengan "Belajar dari sesama, eksekusi yang nyata-nyata kepake" atau sejenisnya.

### B5. Aksi (BELUM di Phase 2)

Phase 1 punya:
- Hero "Aksi - Bukan cuma ngomong, kita kerjain"
- Polling Hari Ini dengan icon per option (🚌🛒🎓 — emoji decor, LANGGAR CLAUDE.md anti-pattern saat port)
- Petisi list (di-scroll lebih lanjut)

### B6. Tagih Janji (BELUM di Phase 2)

Phase 1 paling kaya:
- Pilar tag Caveat coral
- Hero "Tagih Janji Pemerintah" + italic Vollkorn
- Subtitle 3-clause poetic
- Illustration orang + checklist
- Dual CTA "Lihat semua janji" + "+ Submit janji baru"
- 4 stat cards: 12 janji terlacak / 17% ditepati / 33% berjalan / 42% mandek-diingkari
- (Di-scroll: peta Indonesia 5 provinsi + dashboard partai)

### B7. Main games (BELUM di Phase 2)

Phase 1:
- Hero "Main" + streak "5 hari berturut-turut"
- "Game Hari Ini" Citizen Wordle dengan blue card header + tile grid 5x6

🚨 **Bug content Phase 1**: "**Citizen Wordle**" + "Kata civic 5 huruf" — DUA pelanggaran: "civic" + naming "Citizen". Saat port, ganti jadi **"Tebak Kata Hari Ini"** + "Kata warga 5 huruf" (sudah di-spec planner).

### B8. Profil / KTP Warga (BELUM di Phase 2)

Phase 1:
- "Paspor Warga Digital" header + "Bagikan paspor" CTA
- 4 tab: Cover / Identitas / Stempel / Visa
- Cover view: card biru paspor design dengan logo "JW", nomor JW-2026-0001, tagline "Suara warga, rumahnya disini"

(Di-scroll: kemungkinan ada Identitas tab dengan profile data, Stempel tab dengan badge collection, Visa tab dengan kontribusi history)

### B9. Notifikasi + Onboarding (BELUM di Phase 2)

Phase 1:
- Bell icon di header dengan dot indikator (notif baru)
- "Baru di sini? Mulai onboarding" floating button kiri-bawah Beranda

---

## C. Hal-hal kritis YANG TERLEWATKAN dari roadmap (perlu masuk Sprint 3-5)

### C1. Tier 1 — wajib pre-beta (BACKLOG belum cover)

1. **Notification system** — bell icon header + dropdown drawer + per-event triggers (someone replied your thread, your petisi reached threshold, your janji follow updated, etc.)
   - **Kompleksitas**: Medium (DB table `notifications` + Realtime subscription + UI drawer)
   - **Saran**: Spec baru di Sprint 4

2. **Onboarding flow** — wizard 3-5 step untuk user baru: pick chapter, pick topik interest, intro Nala, claim KTP Warga, suggest first action
   - **Kompleksitas**: Medium (multi-step form + state machine)
   - **Saran**: Spec baru di Sprint 4 — paling kritis untuk retention beta

3. **Lapor Warga page** — `/lapor` untuk submit laporan pelayanan publik (jalan rusak, banjir, sampah, dll). Ada di queries.ts (`listLaporan`, `submitLaporan`) tapi belum ada page sama sekali di Phase 2 maupun Phase 1.
   - **Kompleksitas**: Medium (form + image upload + map + category)
   - **Saran**: Sprint 4 — gabung dengan Aksi page atau standalone

4. **Profile public page** — `/profil/[username]` selain own profile. Untuk lihat kreator lain, follow, lihat karya/thread mereka.
   - **Kompleksitas**: Medium
   - **Saran**: Sprint 4

5. **Search global** — search bar di header untuk thread/karya/janji/pejabat
   - **Kompleksitas**: High (Postgres full-text search atau Algolia)
   - **Saran**: Sprint 4 minimum (basic Postgres ts_vector)

### C2. Tier 2 — important untuk feature parity (port Phase 1)

6. **Komunitas sub-tabs** — Chapter Regional / Sub-komunitas detail / Event / Direktori Mitra
   - 4 page baru
   - **Saran**: split jadi mini-spec di Sprint 3 (kalau ada bandwidth) atau Sprint 4

7. **Trending Hari Ini + Aturan Komunitas sidebar** di Komunitas
   - Tinggal tambah 2 component di Komunitas Index
   - **Saran**: include di patch Spec #7

8. **Bookmark + Share** per thread/karya/petisi
   - DB table `bookmarks` + share intent (Web Share API)
   - **Saran**: Sprint 4 cross-cutting feature

9. **Hot/Ramai indicator** — algoritma sederhana (vote velocity) untuk highlight thread aktif
   - **Saran**: Sprint 4 — atau Sprint 5 polish

10. **Floating compose `+` button** — quick action di bottom-right untuk compose thread/karya cepat
    - **Saran**: Sprint 4

### C3. Tier 3 — Super App (mobile native readiness)

11. **Push Notification (PWA + future React Native)** — vital untuk re-engagement
    - PWA: VAPID + service worker push event
    - RN: FCM + APNS
    - **Saran**: Sprint 5 (PWA), Sprint 6+ (RN)

12. **Offline mode** — service worker cache strategi (Phase 1 PWA basic, perlu strategi proper untuk Phase 2)
    - Read-only offline (cached threads/karya)
    - Queue write (vote/reply offline → sync online)
    - **Saran**: Sprint 5

13. **Camera integration** — untuk submit Lapor Warga (foto langsung dari HP)
    - PWA: getUserMedia + canvas
    - RN: Expo Camera
    - **Saran**: bareng dengan Lapor Warga spec

14. **Share intent** — Web Share API untuk share karya/petisi ke WA/IG dari OS native
    - **Saran**: Sprint 4 quick win

15. **Deep link routing** — `https://jubirwarga.id/petisi/abc` → buka langsung di-app
    - PWA universal links
    - RN deep linking schema
    - **Saran**: Sprint 5

16. **Bottom tab bar untuk mobile** — saat ini Phase 2 pakai header nav (desktop pattern). Mobile UX butuh bottom tab bar (Beranda/Komunitas/+/Notif/Profil)
    - **Saran**: Sprint 4 atau Spec #15 polish

17. **Pull-to-refresh** + **swipe gestures** — native pattern
    - PWA bisa pakai library (PullToRefresh.js) atau custom
    - **Saran**: Sprint 5

18. **Background sync** — submit thread/karya/petisi sign saat offline → sync saat online
    - **Saran**: Sprint 5

19. **Biometric auth** (FaceID/TouchID) untuk login cepat
    - PWA: WebAuthn
    - RN: react-native-biometrics
    - **Saran**: Sprint 6+

20. **Geolocation auto-detect chapter** — saat user daftar, deteksi lokasi → suggest chapter terdekat
    - **Saran**: Sprint 5

### C4. Tier 4 — Operational (ada di audit doc tapi belum implementasi)

21. **Sentry + UptimeRobot + Plausible** — sudah di audit Tier 1 OPS, belum execute
22. **Email verification flow** — Supabase punya built-in tapi UX-nya generic
23. **Password reset flow** — sama
24. **Account deletion + data export** — UU PDP compliance
25. **Two-factor auth (2FA)** — security upgrade
26. **Admin moderation panel** — flag/hapus konten, ban user (Sprint 5+)
27. **Help/FAQ section** — `/bantuan` page
28. **Privacy Policy + Terms of Service** — legal pre-launch wajib

---

## D. Anti-pattern violations Phase 1 yang harus DI-FIX saat port

CLAUDE.md "anti-pattern (zero tolerance)" rule — Phase 1 ada beberapa pelanggaran yang **JANGAN di-port apa adanya** ke Phase 2:

1. ❌ **"civic"** muncul di:
   - Kelas subtitle: "Belajar civic & ekspresi yang nyata-nyata kepake" → ganti "Belajar dari sesama, eksekusi yang nyata-nyata kepake"
   - Main games: "Citizen Wordle" + "Kata civic 5 huruf" → ganti "Tebak Kata Hari Ini" + "Kata warga 5 huruf" (sudah di-spec planner)

2. ❌ **Emoji dekorasi UI** banyak di Phase 1:
   - Beranda: "📊 Polling Hari Ini", "🏆 Top 3 hari ini", "🥇🥈🥉" rank
   - Aksi: "🚌 Transportasi", "🛒 Subsidi pangan", "🎓 Beasiswa" sebagai pilihan polling
   - Main: "🔥 5 hari berturut-turut", "🎮 Game Hari Ini"
   - Karya: "📤 Upload Karya Kamu", "⭐ Pilihan Editor"
   - Kelas: "👤 mentor", "💰 harga"

   → Saat port ke Phase 2, ganti SEMUA dengan Lucide icon proper. Yang sudah jalan: NalaPanel pakai Sparkles + ChevronUp/Down + MessageCircle proper. Karya port juga sudah pakai placeholder colored bg (bukan emoji).

3. ❌ **Kotak warna placeholder** untuk illustration di card cover Karya — perlu real SVG illustration atau gradient brand-aligned (Phase 2 sudah ada `EmptyKarya` dll, dan karya cover saat ini pakai colored placeholder yang OK as interim)

4. ❌ **Naming "Citizen"** — Phase 1 pakai "Citizen Wordle". CLAUDE.md decision: nama brand "Tebak Kata Hari Ini" (sudah dilanjut planner di Spec #5/Spec #13 plan).

---

## E. Verdict & rekomendasi konkret

**Verdict honest:**
Project on track untuk Sprint 3 page port (kalau Spec #9-12 selesai sesuai plan), tapi **vision "super web + super app" baru ~30% terdekripsi**. Banyak fitur infrastruktural (notif, onboarding, search, lapor warga) belum masuk plan sama sekali — risiko gap saat user masuk beta dan minta fitur basic yang mereka harapkan dari modern app (notif, search, share).

**Rekomendasi konkret untuk update planning:**

1. **Update `specs/SPRINT-3/00-overview.md`** — tambah catatan bahwa Sprint 3 fokus parity dasar Phase 1, **bukan** super app feature complete
2. **Bikin `specs/SPRINT-4/00-overview.md`** — outline 8-12 spec untuk Sprint 4 dengan focus:
   - Notification system (DB + Realtime + UI drawer)
   - Onboarding wizard
   - Lapor Warga page
   - Profile public + Follow system
   - Search global
   - Bookmark + Share intent
   - Komunitas 4 sub-tab missing
3. **Bikin `specs/SPRINT-5/00-overview.md`** — outline mobile-first features:
   - PWA push notification + offline mode + bottom tab bar
   - Camera + geolocation untuk Lapor Warga
   - Deep linking
   - Real Claude API integration Nala (defer dari Sprint 3)
   - Realtime subscriptions
4. **Update `docs/AUDIT_PRE_BETA_2026-05-01.md`** — tambah Tier 1 item baru:
   - "Onboarding flow" — wajib pre-beta (kalau gak ada, bouncerate tinggi)
   - "Notification system minimum" — wajib pre-beta (engagement loop)
5. **Cleanup anti-pattern saat port** — setiap spec page port (Spec #9-12) wajib include section "Anti-pattern audit" dari Phase 1 yang harus di-fix:
   - Replace emoji dengan Lucide icon
   - Replace "civic"/"Citizen" dengan brand-faithful copy

---

## F. 1 hal yang aku paling concerned (planner perspective)

**Onboarding flow gap.** Sekarang user landing di Phase 2 langsung masuk ke Beranda — gak ada wizard yang teach: "ini Jubir Warga, ini Nala, ini chapter regional, ini cara kontribusi". Tanpa onboarding, beta tester bingung pertama kali, drop-off tinggi.

Phase 1 ada button "Baru di sini? Mulai onboarding" floating, tapi aku belum cek implementasinya — perlu reverse-engineer Phase 1 onboarding flow + port + polish.

**Saran konkret:** sebelum lanjut ke Spec #11 (Tagih), aku tulis **Spec #X Onboarding Flow** sebagai mini-spec (~2-3 jam Claude Code). Itu akan di-trigger saat user pertama kali login + bisa skip. Cover: chapter pick, topik interest, intro Nala, claim KTP Warga.

---

## G. Sign-off + revision

| Milestone | Date | Action |
|---|---|---|
| Doc created | 2026-05-01 | Initial evaluation, Sprint 3 4/10 done |
| Sprint 3 mid-point | ~2026-05-08 | Re-evaluate gap, mark progress |
| Sprint 3 close | ~2026-05-15 | Final coverage assessment |
| Pre-beta gate | ~2026-06-01 | Sign-off per Tier 1 item |
| Post-beta retro | Juli 2026 | Lesson learned, update Sprint 4/5 plan |

---

_Document version: 1.0_
_Last updated: 2026-05-01 by planner_
_Next review: Sprint 3 mid-point_
