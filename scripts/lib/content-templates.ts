// Indonesian-flavored content banks for thread / reply / karya / laporan generation.
//
// Constraint per Spec #2: konten TIDAK boleh menyebut tokoh real selain pejabat
// yang sudah di-seed (14 nama di PEJABAT_SEED_NAMES). No real artists, athletes,
// celebs, journalists, etc. Faker.person.fullName produces fictional Indonesian
// names which is fine for inline mentions.
//
// Geographical consistency: a thread body is built with a single anchorKota
// passed into buildThreadBody — every {kota} occurrence resolves to the same
// city. No more "Semarang in sentence 1, Medan in sentence 2".
//
// Latin-free guarantee: NO faker.lorem.* anywhere. {detail} placeholder pulls
// from INDONESIAN_FILLER. Per-paragraph chains pull from THREAD_BODY_BANK.

import { f, faker } from './faker-id';
import { pickRandom, pickN, randInt, weightedPick } from './distributions';

// ─── Reusable banks ────────────────────────────────────

export const KOTA_LIST = [
  'Jakarta', 'Bandung', 'Surabaya', 'Malang', 'Yogyakarta', 'Medan', 'Makassar',
  'Semarang', 'Denpasar', 'Solo', 'Bekasi', 'Tangerang', 'Depok', 'Padang',
] as const;

// 14 real pejabat from seed.sql — these are the ONLY public figures we may name.
export const PEJABAT_SEED_NAMES = [
  'Joko K.', 'Pramono A.', 'Sri Mulyani', 'Anies B.', 'Ridwan K.',
  'Khofifah', 'Bobby N.', 'Danny P.', 'Edy R.', 'Andi Sudirman',
  'Eri C.', 'Sanusi', 'Ridwan Suryadi', 'Anisa Putri',
] as const;

export const TOPIK_KEBIJAKAN = [
  'Cipta Kerja', 'KUHP', 'IKN', 'PPRT', 'TPKS', 'Minerba',
  'BBM bersubsidi', 'PPN 12%', 'Pendidikan Vokasi', 'Perlindungan Data Pribadi',
] as const;

export const ISSUE_BANK = [
  'kenaikan harga BBM', 'tarif PDAM yang naik', 'sampah di sungai',
  'banjir tahunan', 'lampu jalan mati', 'tarif parkir naik',
  'sekolah bocor pas hujan', 'aplikasi pemerintah error', 'jalur sepeda dipakai motor',
  'pasar tradisional dibongkar', 'subsidi listrik dicabut',
] as const;

export const SITUASI_BANK = [
  'tetangga buang sampah sembarangan', 'jalan rusak nggak diperbaiki',
  'lampu jalan mati seminggu', 'air keruh dari PDAM', 'PJU mati di gang',
  'RT minta iuran nggak jelas', 'tarif parkir naik tiba-tiba', 'tower sinyal goyang',
] as const;

export const AKSI_BANK = [
  'gotong royong bersihin sungai', 'audiensi sama lurah', 'survey tarif PDAM',
  'workshop literasi APBD', 'adopsi pohon di taman kota', 'pemantauan TPS',
  'open data hackathon', 'lomba lukis mural kampung',
] as const;

export const TOPIC_IDS = [
  'politik', 'lingkungan', 'gender', 'mental', 'kerja',
  'pendidikan', 'budaya', 'transport', 'lokal',
] as const;
export type TopicId = typeof TOPIC_IDS[number];

// ─── Generic Indonesian filler sentences (for {detail} resolver) ──

export const INDONESIAN_FILLER: readonly string[] = [
  'Datanya bisa di-cross-check via dashboard transparansi pemerintah daerah, walaupun interface-nya sering nggak ramah.',
  'Buat yang awam isu ini, gue saranin baca rilis NGO kayak ICW atau LBH dulu sebelum bikin konklusi.',
  'Polanya konsisten beberapa tahun terakhir, dan respons baru muncul setelah ada tekanan publik.',
  'Yang menarik justru yang paling vokal di komentar bukan pihak yang paling terdampak.',
  'Kalau ditarik ke level RT/RW, persoalan ini biasanya muncul karena komunikasi yang nggak terstruktur.',
  'Dari pengalaman ngobrol sama beberapa kawan, masalahnya nggak pernah satu sumber — selalu kombinasi sistem.',
  'Banyak warga yang pengen ikut nyuarakan, tapi ribet aksesnya bikin mereka mundur duluan.',
  'Gue catet baik-baik tanggapan dari komen-komen sebelumnya, dan ada beberapa angle yang gue belum pertimbangin.',
  'Solusi cepatnya mungkin nggak ada, tapi setidaknya kita harus terus dokumentasikan supaya nggak hilang dari memori publik.',
  'Mungkin terlalu generalisir, tapi sentimen umum di lingkungan gue cukup mirip soal isu ini.',
  'Yang gue suka dari komunitas ini adalah orang-orang ngeluarin opini tanpa harus menang debat dulu.',
  'Disclaimer: gue belum riset dalem-dalem, jadi koreksi kalau ada yang salah.',
  'Beberapa kawan udah coba advokasi langsung ke OPD terkait, hasilnya mixed.',
  'Bukti-bukti yang udah viral pun seringkali butuh waktu berbulan-bulan sebelum jadi tindakan administratif.',
  'Pertanyaan terbesar gue: gimana kita bedain isu yang struktural sama yang sengaja di-frame begitu.',
  'Bagi gue ini bukan soal benar-salah aja, tapi soal siapa yang ditanggung beban kalau ada miskalkulasi.',
  'Belum ada yang kasih timeline jelas, dan biasanya itu yang bikin warga makin kecewa.',
  'Gue bukan pesimis, tapi pengalaman 3 tahun ngikutin isu sejenis bikin gue belajar untuk kelola ekspektasi.',
  'Akan lebih kuat kalau temen-temen yang relate ikut dokumentasi pengalaman masing-masing di reply.',
  'Mungkin yang lo amatin di kota lo agak beda, mari kita compare di komen.',
];

