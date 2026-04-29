# Spec #4 — Design heritage port (Nala mascot + logo + signature elements)

**Sprint**: 2
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 4-6 jam
**Dependency**: Tidak ada blocking dependency. Sebaiknya **selesai sebelum** atau **paralel dengan** Spec #3 supaya komponen-komponen tersedia.
**Required reading**: CLAUDE.md section 4 & 5; `apps/legacy/src/components/nala/nala-mascot-and-page.jsx`; `apps/legacy/src/components/layout/main.jsx`; Design v2 doc Section 2 (Brand Identity).

---

## Goal

Port "feel alive" Phase 1 ke Phase 2: mascot Nala (5 ekspresi), logo SVG hand-drawn, 5 ilustrasi SVG kustom prioritas, dan komponen signature (squiggly underline, dashed border illustration card, anotasi rotated, hand-drawn kicker). Output: design system yang konsisten dengan Phase 1 visual identity, type-safe untuk Phase 2.

## Konteks

Phase 1 di `jubir.spdindonesia.org` punya feel yang Mas suka: hidup, "berasa Jubir", micro-imperfeksi yang bikin tidak terasa corporate template. Phase 2 sekarang baru import font + warna — belum punya mascot, belum punya logo SVG, belum punya ilustrasi. Hasilnya generic. Spec ini port semua yang "bikin Jubir terasa Jubir".

## File yang dibuat

```
apps/web/src/components/
├── jw-logo.tsx                     Logo SVG hand-drawn — replace text "Jubir Warga" di SiteHeader
├── nala/
│   ├── nala-mascot.tsx             Mascot SVG dengan 5 ekspresi
│   ├── nala-prompts.ts             Library prompt suggestion (port dari nala-prompts.js)
│   └── nala-trigger-button.tsx     Floating "Tanya Nala" button (untuk dipakai di multiple page)
├── illustrations/
│   ├── hero-baca-dokumen.tsx       #1 — orang muda baca dokumen di kafe
│   ├── hero-lingkar-diskusi.tsx    #4 — sekelompok orang ngobrol di lingkar
│   ├── empty-forum.tsx             #2 — orang duduk di bench, balon bicara kosong
│   ├── empty-karya.tsx             #3 — kanvas kosong dengan kuas
│   └── error-404.tsx               #15 — orang muda garuk kepala dengan map keliru
└── decor/
    ├── squiggly-underline.tsx      Squiggly SVG underline (untuk hero "Pasal 28E")
    ├── annotation-tag.tsx          Caveat font + rotation + arrow → untuk anotasi tangan
    └── dashed-illustration-frame.tsx  Frame untuk ilustrasi placeholder (Beranda hero side)
```

## File yang diubah

- `apps/web/src/components/site-header.tsx` — replace text "Jubir Warga" dengan `<JwLogo />`
- `apps/web/src/app/page.tsx` — replace placeholder dashed div dengan `<HeroBacaDokumen />` di Beranda hero kanan; tambah `<SquigglyUnderline>` di "Pasal 28E"
- `apps/web/src/app/not-found.tsx` — pakai `<Error404 />` ilustrasi
- `apps/web/src/components/beranda/thread-list.tsx` — empty state pakai `<EmptyForum />`

---

## Komponen detail

### 1. `jw-logo.tsx` — Logo wordmark hand-drawn

Source SVG existing: cek `apps/legacy/src/components/layout/main.jsx` cari komponen Header/Logo. Kalau Phase 1 belum punya SVG dedicated dan masih pakai text styled, bikin baru:

```tsx
type Props = {
  size?: number;       // default 32 (header)
  variant?: 'default' | 'cream';  // cream = untuk dark bg
  withSquiggly?: boolean;  // default true
  className?: string;
};

export function JwLogo({ size = 32, variant = 'default', withSquiggly = true, className }: Props) {
  const fill = variant === 'cream' ? '#FFFAEE' : '#1A2256';
  // SVG path inline — wordmark "Jubir Warga" dengan style:
  //   - Huruf bulat (rounded), seperti tulisan spidol
  //   - Sedikit irregular (path command pakai control point yang bergelombang)
  //   - Stroke-linecap: round, stroke-linejoin: round
  //   - Underline squiggly coral di bawah (kalau withSquiggly=true)
  // Ratio width:height = 4:1 (mis. 128×32 saat size=32)
  return (
    <svg ...>
      {/* Path "Jubir" + "Warga" hand-drawn */}
      {/* Optional squiggly underline */}
    </svg>
  );
}
```

