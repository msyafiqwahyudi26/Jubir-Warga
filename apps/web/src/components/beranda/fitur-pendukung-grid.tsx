import Link from 'next/link';
import { MessageCircle, Edit3, BookOpen, Zap, type LucideIcon } from 'lucide-react';

// Spec #32 — Tier 2 fitur compact, post-pivot. Tagih + Janji vs Realita Game
// dijadikan prominent di hero/section atas; Komunitas/Karya/Kelas/Aksi
// di-de-emphasize sebagai "fitur lainnya".
type Feature = {
  href: string;
  icon: LucideIcon;
  label: string;
  desc: string;
};

const TIER2_FEATURES: readonly Feature[] = [
  {
    href: '/komunitas',
    icon: MessageCircle,
    label: 'Komunitas',
    desc: 'Diskusi per janji, ngobrol bareng warga.',
  },
  {
    href: '/karya',
    icon: Edit3,
    label: 'Karya',
    desc: 'Tulisan, vlog, ilustrasi dari warga.',
  },
  {
    href: '/kelas',
    icon: BookOpen,
    label: 'Kelas',
    desc: 'Literasi kebijakan, ringkas + nendang.',
  },
  {
    href: '/aksi',
    icon: Zap,
    label: 'Aksi',
    desc: 'Petisi, polling, kampanye warga.',
  },
];

export function FiturPendukungGrid() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-2">
          <span
            className="font-hand text-lg text-jw-coral"
            aria-hidden="true"
          >
            — ekosistem
          </span>
          <h2 className="font-display text-3xl font-bold text-jw-blue">
            Ekosistem Jubir Warga
          </h2>
        </div>
        <p className="text-sm text-jw-ink/70 mb-6 max-w-2xl">
          Tagih Janji yang lagi spotlight, tapi ekosistem warga muda di sini
          tetap berkembang bertahap — pilih yang kamu suka.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TIER2_FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.href}
                href={f.href}
                className="group rounded-jw-lg border border-jw-line bg-white p-5 hover:border-jw-blue-soft/40 hover:-translate-y-0.5 hover:shadow-jw-md transition-all duration-200 flex flex-col"
              >
                <span
                  className="inline-flex items-center justify-center rounded-jw-md bg-jw-pill-blue-bg/40 text-jw-blue w-10 h-10 mb-3"
                  aria-hidden="true"
                >
                  <Icon size={20} />
                </span>
                <span className="font-display text-lg font-semibold text-jw-blue group-hover:underline">
                  {f.label}
                </span>
                <span className="text-xs text-jw-muted mt-1 leading-relaxed">
                  {f.desc}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
