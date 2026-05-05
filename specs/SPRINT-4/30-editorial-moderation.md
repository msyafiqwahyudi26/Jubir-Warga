# Spec #30 — Editorial Moderation System (Verification Badge)

**Sprint**: 4
**Owner**: Claude Code (Window E)
**Estimasi**: 1 minggu
**Priority**: P0 (anti-defamation + trust signal)
**Dependency**: #25 + #29 (provides content yang perlu di-moderate)
**Source**: `docs/STRATEGY_PIVOT_2026-05-04.md` Section 5 Risk 1

---

## Goal

Build editorial moderation dashboard untuk admin role yang:
- Review **pending** content sebelum publish (janji_terstruktur, alignment_verdict, lapor_warga)
- Action: approve / modify / reject / flag
- Tag setiap published content dengan verification badge:
  - ✅ **Terverifikasi Kurator** — manual editorial review
  - 🤖 **Kurasi AI** — auto-generated dari pipeline, masih displayed
- Audit trail per review action

---

## Required reading

1. `docs/STRATEGY_PIVOT_2026-05-04.md` Section 5
2. `specs/SPRINT-4/00-overview.md` — schema `editorial_review` table
3. `specs/SPRINT-4/29-live-watch-ai.md` — produces `alignment_verdict` pending
4. `CLAUDE.md` §8 (security — admin role)

---

## File yang dibuat

```
apps/web/src/app/admin/
├── layout.tsx                       Admin role check + nav
├── page.tsx                         Dashboard overview
├── verdicts/page.tsx                Review alignment_verdict pending
├── verdicts/[id]/page.tsx           Single verdict detail + edit form
├── janji/page.tsx                   Review janji_terstruktur pending
├── lapor/page.tsx                   Review lapor warga submissions
└── audit-log/page.tsx               Review history (audit trail)

apps/web/src/lib/admin/
├── role-check.ts                    Server-side admin role guard
├── moderation-actions.ts            Server actions: approve/modify/reject
└── audit-logger.ts                  Insert ke editorial_review table

apps/web/src/components/admin/
├── verdict-review-card.tsx          Single pending verdict UI
├── badge-verification.tsx           "Terverifikasi Kurator" / "Kurasi AI" badge
└── moderation-toolbar.tsx           Action buttons (approve/modify/reject)

supabase/migrations/
└── 0005_admin_role.sql              Admin role flag di profiles + RLS update
```

---

## Step-by-step

### 1. Admin role schema

```sql
-- supabase/migrations/0005_admin_role.sql
alter table public.profiles add column if not exists is_admin boolean default false;

-- RLS policy: admin can read all pending content
create policy "admins_read_pending_verdicts" on public.alignment_verdict
  for select using (
    editorial_status = 'pending' and
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- admin can update editorial status
create policy "admins_moderate_verdicts" on public.alignment_verdict
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- editorial_review log: admin only
create policy "admins_write_review_log" on public.editorial_review
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
```

### 2. Admin layout dengan role guard

```tsx
// apps/web/src/app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/masuk?redirect=/admin');
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  
  if (!profile?.is_admin) {
    return <UnauthorizedPage />;
  }
  
  return (
    <div className="admin-shell">
      <AdminNav />
      <main>{children}</main>
    </div>
  );
}
```

### 3. Verdict review page

```tsx
// apps/web/src/app/admin/verdicts/page.tsx
export default async function VerdictsReviewPage() {
  const supabase = await createClient();
  const { data: pending } = await supabase
    .from('alignment_verdict')
    .select(`
      *, media_quote(*, pejabat(*)), 
      matched_visi_misi(*), matched_rpjmn_target(*)
    `)
    .eq('editorial_status', 'pending')
    .order('created_at', { ascending: true });
  
  return (
    <div>
      <h1>Pending Verdicts ({pending?.length ?? 0})</h1>
      <ul className="space-y-4">
        {pending?.map((v) => (
          <VerdictReviewCard key={v.id} verdict={v} />
        ))}
      </ul>
    </div>
  );
}
```