**WAJIB**:
- Bukan rendering teks dengan `<text>` SVG element — pakai `<path>` murni
- Tidak boleh pakai font Caveat
- Ada 2 versi warna: blue (default) dan cream (untuk footer dark bg)
- Tinggi default 32px, scalable proporsional

**Kalau Claude Code stuck bikin path SVG hand-drawn dari nol**: pakai SVG dari Phase 1 sebagai source — buka `apps/legacy/src/components/layout/main.jsx`, cari pattern `<svg viewBox=...>` di area Header/Logo, copy path, adapt ke TS component.

### 2. `nala/nala-mascot.tsx` — Mascot 5 ekspresi

Port langsung dari `apps/legacy/src/components/nala/nala-mascot-and-page.jsx`. File source size 16KB, isinya mascot SVG (claymorphism beo) dengan 5 ekspresi: `curious`, `excited`, `mentor`, `thinking`, `confident`.

**Yang HARUS dipertahankan**:
- 5 ekspresi (jangan kurangi)
- Gradient claymorphism (radial gradient untuk body / head / beak)
- Drop shadow filter
- Unique ID per instance untuk avoid SVG `id` collision
- Aria-label: `Nala — ${expression}`

**Yang dimodifikasi untuk TS**:

```tsx
type NalaExpression = 'curious' | 'excited' | 'mentor' | 'thinking' | 'confident';

type Props = {
  expression?: NalaExpression;
  size?: number;        // default 120
  className?: string;
};

export function NalaMascot({ expression = 'curious', size = 120, className }: Props) {
  // Port logic dari Phase 1
  // Convert React.createElement → JSX
  // Convert var → const, function → arrow
  // Tambah type annotations
  return <svg ... />;
}
```

**Catatan**: TIDAK port `PageNala` (komponen full page) di spec ini — itu page-level, akan di-port saat Spec untuk halaman `/nala` dibuat.

### 3. `nala/nala-prompts.ts` — Suggestion prompts library

Port dari `apps/legacy/src/lib/nala-prompts.js`. Strukturnya:

```ts
export type NalaMode = 'tanya' | 'coach' | 'writing' | 'advocacy';

export type NalaPrompt = {
  id: string;
  mode: NalaMode;
  text: string;        // Yang muncul sebagai chip suggestion
  fullPrompt?: string; // Optional: prompt lengkap yang dikirim ke API
};

export const SUGGESTED_PROMPTS: NalaPrompt[] = [
  { id: 'p1', mode: 'tanya', text: 'Jelaskan Pasal 28E secara santai' },
  { id: 'p2', mode: 'advocacy', text: 'Buat draft surat ke Wali Kota soal tarif parkir' },
  // ... 10-12 total dari Design v2 doc Section 4.14
];

// Helper untuk filter by mode
export function getPromptsByMode(mode: NalaMode): NalaPrompt[] { ... }
```

10 prompt dari design doc (sudah ditulis):
1. "Jelaskan Pasal 28E secara santai"
2. "Buat saya draft surat ke Wali Kota soal tarif parkir"
3. "Apa beda DPR sama DPRD?"
4. "Bantu saya pahami janji-janji menteri kesehatan baru"
5. "Cek apakah opini saya kuat secara logika"
6. "Ringkas thread terbaru di forum"
7. "Apa itu RUU PPRT, dan kenapa rame?"
8. "Bantu saya draft pertanyaan untuk DPRD"
9. "Jelaskan APBD daerah saya"
10. "Beri saya 5 fakta soal subsidi BBM 2026"

### 4. `nala/nala-trigger-button.tsx` — Floating "Tanya Nala" button

