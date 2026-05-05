# Spec #34 — Visual Parity Port (Claude Design → Phase 2)

**Sprint**: 4 phase 2 (post-deploy polish)
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 1-2 hari (1 window paralel) untuk Wave 1
**Priority**: P1 (post Sprint 4 phase 1 complete + deployed)
**Source reference**: `docs/design-system-reference/` (commit `5f7cf7c`)

---

## Goal

Port 5 component paling impactful dari Claude Design "Jubir Warga Design System" ke Phase 2 current. **Adopt selectively, don't rebuild** — leverage existing investment Sprint 1-3, tambah elements yang most missed.

Setelah Wave 1 selesai:
- Avatar circular name-hued + marigold level dot di seluruh aplikasi
- Pill 7-tone semantic standardized (replace ad-hoc badge)
- Header dengan Lucide nav icon + active state pill highlight
- Janji card dengan avatar pejabat + region tag + timing annotation
- Tinted surface tokens (`--surface-blue/coral/mari/mint`) tersedia di globals.css

Visual parity Phase 2 vs Claude Design ≈ 80% match (Wave 1). Sisa 20% = Wave 2 (multi-column feed, Nala mascot 3D banner, Caveat annotations sweep).

---

## Required reading

1. `docs/design-system-reference/colors_and_type.css` — design tokens (5KB)
2. `docs/design-system-reference/components.jsx` — Avatar/Pill/Btn/Card/Header source (10KB)
3. `docs/design-system-reference/PageBeranda.jsx` — Janji card pattern reference (25KB)
4. `CLAUDE.md` §5 design system + §4 brand voice
5. Existing `apps/web/src/app/globals.css` — current tokens
6. Existing `apps/web/src/components/site-header.tsx` — nav 6 surface text-only

---

## File yang dibuat / diubah

### Wave 1 — 5 component port

```
NEW:
apps/web/src/components/ui/avatar.tsx                    Avatar name-hued + level dot
apps/web/src/components/ui/pill.tsx                      Pill 7-tone semantic
apps/web/src/components/ui/region-tag.tsx                BARU — tag PROVINSI/PUSAT/KOTA
apps/web/src/lib/util/format-relative-time.ts            Helper "Status berubah 2j lalu"

EXTEND:
apps/web/src/app/globals.css                             Tambah tinted surface tokens
apps/web/src/components/site-header.tsx                  Add Lucide nav icon per item + active state
apps/web/src/app/tagih/janji-row.tsx                     Add Avatar + region tag + timing annotation
apps/web/src/components/beranda/janji-prominent-cards.tsx Add Avatar + status timing annotation
apps/web/src/app/tagih/components/janji-card-with-badge.tsx Add Avatar + region tag

REFACTOR (gradual, not blocker):
apps/web/src/app/komunitas/vote-arrows.tsx               Use new Pill component
apps/web/src/app/tagih/status-pill.tsx                   Use new Pill 7-tone (deprecate ad-hoc)
```

---

## Step-by-step

### Step 1 — Tinted surface tokens (30 menit)

**File**: `apps/web/src/app/globals.css`

Tambah ke `@theme` block:

```css
@theme {
  /* Existing tokens preserved... */
  
  /* NEW — Tinted surfaces (per Claude Design system) */
  --color-jw-surface-blue:     #E8ECF7;
  --color-jw-surface-coral:    #FCE9E1;
  --color-jw-surface-marigold: #FEF3D9;
  --color-jw-surface-mint:     #E1F2EC;
  --color-jw-surface-grey:     #F0EDE8;
}
```

Tailwind classes auto-generated: `bg-jw-surface-blue`, `bg-jw-surface-coral`, dll.

**Acceptance**: 5 surface tokens accessible via Tailwind utility.

---

### Step 2 — Avatar component (1 jam)

**Source reference**: `docs/design-system-reference/components.jsx:49-72`

**File baru**: `apps/web/src/components/ui/avatar.tsx`