// ─── Thread body banks (per-topic, ~6-7 sentences each) ──

const POLITIK_SENTENCES: readonly string[] = [
  'RUU yang masuk Prolegnas tahun ini ada belasan, tapi cuma sebagian yang bener-bener di-expose ke publik secara terbuka.',
  'Kalau pejabat udah bilang "masih dalam kajian", biasanya itu sinyal politik bukan teknis.',
  'Yang sering bikin warga capek bukan kebijakan kontroversialnya, tapi proses dialog yang nggak transparan.',
  'Janji kampanye yang masuk progress "mandek" belum tentu sengaja diingkari — kadang konflik antar-stakeholder yang macetin.',
  'Gue pernah ikut audiensi terbuka di kantor lurah, dan literally cuma ada gue plus dua ibu-ibu yang dateng.',
  'Generasi kita nggak apatis — cuma capek dengan ritual partisipasi yang nggak menghasilkan.',
  'Soal {topik_kebijakan}, draft yang beredar di publik dan yang dibahas di komisi seringkali beda kontennya.',
];

const LINGKUNGAN_SENTENCES: readonly string[] = [
  'Data BMKG bulan kemarin nunjukin polusi udara di {kota} udah dua kali ambang aman WHO.',
  'Bank sampah di tingkat RT bisa kerja kalau ada satu orang yang konsisten, biasanya ibu-ibu PKK.',
  'Kalau lihat data deforestasi 5 tahun terakhir, kawasan yang hilang udah setara luas Pulau Bali.',
  'RTH di kota-kota besar masih jauh di bawah standar 30% — paling banter nyentuh 9-10%.',
  'Greenwashing brand fashion lokal makin kreatif, untung pola pikir konsumen muda juga makin kritis.',
  'Sungai yang lewat kampung gue kalau musim kemarau jadi tempat warga buang sampah, bukan masalah baru tapi makin parah.',
  'Audit lingkungan untuk proyek dekat {kota} biasanya ada dokumennya, cuma jarang dibuka ke publik tanpa diminta.',
];

const GENDER_SENTENCES: readonly string[] = [
  'TPKS udah disahin lebih dari dua tahun, tapi sosialisasi di kampus banyak yang masih nol persen.',
  'Cuti melahirkan di sektor formal kadang masih kurang dari tiga bulan, padahal WHO rekomen minimum enam.',
  'Stigma laporan kekerasan masih kuat — banyak korban yang mundur sebelum kasusnya naik ke ranah hukum.',
  'Disclaimer: gue bukan ahli, sekadar share dari support group yang gue ikutin tahun lalu.',
  'Beasiswa khusus perempuan untuk STEM aktif beberapa tahun terakhir, tapi awareness-nya masih rendah.',
  'Catcalling di angkot dan pasar tradisional di {kota} masih jadi normal yang nggak boleh dinormalin.',
  'Yang sering kelewat: pelaku kekerasan domestik kadang dilindungi oleh struktur keluarga sendiri.',
];

const MENTAL_SENTENCES: readonly string[] = [
  'Sliding-scale therapist di kota besar udah mulai banyak, tapi jarang yang publish daftar harganya secara terbuka.',
  'Burnout aktivisme nyata — gue pernah skip tiga bulan dari komunitas dan baru sadar tubuh udah kelelahan.',
  'Doomscrolling itu pelan-pelan ngerusak fokus kita, dan algoritma feed tahu banget cara nge-trigger-nya.',
  'Selfcare bukan brunch hari Minggu — kadang itu ya berarti tidur delapan jam dan stop ngecek WA grup.',
  'Quarter-life crisis di angka 26 itu wajar, terutama di tengah ketidakpastian ekonomi pasca-pandemi.',
  'Kalau ada kawan lagi distress berat, pertanyaan terbaiknya bukan "udah dipikirin?" tapi "lo butuh ditemenin gak?".',
  'Mental health bukan masalah individual aja — sistem kerja, akses transportasi, semua ngaruh.',
];

