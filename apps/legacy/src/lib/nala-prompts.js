// ─────────────────────────────────────────────────────────
// Jubir Warga — Nala AI mock prompt library
//
// 4 mode (Tanya / Coach / Writing / Advocacy) + pre-canned
// response untuk demo. Phase 2: replace dengan Claude API call.
//
// Pakai via window.JWNala.{modes, suggestions, respond, etika}.
// ─────────────────────────────────────────────────────────

(function (global) {
  'use strict';

  // ── 4 Mode Nala ──────────────────────────────────────
  const MODES = [
    {
      id: 'tanya',
      label: 'Tanya',
      icon: '🤔',
      color: 'blue',
      tagline: 'Tanya apa saja seputar isu publik & demokrasi',
      placeholder: 'Misal: Apa itu UU Cipta Kerja?',
    },
    {
      id: 'coach',
      label: 'Coach',
      icon: '🎓',
      color: 'mint',
      tagline: 'Bantu refleksi & rencana aksi pribadi',
      placeholder: 'Misal: Aku ragu mau ikut demo, gimana ya?',
    },
    {
      id: 'writing',
      label: 'Writing',
      icon: '✍️',
      color: 'coral',
      tagline: 'Bantu nulis surat, opini, atau caption',
      placeholder: 'Misal: Bantu draft surat ke DPRD soal banjir',
    },
    {
      id: 'advocacy',
      label: 'Advocacy',
      icon: '📣',
      color: 'marigold',
      tagline: 'Strategi kampanye & narasi gerakan',
      placeholder: 'Misal: Cara framing isu transportasi publik',
    },
  ];

  // ── Suggested prompts per mode ──────────────────────
  const SUGGESTIONS = {
    tanya: [
      'Apa bedanya DPR dan DPD?',
      'Kenapa ada pasal karet di KUHP baru?',
      'Bagaimana cara cek saldo BPJS Kesehatan online?',
      'Apa hak warga ketika diberhentikan polisi?',
      'Bedanya ormas dengan LSM?',
    ],
    coach: [
      'Aku capek lihat berita hoaks terus, gimana cara filter info?',
      'Mau aktif di RT/RW tapi malu, ada saran?',
      'Gimana cara ngobrolin politik sama keluarga tanpa berantem?',
      'Aku merasa suaraku gak didengar, masih relevan vote?',
    ],
    writing: [
      'Bantu draft surat keberatan ke pengembang yang ngeruk lahan',
      'Tulisin opini singkat soal kenapa pajak harus transparan',
      'Caption IG buat ajakan ikut audiensi DPR',
      'Email follow-up ke ombudsman soal laporan yang macet',
    ],
    advocacy: [
      'Framing untuk isu hak ojol yang gak menyinggung kelas menengah',
      'Strategi 30 hari kampanye lokal soal sampah',
      'Cara approach jurnalis untuk story isu kita',
      'Bikin one-pager untuk meyakinkan anggota DPRD',
    ],
  };

  // ── Pre-canned response (mock — Phase 2 ke Claude API) ──
  // Key: substring trigger di prompt user (lower-case).
  // Value: [text, suggested follow-ups]
  const CANNED = {
    'uu cipta kerja': {
      reply:
        `**UU Cipta Kerja** (UU 6/2023) adalah omnibus law hasil revisi setelah Mahkamah Konstitusi menyatakan versi 2020 inkonstitusional bersyarat. Tujuannya: konsolidasi >70 UU jadi satu untuk "mempermudah investasi".\n\nKritik utama: pasal ketenagakerjaan (PHK lebih mudah, outsourcing diperluas), pelemahan AMDAL, dan klausul yang mengurangi peran pemda. Pendukung argumen: realitas birokrasi kita memang berbelit, perlu konsolidasi.\n\nKamu mau dalami sisi mana — buruh, lingkungan, atau prosedur legislatifnya?`,
      followups: [
        'Sisi buruh — apa yang berubah di pesangon?',
        'Sisi lingkungan — kenapa AMDAL dilemahkan?',
        'Bagaimana proses ini lolos di parlemen?',
      ],
    },
    'dpr dan dpd': {
      reply:
        `**DPR** = Dewan Perwakilan Rakyat. 580 anggota dari partai politik. Bertugas legislasi (bikin UU), anggaran (APBN), dan pengawasan eksekutif. Dipilih per dapil, satu dapil bisa banyak kursi.\n\n**DPD** = Dewan Perwakilan Daerah. 152 anggota (4 per provinsi), wajib non-partai (perseorangan). Tugas terbatas: usul RUU otonomi daerah, pengelolaan SDA, dan pengawasan UU yang menyangkut daerah. Tidak bisa membentuk UU sendirian.\n\nIntinya: DPR powerful, DPD lebih simbolik. Bersama Presiden mereka bentuk MPR.`,
      followups: [
        'Kenapa DPD dibentuk kalau kekuasaannya kecil?',
        'Cara cek anggota DPR & DPD dari dapilku',
        'Bisa nggak DPD diperkuat?',
      ],
    },
    'ragu demo': {
      reply:
        `Wajar ragu — bukan berarti gak peduli. Beberapa hal yang biasanya bikin ragu: takut ditangkap, gak yakin akan efektif, atau malu sendirian.\n\nCoba pikirkan dulu: apa **isu spesifik** yang menggerakkan kamu? Apa **kapasitas pribadi** kamu untuk hari itu (waktu, kesehatan, keuangan kalau kena masalah)? Apa **dukungan logistik** yang ada (teman, hotline LBH, ID line, tas darurat)?\n\nDemo itu satu cara dari banyak. Kalau belum siap fisik, bisa kontribusi via dukung donasi BBM mobil komando, sebar info di IG, jadi pemantau remote, atau dokumentasi.`,
      followups: [
        'Buatkan checklist persiapan demo',
        'Cara amankan diri kalau dirsoir polisi',
        'Cara bantu kalau gak bisa hadir fisik',
      ],
    },
  };

  // ── Etika prinsip Nala (untuk halaman /nala/etika) ──
  const ETIKA = [
    {
      title: 'Aku bukan pengganti ahli.',
      body:  'Untuk keputusan hukum, medis, atau finansial yang penting, konsultasikan ke profesional bersertifikat. Aku bantu memahami konteks, bukan memberi nasihat akhir.',
    },
    {
      title: 'Aku bisa salah.',
      body:  'Data latihku ada batas waktu, dan aku bisa "mengarang" detail. Kalau kamu butuh angka atau pasal spesifik, cek sumber primer (UU, putusan MK, BPS, dst.).',
    },
    {
      title: 'Aku tidak netral mutlak.',
      body:  'Aku berpijak pada nilai konstitusi dan HAM. Aku tidak memberi platform untuk kebencian rasial, agama, atau ajakan kekerasan. Tapi soal kebijakan, aku usahakan menyajikan multi-perspektif.',
    },
    {
      title: 'Datamu privat.',
      body:  'Percakapan kamu disimpan lokal di browser sendiri (localStorage). Tidak ada server Jubir Warga yang mengingatnya — kecuali kamu sadar mengirim sebagai laporan publik.',
    },
    {
      title: 'Aku tidak menggantikan komunitas.',
      body:  'Yang paling tahu masalah kamu adalah kamu dan tetangga kamu. Aku alat bantu, bukan substitusi musyawarah.',
    },
  ];

  // ── Mock respond function ───────────────────────────
  function respond(prompt, mode = 'tanya') {
    const lower = String(prompt || '').toLowerCase();
    for (const key of Object.keys(CANNED)) {
      if (lower.includes(key)) return CANNED[key];
    }
    // Default fallback
    return {
      reply:
        `Pertanyaan menarik. Lagi mode **${mode}**, tapi belum ada respons spesifik untukku di prototipe ini.\n\nVersi rilis nanti aku akan terhubung ke API Claude yang bisa membantu lebih dalam — sekarang masih demo. Coba salah satu pertanyaan di kartu suggested di atas, atau formulasikan ulang.`,
      followups: SUGGESTIONS[mode]?.slice(0, 3) || [],
    };
  }

  // ── Streaming simulator (word-by-word reveal) ───────
  // Pakai: const stop = JWNala.streamReveal(text, onChunk, onDone, 30);
  function streamReveal(text, onChunk, onDone, delayMs = 25) {
    const words = text.split(/(\s+)/);
    let i = 0;
    let buf = '';
    let stopped = false;
    const tick = () => {
      if (stopped) return;
      if (i >= words.length) { onDone && onDone(buf); return; }
      buf += words[i++];
      onChunk && onChunk(buf);
      setTimeout(tick, delayMs);
    };
    tick();
    return () => { stopped = true; };
  }

  // ── Export ───────────────────────────────────────────
  global.JWNala = {
    MODES,
    SUGGESTIONS,
    CANNED,
    ETIKA,
    respond,
    streamReveal,
  };
})(window);
