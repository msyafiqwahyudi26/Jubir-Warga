# JWIcon — Custom SVG icon set Jubir Warga

Foundation Tier 2 brand-aligned icon set. Goal jangka panjang: replace Lucide
secara bertahap dengan icon hand-drawn brand-aligned (mirror logo + Nala mascot
treatment). Sprint 3 = 5 placeholder icon untuk validate pattern. Sprint 4-5 =
designer expand jadi 30-40 icon set lengkap.

Sumber decision: brand policy Mas 2026-05-01 (CLAUDE.md Section 5.4 + 5.4b).

## Pakai

```tsx
import { JWIcon } from '@/components/jw-icon';

<JWIcon name="home" size={20} />
<JWIcon name="bell" size={24} className="text-jw-coral" />
<JWIcon name="search" color="#1A2256" />
```

Available sekarang: `home`, `message`, `user`, `search`, `bell`.

## Tambah icon baru

1. Bikin file di `icons/<name>.tsx` ikut pattern existing:
   - viewBox `0 0 24 24`
   - stroke `1.5` (consistent dengan logo treatment)
   - color = `currentColor` default (parent controls via Tailwind text-* class)
   - Sedikit imperfection: `<circle r="0.4" fill={color} />` dot kecil, atau
     line yang gak presisi 100% (mirror hand-drawn feel logo + Nala)
2. Export sebagai named React component (`export function FooIcon(...)`).
3. Register di `jw-icon.tsx`:
   - Import: `import { FooIcon } from './icons/foo';`
   - Tambah ke `ICONS` map: `foo: FooIcon`.
4. Update test di `__tests__/jw-icon.test.tsx` (tambah ke daftar nama).

TypeScript akan auto-pickup nama baru lewat `JWIconName` type.

## Style guideline

- **Stroke**: 1.5px (consistent — bukan 1px atau 2px)
- **Cap / join**: round
- **Color**: `currentColor` — parent component yang kontrol via Tailwind class
- **Imperfection**: 1 dot kecil atau line slightly wonky — mirror logo + Nala
- **NO**: gradient, shadow, multi-color, fill solid (untuk icon — emoji boleh
  full color, see `../jw-emoji/`)
- **Brand palette only** kalau perlu warna eksplisit (11 token CLAUDE.md 5.1)

## Anti-pattern (jangan lakukan)

- ❌ Native unicode emoji sebagai icon
- ❌ Lucide import langsung di icon set ini (Lucide tetap jalan paralel,
  tapi gak masuk ke `jw-icon/`)
- ❌ Stroke selain 1.5px
- ❌ Font-based icon (icomoon, fontawesome)
- ❌ Warna di luar 11 brand token

## Roadmap

| Sprint | Scope |
|---|---|
| 3 (sekarang) | 5 icon placeholder (home, message, user, search, bell) — validate pattern |
| 4-5 | 30-40 icon brand-aligned (designer atau freelancer task), replace Lucide bertahap |
| 5+ | SVG sprite optimization (1 file untuk semua), animation per icon kalau perlu |

Lihat `BACKLOG.md` "Custom SVG emoji set + custom icon set (brand-aligned)"
untuk full vision.