const KERJA_SENTENCES: readonly string[] = [
  'UMR {kota} naik beberapa persen tahun ini, tapi tarif kos juga naik dengan rasio yang lebih tinggi.',
  'Magang dibayar di bawah UMR sebenernya melanggar, cuma penegakannya lemah karena talent supply lebih banyak dari demand.',
  'Outsource vs PKWT itu beda banget secara legal, dan banyak HR sengaja blur biar fleksibilitas mereka lebih besar.',
  'Serikat pekerja muda di startup masih jarang, padahal isu kesejahteraannya nggak kalah berat dari pabrik.',
  'Freelance pajak gampangnya cek aja PPh 21 lewat aplikasi DJP — kalau di-skip, surat teguran tinggal nunggu waktu.',
  'Yang gue pelajari setelah tiga tahun jadi karyawan: nego gaji bukan kemampuan dasar, itu skill yang harus dilatih.',
  'Pelanggaran jam kerja di banyak startup nggak pernah ke-track karena nggak ada absensi formal.',
];

const PENDIDIKAN_SENTENCES: readonly string[] = [
  'PIP itu program afirmasi yang bagus, tapi distribusinya kadang telat sampai semester berikutnya udah dimulai.',
  'Sekolah negeri yang fasilitasnya bocor pas hujan masih banyak — bukan cuma di provinsi terpencil.',
  'Beasiswa LPDP S2 itu kompetisinya sengit, dan banyak faktor success yang nggak dibahas di YouTube influencer.',
  'Bahasa daerah pelan-pelan hilang dari ruang kelas — ini bukan cuma kerugian budaya, tapi juga kognitif.',
  'Adek gue cerita di sekolahnya, anak-anak udah pakai TikTok lebih sering dari ngobrol di kantin.',
  'Kurikulum Merdeka kelihatan progresif di kertas, tapi guru-guru di lapangan banyak yang nggak dapat training memadai.',
  'Akses internet sekolah di {kota} masih bervariasi — ada yang fiber 100 Mbps, ada yang masih hotspot HP guru.',
];

const BUDAYA_SENTENCES: readonly string[] = [
  'Stand-up di {kota} pelan-pelan mulai berani bahas isu publik, dan respons audiens-nya surprisingly positive.',
  'Indie band yang lirik lagunya politis biasanya dapat traction kecil tapi loyal — itu pasar yang nggak boleh diremehin.',
  'Festival seni warga di {kota} sering kekurangan volunteer, padahal yang minat banyak — masalahnya komunikasi.',
  'Mural di kampung yang dihapus pemerintah daerah biasanya yang paling bagus secara estetik dan paling berani secara pesan.',
  'Podcast politik anak muda yang nggak preachy itu rare, dan biasanya hidupnya nggak lama karena monetisasi sulit.',
  'Film independen yang bahas isu lokal jarang dapat layar bioskop, tapi YouTube + screening komunitas jadi alternatif.',
  'Komik instagram yang bahas isu publik sekarang jadi medium yang efektif buat reach demografi muda di {kota}.',
];

const TRANSPORT_SENTENCES: readonly string[] = [
  'KRL kalau telat itu jarang murni teknis — sering kombinasi sinyal plus cuaca plus jadwal kereta lain.',
  'Jalur sepeda di kebanyakan kota dipakai motor karena penegakan lemah, dan banyak motor sebenernya juga butuh ruang aman.',
  'Tarif ojol naik tapi insentif driver turun — itu pola yang konsisten tiga tahun terakhir.',
  'BRT efektif kalau density-nya cocok — di {kota} feeder-nya kadang nggak nyambung ke gang kecil.',
  'Tarif parkir naik tanpa public consultation itu pola yang berulang di banyak kota.',
  'Halte busway baru dibangun di rute yang udah rame, bukan di rute yang butuh stimulus — itu yang sering gue heran.',
  'Banyak warga {kota} yang commute lebih dari dua jam per hari karena transportasi publik nggak nyentuh kawasan rumah.',
];

const LOKAL_SENTENCES: readonly string[] = [
  'Posyandu yang aktif itu tergantung kader RT — kalau kadernya semangat, bayi-bayi ditimbang teratur.',
  'Karang Taruna {kota} aktif lagi belakangan ini, biasanya digerakin alumni yang udah balik kampung.',
  'Pasar tradisional digantiin minimarket itu punya trade-off jelas: efisiensi vs jaringan ekonomi warga.',
  'Tanah ulayat yang dijual diam-diam biasanya muncul ketika ada proyek infrastruktur dekat sana.',
  'Keluhan kecil di tingkat RT seringkali jadi indikator masalah struktural yang lebih besar.',
  'Kalau RT/RW pengurusnya satu orang sejak lama, biasanya komunikasi info publik macet di pintu ketua.',
  'Acara warga di {kota} masih banyak yang dibiayain swadaya — sehat secara komunitas tapi rapuh secara skala.',
];

