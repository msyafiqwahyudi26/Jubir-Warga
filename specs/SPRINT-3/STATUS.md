# Sprint 3 — Status

**Started**: 2026-05-01
**Target completion**: 2026-05-15
**Plan**: `specs/SPRINT-3/00-overview.md`

## Spec progress

| Spec | Title | Status | Commit |
|---|---|---|---|
| #6 | Supabase typegen untuk views | 📋 Spec written, ready untuk Claude Code | — |
| #7 | Komunitas page (Index + ThreadDetail) | ⏳ Blocked — 3 decisions Mas pending | — |
| #8 | Karya page (Index + ReadingView) | 📋 Listed di overview, spec belum ditulis | — |
| #9 | Kelas page (Index + LessonPlayer) | 📋 Listed | — |
| #10 | Aksi page (Index + PetisiDetail + PollingDetail) | 📋 Listed | — |
| #11 | Tagih page (Index + JanjiDetail) | 📋 Listed | — |
| #12 | Profil + KTP Warga (PasporPublic) | 📋 Listed | — |
| #13 | Main games (Tebak Kata + game #2) | 📋 Listed (game #2 TBD: saran Tebak Pejabat) | — |
| #14 | Brand consistency cleanup PPTX/DOCX | 📋 Listed | — |
| #15 | Polish + audit (mock 8 baru, mode selector Nala, react-markdown) | 📋 Listed | — |

## Blockers aktif

**Untuk Spec #7 Komunitas (block spec writing):**
1. Server vs Client Component split (rekomendasi: Server fetch + nested Client)
2. Vote auth requirement (rekomendasi: login required)
3. Sub-komunitas data source (rekomendasi: hard-code constant Sprint 3, DB Sprint 5)

Mas approve via reply singkat di chat planner ("approve semua" atau "1 setuju, 2 anonymous, 3 setuju").

## Carry-over operasional (non-blocking)

- Twilio Verify untuk WhatsApp OTP — Mas belum setup
- Google OAuth client di Google Cloud Console — Mas belum setup
- Domain `jubirwarga.id` — pending decision

## Notes

- Data layer `@jw/data` udah lengkap (Sprint 1-2). Spec #7-12 cuma consume hooks, tidak re-build queries.
- Pre-existing typecheck errors di `beranda/petisi-preview.tsx` akan auto-resolve setelah Spec #6 selesai.

---

_Last updated: 2026-05-01 by planner._
