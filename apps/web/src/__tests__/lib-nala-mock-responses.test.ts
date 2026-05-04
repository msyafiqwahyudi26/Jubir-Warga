import { describe, it, expect } from 'vitest';
import { getMockResponse, MOCK_RESPONSES } from '@/lib/nala/mock-responses';

describe('getMockResponse', () => {
  it('matches keyword "pasal 28e" (case insensitive) and returns citation', () => {
    const result = getMockResponse('Apa itu pasal 28E?');
    expect(result.content).toContain('Pasal 28E');
    expect(result.citations).toHaveLength(1);
    expect(result.citations[0]).toMatchObject({ index: 1 });
  });

  it('matches keyword "kelas online"', () => {
    const result = getMockResponse('Saya cari kelas online publik');
    expect(result.content).toContain('Kelas online');
  });

  it('matches keyword "opini" and returns the editorial template', () => {
    const result = getMockResponse('Bantu draft opini buat aku');
    expect(result.content).toContain('Opini editorial');
  });

  it('returns fallback content + empty citations for unknown topic', () => {
    const result = getMockResponse('Cuaca hari ini gimana?');
    expect(result.content).toContain('mode beta');
    expect(result.citations).toEqual([]);
  });

  // 8 curated topics added to match NALA_SUGGESTIONS prompt chips.
  // Each spot-checks a chip phrasing that real users would click.
  it('matches DPR vs DPD chip phrasing', () => {
    const result = getMockResponse('Apa bedanya DPR dan DPD?');
    expect(result.content).toContain('DPR');
    expect(result.content).toContain('DPD');
    expect(result.citations).toHaveLength(1);
  });

  it('matches KUHP pasal karet chip phrasing', () => {
    const result = getMockResponse('Kenapa ada pasal karet di KUHP baru?');
    expect(result.content).toContain('KUHP');
    expect(result.citations).toHaveLength(1);
  });

  it('matches BPJS Kesehatan chip phrasing (case insensitive)', () => {
    const result = getMockResponse('Bagaimana cara cek saldo BPJS Kesehatan online?');
    expect(result.content).toContain('Mobile JKN');
    expect(result.citations).toHaveLength(1);
  });

  it('matches hak warga vs polisi chip phrasing', () => {
    const result = getMockResponse('Apa hak warga ketika diberhentikan polisi?');
    expect(result.content).toContain('Propam');
    expect(result.citations).toHaveLength(1);
  });

  it('matches putusan MK chip phrasing', () => {
    const result = getMockResponse('Putusan MK soal X — apa artinya buat aku?');
    expect(result.content).toContain('amar putusan');
    expect(result.citations).toHaveLength(1);
  });

  it('matches APBD chip phrasing', () => {
    const result = getMockResponse('Gimana baca APBD dengan jujur?');
    expect(result.content).toContain('APBD');
    expect(result.citations).toHaveLength(1);
  });

  it('matches lapor pungli chip phrasing', () => {
    const result = getMockResponse('Aku kena pungli, lapor ke mana?');
    expect(result.content).toContain('Saber Pungli');
    expect(result.citations).toHaveLength(1);
  });

  it('matches pilkada vs pemilu chip phrasing', () => {
    const result = getMockResponse('Apa beda pilkada vs pemilu legislatif?');
    expect(result.content).toContain('Pilkada');
    expect(result.content).toContain('Pilpres');
    expect(result.citations).toHaveLength(1);
  });

  it('uses Nala brand voice in new responses (kamu/aku, no saya/Anda)', () => {
    const phrasings = [
      'Apa bedanya DPR dan DPD?',
      'Aku kena pungli, lapor ke mana?',
      'Apa hak warga ketika diberhentikan polisi?',
    ];
    for (const phrase of phrasings) {
      const result = getMockResponse(phrase);
      // Soft check: response must address the user as "kamu" somewhere.
      expect(
        /\bkamu\b/i.test(result.content),
        `${phrase}: response should address user as "kamu"`,
      ).toBe(true);
      // No formal "Anda"/"Saya" — Nala uses kamu/aku per CLAUDE.md 4.2.
      expect(result.content).not.toMatch(/\bAnda\b/);
      expect(result.content).not.toMatch(/\bSaya\b/);
    }
  });

  it('avoids forbidden vocabulary "civic" across all canned responses', () => {
    // Sweep every canned topic — none should use "civic" per CLAUDE.md 4.3.
    const samples = [
      'Apa itu pasal 28E?',
      'Saya cari kelas online publik',
      'Bantu draft opini buat aku',
      'Apa bedanya DPR dan DPD?',
      'Kenapa ada pasal karet di KUHP baru?',
      'cek BPJS',
      'razia polisi',
      'putusan MK',
      'baca APBD',
      'lapor pungli',
      'pilkada',
    ];
    for (const sample of samples) {
      const result = getMockResponse(sample);
      expect(result.content.toLowerCase()).not.toContain('civic');
    }
  });

  // ── Spec #15 batch 2 (topic 12-19) ────────────────────────────
  // 8 mock baru: agraria, omnibus, RTH, sisdiknas, mental health,
  // data privacy, UU ITE, transisi energi.

  it('matches reformasi agraria chip phrasing', () => {
    const result = getMockResponse('Konflik agraria di kampung halaman aku');
    expect(result.content).toContain('HGU');
    expect(result.citations).toHaveLength(1);
  });

  it('matches UU Cipta Kerja chip phrasing', () => {
    const result = getMockResponse('Apa dampak UU Cipta Kerja ke pekerja?');
    expect(result.content).toContain('Outsourcing');
    expect(result.citations).toHaveLength(1);
  });

  it('matches RTH / ruang publik chip phrasing', () => {
    const result = getMockResponse('Kenapa RTH di Jakarta sedikit?');
    expect(result.content).toContain('Ruang Terbuka Hijau');
    expect(result.citations).toHaveLength(1);
  });

  it('matches Sisdiknas / UKT chip phrasing', () => {
    const result = getMockResponse('UKT kampusku naik 100%, gimana?');
    expect(result.content).toContain('UKT');
    expect(result.citations).toHaveLength(1);
  });

  it('matches kesehatan mental chip phrasing', () => {
    const result = getMockResponse('Mau cari psikolog murah, gimana ya?');
    expect(result.content).toContain('BPJS');
    expect(result.citations).toHaveLength(1);
  });

  it('matches UU PDP / data privacy chip phrasing', () => {
    const result = getMockResponse('Data pribadi aku bocor, harus gimana?');
    expect(result.content).toContain('UU PDP');
    expect(result.citations).toHaveLength(1);
  });

  it('matches UU ITE / kebebasan pers chip phrasing', () => {
    const result = getMockResponse('Aku mau posting kritik, takut kena UU ITE');
    expect(result.content).toContain('UU ITE');
    expect(result.citations).toHaveLength(1);
  });

  it('matches transisi energi / krisis iklim chip phrasing', () => {
    const result = getMockResponse('Gimana progres transisi energi Indonesia?');
    expect(result.content).toContain('PLTU');
    expect(result.citations).toHaveLength(1);
  });

  it('batch 2 responses use "kamu/aku" voice (no Anda/Saya)', () => {
    // Slice from index 11 onward = batch 2 (topic 12-19).
    const batch2 = MOCK_RESPONSES.slice(11);
    expect(batch2).toHaveLength(8);
    for (const rule of batch2) {
      expect(rule.response).not.toMatch(/\bAnda\b/);
      expect(rule.response).not.toMatch(/\bSaya\b/);
      expect(/\bkamu\b/i.test(rule.response)).toBe(true);
    }
  });

  it('batch 2 responses avoid forbidden vocab (civic, "warga negara yang kritis")', () => {
    const batch2 = MOCK_RESPONSES.slice(11);
    for (const rule of batch2) {
      expect(rule.response.toLowerCase()).not.toContain('civic');
      expect(rule.response).not.toMatch(/warga negara yang kritis/i);
    }
  });
});