```tsx
type AvatarProps = {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';  // 24/32/40/56 px
  level?: number;                     // 1-10, marigold dot
  showLevel?: boolean;
};

const SIZE_MAP = { sm: 24, md: 32, lg: 40, xl: 56 } as const;

export function Avatar({ name, size = 'md', level, showLevel = true }: AvatarProps) {
  const px = SIZE_MAP[size];
  const initials = name
    .split(' ')
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
  
  // Name-hued algorithm dari Claude Design source
  const hue = (name.charCodeAt(0) * 37 + (name.charCodeAt(1) ?? 0) * 11) % 360;
  const fontSize = px / 2.6;
  
  return (
    <div className="relative inline-block flex-shrink-0">
      <div
        className="rounded-full text-white flex items-center justify-center font-semibold"
        style={{
          width: px,
          height: px,
          background: `hsl(${hue}, 42%, 40%)`,
          fontSize,
        }}
      >
        {initials}
      </div>
      {showLevel && level !== undefined && (
        <span
          className="absolute -bottom-0.5 -right-0.5 bg-jw-marigold text-white rounded-full font-bold flex items-center justify-center"
          style={{
            width: Math.max(14, px * 0.35),
            height: Math.max(14, px * 0.35),
            fontSize: Math.max(9, px * 0.22),
          }}
        >
          {level}
        </span>
      )}
    </div>
  );
}
```

**Test**: `apps/web/src/__tests__/avatar.test.tsx` — verify hue deterministic per name, level dot conditional.

**Acceptance**:
- 4 size variant (sm/md/lg/xl)
- Hue deterministic same input = same output
- Level dot conditional render
- 2 char initials max

---

### Step 3 — Pill 7-tone semantic (1.5 jam)

**Source reference**: `docs/design-system-reference/components.jsx:15-31`

**File baru**: `apps/web/src/components/ui/pill.tsx`

```tsx
type PillTone = 'blue' | 'coral' | 'marigold' | 'mint' | 'red' | 'grey' | 'dark';

const TONE_MAP: Record<PillTone, { bg: string; fg: string; bd: string }> = {
  blue:     { bg: 'bg-jw-surface-blue',     fg: 'text-jw-blue',         bd: 'border-jw-blue/30' },
  coral:    { bg: 'bg-jw-surface-coral',    fg: 'text-jw-coral',        bd: 'border-jw-coral' },
  marigold: { bg: 'bg-jw-surface-marigold', fg: 'text-jw-marigold-text', bd: 'border-jw-marigold' },
  mint:     { bg: 'bg-jw-surface-mint',     fg: 'text-jw-mint-text',    bd: 'border-jw-mint' },
  red:      { bg: 'bg-jw-pill-red-bg',      fg: 'text-jw-red',          bd: 'border-jw-red' },
  grey:     { bg: 'bg-jw-surface-grey',     fg: 'text-jw-muted',        bd: 'border-jw-line' },
  dark:     { bg: 'bg-jw-blue',             fg: 'text-jw-cream',        bd: 'border-jw-blue' },
};

export function Pill({ tone = 'blue', children, className = '' }: {
  tone?: PillTone;
  children: React.ReactNode;
  className?: string;
}) {
  const s = TONE_MAP[tone];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${s.bg} ${s.fg} ${s.bd} ${className}`}>
      {children}
    </span>
  );
}
```

**Acceptance**:
- 7 tone variant
- Reusable di status, region tag, etc.
- Replace ad-hoc badge components

---

### Step 4 — Region Tag component (15 menit)

**File baru**: `apps/web/src/components/ui/region-tag.tsx`

```tsx
import { Pill } from './pill';

const REGION_LABEL: Record<string, string> = {
  nasional: 'PUSAT',
  provinsi: 'PROVINSI',
  kabupaten_kota: 'KOTA',
};

export function RegionTag({ level }: { level: 'nasional' | 'provinsi' | 'kabupaten_kota' }) {
  return <Pill tone="grey" className="text-[10px] font-bold tracking-wide">{REGION_LABEL[level]}</Pill>;
}
```

---

### Step 5 — Format relative time helper (15 menit)

**File baru**: `apps/web/src/lib/util/format-relative-time.ts`

```ts
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  
  if (diffMin < 60) return `${diffMin}mnt lalu`;
  
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}j lalu`;
  
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD}h lalu`;
  
  const diffM = Math.floor(diffD / 30);
  if (diffM < 12) return `${diffM}b lalu`;
  
  return `${Math.floor(diffM / 12)}t lalu`;
}
```

---

### Step 6 — Site header dengan Lucide nav icons + active state (2 jam)

**Source reference**: `docs/design-system-reference/components.jsx:90-160` (Header function)

**File**: `apps/web/src/components/site-header.tsx` (extend existing)

Replace nav items:

```tsx
'use client';
import { usePathname } from 'next/navigation';
import { Home, MessageCircle, Edit3, BookOpen, Zap, ClipboardCheck, Gamepad2, type LucideIcon } from 'lucide-react';

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/komunitas', label: 'Komunitas', icon: MessageCircle },
  { href: '/karya', label: 'Karya', icon: Edit3 },
  { href: '/kelas', label: 'Kelas', icon: BookOpen },
  { href: '/aksi', label: 'Aksi', icon: Zap },
  { href: '/tagih', label: 'Tagih Janji', icon: ClipboardCheck },
  { href: '/main', label: 'Main', icon: Gamepad2 },
];

