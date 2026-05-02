# Spec #X1 — Custom SVG icon + emoji set foundation (Tier 2 prep)

**Sprint**: 3 (paralel dengan #12 Profil)
**Owner**: Claude Code (executor instance #2) · audited oleh planner
**Estimasi**: 1.5-2 jam
**Dependency**: Tidak ada blocking. Self-contained, zero overlap dengan Spec #12 Profil yang lagi jalan.
**Decisions Mas (approved 2026-05-01):**
1. ✅ Brand policy: native unicode emoji banned sebagai brand decor; custom SVG emoji + icon brand-aligned ENCOURAGED (Tier 2 goal Sprint 4-5)
2. ✅ Sprint 3: foundation only — placeholder set (5 icon + 5 emoji) untuk validate pattern, full set Sprint 4-5 designer task
3. ✅ Strict file ownership: instance #2 ONLY edit folder baru `components/jw-icon/` + `components/jw-emoji/`. JANGAN edit shared file (STATUS.md, package.json, site-header.tsx, layout.tsx)

**Required reading sebelum mulai:**
1. `CLAUDE.md` Section 5.4 + 5.4b + 5.6 — brand emoji + icon policy (Tier 1 Lucide interim, Tier 2 custom SVG goal)
2. `BACKLOG.md` "Custom SVG emoji set + custom icon set (brand-aligned)" — full vision + roadmap
3. `apps/web/src/components/nala/nala-mascot.tsx` — reference style hand-drawn brand-aligned (mirror treatment buat icon set)
4. `apps/web/src/components/jw-logo.tsx` — reference Patrick Hand + squiggly underline (mirror feel)

---

## Goal

Bikin **foundation** custom SVG icon + emoji set sebagai placeholder untuk Tier 2 brand-aligned visual library. Sprint 3 = 5 icon + 5 emoji minimum sebagai proof-of-concept pattern. Sprint 4-5 = designer expand jadi 30-40 icon + 30-50 emoji full set.

Setelah spec ini selesai:
- Pattern component pattern teregister (`<JWIcon name="home" />`, `<JWEmoji name="kategori-transport" />`)
- 5 icon + 5 emoji placeholder ready
- Dokumentasi cara extend (designer atau Mas tinggal nambah SVG file baru)
- Foundation siap di-import dari halaman lain Sprint 4+

## STRICT FILE OWNERSHIP — JANGAN EDIT FILE INI:

❌ `specs/SPRINT-3/STATUS.md` (Spec #12 ownership)
❌ `apps/web/package.json` (kalau perlu add deps, koordinasi dulu)
❌ `pnpm-lock.yaml` (auto-generated)
❌ `apps/web/src/components/site-header.tsx` (Spec #12 verify)
❌ `apps/web/src/app/layout.tsx` (Spec #12 verify)
❌ Any file di `apps/web/src/app/profil/`, `app/u/`, `lib/profil/` (Spec #12)

✅ Boleh edit:
- `apps/web/src/components/jw-icon/` (NEW folder)
- `apps/web/src/components/jw-emoji/` (NEW folder)
- `apps/web/src/__tests__/jw-icon.test.tsx` (NEW file)
- `apps/web/src/__tests__/jw-emoji.test.tsx` (NEW file)
- `BACKLOG.md` (Sprint 4 prep notes section, append only — JANGAN edit existing entry)
- `specs/SPRINT-3/X1-svg-icon-foundation.md` (THIS spec file, include in commit)

---

## File yang dibuat

```
apps/web/src/components/jw-icon/
├── index.ts                            Barrel export + JWIcon component + ICONS map
├── README.md                           Dokumentasi cara add icon baru
├── jw-icon.tsx                         <JWIcon name="..." size={...} />
└── icons/
    ├── home.svg                        Home (rumah hand-drawn)
    ├── message.svg                     Message bubble
    ├── user.svg                        User silhouette
    ├── search.svg                      Search magnifier
    └── bell.svg                        Notification bell

apps/web/src/components/jw-emoji/
├── index.ts                            Barrel export + JWEmoji component + EMOJIS map
├── README.md                           Dokumentasi cara add emoji baru
├── jw-emoji.tsx                        <JWEmoji name="..." size={...} />
└── emoji/
    ├── kategori-transport.svg          Bus/MRT stylized brand-aligned
    ├── kategori-pangan.svg             Beras/sayur stylized
    ├── status-ditepati.svg             Check mark coral hand-drawn
    ├── status-mandek.svg               Pause/clock stylized
    └── reaksi-love.svg                 Hati hand-drawn coral

apps/web/src/__tests__/
├── jw-icon.test.tsx                    Test render + size prop + invalid name fallback
└── jw-emoji.test.tsx                   Test render + size prop + invalid name fallback
```

---

## Step-by-step

### 1. Bikin folder structure

```powershell
mkdir apps/web/src/components/jw-icon/icons
mkdir apps/web/src/components/jw-emoji/emoji
```

### 2. Component pattern

**`apps/web/src/components/jw-icon/jw-icon.tsx`:**

```tsx
import HomeIcon       from './icons/home.svg';
import MessageIcon    from './icons/message.svg';
import UserIcon       from './icons/user.svg';
import SearchIcon     from './icons/search.svg';
import BellIcon       from './icons/bell.svg';

const ICONS = {
  home:    HomeIcon,
  message: MessageIcon,
  user:    UserIcon,
  search:  SearchIcon,
  bell:    BellIcon,
} as const;

export type JWIconName = keyof typeof ICONS;

type Props = {
  name: JWIconName;
  size?: number;
  className?: string;
  'aria-label'?: string;
};

export function JWIcon({ name, size = 20, className, ...rest }: Props) {
  const SvgIcon = ICONS[name];
  if (!SvgIcon) return null;
  return (
    <SvgIcon
      width={size}
      height={size}
      className={className}
      aria-hidden={!rest['aria-label']}
      {...rest}
    />
  );
}
```

> **NOTE Claude Code:** Next.js 15 default support SVG import sebagai React component via `@svgr/webpack`. Kalau gak ada, tambah `next.config.ts` dengan SVGR config:
> ```ts
> webpack(config) {
>   config.module.rules.push({
>     test: /\.svg$/i,
>     use: ['@svgr/webpack'],
>   });
>   return config;
> }
> ```
> Atau alternative: inline SVG sebagai React component manual (no webpack config needed). **Pakai approach kedua kalau ragu** (lebih kompatibel + no extra dep).

### 3. Inline SVG approach (recommended — no SVGR setup)

Refactor jadi inline SVG sebagai React component:

**`apps/web/src/components/jw-icon/jw-icon.tsx` (inline):**

```tsx
import { HomeIcon } from './icons/home';
import { MessageIcon } from './icons/message';
import { UserIcon } from './icons/user';
import { SearchIcon } from './icons/search';
import { BellIcon } from './icons/bell';

const ICONS = {
  home: HomeIcon,
  message: MessageIcon,
  user: UserIcon,
  search: SearchIcon,
  bell: BellIcon,
} as const;

export type JWIconName = keyof typeof ICONS;

type Props = {
  name: JWIconName;
  size?: number;
  className?: string;
  color?: string;
};

export function JWIcon({ name, size = 20, className, color = 'currentColor' }: Props) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return <Icon size={size} className={className} color={color} />;
}
```

**`apps/web/src/components/jw-icon/icons/home.tsx`:**

```tsx
type IconProps = { size?: number; className?: string; color?: string };

export function HomeIcon({ size = 20, className, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* Hand-drawn rumah, sedikit irregular mirror logo treatment */}
      <path d="M3 11l9-8 9 8" />
      <path d="M5 9.5V20a1 1 0 001 1h12a1 1 0 001-1V9.5" />
      <path d="M9 21V14h6v7" />
      {/* Sedikit imperfection: corner not perfectly aligned */}
      <circle cx="12" cy="11" r="0.3" fill={color} />
    </svg>
  );
}
```

Pattern serupa untuk message, user, search, bell — inline SVG dengan stroke 1.5px, sedikit hand-drawn imperfection (circle dot kecil, line gak presisi 100%).

### 4. Emoji pattern

**`apps/web/src/components/jw-emoji/jw-emoji.tsx`:**

```tsx
import { KategoriTransport } from './emoji/kategori-transport';
import { KategoriPangan } from './emoji/kategori-pangan';
import { StatusDitepati } from './emoji/status-ditepati';
import { StatusMandek } from './emoji/status-mandek';
import { ReaksiLove } from './emoji/reaksi-love';

const EMOJIS = {
  'kategori-transport': KategoriTransport,
  'kategori-pangan':    KategoriPangan,
  'status-ditepati':    StatusDitepati,
  'status-mandek':      StatusMandek,
  'reaksi-love':        ReaksiLove,
} as const;

export type JWEmojiName = keyof typeof EMOJIS;

type Props = {
  name: JWEmojiName;
  size?: number;
  className?: string;
};

export function JWEmoji({ name, size = 24, className }: Props) {
  const Emoji = EMOJIS[name];
  if (!Emoji) return null;
  return <Emoji size={size} className={className} />;
}
```

Each emoji = full-color SVG (BUKAN single-stroke), pakai brand palette token (jw-blue, jw-coral, jw-marigold, jw-mint).

**Example `kategori-transport.tsx`:**

```tsx
type EmojiProps = { size?: number; className?: string };

export function KategoriTransport({ size = 24, className }: EmojiProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      {/* Stylized bus/MRT — boxy hand-drawn */}
      <rect x="4" y="10" width="24" height="14" rx="3" fill="#1A2256" />
      {/* Window */}
      <rect x="6" y="12" width="9" height="6" rx="1" fill="#FFFAEE" />
      <rect x="17" y="12" width="9" height="6" rx="1" fill="#FFFAEE" />
      {/* Wheel */}
      <circle cx="9" cy="25" r="2.5" fill="#2A2D3A" />
      <circle cx="23" cy="25" r="2.5" fill="#2A2D3A" />
      {/* Coral accent door */}
      <rect x="14.5" y="16" width="3" height="8" rx="0.5" fill="#E8632B" />
    </svg>
  );
}
```

**Example `status-ditepati.tsx`:**

```tsx
type EmojiProps = { size?: number; className?: string };

export function StatusDitepati({ size = 24, className }: EmojiProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      <circle cx="16" cy="16" r="14" fill="#7FB69E" />
      {/* Check mark hand-drawn — sedikit wonky */}
      <path
        d="M9 16 L14 21 L23 11"
        stroke="#FFFAEE"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
```

Style consistent untuk 5 emoji: 32x32 viewBox, brand color palette, sedikit imperfection (gak presisi geometrik).

### 5. README dokumentasi

**`apps/web/src/components/jw-icon/README.md`:**

```markdown
# JWIcon — Custom SVG icon set Jubir Warga

Brand-aligned icon set yang gradual replace Lucide.

## Pakai

\`\`\`tsx
import { JWIcon } from '@/components/jw-icon';

<JWIcon name="home" size={20} />
<JWIcon name="bell" size={24} className="text-jw-coral" />
\`\`\`

## Tambah icon baru

1. Bikin file SVG di `icons/<name>.tsx` dengan pattern:
   - viewBox 24x24
   - stroke 1.5px (hand-drawn feel)
   - color = `currentColor` (inherit dari parent)
   - Sedikit imperfection (circle dot, line slight wonky)
2. Export sebagai React component
3. Register di `jw-icon.tsx` `ICONS` map
4. Update test `__tests__/jw-icon.test.tsx`

## Style guideline

- **Stroke**: 1.5px (consistent dengan logo)
- **Cap**: round
- **Join**: round
- **Color**: `currentColor` (parent controls via Tailwind text-* class)
- **Imperfection**: sedikit, mirror logo + Nala mascot
- **NO**: gradient, shadow, multi-color (untuk icon — emoji boleh full color)

## Roadmap

Sprint 3: 5 icon (home, message, user, search, bell) — placeholder
Sprint 4-5: 30-40 icon, replace Lucide bertahap (designer atau freelancer task)

Lihat `BACKLOG.md` "Custom SVG emoji set + custom icon set" untuk full vision.
```

**`apps/web/src/components/jw-emoji/README.md`:** mirip pattern, tapi emoji full-color brand palette + 32x32 viewBox.

### 6. Tests

**`__tests__/jw-icon.test.tsx`:**

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { JWIcon } from '@/components/jw-icon/jw-icon';

describe('<JWIcon />', () => {
  it('renders home icon', () => {
    const { container } = render(<JWIcon name="home" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
  it('respects size prop', () => {
    const { container } = render(<JWIcon name="bell" size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
  });
  it('returns null for invalid name', () => {
    // @ts-expect-error testing invalid input
    const { container } = render(<JWIcon name="invalid" />);
    expect(container.firstChild).toBeNull();
  });
});
```

**`__tests__/jw-emoji.test.tsx`:** mirip pattern.

### 7. Quality gates

```powershell
pnpm --filter @jw/web typecheck
pnpm --filter @jw/web lint
pnpm --filter @jw/web test
```

Wajib pass tanpa modify file lain.

### 8. Commit message

```
feat(brand): foundation custom SVG icon + emoji set (5+5 placeholder)

- jw-icon/: 5 placeholder icon (home, message, user, search, bell) inline
  React SVG, stroke 1.5px hand-drawn feel mirror logo treatment
- jw-emoji/: 5 placeholder emoji (kategori-transport, kategori-pangan,
  status-ditepati, status-mandek, reaksi-love) full-color brand palette
- README per folder dengan dokumentasi cara extend (designer task Sprint 4-5)
- 2 test baru: jw-icon render + size, jw-emoji render + size, invalid name fallback
- Per Spec #X1 + brand decision Mas 2026-05-01 + BACKLOG "Custom SVG emoji set"
- Strict file ownership: zero overlap dengan Spec #12 Profil yang paralel jalan

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

### 9. Coordinate dengan Spec #12

Setelah commit READY untuk push:

1. **TUNGGU** Claude Code #1 (Spec #12 Profil) commit dulu ke main
2. **PULL** terbaru: `git pull origin main`
3. **REBASE** kalau perlu (kalau ada commit lain di antara): `git rebase origin/main`
4. **PUSH**: `git push origin main`

Atau alternative: bikin branch terpisah `feat/svg-icon-foundation`, push ke branch itu, planner merge ke main setelah audit.

---

## Acceptance checklist

- [ ] `apps/web/src/components/jw-icon/` folder ada dengan 5 icon + index + README + jw-icon.tsx
- [ ] `apps/web/src/components/jw-emoji/` folder ada dengan 5 emoji + index + README + jw-emoji.tsx
- [ ] Inline SVG approach (gak butuh @svgr/webpack config)
- [ ] `<JWIcon name="home" />` render proper SVG
- [ ] `<JWEmoji name="status-ditepati" />` render proper SVG full color
- [ ] Size prop respected
- [ ] Invalid name fallback null (no crash)
- [ ] 2 test baru pass (target total 122+)
- [ ] `pnpm typecheck` 0 errors
- [ ] `pnpm lint` 0 new warnings
- [ ] Strict file ownership respected (no edit shared file)
- [ ] Commit + push tanpa conflict dengan Spec #12

## Out of scope (Sprint 4-5 designer task)

- ❌ Full set 30-40 icon (replace Lucide bertahap) — designer task
- ❌ Full set 30-50 emoji (kategori isu lengkap, reaksi, status, action, aksesoris) — designer task
- ❌ SVG sprite optimization (1 file untuk semua) — Sprint 5 build optimization
- ❌ Animation per emoji (Lottie atau CSS) — post-launch
- ❌ Color theme variant (untuk dark mode) — post-launch

## Notes untuk planner audit

Aku akan audit:
- Folder structure clean
- Inline SVG approach (no extra webpack config)
- Pattern consistent (5 icon + 5 emoji style aligned)
- Hand-drawn feel sedikit irregular (mirror logo + Nala)
- Brand palette only (jw-blue/jw-coral/jw-marigold/jw-mint/jw-cream)
- Strict file ownership respected — no overlap dengan Spec #12
- Test count tambah 2

## Coordinate timing

**Sebelum mulai:** verify Claude Code #1 (Spec #12) udah jalan di window 1 dengan komit yang aman.

**Saat siap commit:**
1. `git status` — pastikan cuma file di scope
2. `git pull origin main` — sync latest
3. Resolve kalau ada conflict (kemungkinan besar 0)
4. `git add` + commit + push

**Kalau bentrok dengan Spec #12 push:**
- `git pull --rebase origin main`
- Resolve manual (kemungkinan besar STATUS.md kalau Spec #12 udah update — tapi aku JANGAN edit STATUS.md, so safe)
- `git push origin main`
