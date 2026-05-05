import Link from 'next/link';
import type { Metadata } from 'next';
import { Shield, FileCheck, History, LayoutDashboard } from 'lucide-react';
import { requireAdmin } from '@/lib/admin/role-check';

export const metadata: Metadata = {
  title: 'Admin — Jubir Warga',
  description: 'Editorial moderation dashboard.',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await requireAdmin();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-jw-cream">
      <header className="border-b border-jw-line bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-jw-coral" aria-hidden />
            <span className="font-display text-lg font-bold text-jw-blue">
              Admin Panel
            </span>
          </div>
          <nav
            aria-label="Navigasi admin"
            className="flex items-center gap-4 text-sm font-medium"
          >
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-jw-ink hover:text-jw-coral transition"
            >
              <LayoutDashboard size={14} aria-hidden /> Dashboard
            </Link>
            <Link
              href="/admin/janji"
              className="inline-flex items-center gap-1 text-jw-ink hover:text-jw-coral transition"
            >
              <FileCheck size={14} aria-hidden /> Janji
            </Link>
            <Link
              href="/admin/audit-log"
              className="inline-flex items-center gap-1 text-jw-ink hover:text-jw-coral transition"
            >
              <History size={14} aria-hidden /> Audit Log
            </Link>
          </nav>
          <span className="text-xs text-jw-muted">
            {ctx.email ?? ctx.name ?? 'admin'}
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