export const THREAD_BODY_BANK: Record<TopicId, readonly string[]> = {
  politik: POLITIK_SENTENCES,
  lingkungan: LINGKUNGAN_SENTENCES,
  gender: GENDER_SENTENCES,
  mental: MENTAL_SENTENCES,
  kerja: KERJA_SENTENCES,
  pendidikan: PENDIDIKAN_SENTENCES,
  budaya: BUDAYA_SENTENCES,
  transport: TRANSPORT_SENTENCES,
  lokal: LOKAL_SENTENCES,
};

export const THREAD_OPENERS: readonly string[] = [
  'Disclaimer dulu: ini opini pribadi yang masih bisa salah.',
  'Sebenernya udah lama mau bahas, baru nemu momen yang pas.',
  'Buat yang baru ngikutin diskusi ini, gue kasih konteks dulu.',
  'Mungkin lo udah baca berita serupa, tapi sudut pandang gue agak beda.',
  'Cerita ini mungkin kecil, tapi penting buat dicatat.',
  'Drop pertanyaan dulu sebelum bahas: kalian pernah nemu hal serupa?',
  'Tadi pagi gue baca berita, lalu langsung kepikiran buat bahas di sini.',
  'Posting ini buat yang tinggal di {kota} mungkin lebih relate.',
];

export const THREAD_CLOSERS: readonly string[] = [
  'Kalau ada yang punya data atau pengalaman lain, drop di reply ya.',
  'Gue belum punya jawaban pasti, tapi diskusi-nya sendiri yang mahal.',
  'Maaf kalau panjang — kalau ada yang gue lewatin, koreksi aja.',
  'Yang penting jangan kebawa emosi pas debat soal ini.',
  'Akhir kata, semoga kita tetep waras ngeliat semua ini.',
];

// Map chapter_id (FK target) → kota name, for anchoring body content.
export const CHAPTER_TO_KOTA: Record<string, string> = {
  jakarta: 'Jakarta',
  bandung: 'Bandung',
  malang: 'Malang',
  surabaya: 'Surabaya',
  jogja: 'Yogyakarta',
  medan: 'Medan',
  makassar: 'Makassar',
};

export function chapterToKota(id: string | null | undefined): string {
  if (id && CHAPTER_TO_KOTA[id]) return CHAPTER_TO_KOTA[id] as string;
  return pickRandom(KOTA_LIST);
}

// ─── Thread title templates ────────────────────────────

interface ThreadTpl {
  topic: TopicId;
  titles: readonly string[];
  /** Legacy field — pre-refactor body opener seeds. Unused by buildThreadBody now. */
  hooks?: readonly string[];
}

