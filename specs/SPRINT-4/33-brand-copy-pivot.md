# Spec #33 — Brand Copy + Tagline Pivot

**Sprint**: 4
**Owner**: Claude Code (Window G)
**Estimasi**: 0.5 minggu
**Priority**: P0 (low effort, high signal)
**Dependency**: Sprint 3 baseline
**Source**: `docs/STRATEGY_PIVOT_2026-05-04.md` Section 4

---

## Goal

Update copy publik di seluruh app untuk match positioning baru:
- Tagline primary: **"Setiap janji punya jejak"**
- Tagline sub: **"Janji ditagih, jejaknya tercatat"**
- Tone: kritis fakta + pro-democracy + selaras pemerintah pusat
- Drop framing lama "VICE × Discord × Coursera × Change.org × Wordle"
- Replace generic "civic platform" copy dengan accountability framing

---

## Required reading

1. `docs/STRATEGY_PIVOT_2026-05-04.md` Section 4
2. `CLAUDE.md` §1 (post-pivot positioning) + §4 (brand voice)
3. `apps/legacy/docs/Landing_Page_Beta_Copy.md` — old copy reference (drop)

---

## File yang diubah (copy sweep)

### Primary surfaces

```
apps/web/src/app/layout.tsx                     metadata: title default + description + OpenGraph + Twitter
apps/web/src/app/page.tsx                       Beranda hero copy (handled in Spec #32)
apps/web/src/app/(auth)/masuk/page.tsx          Login page subhead
apps/web/src/app/(auth)/daftar/page.tsx         Daftar page subhead
apps/web/src/components/site-footer.tsx         Footer tagline + beta disclaimer
apps/web/public/manifest.json                   PWA name + description
```

### Static legal/about pages

```
apps/web/src/app/tentang/page.tsx               Update mission + product description
apps/web/src/app/privasi/page.tsx               Add data sources disclosure (RPJMN/RPJMD/Media)
apps/web/src/app/syarat/page.tsx                Add AI verdict disclaimer
apps/web/src/app/etika/page.tsx                 Editorial moderation policy + verification badge explanation
```

### Component microcopy

```
apps/web/src/components/nala/nala-prompts.ts    System prompt update — anchor positioning
apps/web/src/lib/nala/mock-responses.ts         Drop generic "civic" framing kalau ada
```

---

## Step-by-step

### 1. Metadata global

`apps/web/src/app/layout.tsx`:

```ts
export const metadata: Metadata = {
  title: {
    default: 'Jubir Warga — Setiap janji punya jejak.',
    template: '%s · Jubir Warga',
  },
  description:
    'Platform akuntabilitas pemerintah berbasis data resmi (RPJMN/RPJMD/Visi Misi paslon) yang dianalisis AI untuk warga muda Indonesia. Pantau janji bareng-bareng.',
  // ... rest unchanged
  openGraph: {
    title: 'Jubir Warga — Setiap janji punya jejak.',
    description: 'Pantau janji pejabat dari RPJMN/RPJMD, dianalisis AI, ditagih bareng warga muda Indonesia.',
    siteName: 'Jubir Warga',
  },
  twitter: {
    title: 'Jubir Warga',
    description: 'Setiap janji punya jejak.',
  },
};
```

### 2. Manifest PWA

```json
{
  "name": "Jubir Warga",
  "short_name": "Jubir Warga",
  "description": "Setiap janji punya jejak. Platform akuntabilitas pemerintah untuk warga muda Indonesia.",
  ...
}
```

### 3. Footer tagline

`apps/web/src/components/site-footer.tsx`:

```tsx
<p className="mt-3 text-sm text-jw-ink/70 max-w-xs">
  Setiap janji punya jejak. Platform akuntabilitas pemerintah berbasis data + AI 
  untuk warga muda Indonesia.
</p>
<p className="mt-4 text-xs text-jw-muted">
  Sekarang masih beta. Feedback ke{' '}
  <a href="mailto:info@jubirwarga.id" className="text-jw-coral hover:underline">
    info@jubirwarga.id
  </a>
</p>
```

### 4. Halaman Tentang (rewrite)

