/**
 * Editorial audit trail logger — writes ke editorial_review table.
 *
 * Schema reference: supabase/migrations/0004_alignment_schema_light.sql
 * RLS: admins_write_review_log (insert hanya kalau profiles.is_admin = true)
 *
 * Audit trail immutable — tidak ada update/delete policy. Setiap moderation
 * action (approve/modify/reject/flag) WAJIB di-log.
 */
import { createClient } from '@/lib/supabase/server';
import type {
  EditorialReviewRow,
  ReviewAction,
  ReviewTargetType,
} from './types';

type LogParams = {
  reviewerId: string;
  targetType: ReviewTargetType;
  targetId: string;
  action: ReviewAction;
  notes?: string | null;
};

/**
 * Insert entry ke editorial_review. Returns the inserted row atau error.
 * Caller harus sudah lewat requireAdmin() — RLS enforces juga di DB level.
 */
export async function logEditorialReview(
  params: LogParams,
): Promise<{ ok: true; row: EditorialReviewRow } | { ok: false; error: string }> {
  const supabase = await createClient();

  const insertPayload = {
    reviewer_id: params.reviewerId,
    target_type: params.targetType,
    target_id: params.targetId,
    action: params.action,
    notes: params.notes ?? null,
  };

  // editorial_review table belum ada di Database type sampai post-migration
  // typegen. Cast via unknown untuk bypass — RLS + check constraint di DB
  // tetap enforce shape correctness.
  const { data, error } = await (
    supabase.from('editorial_review' as never) as unknown as {
      insert: (
        v: typeof insertPayload,
      ) => {
        select: () => {
          single: () => Promise<{
            data: EditorialReviewRow | null;
            error: { message: string } | null;
          }>;
        };
      };
    }
  )
    .insert(insertPayload)
    .select()
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? 'unknown insert error' };
  }
  return { ok: true, row: data };
}

/**
 * Fetch recent editorial review entries (descending). Untuk /admin/audit-log
 * page. Returns empty array kalau RLS denies (non-admin).
 */
export async function fetchRecentReviews(
  limit = 50,
): Promise<EditorialReviewRow[]> {
  const supabase = await createClient();
  const { data } = await (
    supabase.from('editorial_review' as never) as unknown as {
      select: (v: string) => {
        order: (
          col: string,
          opts: { ascending: boolean },
        ) => {
          limit: (
            n: number,
          ) => Promise<{ data: EditorialReviewRow[] | null }>;
        };
      };
    }
  )
    .select('*')
    .order('reviewed_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}