export const THREAD_TEMPLATES: readonly ThreadTpl[] = [
  {
    topic: 'politik',
    titles: [
      'RUU {topik_kebijakan}, kenapa mandek terus?',
      'Pengalaman ikut audiensi DPR soal {topik_kebijakan} kemarin',
      'Apa hak warga kalau {situasi}?',
      'Kalau {pejabat} bilang udah ditepati, kita ngecek dari mana?',
      'Kenapa partai politik makin nggak ngerti anak muda?',
      'Soal janji {topik_kebijakan} yang katanya udah jalan — beneran?',
      'Anak muda masih perlu masuk partai? Pengalaman gue 2 tahun',
    ],
    hooks: [
      'Disclaimer dulu: ini opini pribadi.',
      'Sebenernya udah lama mau bahas, baru nemu momen pas.',
      'Tadi pagi gue baca berita di {kota},',
      'Buat yang belum tau,',
    ],
  },
  {
    topic: 'lingkungan',
    titles: [
      'Kondisi sungai di {kota} sekarang — foto + analisis',
      'Komunitas kami baru aja {aksi}, sharing pengalaman',
      'Mall baru nutupin RTH — siapa yang kasih izin?',
      'Bank sampah di RT kami akhirnya jalan, ini ceritanya',
      'Polusi udara {kota} udah kayak Jakarta — data BMKG terbaru',
      'Greenwashing brand fashion lokal, gimana cara cek?',
    ],
    hooks: [
      'Foto-foto ini gue ambil weekend kemarin di {kota}.',
      'Kemarin pas {aksi}, ada momen yang bikin mikir.',
      'Iseng-iseng cek data, ternyata {kota} ada di rangking yang nggak banggain.',
    ],
  },
  {
    topic: 'gender',
    titles: [
      'TPKS udah disahin, tapi di kampus kami masih nihil sosialisasi',
      'Cuti melahirkan di kantor swasta — pengalaman temen',
      'Catcalling di angkot {kota} masih jadi normal?',
      'Cara dukung temen yang lagi proses lapor kekerasan',
      'Beasiswa khusus perempuan STEM — list yang masih buka',
    ],
    hooks: [
      'TW: kekerasan seksual.',
      'Disclaimer: gue cowok, cuma share observasi.',
      'Cerita temen, gue sharing dengan izin dia.',
    ],
  },
  {
    topic: 'mental',
    titles: [
      'Cari psikolog yang sliding-scale di {kota} — list 2026',
      'Tips bertahan kalau kerjaan toxic tapi belum bisa resign',
      'Tentang doomscrolling berita politik — gimana cara stop?',
      'Burnout aktivisme nyata — gimana lo handle?',
      'Quarter-life crisis di angka 26, biasa atau red flag?',
    ],
    hooks: [
      'Selflcare bukan berarti spa weekend, btw.',
      'Pengalaman pribadi, take it dengan grain of salt.',
      'Lebih banyak pertanyaan daripada jawaban di sini.',
    ],
  },
  {
    topic: 'kerja',
    titles: [
      'Magang dibayar 500rb/bulan di {kota} — boikot atau ambil?',
      'Outsource vs PKWT — perbedaan yang gue baru ngerti',
      'Serikat pekerja muda di startup, ada nggak?',
      'UMR {kota} naik {nominal}%, tapi tarif kos juga naik',
      'Freelance pajak gimana? Gue baru aja kena teguran',
    ],
    hooks: [
      'Buat yang baru lulus, gue mau share apa yang gue wish gue tau.',
      'Pengalaman 2 tahun terakhir di startup {kota}.',
      'Disclaimer: gue bukan konsultan pajak.',
    ],
  },
  {
    topic: 'pendidikan',
    titles: [
      'PIP cair telat lagi, ini dampaknya buat siswa SMA',
      'Sekolah negeri bocor pas hujan — ini foto dari adek gue',
      'Kurikulum Merdeka di sekolah swasta vs negeri — beda banget',
      'Beasiswa LPDP S2 — tips yang nggak ada di YouTube',
      'Bahasa daerah hilang di kelas, gimana?',
    ],
    hooks: [
      'Adek gue cerita kemarin,',
      'Kemarin diundang jadi alumni speaker, dapat insight ini.',
      'Buat yang lagi ngerjain skripsi tentang ini,',
    ],
  },
  {
    topic: 'budaya',
    titles: [
      'Stand-up di {kota} mulai bahas isu publik — cek 3 komika ini',
      'Festival seni warga di {kota} bulan depan, butuh volunteer',
      'Indie band yang lirik lagunya tentang {issue}',
      'Mural di kampung kami dihapus paksa, ini ceritanya',
      'Podcast politik anak muda yang nggak preachy — rekomen?',
    ],
    hooks: [
      'Sharing for visibility,',
      'Buat yang suka indie scene {kota},',
      'Ada momen menarik di acara warga kemarin.',
    ],
  },
  {
    topic: 'transport',
    titles: [
      'KRL telat 30 menit pagi tadi — apa yang sebenernya terjadi?',
      'Jalur sepeda di {kota} dipakai motor, tilang 0',
      'Tarif ojol naik tapi insentif driver turun, gimana?',
      'Halte busway kosong tapi rute baru ditambah?',
      'BRT {kota} efektif nggak buat warga gang sempit?',
    ],
    hooks: [
      'Gue commute setiap hari pakai ini, jadi notice patterns.',
      'Buat yang naik moda sama,',
      'Data dari bot pemantauan,',
    ],
  },
  {
    topic: 'lokal',
    titles: [
      '{situasi} — mau ngadu ke siapa?',
      'Posyandu di RT kami akhirnya jalan tiap minggu, ini ceritanya',
      'Tanah ulayat di kampung dijual diam-diam',
      'Karang Taruna {kota} aktif lagi — ngapain aja?',
      'Pasar tradisional {kota} digantiin minimarket — pro/kontra',
    ],
    hooks: [
      'Cerita RT kami minggu lalu,',
      'Kalau lo tinggal di {kota} mungkin relate,',
      'Mungkin small story tapi penting buat dicatat.',
    ],
  },
];

// ─── Reply templates ───────────────────────────────────

