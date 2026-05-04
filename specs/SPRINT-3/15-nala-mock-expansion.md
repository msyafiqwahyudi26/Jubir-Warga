# Spec #15 — Nala mock responses expansion (batch 2: +8 baru)

**Sprint**: 3 (post-implementation polish)
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 1.5-2 jam
**Dependency**: Commit `383a82d` (8 mock + 11 rule total) sudah landed
**Source**: Context.md "Spec #15 Polish + audit + 8 more mock responses Nala"
**Window**: A (batch 2 paralel — Nala territory dedicated, 0 conflict)

**Decisions Mas (approved 2026-05-04):**
1. ✅ Lanjut expansion 8 mock topic baru (total target: 19 rule)
2. ✅ Brand voice tetap: kamu/aku, Gen Z mix, hindari "civic" + jargon partisan
3. ✅ Pattern follow existing 11 rule (struktur 3-5 paragraf + list + bold key term)

**Required reading:**
1. `apps/web/src/lib/nala/mock-responses.ts` — pattern existing 11 rule
2. `apps/web/src/__tests__/lib-nala-mock-responses.test.ts` — test pattern
3. `CLAUDE.md` §4 (brand voice + Nala system prompt)
4. `memory.md` (citation allowlist NGO)

---

## Goal

Tambah 8 mock response Nala baru → total 19 rule. Cover topic publik yang sering ditanyain anak muda Indonesia tapi belum jadi rule. Setiap response: 3-5 paragraf, struktur list + bold, citation NGO terkemuka.

---

## 8 Topic baru (proposal — Mas adjust kalau perlu)

| # | Topic | Trigger keyword | Citation source |
|---|---|---|---|
| 12 | Reformasi agraria & konflik tanah | "tanah ulayat", "konflik agraria", "HGU", "land grab" | KPA, AMAN, Walhi |
| 13 | UU Cipta Kerja (Omnibus) — implikasi pekerja | "UU Cipta Kerja", "omnibus", "outsourcing", "pesangon" | LBH Jakarta, KSPI |
| 14 | Ruang publik & RTH kota | "RTH", "ruang terbuka hijau", "trotoar", "taman kota" | Rujak Center, Walhi |
| 15 | Pendidikan & UU Sisdiknas | "Sisdiknas", "UKT mahal", "guru honorer", "PPDB zonasi" | Persatuan Guru Republik, FSGI |
| 16 | Kebijakan kesehatan mental | "BPJS mental health", "psikolog", "kesehatan jiwa", "konseling" | Into the Light, IPK Indonesia |
| 17 | Hak digital & data privacy | "UU PDP", "data pribadi", "kebocoran data", "kominfo blokir" | ELSAM, ICT Watch, SAFEnet |
| 18 | Kebebasan pers & UU ITE | "UU ITE", "pasal karet pers", "kriminalisasi jurnalis", "AJI" | AJI, LBH Pers, ICJR |
| 19 | Iklim & transisi energi | "transisi energi", "PLTU batu bara", "krisis iklim", "Paris Agreement" | Walhi, Trend Asia, IESR |

**Mas decision needed**: 8 topic ini OK atau Mas mau swap dengan topic lain (mis. korupsi, transportasi publik, gender, dll)?

Default: pakai 8 di atas. Kalau Mas paste konfirmasi "lanjut", Window A langsung eksekusi.

---

## File yang diubah

```
apps/web/src/lib/nala/mock-responses.ts                 Add 8 rule baru
apps/web/src/__tests__/lib-nala-mock-responses.test.ts  Add 10 test case (keyword match + brand voice + forbidden vocab)
```

## File yang TIDAK diubah

- ❌ `apps/web/src/components/nala/*` (UI Nala, terutama nala-prompt-chips.tsx — chip exposure strategy belum decide, defer)
- ❌ `apps/web/src/lib/nala/nala-prompts.ts` (system prompt, no change)

---

## Step-by-step

### 1. Per topic, tulis 1 mock object (template):

```ts
{
  pattern: /\b(keyword1|keyword2|keyword3)\b/i,
  topic: 'topic-id-slug',
  response: `Halo! Soal **{topic title}**, ini yang aku tahu:

**Apa itu?**
- Penjelasan singkat (1-2 kalimat dengan istilah anak muda)