### 4. Server actions: approve / modify / reject

```ts
// apps/web/src/lib/admin/moderation-actions.ts
'use server';

export async function approveVerdict(verdictId: string, finalReasoning?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // verify admin
  if (!await isAdmin(user.id)) throw new Error('Unauthorized');
  
  // update verdict status + final_reasoning
  await supabase.from('alignment_verdict').update({
    editorial_status: 'approved',
    editorial_reviewer_id: user.id,
    final_verdict: finalReasoning ? null : undefined,  // keep AI verdict if no override
    final_reasoning: finalReasoning ?? undefined,
    published_at: new Date().toISOString(),
  }).eq('id', verdictId);
  
  // audit log
  await supabase.from('editorial_review').insert({
    reviewer_id: user.id,
    target_type: 'verdict',
    target_id: verdictId,
    action: 'approve',
    notes: finalReasoning ? 'Modified reasoning' : 'Approved as-is',
  });
  
  revalidatePath('/admin/verdicts');
  revalidatePath('/live-watch');
}

export async function rejectVerdict(verdictId: string, reason: string) {
  // similar pattern
}

export async function modifyVerdict(verdictId: string, newVerdict: string, newReasoning: string) {
  // similar pattern, update both verdict + reasoning
}
```

### 5. Verification badge component

```tsx
// apps/web/src/components/admin/badge-verification.tsx
export function VerificationBadge({ status }: { status: 'verified_curator' | 'curated_ai' }) {
  if (status === 'verified_curator') {
    return (
      <span className="badge-verified" title="Reviewed by editorial team">
        ✅ Terverifikasi Kurator
      </span>
    );
  }
  return (
    <span className="badge-ai" title="AI-curated, displayed transparently">
      🤖 Kurasi AI
    </span>
  );
}
```

### 6. Wire badge ke public-facing components

Update Live Watch verdict card, Tagih dashboard, Janji vs Realita reveal — semua tampil verification badge per content piece. Spec #29 + #24 + #28 sudah include placeholder, Window E pastiin component badge consistent.

---

## Acceptance checklist

- [ ] Migration 0005 admin_role applied
- [ ] `/admin` accessible only by `is_admin = true` profiles (others redirect)
- [ ] Verdict review page list pending verdicts dengan full context
- [ ] Approve / modify / reject buttons working dengan server actions
- [ ] Audit trail di `editorial_review` table populated per action
- [ ] Verification badge component reusable (Terverifikasi Kurator / Kurasi AI)
- [ ] Badge tampil di Live Watch verdict card, Tagih dashboard, Game reveal
- [ ] Empty state kalau no pending content
- [ ] Mobile responsive admin (mostly desktop, tapi tetap usable)
- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm test` pass

---

## Out of scope (defer)

- ❌ Multi-tier reviewer roles (Sprint 5)
- ❌ Reviewer SLA / queue timer (Sprint 5)
- ❌ Email notification baru pending (Sprint 5)
- ❌ Bulk approve UI (Sprint 5)
- ❌ Right-of-reply pejabat workflow (Sprint 5+)

---

## Coordinate paralel — Window E territory

✅ Aman: `apps/web/src/app/admin/**`, `apps/web/src/lib/admin/**`, `apps/web/src/components/admin/**`, `supabase/migrations/0005_*.sql`
❌ JANGAN edit: scraping pipeline (Window B), Live Watch UI (Window D)

---

## Commit message

```
feat(admin): editorial moderation system + verification badge

- Migration 0005: profiles.is_admin flag + RLS policies
- /admin/* admin-only pages (role guard via layout)
- Verdict review: approve/modify/reject dengan audit trail
- Janji review + Lapor warga review pages
- VerificationBadge component (Terverifikasi Kurator / Kurasi AI)
- Editorial review log (audit trail) di editorial_review table

Per Spec #30 — anti-defamation + trust signal layer.
```