```md
# Tentang Jubir Warga

**Setiap janji punya jejak.** Janji ditagih, jejaknya tercatat.

Jubir Warga adalah platform akuntabilitas pemerintah untuk warga muda Indonesia 17–39 tahun. 
Kami pantau janji pejabat publik dari **dokumen resmi** (RPJMN, RPJMD, Visi Misi paslon di KPU), 
**dianalisis AI** untuk konsistensi-nya, dan **ditagih bareng-bareng** lewat dashboard publik + 
diskusi komunitas + game ringan.

## Misi

Bantu warga muda Indonesia sadar bahwa **kebijakan pemerintah ngaruh ke hidup sehari-hari**. 
Kami percaya akuntabilitas adalah bentuk dukungan terbaik — bukan oposisi, bukan partisan, 
bukan attack. Sejalan dengan agenda pembangunan pemerintah pusat.

## Apa yang kami lakukan

1. **Tagih Janji** — database publik janji pejabat dengan alignment scoring per region
2. **Live Watch AI** — scrape media mainstream + analyze konsistensi vs visi misi/RPJMN real-time
3. **Janji vs Realita game** — quiz 30-detik fact-grounded untuk awareness
4. **Komunitas** — diskusi per janji, ruang warga bareng-bareng

## Verifikasi & sumber

Setiap janji + verdict di platform kami punya badge transparency:
- ✅ **Terverifikasi Kurator** — direview manual oleh tim editorial Jubir Warga
- 🤖 **Kurasi AI** — auto-generated dari pipeline AI, di-tag transparan

Sumber data: Bappenas (RPJMN), Pemprov (RPJMD), KPU (Visi Misi paslon), BPS (Indeks pembangunan), 
media mainstream Indonesia (Kompas, Tempo, Detik, Antara, CNN ID, Tirto).

## Dari SPD Indonesia

Jubir Warga lahir dari **SPD Indonesia (Sindikasi Pemilu & Demokrasi)** sebagai platform digital 
untuk anak muda. Sedang dalam proses pembentukan PT independen 2026.
```

### 5. Halaman Privasi (data disclosure)

Add section "Data sources" yang jelas untuk transparency:

```md
## Data sources

Data janji pejabat di Jubir Warga berasal dari:

### Dokumen resmi pemerintah
- **RPJMN** (Bappenas) — Rencana Pembangunan Jangka Menengah Nasional
- **RPJMD** (Pemprov / Pemkab / Pemkot) — Rencana per region
- **Visi Misi paslon** (KPU) — komitmen kampanye saat pemilu/pilkada
- **Indeks BPS** — IPM, IDH, IPMD untuk konteks indikator pembangunan

### Media mainstream Indonesia (Live Watch source)
Kompas, Tempo, Detik, Antara, CNN Indonesia, Tirto, Kumparan — di-scrape untuk pernyataan 
kebijakan pejabat publik. Hanya kutipan langsung yang dikutip (fair use), full artikel link 
ke source asli.

### Lapor warga (UGC)
Pengguna terdaftar dapat lapor janji baru. Setiap submission moderasi editorial sebelum publish.

## Privasi pengguna

(...existing privacy policy continue...)
```

### 6. Halaman Etika (verification policy)

```md
# Etika Komunitas + Editorial Policy

## Verification badge

Setiap konten di Jubir Warga punya badge transparency:

- ✅ **Terverifikasi Kurator**: Reviewed manual oleh tim editorial Jubir Warga.
  Verdict + reasoning sudah dikalibrasi dengan dokumen sumber + konteks editorial.
- 🤖 **Kurasi AI**: Auto-generated dari pipeline AI (embedding + LLM Claude). 
  Di-tag transparan, masih dapat diakses publik tetapi belum melalui review manual.

## AI verdict disclaimer

Verdict AI di Live Watch dibuat berdasarkan analisis dokumen publik. **Bukan tuduhan final**. 
Verdict 4-tier:
- ✅ Aligned — sesuai
- 🟢 Partial — sebagian sesuai
- 🟡 Drift — perlu klarifikasi (bukan "ingkar")
- 🔴 Contradict — bertentangan dengan reference

Tone non-accusatory. Pejabat publik berhak request klarifikasi → akan ditampilkan side-by-side 
dengan AI verdict. (Mekanisme right-of-reply Sprint 5+.)

## Komunitas guidelines

- Diskusi fact-grounded — argumen berdasar data, bukan attack personal
- Hormati perbedaan pendapat — bisa debat sehat
- No partisan — tidak endorse partai/kandidat tertentu
- No hate speech, no SARA, no fitnah/hoaks
- Moderasi: laporan dari user → editorial review → action (warning / mute / ban)
```

### 7. Nala system prompt update

`apps/web/src/components/nala/nala-prompts.ts`:

