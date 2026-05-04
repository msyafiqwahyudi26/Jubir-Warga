import Link from 'next/link';
import { Instagram, Twitter, Youtube } from 'lucide-react';
import { JwLogo } from './jw-logo';

const PLATFORM_LINKS = [
  { href: '/komunitas', label: 'Komunitas' },
  { href: '/karya', label: 'Karya' },
  { href: '/kelas', label: 'Kelas' },
  { href: '/aksi', label: 'Aksi' },
  { href: '/tagih', label: 'Janji' },
  { href: '/main', label: 'Main' },
];

const ABOUT_LINKS = [
  { href: '/tentang', label: 'Tentang Jubir Warga' },
  { href: '/tim', label: 'Tim' },
  { href: '/partner', label: 'Partner' },
  { href: '/press', label: 'Press' },
];

const LEGAL_LINKS = [
  { href: '/privasi', label: 'Privasi' },
  { href: '/syarat', label: 'Syarat & Ketentuan' },
  { href: '/etika', label: 'Etika Komunitas' },
];

const SOCIAL_LINKS = [
  {
    href: 'https://instagram.com/jubirwarga.id',
    label: 'Instagram @jubirwarga.id',
    Icon: Instagram,
  },
  {
    href: 'https://twitter.com/jubirwarga',
    label: 'Twitter / X',
    Icon: Twitter,
  },
  {
    href: 'https://youtube.com/@jubirwarga',
    label: 'YouTube',
    Icon: Youtube,
  },
];

const PARTNERS = ['SPD', 'KitaBisa', 'Komisi.co', 'Indorelawan', 'ceksuaramu.com'];

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-jw-blue text-jw-cream">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <JwLogo size={28} variant="cream" />
            <p className="mt-3 text-sm text-jw-cream/70">
              Kumpul. Berkarya. Bersuara.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-jw-cream/55">
              Jl. Tebet Barat Dalam IIC No. 14,
              <br />
              Tebet, Jakarta Selatan
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {PARTNERS.map((p) => (
                <span
                  key={p}
                  className="text-[11px] px-2 py-0.5 rounded-jw-sm bg-jw-cream/10 text-jw-cream/70"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <FooterColumn title="Platform" links={PLATFORM_LINKS} />
          <FooterColumn title="Tentang" links={ABOUT_LINKS} />

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-jw-cream/40 mb-4">
              Hubungi
            </h3>
            <ul className="space-y-2 text-sm text-jw-cream/75">
              <li>
                <a
                  href="https://instagram.com/jubirwarga.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-jw-coral transition"
                >
                  @jubirwarga.id
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@jubirwarga.id"
                  className="hover:text-jw-coral transition"
                >
                  info@jubirwarga.id
                </a>
              </li>
              <li>
                <a
                  href="mailto:partnerships@jubirwarga.id"
                  className="hover:text-jw-coral transition"
                >
                  partnerships@jubirwarga.id
                </a>
              </li>
              <li>
                <a
                  href="mailto:press@jubirwarga.id"
                  className="hover:text-jw-coral transition"
                >
                  press@jubirwarga.id
                </a>
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-jw-cream/70 hover:text-jw-coral transition active:scale-95"
                >
                  <Icon size={18} aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-jw-cream/10 grid gap-3 md:grid-cols-2 md:items-center">
          <p className="text-[11px] text-jw-cream/50 leading-relaxed">
            © 2026 Jubir Warga · Inisiatif SPD Indonesia · Dalam pembentukan PT
            independen 2026.
            <br />
            <span className="text-jw-cream/70">
              Sekarang masih beta — feedback ke{' '}
              <a
                href="mailto:info@jubirwarga.id"
                className="text-jw-coral hover:underline"
              >
                info@jubirwarga.id
              </a>
              .
            </span>
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-jw-cream/70 hover:text-jw-coral transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-jw-cream/40 mb-4">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-jw-cream/75 hover:text-jw-coral transition"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
