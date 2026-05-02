export function isClosed(deadline: string | null): boolean {
  if (!deadline) return false;
  const t = new Date(deadline).getTime();
  if (Number.isNaN(t)) return false;
  return t < Date.now();
}

export function formatDeadline(deadline: string | null): string {
  if (!deadline) return 'Tanpa deadline';
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return 'Tanpa deadline';
  if (isClosed(deadline)) return 'Sudah selesai';
  const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Hari ini berakhir';
  if (days === 1) return 'Berakhir besok';
  if (days <= 7) return `Berakhir ${days} hari lagi`;
  return `Berakhir ${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}