```ts
export const NALA_SYSTEM_PROMPT = `
Kamu adalah Nala, AI persona dari platform Jubir Warga (Indonesia).

IDENTITY:
- Nama: Nala — beo (parrot) yang jadi sahabat warga digital.
- Karakter: hibrid sahabat dan mentor.

PLATFORM CONTEXT:
- Jubir Warga = platform akuntabilitas pemerintah berbasis data resmi (RPJMN/RPJMD/Visi Misi)
  yang dianalisis AI untuk warga muda Indonesia.
- Tagline: "Setiap janji punya jejak."
- Tone: kritis fakta, pro-democracy, selaras agenda pembangunan pemerintah pusat.
- Bukan oposisi. Bukan partisan. "Akuntabilitas = bentuk dukungan terbaik."

VOICE:
- Pakai "aku" / "kamu", BUKAN "saya" / "Anda".
- Bilingual mix Indonesia santai. Sesekali boleh campur istilah asing umum di Gen Z.
- Tidak menggurui. Tidak terlalu formal.
- Pakai contoh konkret Indonesia (KRL, ojek online, kantin SD, RT/RW).

NILAI:
- Selalu sertakan sumber kalau claim sesuatu — mention page RPJMN/RPJMD spesifik kalau relevan.
- Akui ketidakpastian. Lebih baik bilang "aku nggak yakin, tapi..." daripada nge-fake sure.
- Tidak partisan — tidak endorse partai/kandidat.
- Tidak bikin konten ujaran kebencian, fitnah, atau hoaks.
- Hormati perbedaan pendapat. Bisa diajak debat sehat.

KAPABILITAS:
- Penjelasan UU/Pasal/janji dalam bahasa anak muda.
- Bantu warga baca dokumen RPJMN/RPJMD + visi misi paslon.
- Coach kelas: cek pemahaman, jawab pertanyaan, kasih latihan.
- Ringkas thread panjang jadi poin kunci.
- Suggest aksi konkret berdasar percakapan (lapor janji, ikut diskusi, dll).

BATASAN:
- Tidak kasih saran hukum spesifik (rujuk ke pengacara).
- Tidak kasih saran medis.
- Tidak kasih informasi yang bisa dipakai menyakiti orang.
- Kalau user ngomongin distress mental berat, suggest hotline + sumber profesional.
`;
```

---

## Acceptance checklist

- [ ] Metadata global update (title, description, OG, Twitter)
- [ ] Manifest PWA description match new tagline
- [ ] Footer copy update — "Setiap janji punya jejak" tagline + new positioning
- [ ] Tentang page rewritten — match new mission + verification badge explanation
- [ ] Privasi page tambah Data Sources section (transparency)
- [ ] Etika page tambah AI verdict disclaimer + verification badge explanation
- [ ] Login + Daftar page subhead match new positioning
- [ ] Nala system prompt update — anchor pivot context
- [ ] Drop framing "VICE × Discord × Coursera × Change.org × Wordle" anywhere
- [ ] Drop generic "civic" framing — replace dengan "akuntabilitas" / "warga muda Indonesia"
- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm test` pass

---

## Out of scope (defer)

- ❌ Multi-language translation (English) — Sprint 5+
- ❌ Marketing landing page baru (separate from app) — separate spec
- ❌ Press kit / brand asset rebuild — Sprint 5+
- ❌ IG content calendar refresh — out of repo scope (handle by content team)

---

## Coordinate paralel — Window G territory

✅ Aman: `apps/web/src/app/tentang/page.tsx`, `privasi/page.tsx`, `syarat/page.tsx`, `etika/page.tsx`, `apps/web/src/app/layout.tsx` (metadata only), `apps/web/src/components/site-footer.tsx`, `apps/web/public/manifest.json`, `apps/web/src/components/nala/nala-prompts.ts`

⚠️ Coordinate dengan Window F (#32 Beranda) — copy hero handled di Spec #32, jangan double-edit `app/page.tsx`

---

## Commit message

```
feat(brand): copy + tagline pivot — "Setiap janji punya jejak"

- Metadata global update (title default, description, OG, Twitter)
- Manifest PWA description
- Footer tagline + beta disclaimer
- Tentang page rewrite — match new mission + verification badge
- Privasi page tambah Data Sources transparency
- Etika page tambah AI verdict disclaimer
- Login/Daftar subhead align pivot
- Nala system prompt anchor pivot context
- Drop framing "VICE × Discord × Coursera" lama

Per Spec #33 — visible signal pivot brand-wide.
```
