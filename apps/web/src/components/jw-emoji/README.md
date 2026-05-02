# JWEmoji — Custom SVG emoji set Jubir Warga

Foundation Tier 2 brand-aligned emoji set. Pengganti native unicode emoji
(`🚇📚✅❌`) yang dilarang sebagai brand decor karena style-nya inkonsisten
antar OS (Apple/Google/Windows). Sprint 3 = 5 placeholder emoji untuk validate
pattern. Sprint 4-5 = designer expand jadi 30-50 emoji set lengkap.

Sumber decision: brand policy Mas 2026-05-01 (CLAUDE.md Section 5.4b).

## Pakai

```tsx
import { JWEmoji } from '@/components/jw-emoji';

<JWEmoji name="kategori-transport" size={24} />
<JWEmoji name="status-ditepati" size={32} />
<JWEmoji name="reaksi-love" />
```

Available sekarang:

| Name | Tipe | Warna utama |
|---|---|---|
| `kategori-transport` | Kategori isu | jw-blue + cream + coral accent |
| `kategori-pangan` | Kategori isu | jw-blue + cream + mint + coral + marigold |
| `status-ditepati` | Status janji | mint + cream |
| `status-mandek` | Status janji | marigold + jw-blue + cream |
| `reaksi-love` | Reaksi UGC | coral + cream |

## Tambah emoji baru

1. Bikin file di `emoji/<name>.tsx` ikut pattern existing:
   - viewBox `0 0 32 32` (lebih besar dari icon — emoji lebih detail)
   - **Full-color brand palette** — wajib pakai 11 token CLAUDE.md 5.1:
     `#1A2256`, `#FFFAEE`, `#3B4A8A`, `#2A2D3A`, `#6B6860`, `#E6DECB`,
     `#E8632B`, `#F2B137`, `#7FB69E`, `#C44434`, `#8A9099`
   - Sedikit imperfection: hand-drawn feel, sedikit irregular
   - Detail kecil OK (e.g. window di transport, butir nasi di pangan)
2. Export sebagai named React component (`export function FooEmoji(...)`).
3. Register di `jw-emoji.tsx`:
   - Import: `import { FooEmoji } from './emoji/foo';`
   - Tambah ke `EMOJIS` map: `'foo-name': FooEmoji`.
4. Update test di `__tests__/jw-emoji.test.tsx` (tambah ke daftar nama).

Naming convention: `<kategori>-<spesifik>` (e.g. `kategori-pendidikan`,
`status-diingkari`, `reaksi-insight`, `aksi-petisi`).

## Style guideline

- **viewBox**: `0 0 32 32` (consistent — beda dari icon yang 24x24)
- **Full color**: BUKAN single-stroke. Pakai `fill` brand palette + sedikit
  detail kontras (cream untuk highlight, blue untuk dasar, accent coral/
  marigold/mint untuk variasi)
- **Hand-drawn feel**: sedikit irregular, mirror logo + Nala mascot. Bukan
  presisi geometrik
- **Brand palette only** — JANGAN pakai warna di luar 11 token
- **NO**: gradient kompleks (radial OK kalau dipakai sparingly), photo-real,
  isometric 3D

## Anti-pattern (jangan lakukan)

- ❌ Native unicode emoji (`🚇📚`) — itu yang digantikan
- ❌ Stock-style colorful flat icon (rainbow icons set)
- ❌ Warna di luar 11 brand token
- ❌ Single-stroke style (itu domain icon, bukan emoji)

## Roadmap

| Sprint | Scope |
|---|---|
| 3 (sekarang) | 5 emoji placeholder — validate pattern |
| 4-5 | 30-50 emoji full set (designer task): kategori isu lengkap (Transport, Pangan, Pendidikan, Kesehatan, Lingkungan, Pekerjaan, Politik, Budaya), reaksi UGC (love, like, insight, pertanyaan, sedih, marah), status janji (selesai, jalan, mandek, diingkari, belum), action (petisi, polling, kelas, karya, forum, tagih), aksesoris (paspor, stempel, badge level) |
| 5+ | SVG sprite optimization, optional Lottie animation per emoji untuk reaksi UGC |

Lihat `BACKLOG.md` "Custom SVG emoji set + custom icon set (brand-aligned)"
untuk full vision.