Floating action button bottom-right, untuk dipakai di multiple page (Beranda, Komunitas, Karya, Reading view, dll). Klik → trigger global panel (akan di-spec di Spec #5).

```tsx
type Props = {
  context?: string;  // contextual hint, mis. "tentang topik ini" / "tentang artikel ini"
  position?: 'bottom-right' | 'bottom-center';  // default bottom-right
};

export function NalaTriggerButton({ context, position = 'bottom-right' }: Props) {
  return (
    <button className="...">
      <Sparkles size={18} />
      <span>Tanya Nala{context ? ` ${context}` : ''}</span>
    </button>
  );
}
```

Style: rounded-jw-full, bg-jw-coral, text-white, shadow-jw-lg, hover scale 1.05. Ukuran touch-target 44×44 minimum (iOS HIG).

### 5-9. Illustrations (5 SVG kustom)

Setiap file struktur:

```tsx
type Props = {
  size?: number | { width: number; height: number };
  className?: string;
  ariaLabel?: string;
};

export function HeroBacaDokumen({ size = 280, className, ariaLabel = 'Ilustrasi orang muda baca dokumen' }: Props) {
  return (
    <svg
      width={typeof size === 'number' ? size : size.width}
      height={typeof size === 'number' ? size : (size.height ?? size.width * 0.75)}
      viewBox="0 0 280 210"
      role="img"
      aria-label={ariaLabel}
      className={className}
    >
      {/* SVG paths */}
    </svg>
  );
}
```

**Style guide (semua 5 ilustrasi):**
- Flat dengan satu shadow halus (drop-shadow filter)
- Stroke organik — gunakan Bezier curve dengan control point yang sedikit bergelombang
- Warna dari 11 brand token saja
- Composition: subjek di tengah/dominant, ada 1-2 detail kontekstual (mis. tas tote, kemeja batik, cangkir kopi)
- Ratio default 4:3 (280×210)

**Konten per ilustrasi (dari Design v2 Section 2.5):**

1. **`hero-baca-dokumen.tsx`** — orang muda baca dokumen di kafe. Detail: kemeja batik kasual, tas tote di samping, cangkir kopi di meja, dokumen di tangan dengan beberapa highlight.
2. **`hero-lingkar-diskusi.tsx`** — sekelompok 4-5 orang duduk lingkar, ada speech bubble kecil keluar dari salah satunya, vibe casual.
3. **`empty-forum.tsx`** — 1 orang duduk di bench, balon bicara KOSONG di atasnya. Vibe lonely-but-hopeful.
4. **`empty-karya.tsx`** — kanvas/easel kosong dengan kuas tergeletak, atau kertas kosong dengan pulpen.
5. **`error-404.tsx`** — orang muda garuk kepala, peta yang dipegang terbalik atau aneh. Vibe bingung-tapi-lucu.

**Kalau Claude Code stuck bikin SVG dari scratch** (5 ilustrasi 4-6 jam terlalu lama): boleh dropdown ke placeholder approach untuk MVP — pakai `<DashedIllustrationFrame>` (komponen 11 di bawah) sebagai wrapper, lalu inside isi dengan minimal SVG sketch (5-10 path simple). Yang penting BUKAN emoji, BUKAN flat color block, BUKAN stock vector.

**Acceptable MVP-quality SVG** (kalau time-constrained):
- Outline-only stroke (1.5-2px) tanpa fill kompleks
- 3-5 path major saja
- Tetap recognizable subjek
- Tetap pakai brand color

**Better-quality SVG** (kalau ada bandwidth):
- Combo outline + soft fill
- 8-15 path
- Detail kontekstual lengkap
- Subtle shadow

### 10. `decor/squiggly-underline.tsx`

```tsx
type Props = {
  width?: number;    // default 200, harus match width text yang di-underline
  color?: string;    // default coral
  thickness?: number; // default 3
  className?: string;
};

export function SquigglyUnderline({ width = 200, color = '#E8632B', thickness = 3, className }: Props) {
  // SVG path zigzag organic
  // Pattern: M0,4 Q5,0 10,4 T20,4 T30,4 ...
  // Repeating until width match
  return <svg ... />;
}
```

Pakai sebagai inline component di bawah text yang mau di-underline, atau via `::after` pseudo-element pakai data URL.

### 11. `decor/annotation-tag.tsx`

Untuk anotasi tangan dengan rotation, mis. "← baca!" atau "← chapter aktif tinggal pilih".

```tsx
type Props = {
  text: string;
  rotation?: number;  // degree, default -4
  color?: 'coral' | 'marigold';  // default coral
  arrowDirection?: 'left' | 'right' | 'none';  // default 'left'
  className?: string;
};

export function AnnotationTag({ text, rotation = -4, color = 'coral', arrowDirection = 'left', className }: Props) {
  return (
    <span
      className={`inline-block font-hand text-jw-${color} ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {arrowDirection === 'left' && '← '}
      {text}
      {arrowDirection === 'right' && ' →'}
    </span>
  );
}
```

### 12. `decor/dashed-illustration-frame.tsx`

Wrapper card dengan dashed border untuk illustration placeholder, sesuai pattern di Beranda Phase 1:

```tsx
type Props = {
  children: ReactNode;
  ratio?: '4/3' | '1/1' | '3/4';  // aspect ratio
  className?: string;
};