// Inside SiteHeader:
const pathname = usePathname();
const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

return (
  <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
    {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
      const active = isActive(href);
      return (
        <Link
          key={href}
          href={href}
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
```

User area (kanan):
- Replace email split text dengan `<Avatar name={user.user_metadata?.name} size="sm" level={...} />`
- Plus Tanya Nala pill (existing) + Keluar button (existing)

**Acceptance**:
- 7 nav item dengan Lucide icon + label
- Active state highlight (bg-jw-blue + text-jw-cream)
- Hover state (text-jw-coral + bg-jw-pill-grey-bg)
- User area pakai Avatar component (kalau logged in)

---

### Step 7 — Janji card v2 dengan Avatar + region tag + timing (3 jam)

**Source reference**: `docs/design-system-reference/PageBeranda.jsx` — section "Janji yang lagi panas hari ini"

**Files**: 
- `apps/web/src/app/tagih/janji-row.tsx`
- `apps/web/src/components/beranda/janji-prominent-cards.tsx` (extend, OR create new variant)
- `apps/web/src/app/tagih/components/janji-card-with-badge.tsx`

Pattern card baru:

```tsx
import { Avatar } from '@/components/ui/avatar';
import { Pill } from '@/components/ui/pill';
import { RegionTag } from '@/components/ui/region-tag';
import { TrendingUp, AlertTriangle, TrendingDown } from 'lucide-react';
import { formatRelativeTime } from '@/lib/util/format-relative-time';

// Dalam JanjiRow component:
return (
  <Link href={`/tagih/${janji.id}`} className="card-lift block ...">
    <div className="flex items-start gap-3">
      <Avatar name={janji.pejabat_nama} size="md" level={janji.pejabat_level} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-semibold text-jw-blue">{janji.pejabat_nama}</span>
          {janji.pejabat_jabatan && (
            <span className="text-xs text-jw-muted">· {janji.pejabat_jabatan}</span>
          )}
        </div>
        
        <p className="font-display text-base italic text-jw-ink mt-2 line-clamp-3">
          {janji.janji_text}
        </p>
        
        <div className="flex items-center gap-2 flex-wrap mt-3">
          {janji.region_level && <RegionTag level={janji.region_level} />}
          <Pill tone={statusTone(janji.status)}>{janji.status}</Pill>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {/* Status timing annotation */}
        <span className="inline-flex items-center gap-1 text-xs text-jw-muted">
          <TrendingUp size={11} />
          Status berubah {formatRelativeTime(janji.status_updated_at)}
        </span>
      </div>
    </div>
  </Link>
);
```

**Catatan**: `janji.pejabat_level` field belum ada di schema — fallback ke level fixed (mis. 5) atau computed from total_pemantau.

**Acceptance**:
- Per-janji card render dengan Avatar circular name-hued
- Region tag pill (PROVINSI/PUSAT/KOTA)
- Status pill (Berjalan/Mandek/Ditepati/Diingkari)
- Status timing annotation "Status berubah X lalu" dengan icon TrendingUp/AlertTriangle/TrendingDown
- Quote janji italic Vollkorn
- Hover lift effect

---

## Acceptance checklist

- [ ] `globals.css` punya 5 tinted surface tokens (`bg-jw-surface-{blue/coral/marigold/mint/grey}`)
- [ ] `components/ui/avatar.tsx` — name-hued algorithm + level dot, 4 size variant
- [ ] `components/ui/pill.tsx` — 7-tone semantic (blue/coral/marigold/mint/red/grey/dark)
- [ ] `components/ui/region-tag.tsx` — PUSAT/PROVINSI/KOTA wrapper
- [ ] `lib/util/format-relative-time.ts` — Bahasa Indonesia (mnt/j/h/b/t lalu)
- [ ] `site-header.tsx` extended dengan Lucide nav icon per item + active state
- [ ] User area di header pakai Avatar component (kalau logged in)
- [ ] `janji-row.tsx`, `janji-prominent-cards.tsx`, `janji-card-with-badge.tsx` extended dengan Avatar + RegionTag + timing
- [ ] Existing `status-pill.tsx` deprecated, refactor pakai new Pill (gradual, optional)
- [ ] Visual smoke test:
  - Beranda hero janji prominent — avatar tampil dengan level dot
  - /tagih dashboard — filter advanced + per-card avatar/region/timing
  - /tagih/[id] — pejabat avatar di hero
  - Header — 7 nav icon + active state highlight saat di setiap surface
- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm test` pass
- [ ] Test count tambah ≥3 (avatar + pill + format-relative-time test)

---

## Out of scope (defer Wave 2)

- ❌ Multi-column feed Beranda "Lagi Hangat / Karya Terbaru / Aksi Minggu Ini" 3-grid (PageBeranda.jsx pattern)
- ❌ Nala mascot 3D banner (PageNala.jsx + AIPanel.jsx port)
- ❌ Caveat annotation sweep ("← status berubah hari ini") universally
- ❌ Stats & Progress card variations (PageTagih.jsx pattern detail)
- ❌ Paspor Warga 4-page flip 3D (PageProfil.jsx — Sprint 4 scope, separate spec)
- ❌ Logo final hand-crafted SVG (post-funding)
- ❌ Path C strict 100% biru hero enforcement (audit + refactor existing accent usage)
- ❌ Type semantic refactor (CSS variable consolidation)

---

## Risk + mitigation

| Risk | Mitigation |
|---|---|
| `pejabat_level` field belum di DB | Fallback `level={5}` default, atau compute from `total_pemantau` (mis. log scale) |
| `janji.status_updated_at` belum di DB | Pakai `updated_at` existing, Sprint 5+ tambah dedicated field |
| Avatar hue collision (2 nama berbeda hue sama) | Acceptable — visual diversity dari size + initials + level dot juga |
| Pill tone API breaking change | Phase out gradual: keep existing badge component, mark deprecated, migrate per sprint |
| Lucide bundle size bloat | Tree-shake friendly, only import yang dipakai (current: 7 icon nav + ~10 icon lain) |

---

## Coordinate paralel

✅ Aman start kapan pun setelah:
- Sprint 4 phase 1 deploy live
- OR phase 1 commit landed (current state OK)

**File ownership clean** — no overlap dengan Spec #22 (deploy infra), #34 admin work, etc. Spec ini pure **frontend component port**.

**Sequential push order**: 1 window kerjakan sequential per step (1-7). Push setiap component complete biar Mas bisa preview increment.

---

## Commit message template

```
feat(ui): visual parity port Claude Design — Wave 1

Port 5 component dari Claude Design "Jubir Warga Design System":
- Avatar circular name-hued + marigold level dot (4 size variant)
- Pill 7-tone semantic (blue/coral/marigold/mint/red/grey/dark)
- RegionTag PUSAT/PROVINSI/KOTA wrapper
- formatRelativeTime helper Bahasa Indonesia (mnt/j/h/b/t lalu)
- 5 tinted surface tokens di globals.css

Plus extend:
- SiteHeader: Lucide nav icon per item + active state highlight
- Janji card v2: Avatar pejabat + RegionTag + status timing annotation

Source: docs/design-system-reference/ (commit 5f7cf7c)
Per Spec #34 Wave 1. Wave 2 (multi-column, Nala 3D, Caveat sweep) defer.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

---

## Closing note

Wave 1 = 7-8 jam kerjaan, 1 window paralel. Output: Phase 2 visual ~80% match Claude Design quality. Existing investment Sprint 1-3 preserved 100%, cuma extend dengan elements missed.

Sprint 4 phase 2 → Wave 2 (multi-column + mascot 3D + Caveat sweep) → Sprint 5 (Paspor 4-page flip 3D, Logo final, Type semantic refactor).

Pelan-pelan tapi konsisten ke arah Claude Design quality.