**Kenapa relevan buat kamu?**
- Konteks practical — gimana isu ini ngaruh ke generasi muda Indonesia
- Contoh konkret (kota tertentu, kasus terkenal, statistik)

**Posisi yang lagi ramai diperdebatkan:**
- Pro: ...
- Kontra: ...
- Catatan dari aku: aku gak partisan, tapi penting kamu tau dua sisi

**Mau gali lebih dalam?**
- [Resource 1 — NGO terkemuka](URL placeholder)
- [Resource 2 — explainer mainstream](URL placeholder)

Ada yang bikin kamu pengen tanya lebih lanjut? Ngobrol aja, aku siap nemenin.`,
}
```

### 2. Citation URL placeholder

Pakai pattern URL placeholder NGO terkemuka per allowlist (memory.md). Contoh:
- `https://kpa.or.id/...`
- `https://www.walhi.or.id/...`
- `https://aji.or.id/...`
- `https://elsam.or.id/...`
- `https://www.lbhjakarta.org/...`

**TODO post-spec**: real URL audit pre-launch (Pending Decision #2 di context.md).

### 3. Test cases (10 baru)

Per topic, minimal 1 keyword match test + 1 negative match test. Plus 2 cross-cutting test:
- Brand voice guard: no "Anda" / "Saya" di 8 response baru
- Forbidden vocab: no "civic" / "warga negara yang kritis" di 8 response baru

```ts
describe('Mock Nala responses — batch 2 (topics 12-19)', () => {
  it.each([
    ['tanah ulayat dijual', 'reformasi-agraria'],
    ['UU Cipta Kerja outsourcing', 'omnibus-pekerja'],
    // ...
  ])('matches "%s" → topic "%s"', (input, expectedTopic) => {
    const result = matchMockResponse(input);
    expect(result?.topic).toBe(expectedTopic);
  });

  it('no "Anda"/"Saya" in batch 2 responses', () => {
    const batch2 = MOCK_RESPONSES.slice(11);
    batch2.forEach((r) => {
      expect(r.response).not.toMatch(/\bAnda\b/);
      expect(r.response).not.toMatch(/\bSaya\b/);
    });
  });

  it('no forbidden vocab in batch 2 responses', () => {
    const batch2 = MOCK_RESPONSES.slice(11);
    batch2.forEach((r) => {
      expect(r.response.toLowerCase()).not.toContain('civic');
      expect(r.response).not.toMatch(/warga negara yang kritis/i);
    });
  });
});
```

---

## Acceptance checklist

- [ ] 8 mock object baru di `MOCK_RESPONSES` array (total 19)
- [ ] Setiap response: 3-5 paragraf, struktur list + bold key term
- [ ] Setiap response: 0 occurrence "Anda"/"Saya" (kamu/aku consistent)
- [ ] Setiap response: 0 occurrence "civic"/"warga negara yang kritis"
- [ ] Setiap response: minimal 2 citation URL placeholder dari NGO allowlist
- [ ] 10 test case baru pass — total test 195 → 205
- [ ] `pnpm typecheck` + `pnpm lint` + `pnpm test` pass

## Out of scope

- ❌ Real URL audit (Pending Decision #2, Sprint 4 awal)
- ❌ Chip exposure strategy (Pending Decision #1, separate decision)
- ❌ Nala UI component change (chips/panel/dialog) — Window A scope cuma data layer

## Commit message

```
feat(nala): expand mock responses — 8 topic baru (total 19 rule)

Topics: agraria, omnibus, RTH, sisdiknas, mental health, data privacy,
UU ITE, transisi energi.

- 8 mock object baru di MOCK_RESPONSES (total 11 → 19)
- 10 test case baru (keyword match + brand voice + forbidden vocab guard)
- Test suite: 195 → 205 pass
- Citation placeholder per allowlist NGO (KPA, Walhi, AJI, ELSAM, dll)

Per Spec #15 batch 2. Real URL audit defer ke Sprint 4 (Pending Decision #2).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

## Coordinate paralel — Window A territory

✅ Aman edit: `lib/nala/mock-responses.ts` + test file
❌ JANGAN edit: `components/nala/*` (chip UI), `lib/nala/nala-prompts.ts`

Pull-rebase sebelum push. Window B/C/D/E paralel di scope berbeda — 0 conflict expected.