export function DashedIllustrationFrame({ children, ratio = '4/3', className }: Props) {
  return (
    <div className={`rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-jw-line bg-jw-blue/[0.04] aspect-[${ratio}] ${className}`}>
      {children}
    </div>
  );
}
```

---

## Acceptance checklist

- [ ] Semua 12 file komponen dibuat sesuai struktur
- [ ] **Logo**: render di Header (light bg, blue) dan Footer (dark bg, cream). Tidak pakai font Caveat. SVG inline.
- [ ] **Nala mascot**: 5 ekspresi render benar — test dengan 5x `<NalaMascot expression="curious|excited|mentor|thinking|confident" />` di test page sementara
- [ ] **5 ilustrasi**: render di context-nya:
  - HeroBacaDokumen di Beranda hero kanan (replace dashed placeholder)
  - HeroLingkarDiskusi di landing section "Apa itu Jubir Warga" (atau standalone test page)
  - EmptyForum di ThreadList saat 0 thread
  - EmptyKarya di Karya page (placeholder, page belum di-port — bisa di standalone test)
  - Error404 di `/not-found`
- [ ] **Squiggly underline**: render di hero "Pasal 28E" (Beranda + Coming Soon hero)
- [ ] **AnnotationTag**: render di Beranda hero dengan teks "← kamu juga bisa!"
- [ ] **DashedIllustrationFrame**: tetap dipertahankan untuk slot ilustrasi yang belum di-port (Sprint 3+)
- [ ] **NalaTriggerButton**: render di Beranda bottom-right (tidak perlu functional yet, button trigger akan diintegrasikan di Spec #5)
- [ ] **Aksesibilitas**: semua SVG punya `role="img"` + `aria-label` yang masuk akal
- [ ] **Performance**: total bundle SVG inline (5 ilustrasi + logo + mascot) < 50KB raw
- [ ] **Visual smoke**: buka `/coming-soon` & `/`, screenshot mobile + desktop, compare dengan `https://jubir.spdindonesia.org` Phase 1 — feel harus konsisten

## Out of scope (next sprint)

- ❌ 10 ilustrasi sisa (akan di-port saat page-nya di-port di Sprint 3+)
- ❌ AI Nala global panel — itu Spec #5
- ❌ Paspor cover SVG — itu page Profil di Sprint 4
- ❌ Map Indonesia SVG — itu page Tagih Janji di Sprint 4
- ❌ Mascot animation (typing, blinking, head bob) — Sprint 3 polish

## QA & visual audit

Setelah implement, screenshot side-by-side:
1. `https://jubir.spdindonesia.org` Beranda hero
2. `localhost:3000` Beranda hero (with new logo + illustration + squiggly + Nala trigger)

Visual harus konsisten dalam: warna, tipografi, micro-imperfeksi (rotation, dashed border), Nala presence, "feel hidup". Kalau Phase 2 terlihat lebih corporate / steril dari Phase 1 — gagal acceptance.