export const REPLY_TEMPLATES = {
  agreement: [
    'Setuju banget. Di {kota} juga begini, malah lebih parah.',
    'Bener bro. Pengalaman gue di {kota} mirip — {detail}',
    'Sepakat. Yang penting kita konsisten suarainnya.',
    'Mantul. Poin nomor 2 yang paling kena.',
    'This. Selama ini gue kira cuma di {kota}, ternyata nasional.',
  ],
  question: [
    'Sumbernya dari mana, ka? Gue mau dive deeper.',
    'Ada link beritanya nggak? Pengen baca lengkap.',
    'Kalau menurut lo solusinya gimana?',
    'Berapa lama lo follow isu ini?',
    'Ada komunitas yang udah handle ini di {kota}?',
  ],
  experience: [
    'Gue pernah ngalamin yang mirip di {kota} tahun lalu. {detail}',
    'Adek gue kuliah di {kota}, cerita hal yang sama.',
    'Pengalaman kantor lama gue, persis kayak yang lo tulis.',
    'RT gue baru aja ngalamin ini bulan kemarin.',
  ],
  counter: [
    'Setuju sama poin awal, tapi soal {issue} gue rada beda. {detail}',
    'Hmm, ada angle lain sih. Coba pertimbangin {detail}',
    'Sebagian betul, tapi konteksnya beda di luar {kota}.',
    'Respectfully disagree di poin terakhir. Karena {detail}',
  ],
  tag: [
    'Mungkin @{user} bisa kasih perspektif, dia pernah bahas ini.',
    'Coba di-tag aja @{user} biar diskusi lebih rame.',
    'Yang ngerti soal {issue} sih kayaknya @{user}.',
  ],
} as const;

// ─── Karya templates ───────────────────────────────────

export const KARYA_TITLES = {
  Tulisan: [
    'Lima Cara Sederhana Pemuda Bisa Ikut Audit Anggaran Daerah',
    'Kenapa Generasi Kita Skeptis terhadap Demokrasi (dan Kenapa Itu Wajar)',
    'Demokrasi Deliberatif: Teori yang Bisa Kita Coba di Level RT',
    'Apa yang Ekonom Sebut "Tax Morale" — dan Kenapa Penting buat Kita',
    'Surat untuk Diriku di Tahun 2030: Soal Politik dan Harapan',
    'Membaca Putusan MK seperti Membaca Sastra: Sebuah Eksperimen',
    'Catatan dari Audiensi: Kenapa Pejabat Suka Pakai Bahasa Berlapis',
  ],
  Vlog: [
    'Ngobrol sama Pedagang Kaki Lima soal Tarif Parkir Baru',
    'Sehari di Kantor Lurah — Apa yang Sebenernya Terjadi?',
    'Field Trip ke TPA: Tempat Sampah Kita Berakhir',
    'Wawancara Mahasiswa Hukum yang Magang di Komnas',
  ],
  Ilustrasi: [
    'Konstitusi dalam 8 Panel Komik',
    'Anatomi APBD Daerah — Visual Guide',
    'Visualisasi Janji Pejabat: Yang Ditepati vs yang Mandek',
  ],
  Podcast: [
    'Obrolan Kopi: Anak Muda dan Politik Identitas',
    'Antara Aktivis dan Burnout: Cerita 3 Penggerak Komunitas',
  ],
  Zine: [
    'Zine Edisi Pertama: Suara dari Pinggiran Kota',
  ],
} as const;

export const KARYA_PARAGRAPHS = [
  'Kalau kita mulai dari premis bahwa anak muda di Indonesia bukan apatis, tapi terlalu lama dikecewain — banyak hal jadi masuk akal. Bukan masalah motivasi yang hilang, tapi bukti bahwa partisipasi kita didengar yang langka.',
  'Hari pertama gue dateng ke audiensi, gue kira bakal ada formulir, ada sesi tanya jawab, ada notulen yang dibagikan. Yang ada cuma 30 menit sambutan, lalu ramai tepuk tangan, lalu pulang.',
  'Konstitusi kita sebenernya cukup progresif kalau dibaca dengan teliti. Pasal 28 misalnya — sederet hak yang kalau dipahami betul, harusnya bikin kita lebih galak menuntut.',
  'Beberapa kawan bilang gue terlalu naif. Tapi naif menurut gue beda sama optimis. Naif itu nggak ngerti the game, optimis itu udah ngerti tapi tetep maju.',
  'Data yang gue olah ini berasal dari rilis publik selama 6 bulan terakhir. Bukan riset akademik formal, tapi cukup buat ngeliat pola yang jarang dibahas media mainstream.',
  'Yang menarik dari forum ini bukan jawabannya, tapi pertanyaannya. Pertanyaan-pertanyaan yang gue sendiri nggak pernah pikirin sebelumnya, datang dari orang-orang yang katanya "biasa aja".',
  'Bukan tentang menang atau kalah dalam debat. Tapi soal apakah setelah debat selesai, kita pulang dengan kesadaran baru atau cuma kepuasan yang dangkal.',
  'Gue inget banget Pak Lurah waktu itu bilang: "anak muda zaman sekarang nggak sabar, maunya instan." Lucunya, dia nggak pernah jelasin proses panjangnya seperti apa.',
  'Setiap kali gue cek dashboard transparansi, jantung gue agak berdebar. Bukan karena nemu sesuatu yang mencurigakan — tapi karena terlalu banyak yang masih kosong.',
  'Yang gue pelajari dari komunitas-komunitas kecil ini: perubahan jarang mulai dari demonstrasi besar. Lebih sering dari diskusi panjang yang nggak diliput siapa pun.',
];

