'use client';

/**
 * NavLinks — Client Component nav dengan Lucide icon + active state pill.
 *
 * Per Spec #34 visual parity Wave 1, step 6.
 * Diisolasi sebagai Client Component supaya SiteHeader tetap Server
 * (consume user prop dari layout). usePathname() trigger Client boundary.
 *
 * 7 surfaces: Beranda, Komunitas, Karya, Kelas, Aksi, Tagih Janji, Main.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MessageCircle,
  Edit3,
  BookOpen,
  Zap,
  ClipboardCheck,
  Gamepad2,
  type LucideIcon,
} from 'lucide-react';

type NavItem = { href: string; label: string; icon: LucideIcon };

const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/komunitas', label: 'Komunitas', icon: MessageCircle },
  { href: '/karya', label: 'Karya', icon: Edit3 },
  { href: '/kelas', label: 'Kelas', icon: BookOpen },
  { href: '/aksi', label: 'Aksi', icon: Zap },
  { href: '/tagih', label: 'Tagih Janji', icon: ClipboardCheck },
  { href: '/main', label: 'Main', icon: Gamepad2 },
];

export function NavLinks() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      aria-label="Navigasi utama"
      className="hidden md:flex items-center gap-1 text-sm font-medium"
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-jw-md transition ${
              active
                ? 'bg-jw-blue text-jw-cream'
                : 'text-jw-ink hover:text-jw-coral hover:bg-jw-pill-grey-bg'
            }`}
          >
            <Icon size={15} aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
