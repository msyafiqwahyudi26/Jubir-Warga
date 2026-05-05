# Sprint 4 — Status

**Started**: 2026-05-05
**Target launch**: 2026-06-02 (4 minggu reduced scope)
**Plan**: `specs/SPRINT-4/SCOPE-REDUCED-2026-05-05.md` (supersedes 00-overview.md)

## Spec progress

| Spec | Title | Window | Status | Commit |
|---|---|---|---|---|
| #34 | Migration 0004 LIGHT + Editorial admin skeleton | A | 🟡 SCAFFOLD READY 2026-05-05 — migration file written + admin scaffold (lib/admin types/role-check/moderation-actions/audit-logger, components/admin badge-verification + janji-edit-form, app/admin layout + dashboard + janji list/edit + audit-log). Apply migration + types regen pending Mas (no DB password locally). 240/240 test pass, typecheck 0, lint 0 new in admin scope. | TBD (apply) |
| #24-light | Tagih Dashboard light v2 | B | 📋 In progress | — |
| #28-light | Janji vs Realita game v1 | C | ✅ DONE | 6ba5b3f |
| #32+#33 | Beranda redesign + Brand copy combined | D | 📋 In progress | — |
| #38 | Self-host VPS setup + Deploy activation | E | ✅ DONE | 3fb7d54 |

## Sprint 4 Spec #34 — Apply migration runbook

Migration file: `supabase/migrations/0004_alignment_schema_light.sql` (idempotent — uses `if not exists` for columns + DO blocks for policies).

**Apply via Supabase Studio**:
1. Buka https://supabase.com/dashboard/project/ifrautpvbhdbhieystxk/sql
2. New query → paste contents `supabase/migrations/0004_alignment_schema_light.sql`
3. Run → expect 0 errors. Idempotent — aman re-run.
4. Verify (paste di SQL editor):

```sql
SELECT column_name FROM information_schema.columns
 WHERE table_schema='public' AND table_name='janji'
   AND (column_name LIKE 'alignment%'
        OR column_name LIKE 'editorial%'
        OR column_name LIKE 'source_doc%')
 ORDER BY column_name;
-- Expected 7 rows: alignment_reasoning, alignment_status, editorial_reviewed_at,
--                  editorial_reviewer_id, editorial_status, source_doc_page,
--                  source_doc_url
```

```sql
SELECT count(*) FROM public.editorial_review;
-- Expected: 0 (table baru, kosong)
```

5. Setelah migration applied, regenerate Database types:
   ```bash
   pnpm data:typegen
   # atau langsung CLI: supabase gen types typescript --project-id ifrautpvbhdbhieystxk > packages/data/src/database.types.ts
   ```

6. Migration sudah include admin seed untuk `admin@spdindonesia.org`. Verify:
   ```sql
   SELECT p.id, p.is_admin, u.email
     FROM public.profiles p JOIN auth.users u ON u.id = p.id
    WHERE u.email = 'admin@spdindonesia.org';
   -- Expected: 1 row dengan is_admin = true
   ```
   Kalau email beda, set manual:
   ```sql
   UPDATE public.profiles SET is_admin = true WHERE id = (
     SELECT id FROM auth.users WHERE email = '<email Mas>'
   );
   ```

7. Test /admin route — login sebagai Mas, navigate ke `/admin` → harus render dashboard.

**Audit checklist Spec #34**:
- [x] Migration 0004 LIGHT file written (idempotent, no destructive)
- [x] /admin/* role-guarded via layout.tsx → requireAdmin() redirect
- [x] /admin/janji list dengan filter editorial_status URL-based
- [x] /admin/janji/[id] edit form set alignment_status + reasoning + verification badge
- [x] Server action approve/modify/reject log ke editorial_review (Zod-validated)
- [x] VerificationBadge component reusable (Lucide icons, 3 status)
- [x] /admin/audit-log riwayat moderation actions
- [x] typecheck 0 error, lint 0 new di admin scope, 240/240 test pass
- [x] Admin seed (`admin@spdindonesia.org` → is_admin=true) embedded di migration — idempotent
- [ ] Migration applied ke production (pending Mas, runbook di atas)
- [ ] Database types regenerated post-apply (pending Mas)

## File ownership respected (Spec #34 Window A)

✅ Edited (in scope):
- `supabase/migrations/0004_alignment_schema_light.sql` (BARU)
- `apps/web/src/app/admin/{layout,page,janji/page,janji/[id]/page,audit-log/page}.tsx` (BARU)
- `apps/web/src/lib/admin/{types,role-check,moderation-actions,audit-logger}.ts` (BARU)
- `apps/web/src/components/admin/{badge-verification,janji-edit-form}.tsx` (BARU)

❌ NOT edited (other windows):
- `apps/web/src/app/tagih/**` (Window B)
- `apps/web/src/app/main/**` (Window C)
- `apps/web/src/app/page.tsx, layout.tsx, tentang/, privasi/, etika/, (auth)/` (Window D)
- `apps/web/src/components/{site-footer, beranda/**, nala/**}` (Window D)
- `apps/web/public/manifest.json` (Window D)
- `deploy/**` (Window E)

---

_Last updated: 2026-05-05 by Claude Code Window A (Spec #34 scaffold landed; apply pending Mas)._