// ─── Laporan templates ─────────────────────────────────

export type LaporanCategory = 'jalan' | 'banjir' | 'sampah' | 'listrik' | 'layanan' | 'drainase' | 'lain';

export interface LaporanTpl { title: string; desc: string }

export const LAPORAN_BANK: Record<LaporanCategory, readonly LaporanTpl[]> = {
  jalan: [
    { title: 'Lubang besar di {jalan} dekat halte', desc: 'Sudah {n} bulan tidak diperbaiki. Sering kecelakaan motor, terutama saat hujan.' },
    { title: 'Aspal mengelupas sepanjang {jalan}', desc: 'Kondisi makin parah pasca banjir bulan lalu. Bahaya buat sepeda dan motor kecil.' },
    { title: 'Marka jalan hilang di pertigaan {jalan}', desc: 'Sering bingung arah, hampir kecelakaan dua kali minggu kemarin.' },
  ],
  banjir: [
    { title: 'Banjir setiap hujan deras di Kel. {kelurahan}', desc: 'Drainase tersumbat, air masuk rumah warga sampai 30cm. Sudah lapor RT, tapi belum ada respons.' },
    { title: 'Genangan air rob di {kelurahan} makin parah', desc: 'Setiap pasang naik, jalan utama tergenang setinggi mata kaki. Anak sekolah kesulitan.' },
  ],
  sampah: [
    { title: 'Sampah menumpuk dekat SDN {kelurahan}', desc: 'Bau menyengat di jam istirahat. Dinas Kebersihan sudah dihubungi via medsos, belum dijawab.' },
    { title: 'TPS liar muncul di lahan kosong {jalan}', desc: 'Warga membuang sampah seenaknya, tikus mulai banyak. Perlu intervensi cepat.' },
  ],
  listrik: [
    { title: 'Lampu jalan mati {n} minggu di {jalan}', desc: 'Gelap gulita malam hari, banyak ibu-ibu takut pulang larut. PJU rusak total.' },
    { title: 'Pemadaman bergilir tanpa pemberitahuan di {kelurahan}', desc: 'Listrik mati tiba-tiba 4 jam, nggak ada info dari PLN. Banyak UMKM rugi.' },
  ],
  layanan: [
    { title: 'Pelayanan KTP lambat di Disdukcapil {kelurahan}', desc: 'Antri dari pagi, baru dilayani sore. Sistem online katanya error terus.' },
    { title: 'Posyandu tutup tanpa pengumuman di {kelurahan}', desc: 'Sudah 2 minggu kader nggak hadir. Ibu-ibu dengan balita kebingungan.' },
  ],
  drainase: [
    { title: 'Drainase mampet di Kel. {kelurahan}', desc: 'Air buangan dapur ngumpul di gang. Bau dan rawan jentik nyamuk.' },
    { title: 'Gorong-gorong tersumbat sampah di {jalan}', desc: 'Setiap hujan kecil pun banjir karena ini.' },
  ],
  lain: [
    { title: 'Kabel listrik menjuntai bahaya di {jalan}', desc: 'Hampir kena kepala pejalan kaki dua kali. Sudah lapor PLN belum direspon.' },
  ],
};

// ─── Helpers to fill placeholders ──────────────────────

export interface PlaceholderAnchor {
  kota?: string;
  pejabat?: string;
  topik_kebijakan?: string;
}

/**
 * Resolve {placeholder} tokens in a template.
 *
 * `anchor` locks specific values for the WHOLE template — used by buildThreadBody
 * to force one kota across the entire body (geographical consistency rule).
 * Anchors that aren't passed get fresh random pulls per occurrence (suitable
 * for titles + replies where we want variety).
 *
 * {detail} pulls from INDONESIAN_FILLER — Latin-free.
 */
export function fillPlaceholders(tpl: string, anchor: PlaceholderAnchor = {}): string {
  return tpl
    .replace(/\{topik_kebijakan\}/g, () => anchor.topik_kebijakan ?? pickRandom(TOPIK_KEBIJAKAN))
    .replace(/\{issue\}/g, () => pickRandom(ISSUE_BANK))
    .replace(/\{situasi\}/g, () => pickRandom(SITUASI_BANK))
    .replace(/\{aksi\}/g, () => pickRandom(AKSI_BANK))
    .replace(/\{kota\}/g, () => anchor.kota ?? pickRandom(KOTA_LIST))
    .replace(/\{pejabat\}/g, () => anchor.pejabat ?? pickRandom(PEJABAT_SEED_NAMES))
    .replace(/\{nominal\}/g, () => String(randInt(5, 18)))
    .replace(/\{detail\}/g, () => pickRandom(INDONESIAN_FILLER))
    .replace(/\{n\}/g, () => String(randInt(2, 6)))
    .replace(/\{jalan\}/g, () => `Jl. ${f.location.street()}`)
    .replace(/\{kelurahan\}/g, () => f.location.county());
}

