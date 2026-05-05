// Pure functions untuk compute alignment breakdown + percentage.
// Import-only — tidak ada side effect, aman dipakai di Server Component
// query path atau di test suite.

import {
  emptyAlignmentBreakdown,
  isAlignmentStatus,
  type AlignmentBreakdown,
  type AlignmentStatus,
} from './alignment';

type RowWithAlignment = {
  alignment_status?: string | null;
};

/**
 * Hitung breakdown alignment status dari list janji rows. Janji yang belum
 * di-review (alignment_status null/undefined) tidak masuk total — jadi
 * percentage berbasis "yang sudah ada verdict-nya" saja, bukan total janji.
 */
export function computeAlignmentBreakdown(
  rows: ReadonlyArray<RowWithAlignment>,
): AlignmentBreakdown {
  return rows.reduce<AlignmentBreakdown>((acc, row) => {
    if (isAlignmentStatus(row.alignment_status)) {
      acc[row.alignment_status] += 1;
    }
    return acc;
  }, emptyAlignmentBreakdown());
}

export function alignmentTotal(breakdown: AlignmentBreakdown): number {
  return (
    breakdown.aligned +
    breakdown.partial +
    breakdown.drift +
    breakdown.contradict
  );
}

/**
 * Persentase per-status terhadap total reviewed (bukan total janji). Return
 * 0 jika total = 0 untuk hindari NaN. Round ke integer percent.
 */
export function alignmentPercent(
  status: AlignmentStatus,
  breakdown: AlignmentBreakdown,
): number {
  const total = alignmentTotal(breakdown);
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((breakdown[status] / total) * 100)));
}

/**
 * Janji yang belum direview = total minus reviewed. Untuk transparansi banner
 * "X dari Y janji sudah ada verdict alignment-nya".
 */
export function pendingReviewCount(
  rows: ReadonlyArray<RowWithAlignment>,
): number {
  let pending = 0;
  for (const row of rows) {
    if (!isAlignmentStatus(row.alignment_status)) pending += 1;
  }
  return pending;
}