/**
 * Build a thread title from a topic-matched template, locked to anchorKota.
 *
 * If the chosen title template doesn't contain a {kota} placeholder, the
 * resulting title simply has no kota mention — we never force-insert one.
 * Used by both the initial seeder and the refresh script so title/body
 * always derive their kota from the same chapter_id.
 */
export function buildThreadTitle(topic: TopicId, anchorKota: string): string {
  const tpl =
    THREAD_TEMPLATES.find((t) => t.topic === topic) ??
    pickRandom(THREAD_TEMPLATES);
  return fillPlaceholders(pickRandom(tpl.titles), { kota: anchorKota });
}

/**
 * Build a thread body: 2-4 paragraphs, fully Indonesian, single anchorKota
 * across the whole body (no Semarang→Medan→Jakarta jumps).
 *
 * Structure:
 *   • paragraph 1: 1 opener + 1 topic sentence
 *   • middle paragraphs: 2 topic sentences + optional filler
 *   • last paragraph: 1 topic sentence + 1 closer
 */
export function buildThreadBody(topic: TopicId, anchorKota: string): string {
  const anchor: PlaceholderAnchor = { kota: anchorKota };
  const paraCount = randInt(2, 4);
  const topicBank = THREAD_BODY_BANK[topic];
  // Pre-pick distinct topic sentences for the whole body (avoid repeats within one body).
  const needed = paraCount * 2 + 1;
  const topicPicks: string[] = pickN(topicBank, Math.min(needed, topicBank.length));
  // If we need more than the bank has, top up with filler (rare — banks have 6-7 each).
  while (topicPicks.length < needed) topicPicks.push(pickRandom(INDONESIAN_FILLER));

  const paragraphs: string[] = [];
  let cursor = 0;
  // First paragraph: opener + topic sentence
  paragraphs.push(
    [fillPlaceholders(pickRandom(THREAD_OPENERS), anchor),
     fillPlaceholders(topicPicks[cursor++] as string, anchor)].join(' ')
  );
  // Middle paragraphs
  for (let i = 1; i < paraCount - 1; i++) {
    const sentences = [
      fillPlaceholders(topicPicks[cursor++] as string, anchor),
      fillPlaceholders(topicPicks[cursor++] as string, anchor),
    ];
    if (faker.datatype.boolean({ probability: 0.4 })) {
      sentences.push(fillPlaceholders(pickRandom(INDONESIAN_FILLER), anchor));
    }
    paragraphs.push(sentences.join(' '));
  }
  // Last paragraph: topic sentence + closer
  if (paraCount >= 2) {
    paragraphs.push(
      [fillPlaceholders(topicPicks[cursor++] as string, anchor),
       fillPlaceholders(pickRandom(THREAD_CLOSERS), anchor)].join(' ')
    );
  }
  return paragraphs.join('\n\n');
}

/** Pick a reply category by spec distribution. */
export function pickReplyKind(): keyof typeof REPLY_TEMPLATES {
  return weightedPick(
    ['agreement', 'question', 'experience', 'counter', 'tag'] as const,
    [30, 25, 20, 15, 10]
  );
}

export function buildReplyBody(kind: keyof typeof REPLY_TEMPLATES, taggedUser?: string): string {
  const tpl = pickRandom(REPLY_TEMPLATES[kind]);
  let s = fillPlaceholders(tpl);
  if (kind === 'tag' && taggedUser) s = s.replace('{user}', taggedUser);
  return s;
}

/** Build a karya body: 4-8 paragraphs from KARYA_PARAGRAPHS, may add detail. */
export function buildKaryaBody(): string {
  const count = randInt(4, 8);
  const picked: string[] = [];
  const used = new Set<number>();
  while (picked.length < count) {
    const idx = randInt(0, KARYA_PARAGRAPHS.length - 1);
    if (used.has(idx)) continue;
    used.add(idx);
    picked.push(KARYA_PARAGRAPHS[idx] as string);
  }
  return picked.join('\n\n');
}

export type KaryaType = keyof typeof KARYA_TITLES;

export function pickKaryaType(): KaryaType {
  return weightedPick(
    ['Tulisan', 'Vlog', 'Ilustrasi', 'Podcast', 'Zine'] as const,
    [60, 25, 7, 5, 3]
  );
}

export function buildKaryaMeta(type: KaryaType): string | null {
  switch (type) {
    case 'Tulisan': return `${randInt(5, 15)} mnt`;
    case 'Vlog':    return `${randInt(8, 25)}:${String(randInt(0, 59)).padStart(2, '0')}`;
    case 'Podcast': return `${randInt(25, 60)}:${String(randInt(0, 59)).padStart(2, '0')}`;
    case 'Ilustrasi': return `${randInt(4, 10)} panel`;
    case 'Zine':    return `${randInt(16, 32)} hal`;
    default:        return null;
  }
}
