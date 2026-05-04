-- ──────────────────────────────────────────────────────────────────────
-- Spec #19 — Seed karya body content batch 1 (10 long-form drafts)
--
-- IDEMPOTENT: setiap UPDATE pakai guard `body IS NULL OR body = ''` supaya
-- aman re-run. Karya yang udah ke-fill (manual atau via run sebelumnya)
-- nggak akan tertimpa.
--
-- KOLOM TARGET: `body` (bukan `body_md`). Verified via app/karya/[id]/reading-view.tsx
-- baris 35: `<ArticleBody body={karya.body ?? ''} />` — single column markdown.
--
-- 5 karya pertama target via UUID deterministik dari supabase/seed.sql:
--   88888888-0001-0000-0000-000000000001 — Lima Alasan Pemuda Apatis (Tulisan)
--   88888888-0001-0000-0000-000000000002 — Ngobrol sama Ibu PKL (Vlog transkrip)
--   88888888-0001-0000-0000-000000000003 — Suara Kita Bisa Hilang (Ilustrasi 6 panel)
--   88888888-0001-0000-0000-000000000004 — Demokrasi Deliberatif RT/RW (Tulisan)
--   88888888-0001-0000-0000-000000000005 — Obrolan Pagi Gerakan Pemuda (Podcast script)
--
-- 5 karya berikutnya target via title exact match — UUID generated random per
-- demo seed run. Pakai `title = '...'` filter supaya idempotent dan re-runnable
-- bahkan kalau demo seed regenerated dengan ID baru.
--
-- BRAND VOICE GUARD: source draft ada di docs/karya-content-drafts/.
-- 0 occurrence "Anda" / "Saya" / "civic" / "warga negara yang kritis" verified
-- via grep sebelum SQL ini di-generate. Lihat draft frontmatter untuk persona +
-- voice reference per karya.
--
-- HOW TO APPLY:
--   Method A (Supabase Studio): paste isi file ke SQL Editor → Run
--   Method B (psql):  psql "$SUPABASE_DB_URL" -f supabase/karya_content_seed.sql
--   Method C (script): pnpm tsx scripts/seed-karya-content.ts
--
-- VERIFY POST-APPLY:
--   SELECT id, title, length(body) AS body_len, type FROM karya
--    WHERE id LIKE '88888888-0001-%'
--       OR title IN (
--         'Lima Cara Sederhana Pemuda Bisa Ikut Audit Anggaran Daerah',
--         'Kenapa Generasi Kita Skeptis terhadap Demokrasi (dan Kenapa Itu Wajar)',
--         'Surat untuk Diriku di Tahun 2030: Soal Politik dan Harapan',
--         'Konstitusi dalam 8 Panel Komik',
--         'Antara Aktivis dan Burnout: Cerita 3 Penggerak Komunitas'
--       )
--   ORDER BY type, title;
--
-- WAIT FOR APPROVAL: Per Spec #19, jangan execute ke production sebelum
-- Mas approve via chat. File ini disimpan ready-to-run.
-- ──────────────────────────────────────────────────────────────────────

begin;

-- ────────────────────────────────────────────────────────────────────
-- 1. Lima Alasan Pemuda Masih Apatis terhadap Pemilu Lokal (Tulisan)
-- ────────────────────────────────────────────────────────────────────
update public.karya
set body = $body$Kalau kamu lihat angka turn-out pilkada serentak November 2024, mungkin agak bingung — KPU bilang partisipasi nasional cuma di angka **68%**. Tertinggi di Sulawesi Utara, terendah di Jakarta yang bahkan nggak nyentuh 60%. Yang lebih bikin penasaran: drop paling tajam datang dari demografi 17-25 tahun.

Aku ngobrol sama 12 anak muda di Jakarta, Bandung, dan Surabaya selama dua bulan terakhir. Bukan riset akademik formal — sekadar dengerin alasan mereka jujur, sambil nyari pola. Beberapa dari mereka golput sadar. Beberapa lagi datang ke TPS tapi nggak nyoblos siapa pun. Sebagian lainnya ngerasa malu karena bahkan nggak tau siapa calon wali kotanya.

Lima pola yang muncul berulang-ulang. Bukan ranking, tapi cluster.

## 1. Calonnya nggak ada yang ngajak ngobrol

Yang paling pertama disebut: rasanya politik lokal itu satu arah. Calon-calon datang lewat baliho, datang lewat IG ad, datang lewat acara kampanye yang tertutup-tertutup di hotel. Tapi nggak pernah datang ke kosan, kafe, atau forum mahasiswa. "Gue ngerasa nggak diajak ngobrol — gue cuma diajak milih," kata Reza, mahasiswa Fisip di Bandung.

Bandingkan sama tahun 2014 atau 2017 ketika beberapa calon DPRD pernah bikin sesi tanya jawab kampus. Tradisi itu kayaknya udah meredup. Yang ada sekarang lebih banyak pidato monologis, bukan dialog.

## 2. Janji-janji terasa déjà vu

Lima tahun lalu janji infrastruktur. Lima tahun ini juga. Lima tahun sebelumnya, janji penataan kaki lima. Kalau kamu ngikutin pilkada selama satu siklus aja, mulai kelihatan polanya: janji lebih sering tentang **proyek fisik** daripada perubahan struktural. Jalan, jembatan, lampu jalan. Bukannya itu nggak penting — tapi anak muda yang lagi nyari kerja, atau lagi mikirin biaya kos, ngerasa janji itu kurang relevan.

"Yang gue butuhin sebenernya bukan flyover baru, tapi transportasi publik yang nggak bikin gue telat tiap pagi," kata Nadia, fresh graduate di Tangerang Selatan. Janji-janji yang menyangkut sistem — transportasi, perumahan terjangkau, lapangan kerja — jarang masuk visi-misi pilkada secara konkret.

## 3. Politik kerasa kayak teater

Beberapa orang yang aku ajak ngobrol nyebut kata "panggung" atau "show". Mereka ngerasa pilkada itu kayak nonton teater — calon-calon punya peran, ada konflik manufactured, lalu ada penyelesaian yang udah ditulis sebelumnya. "Habis menang, ya, kembali ke kerja yang sama. Beda partai, hasil sama," kata Yoga di Surabaya.

Yang menarik, mereka bukan sinis dalam arti merendahkan demokrasi. Justru mereka percaya **sistem politik bisa berubah** — tapi nggak yakin pilkada di tingkat ini punya kekuatan buat ngubahnya. Mereka lebih percaya gerakan komunitas, atau bahkan kelompok diskusi non-formal.

## 4. Informasi yang muter di echo chamber

Nyaris semua orang yang aku ajak ngobrol bilang sumber informasi mereka soal calon: timeline IG, X (dulu Twitter), atau podcast. Hampir nggak ada yang baca rilis resmi KPU atau debat publik secara utuh. Konsekuensinya: yang sampai ke mereka udah dikurasi algoritma, atau di-frame oleh content creator.

Ini bukan salah anak muda — ini realitas media kita sekarang. Tapi efeknya: dua orang di kosan yang sama bisa punya pemahaman yang sangat beda tentang siapa calon yang lagi maju, semata-mata karena algoritma kasih konten yang berbeda. Susah ngumpul ngomong politik kalau premisnya udah beda.

## 5. Capek

Ini yang paling jujur dan paling jarang diomongin. Setelah pemilu nasional 2024 yang penuh drama, banyak orang ngerasa **udah habis amunisinya**. Pilkada datang lima bulan kemudian, dan secara emosional banyak yang belum pulih. "Gue cuma pengin tidur sebulan tanpa ngomongin politik," kata seseorang di sebuah kelompok riset informal yang aku ikuti.

Capek ini valid. Politik di Indonesia memang menguras — terutama buat anak muda yang udah aktif di komunitas, atau yang lagi proses identitas politiknya sendiri. Tapi capek juga jadi resep untuk apatisme jangka panjang kalau nggak ada ruang istirahat yang sehat.

## Jadi gimana?

Aku nggak punya jawaban yang clean. Tapi dari ngobrol sama 12 orang ini, ada satu hal yang muncul: mereka **nggak butuh diceramahi soal pentingnya nyoblos**. Mereka udah tau. Yang mereka butuh adalah ruang yang ngakuin kelelahan ini, dan calon-calon yang bener-bener mau ngajak ngobrol — bukan cuma minta suara.

Buat siapa pun yang lagi mikirin gimana caranya nge-engage anak muda di pemilu berikutnya, mungkin pertanyaannya bukan **"gimana cara bikin mereka peduli?"** Mereka udah peduli. Pertanyaannya: **"gimana cara sistem politik ngehargai kepedulian itu?"**$body$
where id = '88888888-0001-0000-0000-000000000001'
  and (body is null or body = '');

-- ────────────────────────────────────────────────────────────────────
-- 2. Ngobrol sama Ibu PKL soal APBD (Vlog — full transkrip)
-- ────────────────────────────────────────────────────────────────────
update public.karya
set body = $body$Aku lagi nyari topik buat tugas akhir, mikirnya bakal wawancara dosen ekonomi atau pejabat Bappeda. Sampai temen aku nyeletuk: "Lo udah pernah tanya Ibu PKL? Mereka tiap hari berurusan sama tarif retribusi, mestinya ngerti lebih dari kita." Awalnya aku ketawa. Sebulan kemudian, aku duduk di trotoar Jalan Riau Bandung, ngobrol sama Bu Yati yang udah jualan nasi kuning di situ 18 tahun.

## 00:00 — Pembuka

**Aku:** Bu, halo. Aku Reza, mahasiswa. Boleh ngobrol bentar?

**Bu Yati:** Boleh, Mas. Nasi kuningnya mau yang biasa atau pake telor?

**Aku:** Yang biasa aja Bu, plus telor. Aku sebenernya pengin nanya — Bu Yati tau APBD nggak?

**Bu Yati:** APBD itu yang dibahas DPRD ya? Yang setiap tahun?

## 02:15 — Pertanyaan inti

**Aku:** Iya, persis. Bu Yati ngerti dari mana?

**Bu Yati:** Dari pengalaman aja, Mas. Kalo APBD baru disahkan, biasanya retribusi naik. Tahun lalu retribusi PKL di sini naik dari 5 ribu jadi 7 ribu sehari. Pas tahun depannya, jalan ini diperbaiki. Jadi gue tau uangnya muter.

**Aku:** Wow. Itu udah analisa cukup canggih sebenernya, Bu.

**Bu Yati:** Lah, dagang itu sekolah, Mas. Setiap angka kena ke gue langsung.

## 04:30 — Cerita konkret

**Bu Yati:** Tahun 2022, ada wacana relokasi PKL ke gedung baru deket pasar. Awalnya kita semua takut — "wah pasti ditipu nih". Lalu ada anak muda, kayaknya dari kampus, datang bawa printout APBD. Kita diajarin baca posnya: ada anggaran 2 miliar buat fasilitas relokasi. Kalo segitu, harusnya gedungnya bener.

**Aku:** Gimana hasilnya?

**Bu Yati:** Akhirnya separuh kita pindah, separuh tetep di sini. Yang pindah, gedungnya jadi. AC-nya jalan. Cuma tarif sewa lebih mahal — itu yang nggak diomongin di awal. Yang tetep di sini kayak gue, retribusi tetep berlaku. Dua-duanya legal, beda situasi.

**Aku:** Bu Yati ngerasa keberuntungan apa pertimbangan?

**Bu Yati:** Pertimbangan, Mas. Gue itung-itung dulu — kalau pindah, sewa 1,2 juta sebulan plus listrik. Di sini, retribusi paling 200 ribu sebulan plus iuran kebersihan. Lokasi lewatan orang juga beda. Akhirnya gue pilih yang sesuai modal.

## 07:20 — Yang nggak banyak orang tau

**Aku:** Bu, dari ngobrol sama PKL lain di sini, ada yang ngerti detail kayak Bu Yati?

**Bu Yati:** Ada beberapa, terutama yang udah lama. Tapi banyak juga yang nggak peduli — bukan karena bodoh, tapi karena ngerasa dibahas pun nggak akan ngubah apa-apa. "Toh yang mutusin DPRD" — gitu aja. Padahal kalo DPRD-nya sering kita aja tanyain, mungkin pertimbangan mereka beda.

**Aku:** Bu Yati pernah ngobrol langsung sama anggota DPRD?

**Bu Yati:** Pernah, sekali. Kunjungan sebelum pemilu. Datang, foto-foto, beli nasi kuning gue, bayar pake duit kembalian seratus rebu. Habis itu nggak pernah dateng lagi. Gue inget mukanya — sampai sekarang masih anggota DPRD aja.

## 09:45 — Refleksi

**Aku:** Bu Yati ngerasa suara Bu Yati di-dengerin?

**Bu Yati:** Kalau ngomong jujur, jarang. Tapi kalau gue mau nuntut, mungkin bisa. Cuma waktu nuntutnya itu yang nggak ada. Dagang dari subuh sampai malem. Mau audiensi kapan?

**Aku:** Itu Bu, jadi pertanyaan saya ke kampus juga sebenernya. Kita semua sibuk. Tapi pertanyaan saya: gimana cara bikin demokrasi yang nggak butuh waktu nyusup ke jadwal kerja Bu Yati buat ngomong?

**Bu Yati:** Mungkin ya gampang aja, Mas. DPRD-nya yang dateng ke gue. Lima belas menit aja, sekali setahun, di pas APBD lagi dibahas. Bukan pas mau pemilu doang.

## 11:30 — Penutup

Bu Yati nggak pernah baca jurnal kebijakan publik. Tapi dia ngerti APBD bukan dari teori, dari **dampaknya ke laci uangnya tiap pagi**. Mungkin pelajaran terbesar dari obrolan ini bukan cara bikin warga ngerti APBD — mereka udah ngerti caranya sendiri. Yang missing: cara sistem ngakuin pengetahuan itu.

Makasih ya Bu Yati buat nasi kuning sama waktunya.$body$
where id = '88888888-0001-0000-0000-000000000002'
  and (body is null or body = '');

-- ────────────────────────────────────────────────────────────────────
-- 3. Kenapa Suara Kita Bisa Hilang — 6 Panel (Ilustrasi)
-- ────────────────────────────────────────────────────────────────────
update public.karya
set body = $body$Suara kamu di bilik suara itu cuma satu titik dari rute panjang. Sebelum jadi keputusan publik, suara itu lewat enam tempat — dan di setiap tempat, ada peluang dia menyusut, dialihkan, atau hilang. Visual ini ngajak kamu lihat rute lengkapnya, panel demi panel.

## Panel 1 — Kamu di TPS

Pagi hari. Kamu antri di TPS, KTP di tangan, mata setengah ngantuk. Kamu coblos. Petugas masukin kertas ke kotak. **Itu titik nol — suara kamu masih utuh, satu suara untuk satu nama.** Yang nggak banyak orang sadar: dari sini, perjalanannya baru mulai.

## Panel 2 — Penghitungan tingkat TPS

Selesai jam 1 siang. Saksi-saksi parpol dateng. Petugas KPPS hitung manual, satu per satu. Berita acara ditandatangani. **Di sini suara kamu masih konkret — angka di kertas, dilihat banyak mata.** Tapi: kalau saksi nggak hadir, kalau form rusak, kalau ada salah hitung — di sini juga peluang pertama suara mleset.

## Panel 3 — Rekap kelurahan / kecamatan

Form dari TPS dibawa ke level kelurahan. Lalu kecamatan. Di tahap ini, ratusan TPS digabung. Yang dipakai bukan suara individu lagi, tapi **angka agregat**. Kalau ada selisih kecil di rekap awal, di tahap ini selisih bisa naik atau ketutup. Tahun 2024, KPU mengakui ada **2.700+ TPS yang harus rekap ulang** karena selisih angka.

## Panel 4 — Sirekap & infrastruktur digital

Sebelum ke level kabupaten, data masuk **Sirekap** — sistem digital KPU. Foto form C1 di-upload, hasilnya di-OCR. Di sini muncul cerita 2024: ada angka yang ke-OCR-nya keliru, ada delay sinkronisasi, ada server nge-lag. Suara yang harusnya udah jelas, tiba-tiba ngambang di awan digital. Bukan hilang — tapi **diragukan**.

## Panel 5 — Perselisihan ke MK

Di pemilu, hasil bisa digugat ke Mahkamah Konstitusi. Tapi gugatan punya threshold tinggi: harus selisih signifikan, harus ada bukti. Yang lolos sidang, dievaluasi panel hakim — bukan diaudit ulang dari TPS asal. **Di tahap ini, suara individu udah lama jadi statistik.** Yang dipertimbangkan integritas proses, bukan kertas suara kamu yang spesifik.

## Panel 6 — Kebijakan publik

Lima tahun kemudian. APBD disahkan. Aturan baru terbit. Pejabat yang kamu coblos — atau yang bahkan bukan kamu coblos — mengambil keputusan yang ngaruh ke kosanmu, ke ongkos transportmu, ke air yang ngalir di rumahmu. **Inilah ujung rutenya.** Dan di sini, jarak antara satu titik suara di TPS dengan satu Perda yang ngubah hidup kamu... terasa galaksi jauhnya.

> Suara kamu nggak hilang dalam satu peristiwa dramatis. Dia menyusut sedikit demi sedikit di setiap tahap.

Kabar baiknya: di setiap titik, ada **mekanisme pengawasan warga** yang sah. Saksi parpol, pemantau independen, jurnalis pemilu, lembaga pengawas seperti Bawaslu, sampai gugatan publik via koalisi masyarakat sipil. Suara kamu lebih kuat kalau mata kamu juga ada di rute itu.$body$
where id = '88888888-0001-0000-0000-000000000003'
  and (body is null or body = '');

-- ────────────────────────────────────────────────────────────────────
-- 4. Demokrasi Deliberatif: Teori yang Bisa Kita Coba di RT/RW (Tulisan)
-- ────────────────────────────────────────────────────────────────────
update public.karya
set body = $body$Pertama kali aku denger istilah "demokrasi deliberatif", aku langsung skip. Kedengerannya kayak istilah jurnal yang bakal bikin obrolan di kafe jadi sepi. Tapi setelah ngajak warga RT 06 di kompleks tempat aku tinggal duduk satu jam, ngomongin satu masalah — dan masalah itu **kelar dalam dua minggu** — aku sadar: teori ini sebenernya udah lama kita praktekin tanpa nama.

Sebelum lanjut, definisi singkat dulu. Demokrasi deliberatif itu pendekatan yang ngutamain **diskusi terbuka, kesetaraan suara, dan keputusan berdasarkan argumen** — bukan voting cepet atau perintah dari atas. Filsuf yang sering dihubungin sama teori ini Jürgen Habermas (Jerman, 1980-an) dan James Fishkin (AS, 1990-an). Tapi prakteknya jauh lebih tua dari teorinya. Musyawarah desa, *adat majelis*, lingkar warga — semua punya DNA yang mirip.

Yang menarik bukan teorinya, tapi **kenapa di tingkat RT/RW kita kadang nggak melakukannya** padahal semua bahan udah ada.

## Apa yang dulu kita coba di RT 06

Kasusnya simpel. Lampu jalan di gang utama mati selama dua bulan. Pak RT bilang udah lapor PLN, belum ada tanggapan. Beberapa warga ngeluh di grup WhatsApp, beberapa marah-marah, beberapa diam. Polanya khas: yang paling vokal nggak selalu yang paling kena dampaknya.

Aku ngajak Pak RT bikin satu pertemuan — bukan rapat formal, bukan kerja bakti dadakan. Cuma duduk satu jam, **30 warga**, di pos ronda. Tiga aturan yang kita pasang:

1. **Setiap orang dapat tiga menit ngomong sebelum boleh disela.** Bahkan yang biasanya diam.
2. **Pertanyaan dulu, baru solusi.** Sering yang penting bukan jawabnya, tapi pertanyaan yang luput.
3. **Keputusan akhir nggak harus konsensus 100%.** Yang penting semua suara udah didengar.

Yang muncul di pertemuan itu di luar dugaan. Bukan cuma soal lampu — yang ternyata ngumpet di balik keluhan lampu adalah kekhawatiran lebih besar tentang **keamanan gang malam hari**, anak-anak yang takut pulang ngaji, ibu-ibu yang ngerasa nggak aman. Lampu cuma simptom.

## Empat hal yang aku pelajari

**Pertama, jangan undang dengan agenda yang udah dikunci.** Begitu agenda dikunci ("rapat soal lampu jalan"), warga datang dengan posisi siap. Yang kita pengin bukan posisi, tapi kekhawatiran. "Ngumpul yuk, mau dengerin keluhan apa aja seputar gang" lebih ngalir.

**Kedua, atur ruang biar setara.** Kalau Pak RT duduk di kursi ketua dan warga duduk di tikar, hierarki udah ngomong duluan. Lingkar tanpa kursi pemimpin — atau bahkan duduk lesehan barengan — bikin orang lebih jujur. Sederhana tapi efeknya besar.

**Ketiga, kasih waktu khusus buat yang biasanya diam.** Ada orang-orang yang struktur lingkungannya bikin dia jarang ngomong: ibu rumah tangga muda, perantau yang baru pindah, lansia. Pertemuan kita pakai aturan **"silent round"** — di awal, setiap orang nulis satu kekhawatiran di kertas, lalu kertasnya dibacain orang lain. Ini bantu orang yang nggak nyaman public speaking tetep masuk.

**Keempat, follow-up itu bagian dari proses.** Pertemuan tanpa follow-up jadi pemanis bibir. Kita bikin grup WA kecil khusus follow-up — bukan grup gosip RT yang udah ada — buat update progress lampu, kirim foto, kasih kabar ke yang nggak hadir.

## Kenapa ini relevan buat sekarang

Indonesia sedang dalam fase di mana kepercayaan pada institusi formal lagi turun. Survei LSI 2024 nunjukin kepercayaan pada DPR turun ke 45%, paling rendah sejak reformasi. Tapi kepercayaan pada **tetangga dan komunitas terdekat** justru naik. Ini ironi — sekaligus peluang.

Kalau lembaga formal lagi krisis legitimasi, ruang-ruang kecil di RT/RW bisa jadi tempat warga **belajar lagi caranya ngambil keputusan bersama**. Bukan untuk gantiin DPRD atau wali kota — tapi untuk ngebuktiin ke diri sendiri bahwa demokrasi nggak harus selalu manuver politik di Senayan.

> Filsuf John Dewey pernah bilang demokrasi itu "way of life", bukan sistem pemerintahan doang.

Maksudnya, demokrasi diuji setiap kali kita bareng-bareng mutusin sesuatu — siapa yang tukar piket bersih-bersih, siapa yang ngurus parkir mobil tamu, gimana ngebagi iuran kas. Setiap keputusan kecil itu latihan.

## Yang nggak akan kebahas di buku teks

Demokrasi deliberatif punya batas. Nggak semua keputusan butuh deliberasi panjang — kadang darurat butuh komando cepat. Nggak semua orang berkapasitas sama untuk artikulasi opini panjang. Nggak semua warga punya waktu luang buat ngumpul satu jam.

Tapi yang aku temuin: kalau **ruangnya tersedia**, orang bakal pakai. Bukan setiap minggu, bukan untuk semua hal. Tapi untuk hal-hal yang penting, ruang itu bisa jadi safety valve. Tempat curhat, tempat curiga, tempat ngakuin "aku nggak setuju", tempat dengerin nenek di ujung gang yang udah 40 tahun di sana.

Kamu nggak butuh izin akademisi untuk nyobain ini. Kamu cuma butuh tetangga yang mau diajak duduk satu jam, dan **niat tulus untuk dengerin**. Sisanya — pelan-pelan — bisa diatur.$body$
where id = '88888888-0001-0000-0000-000000000004'
  and (body is null or body = '');

-- ────────────────────────────────────────────────────────────────────
-- 5. Obrolan Pagi: Gerakan Pemuda & Pemilu 2029 (Podcast — script teaser)
-- ────────────────────────────────────────────────────────────────────
update public.karya
set body = $body$**Episode 12 · Durasi: 45:22 · Diterbitkan 4 Mei 2026**

Tiga tamu: **Mira** (28, koordinator regional gerakan iklim Jakarta), **Bagas** (24, ketua BEM kampus negeri Surabaya), dan **Tia** (29, alumni Jubir Warga 2024 yang sekarang ngorganisir komunitas di Jogja). Pertanyaan besar yang kita gali: **Tiga tahun lagi, gerakan pemuda Indonesia kayak gimana?**

## Show notes

- **00:00** — Intro & posisi tiga tamu soal pemilu 2029
- **04:15** — Apa yang kita pelajari dari 2024: bukan kekalahan, bukan kemenangan, tapi pengalaman fragmentasi
- **12:30** — Gerakan iklim vs gerakan demokrasi: kapan ngumpul, kapan diam-diam jalan sendiri
- **19:48** — Kelelahan vs strategi: kapan istirahat itu sah, kapan dia jadi alibi
- **27:10** — Aliansi lintas kota: yang bikin koalisi 2024 retak, yang bikin sebagian masih utuh
- **33:40** — Strategi 2029: kandidat alternatif vs ngegrep struktural vs pergeseran narasi
- **41:15** — Pertanyaan yang kita simpan untuk diri sendiri

## Cuplikan

> **Mira:** Pemilu 2024 kita masuk dengan logika "pertahankan apa yang masih bisa". Untuk 2029, kayaknya kita harus tanya pertanyaan beda — bukan apa yang dipertahankan, tapi **apa yang mau dibangun**. Itu butuh imajinasi yang sekarang langka.

> **Bagas:** Di kampus, mahasiswa yang aktif sekarang beda banget sama yang aktif 2017. Mereka lebih praktis, lebih hati-hati. Mereka udah lihat senior-seniornya nge-burnout. Jadi kalau lo mau ngajak gerak, lo harus ngajak yang sustainable — bukan all-out tiap minggu.

> **Tia:** Aku setuju soal sustainability, tapi ada bahaya kalau jadi alasan mundur dari momen panas. Burnout itu real. Apatis terselubung juga real. Garisnya tipis, dan kita harus jujur sama diri sendiri di mana kita lagi berdiri.

## Yang nggak masuk audio

Selama rekaman, ada momen ketika Mira nangis bentar saat cerita soal kawan koalisinya yang berhenti aktif setelah 2024. Kami diskusiin ramai-ramai, dan akhirnya sepakat bagian itu **kami potong** — bukan karena nggak penting, tapi karena momen itu butuh ruang yang nggak performatif. Nangis di podcast bisa jadi konten. Kami nggak mau itu.

Yang masuk: refleksi Mira yang lebih tenang setelahnya. "Kawan-kawan aku yang berhenti itu bukan kalah. Mereka cuma butuh fase lain hidupnya. Aku belajar buat nggak nge-judge."

## Tiga pertanyaan yang kita simpan

1. **Apa yang bikin gerakan pemuda Indonesia bisa ngumpul lagi setelah retak — tanpa pura-pura nggak retak?**
2. **Bisakah gerakan iklim, gerakan demokrasi, gerakan kelas pekerja muda satu meja — atau itu fantasi?**
3. **Kalau 2029 hasilnya nggak sesuai harapan, apa rencananya — selain putus asa atau pura-pura optimis?**

Kami nggak punya jawabannya. Tapi pertanyaan ini yang akan jadi bahan episode-episode berikut.

## Penutup

> **Mira:** Tiga tahun bukan waktu yang lama, tapi juga bukan waktu yang pendek. Yang kita kerjain sekarang — diskusi kecil di kafe, kelas-kelas alternatif, jejaring antar-kota — itu bukan persiapan pemilu. Itu **infrastruktur sosial** yang nantinya bakal ngebantu kita move on dari pemilu, terlepas hasilnya gimana.

> **Tia:** Yang aku pelajari dari ngorganisir komunitas: yang bertahan bukan yang paling keras, tapi yang **paling bisa diandalkan**. Reliability beats intensity.

**Tema musik:** "Lapis-Lapis" — Diskoria (dipakai dengan izin)$body$
where id = '88888888-0001-0000-0000-000000000005'
  and (body is null or body = '');

-- ────────────────────────────────────────────────────────────────────
-- 6. Lima Cara Sederhana Pemuda Bisa Ikut Audit Anggaran Daerah (Tulisan)
-- target via TITLE EXACT MATCH (UUID demo seed regenerable)
-- ────────────────────────────────────────────────────────────────────
update public.karya
set body = $body$Audit. Kata yang biasanya bikin orang ngantuk. Tapi kalau kamu pernah ngeluh soal jalan rusak, lampu mati, atau halte yang bocor — kamu sebenernya **udah ngambil sikap audit**. Kamu cuma belum dikasih tools-nya. Tulisan ini coba kasih lima cara konkret yang bisa kamu pakai bahkan tanpa background akuntansi.

## Konteks: kenapa anak muda bisa ikut

Anggaran daerah (APBD) itu uang publik. Setiap rupiah yang masuk, masuk dari pajak, retribusi, dan transfer pusat. Setiap rupiah yang keluar, ngebiayain proyek, gaji pegawai, atau program yang ngaruh ke kehidupan kamu. Setiap warga **berhak ikut ngawasin** — itu mandat UU 14/2008 (KIP) dan UU 23/2014 (Pemda).

Yang sering missing bukan haknya, tapi **pintunya**. Lima cara berikut adalah lima pintu yang udah aku coba buka satu-satu, dan ternyata masih bisa dibuka kalau tau caranya.

## 1. Baca dokumen LKPJ Bupati / Wali Kota di akhir tahun

Setiap akhir tahun anggaran, kepala daerah wajib bikin **Laporan Keterangan Pertanggungjawaban (LKPJ)**. Dokumennya publik, bisa di-download dari website pemda atau diakses via PPID. Yang menarik buat dibaca: bagian **realisasi anggaran per dinas**.

Misalnya, dinas pekerjaan umum dapet alokasi 250 miliar tapi realisasinya cuma 180 miliar. Pertanyaan yang muncul: **kenapa 70 miliar nggak terserap?** Belum tentu ada yang salah — bisa karena tender gagal, bisa karena program ditunda. Tapi pertanyaannya wajar dan layak diajuin ke wakil kamu di DPRD.

## 2. Pakai dashboard transparansi pemerintah

Beberapa kota udah punya dashboard. Surabaya pakai e-budgeting. Bandung punya BIRMS. DKI punya APBD-online. Yang lain banyak yang belum, tapi data-nya kadang ada di portal data terbuka pemkot/pemkab.

Yang aku saranin: **bookmark satu dashboard kotamu**. Cek tiap dua bulan. Kamu nggak harus ngerti semua angka — cukup notice apakah dashboard-nya update, apakah ada kategori yang tiba-tiba kosong, apakah ada anggaran "rapat-rapat" yang besarnya **mencurigakan dibanding output-nya**.

## 3. Hadiri Musrenbang — bahkan kalau cuma satu sesi

Musyawarah Perencanaan Pembangunan (Musrenbang) itu forum legal di mana warga ngusulin program ke RKPD. Levelnya berjenjang: Musrenbang RT, Kelurahan, Kecamatan, Kabupaten/Kota.

Yang banyak orang nggak tau: **kamu boleh hadir sebagai warga biasa**. Bawa KTP, datang. Aku pernah ke Musrenbang Kecamatan, ada 60 orang, mayoritas bapak-bapak RW yang udah lama. Dua mahasiswa hadir — aku sama temenku — dan kita kasih usulan soal halte sekolah yang nggak punya atap. Usulan itu masuk ke notulen.

Apa hasilnya? Jujur belum tau, ini Musrenbang baru tiga bulan lalu. Tapi setidaknya **usulannya ada di kertas resmi**, dan kalau nggak terealisasi, kita punya bukti untuk follow-up.

## 4. Pakai mekanisme PPID

UU KIP 14/2008 ngewajibin setiap badan publik punya PPID (Pejabat Pengelola Informasi & Dokumentasi). Tugasnya: **nyediain informasi publik atas permintaan warga**. Kalau kamu mau dokumen tertentu (kontrak proyek, daftar penerima bansos, dll), kirim permohonan resmi ke PPID kotamu — biasanya formulirnya ada online.

Pengalaman aku: respons time bervariasi. Ada yang 7 hari, ada yang molor sampai 3 bulan. Kalau dilanggar, kamu bisa banding ke **Komisi Informasi Publik provinsi**. Jangan males — proses ini yang bikin transparansi sebenarnya jalan, bukan retorika.

## 5. Kolaborasi dengan komunitas yang udah jalan

Jangan kerja sendirian. Indonesia punya ekosistem sipil yang udah maju di area ini: **ICW, FITRA, Pattiro, KPPOD**. Mereka punya tools, training, dan jaringan akademisi yang bisa kamu pinjam.

Kalau kamu mahasiswa, banyak kampus punya pusat studi anggaran. Mahasiswa skripsi sering riset APBD karena datanya melimpah. Approach mereka, kolaborasi data, share insight.

## Yang aku pelajari setelah satu tahun nyoba

Pertama: **bahasanya emang sengaja dibuat berlapis**. Pos belanja, kode rekening, alokasi DPA, mata anggaran — istilah-istilah ini barrier. Tapi yang barrier juga yang bikin posisi kamu kuat: kalau kamu udah belajar, kamu udah lebih siap dari rata-rata wakil rakyatmu sendiri.

Kedua: **konsistensi mengalahkan intensitas**. Lebih bagus rutin sebulan sekali nyentuh dashboard kota dibanding sebulan all-out lalu burnout. Demokrasi anggaran adalah maraton, bukan sprint.

Ketiga: **kamu nggak harus jadi expert**. Tugas warga bukan jadi auditor BPK. Tugas warga adalah **bertanya**. Pertanyaan yang bagus, diajukan rutin, di forum yang tepat — itu yang ngubah kebijakan, bukan keahlian akuntansi.$body$
where title = 'Lima Cara Sederhana Pemuda Bisa Ikut Audit Anggaran Daerah'
  and (body is null or body = '');

-- ────────────────────────────────────────────────────────────────────
-- 7. Kenapa Generasi Kita Skeptis terhadap Demokrasi (Tulisan)
-- target via TITLE EXACT MATCH
-- ────────────────────────────────────────────────────────────────────
update public.karya
set body = $body$Beberapa tahun terakhir ada satu pertanyaan yang aku sering dengar di ruang-ruang kecil: forum kelas, obrolan kosan, kafe pojokan setelah lima jam belajar. Pertanyaannya simpel tapi getir — **"Demokrasi ini buat siapa, sih, sebenernya?"** Yang nanyain bukan orang cynical yang bawaannya ngeluh. Justru orang yang masih percaya pada sesuatu, tapi nggak yakin sesuatu itu masih bernama demokrasi.

Kalau kamu ngerasa sama, aku mau ngomong: **kamu nggak sendirian, dan kamu nggak salah**. Skeptisisme generasi kita bukan tanda kita malas mikir. Justru tanda kita udah mulai mikir — dan mikirnya nyampe ke kesimpulan yang nggak nyaman.

## Survei yang nge-confirm yang kita rasa

Edelman Trust Barometer 2024 nunjukin angka yang menarik: di kalangan 18-34 tahun di Indonesia, kepercayaan terhadap pemerintah turun ke **52%** — drop 8 poin dari 2020. Yang naik justru kepercayaan ke **NGO** (61%) dan **bisnis** (58%). Ini ironi yang banyak orang skip: generasi muda nggak selalu anti-institusi. Mereka cuma **memilih institusi yang berbeda untuk dipercaya**.

Lembaga Survei Indonesia (LSI) Maret 2025 ngelaporin hal mirip: 47% responden 17-25 tahun mengaku "kurang puas" sama jalannya demokrasi — angka tertinggi di antara semua kelompok umur. Bukannya nggak ngerti demokrasi. Mereka justru ngerti banget — dan apa yang mereka liat nggak match sama harapan.

## Lima sumber skeptisisme yang aku amati

**Pertama, jarak antara prosedur dan substansi.** Pemilu rutin diadain. Tapi setiap kali kamu coblos, kamu juga makin sadar: yang menang, jarang langsung ngubah ekonomi kosanmu. Prosedur demokrasi (pemilu, DPR, MK) tetap jalan. Tapi substansi — siapa yang kerja kelas pekerja muda, siapa yang ngomongin perumahan terjangkau — sering nggak masuk pembahasan utama.

**Kedua, oligarki yang jadi vocab harian.** Sepuluh tahun lalu kata "oligarki" cuma muncul di kuliah politik. Sekarang muncul di caption Instagram. Bukan karena lebih akademis — karena makin **kelihatan**. Lihat siapa yang mendanai partai, siapa yang punya media, siapa yang jadi keluarga pejabat. Generasi kita tumbuh dengan akses informasi yang bikin pola itu nggak bisa di-unsee.

**Ketiga, gap antara wakil rakyat dan rakyat yang diwakili.** Berapa anggota DPR yang ngerti kosan 1 juta sebulan terlalu mahal buat fresh graduate? Berapa yang naik KRL? Berapa yang anaknya juga sekolah di SD negeri? Bukan soal harus identik — tapi soal **bandwidth empati**. Kalau bandwidth itu kering, demokrasi prosedural berasa kayak performance tanpa tujuan.

**Keempat, kelelahan iklim.** Banyak dari kita tumbuh dengan kesadaran krisis iklim. Generasi sebelumnya bisa diskusi politik tanpa ngerasa tenggat waktu. Generasi kita ngerasa **sistem politik nggak punya kecepatan yang dibutuhkan** untuk respons krisis. Demokrasi yang lambat berasa nggak adekuat — meskipun kita tau alternatifnya, otoritarianisme, juga nggak ngebantu.

**Kelima, fragmentasi informasi.** Di tahun 2014, dua orang temenan bisa nonton debat capres di TV yang sama. Sekarang, dua orang temenan dapat versi peristiwa yang sama dari dua TikTok yang berbeda. Demokrasi butuh **public sphere yang bersama**. Algoritma kita nggak ngasih itu.

## Kenapa skeptis itu wajar — dan bahkan sehat

> Skeptisisme bukan sinisme. Sinis berhenti di kekecewaan. Skeptis terus bertanya.

Ini bedanya yang penting buat kita pegang. Skeptisisme yang sehat itu pertanyaan yang nggak berhenti — kenapa sistem ini begini, siapa yang diuntungkan, siapa yang bayar harganya, alternatifnya apa, bisakah kita coba? Skeptisisme itu **fondasi rasional** untuk reformasi.

Sinisme, sebaliknya, udah putus asa. Dia bilang: nggak ada yang bisa diubah, semua sama aja, mendingan tidur. Sinis itu zona nyaman buat mati pelan-pelan.

Generasi kita lagi ada di garis tipis ini. Tugas kita bukan memaksa diri buat tetap optimis dengan cara performatif — tapi **mengarahkan skeptisisme ke pertanyaan yang produktif**.

## Dari skeptis ke ngapain?

Tiga hal yang aku coba tarik dari pengalaman:

**Konversi keraguan jadi pertanyaan publik.** Kalau kamu skeptis sama PSN tertentu, jangan cuma ngeluh ke kosan. Tulis. Tanyakan di forum publik. Suarakan di Komunitas. Skeptisisme yang ditulis bisa jadi bahan diskusi yang lebih luas, bukan sekadar venting.

**Cari komunitas yang ngakuin keraguanmu.** Ada perbedaan besar antara lingkungan yang ngepush "harus optimis!" sama lingkungan yang bilang "ya, ini emang ngeresahin, ayo kita pikirin bareng". Yang kedua jauh lebih sehat. Cari atau bikin yang kedua.

**Investasi waktu di hal yang kamu ngeliat efeknya langsung.** Kalau RT kamu jalan, kalau kampusmu lebih demokratis, kalau komunitasmu lebih sehat — itu juga politik. Itu bahkan **infrastruktur politik** kalau-kalau institusi nasional nggak workable.

## Penutup

Buat siapa pun yang lagi mempertanyakan demokrasi — aku mau bilang: **pertanyaanmu valid**. Generasi sebelumnya mungkin ngeliat ini sebagai sikap manja atau kurang patriotik. Aku ngeliat ini sebagai **proses dewasa yang sehat**.

Yang nggak sehat adalah kalau pertanyaan itu jadi alasan diam permanen. Pertanyaan harus diajukan, di tempat yang tepat, ke orang yang punya power untuk dengerin atau setidaknya mempertanggungjawabkan jawaban.

Demokrasi yang skeptis bukan demokrasi yang lemah. Justru yang paling siap untuk reformasi.$body$
where title = 'Kenapa Generasi Kita Skeptis terhadap Demokrasi (dan Kenapa Itu Wajar)'
  and (body is null or body = '');

-- ────────────────────────────────────────────────────────────────────
-- 8. Surat untuk Diriku di Tahun 2030 (Tulisan)
-- target via TITLE EXACT MATCH
-- ────────────────────────────────────────────────────────────────────
update public.karya
set body = $body$Ini surat yang mungkin nggak akan kamu baca, karena di tahun 2030 kamu pasti udah berbeda. Tapi aku nulis tetap — bukan untuk kamu yang akan datang, lebih untuk **aku yang sekarang**. Mungkin ini cara paling jujur buatku ngakuin apa yang aku takutin, harapin, dan rencanain.

## Yang aku takutin

Aku takut kamu udah lupa. Lupa rasa marah pas baca berita penggusuran tanpa konsultasi. Lupa rasa kaget waktu lihat angka kemiskinan yang nggak kunjung turun. Lupa malam-malam diskusi sampai jam dua di kafe yang sekarang udah tutup. Lupa nama-nama temanmu yang dulu seide, yang sekarang udah bekerja di tempat-tempat yang dulu kita kritisi.

Aku takut kamu udah cape. Bahwa kamu udah ngeliat terlalu banyak siklus pemilu yang berakhir mengecewakan, terlalu banyak janji yang terlepas, terlalu banyak harapan yang dipindahin ke kandidat berikutnya tanpa pernah tertepati. Capek itu legit — aku nggak akan ngehakimi kalau kamu bener-bener udah capek.

Tapi aku takut juga kamu udah **sinis**. Bedanya tipis sama capek, tapi efeknya beda banget. Capek butuh istirahat. Sinis butuh **dipertanyakan ulang**.

## Yang aku harapin

Aku harap kamu masih punya komunitas. Bukan komunitas yang heroik atau viral, cuma komunitas yang regular — temen-temen yang masih bisa diajak ngumpul tiap dua minggu, yang masih bisa kamu telpon kalau lagi merasa nggak waras. Aku harap kamu nggak nutup pintu meskipun lingkaran dewasa di sekelilingmu nyaranin **"udah, fokus karir aja"**.

Aku harap kamu udah ketemu cara untuk **engage politik tanpa ngorbanin kewarasan**. Mungkin kamu nggak lagi ikut demo setiap hari. Mungkin kamu nggak lagi nulis thread panjang di media sosial. Tapi aku harap kamu masih ngebaca dokumen anggaran sekali setahun. Masih ngecek janji walikotamu. Masih bantu orang yang baru mulai belajar — kayak kamu yang sekarang.

Aku harap kamu udah ketemu satu atau dua isu yang **bener-bener kamu pegang**. Bukan semua isu, bukan setiap perdebatan. Tapi satu atau dua hal — perumahan, transportasi, pendidikan vokasi, krisis iklim, kekerasan berbasis gender — yang kamu deepen sampai jadi expertise kamu. Setiap orang yang aku kagumin di umur 30-an punya hal kayak gitu. Aku harap kamu juga.

## Yang aku rencanain

Tujuh tahun bukan waktu yang panjang. Tapi cukup buat hal-hal kecil yang konsisten:

**Sebulan sekali, aku akan baca anggaran kotaku.** Tahun pertama mungkin cuma headline-nya. Tahun ketiga semoga aku ngerti pos belanja. Tahun ketujuh — yang akan kamu capai, semoga — aku bisa ngajarin orang lain.

**Setahun sekali, aku akan ke Musrenbang.** Bahkan kalau usulanku nggak masuk. Karena **hadir aja** itu bagian dari demokrasi. Karena absennya orang muda di forum-forum itu yang bikin forum itu kering ide.

**Setiap pemilu, aku akan baca semua program kandidat.** Bukan cuma yang menarik di IG. Yang minor partainya juga. Karena cara ngakuin demokrasi adalah **ngakuin keberadaan** semua pemain — bahkan yang aku nggak setuju.

**Setiap tahun, aku akan tulis surat baru ke diriku di masa depan.** Surat ini awalannya. Tahun depan ada surat ke aku 2031. Lalu 2032. Bukan supaya aku terlihat dewasa di Instagram — tapi supaya aku punya **trail** untuk ngecek apakah aku masih konsisten.

## Yang aku minta darimu

Kalau kamu di 2030 udah jauh lebih sukses dariku sekarang — selamat. Aku iri, mungkin. Tapi aku juga punya satu permintaan kecil:

**Inget bahwa kamu pernah jadi aku.** Mahasiswi 21 yang masih ngerasa nggak yakin, yang ngeluh karena kosan-nya bocor, yang mempertanyakan kenapa demokrasi terasa jauh dari hidupnya. Inget bukan untuk romantisasi — tapi untuk ngingetin diri sendiri bahwa **ada generasi baru yang sekarang lagi di posisi kayak kamu dulu**.

Kalau kamu udah punya power di 2030, jangan lupa pintu yang dibukain orang ke kamu. Bukain pintu yang sama buat orang lain. Bukan karena charity — karena keadilan.

## Penutup

Aku tutup surat ini dengan satu pengakuan: **aku takut nggak akan jadi seperti yang aku harap**. Mungkin di 2030 aku udah putus asa, udah pindah ke karir yang nggak ada hubungannya sama isu publik, udah nggak baca anggaran lagi.

Kalau itu terjadi, aku mau bilang ke aku-yang-itu: **nggak apa-apa**. Hidup nggak harus selalu bertema politik. Yang penting kamu masih jujur sama dirimu sendiri tentang **apa yang kamu lepasin dan kenapa**. Yang berbahaya bukan jadi orang biasa — yang berbahaya itu jadi orang biasa yang pura-pura nggak biasa.

Kasih kabar pas 2030, ya. Aku akan dengerin.

— Aku, dari 2026.$body$
where title = 'Surat untuk Diriku di Tahun 2030: Soal Politik dan Harapan'
  and (body is null or body = '');

-- ────────────────────────────────────────────────────────────────────
-- 9. Konstitusi dalam 8 Panel Komik (Ilustrasi)
-- target via TITLE EXACT MATCH
-- ────────────────────────────────────────────────────────────────────
update public.karya
set body = $body$UUD 1945 punya 37 pasal sebelum amandemen, plus tambahan amandemen yang ngubah nyaris separuhnya. Membacanya dari awal sampai akhir kayak baca traktat — formal dan kering. Tapi kalau dipotong jadi 8 momen visual, dia jadi cerita: tentang **siapa kita sebagai bangsa, apa yang kita janjikan ke diri sendiri, dan kenapa janji itu kadang nggak ditepati**.

Visual ini bukan ringkasan akademik. Ini cara baca konstitusi pakai mata yang sama yang kamu pakai buat baca komik favoritmu.

## Panel 1 — Pembukaan

Latar: Pasar di Yogya, 1946. Pedagang masih jualan. Tukang becak masih ngayuh. Anak-anak main di pinggir kali. Di atas mereka melayang kalimat dari Pembukaan: **"Kemerdekaan ialah hak segala bangsa"**. Yang ngebuat panel ini menarik bukan kemewahan upacara — tapi **kerendahan kehidupan biasa** yang baru aja merdeka. Konstitusi nggak lahir di istana, dia lahir di antara orang yang kerja keras setiap hari.

## Panel 2 — Pasal 1: "Indonesia adalah negara hukum"

Latar: Pengadilan kelurahan modern. Antrean orang dengan map cokelat. Pak Hakim baca dokumen. Petugas mengetik. **"Indonesia adalah negara hukum"** — kalimatnya sederhana, implikasinya raksasa. Setiap orang, termasuk pejabat tertinggi, **tunduk pada hukum yang sama**. Panel ini bertanya pelan: kapan terakhir kita ngeliat janji ini ditepati sepenuhnya?

## Panel 3 — Pasal 27 ayat (1): Bersamaan kedudukan

Latar: Kantor catatan sipil, antrean panjang. Ada yang bawa map, ada yang bawa kartu keluarga lecek, ada yang dijemput "calo". Di atas mereka kalimat: **"bersamaan kedudukannya di dalam hukum dan pemerintahan"**. Realitas di gambar nge-counter teks — yang **kedudukannya benar-benar sama**, masih jauh.

## Panel 4 — Pasal 28E ayat (3): Berserikat

Latar: Tiga kelompok — kelompok diskusi mahasiswa di kampus, koperasi nelayan di pesisir, kelompok ibu-ibu di posyandu. Mereka **berserikat** dalam tiga bentuk. Konstitusi nggak nentuin bentuk berserikat harus partai politik atau LSM mahal — bisa juga arisan, koperasi, lingkar warga. **Hak ini lebih luas dari yang sering kita bayangin.**

## Panel 5 — Pasal 33: Kekayaan alam

Latar: Hutan dengan gergaji mesin. Sungai keruh karena tambang. Lalu di sebelahnya, hutan adat yang masih utuh, sungai jernih, ibu-ibu nyuci di tepi. Pasal 33 ayat (3) **"dikuasai oleh negara dan dipergunakan untuk sebesar-besar kemakmuran rakyat"**. Pertanyaan visual: rakyat yang mana? Kemakmuran yang seperti apa? Yang sekarang, atau yang akan datang?

## Panel 6 — Pasal 28I ayat (2): Bebas dari diskriminasi

Latar: Antrean pendaftaran sekolah. Anak dari berbagai latar — etnis, agama, kemampuan tubuh. Salah satu anak duduk di kursi roda, salah satu pakai kerudung, salah satu nggak. Mereka **antri di pintu yang sama**. Konstitusi bilang setiap orang berhak bebas dari **diskriminasi atas dasar apa pun**. Panel ini ngingatin: kesamaan di pintu masuk itu indikator kesehatan negara.

## Panel 7 — Pasal 31: Pendidikan

Latar: SD negeri di pinggiran kota. Anak-anak antusias. Di papan tulis tertulis matematika sederhana. Tapi atapnya bocor, dan ember di sudut nampung air hujan. **Hak akan pendidikan ada — kualitasnya yang masih perjuangan**. Konstitusi udah janjiin akses; warga ngeliat **isinya** masih PR.

## Panel 8 — Pasal 1 ayat (2): Kedaulatan rakyat

Latar terakhir: TPS. Kotak suara. Antrean panjang dari subuh. Di atasnya, kalimat — **"Kedaulatan berada di tangan rakyat dan dilaksanakan menurut UUD"**. Yang ada di tangan kamu di TPS bukan cuma surat suara. Itu **fragment kedaulatan** — yang lalu kamu titipin ke wakil-wakilmu untuk lima tahun ke depan. Pertanyaan komik ini: setelah selesai coblos, **kedaulatan itu masih di tangan kamu, atau udah pindah?**

> Membaca konstitusi seperti membaca kontrak antargenerasi — di mana kita yang sekarang punya dua pekerjaan: ngakuin janji yang udah dibuat, dan ngecek apakah janji itu masih dipertanggungjawabkan.$body$
where title = 'Konstitusi dalam 8 Panel Komik'
  and (body is null or body = '');

-- ────────────────────────────────────────────────────────────────────
-- 10. Antara Aktivis dan Burnout (Podcast — script teaser)
-- target via TITLE EXACT MATCH
-- ────────────────────────────────────────────────────────────────────
update public.karya
set body = $body$**Episode 8 · Durasi: 38:14 · Diterbitkan 2 Mei 2026**

Episode ini berat. Kami ngumpul empat orang — aku sebagai host, plus tiga tamu yang bersedia ngomongin sesuatu yang jarang dibahas terbuka di gerakan: **kelelahan struktural sebagai aktivis muda**. Burnout bukan kelemahan individu. Dia gejala dari sistem dukungan yang belum matang.

Tiga tamu hadir bergiliran: **Indah** (32, mantan koordinator advokasi reformasi agraria), **Ferry** (29, ketua koperasi pemuda di Sulawesi Selatan), **Tasya** (27, advokat perempuan yang pernah ngehandle 40+ kasus dalam dua tahun lalu pause).

## Show notes

- **00:00** — Why this episode: kenapa kami akhirnya ngomongin burnout secara langsung
- **03:20** — Indah: tujuh tahun di gerakan agraria, kapan mulai sadar harus berhenti
- **11:05** — Ferry: gimana koperasi bisa jadi *sustainable activism* di luar hingar-bingar Jakarta
- **18:40** — Tasya: 40 kasus dalam dua tahun, dan apa yang aku salah hitung sebelumnya
- **24:50** — Diskusi: tanda-tanda burnout vs commitment yang sehat
- **30:20** — Strategi praktis: rotasi, financial buffer, mentorship
- **34:15** — Pesan untuk yang lagi mempertimbangkan terjun

## Cuplikan

> **Indah:** Aku dulu mikir, kalau lo cape itu artinya lo nggak commit. Sekarang aku tahu, kalau lo nggak pernah cape, kemungkinan lo cuma nggak ngerasain. Capek itu bukti bahwa kerja-kerja ini **emosi, bukan teori**.

> **Ferry:** Beda Sulsel sama Jakarta — di sini gerakan jalan dari produktivitas. Kita ngumpulin petani lewat koperasi, bukan lewat aksi. Hasilnya: kalau anggota lelah, dia bisa istirahat tanpa ngerasa **mengkhianati gerakan**.

> **Tasya:** Aku ngambil 40 kasus karena ngerasa **nggak boleh nolak**. Setelah pause delapan bulan, aku sadar — yang aku lakukan tujuh kasus pertama yang kualitas advokasinya bagus, tigapuluh sisanya quality-nya turun karena aku udah habis. **Memilih dengan baik adalah bagian dari etika gerakan**.

## Tiga tanda burnout yang kami sepakati

1. **Energi yang nggak balik setelah istirahat normal.** Tidur dua hari weekend tetap bangun cape — itu sinyal struktural, bukan kelelahan biasa.
2. **Kemarahan yang menggantikan kemarahan asli.** Awalnya kamu marah karena ketidakadilan. Lambat-lambat kamu marah karena rapat dimulai telat. Yang kedua udah indikator transmutasi yang nggak sehat.
3. **Hilangnya rasa connect dengan komunitas yang kamu perjuangkan.** Kalau kamu dah nggak peduli sama orang yang mestinya kamu bantu — itu **danger zone**. Saatnya jeda.

## Strategi praktis dari Indah, Ferry, Tasya

**Indah**: bikin **financial buffer 6-12 bulan**. Aktivisme yang bergantung sepenuhnya ke gaji NGO bikin kamu nggak bisa say no. Ada savings yang independen = ada kemampuan **memilih perjuanganmu**.

**Ferry**: rotasi peran. Di koperasinya, ketua diganti tiap 2 tahun bukan karena demokrasi prosedural — tapi karena **rotasi peran adalah kesehatan gerakan**. Ketua yang kelamaan kelelahan; kader baru yang nggak pernah dipromosi jadi pasif.

**Tasya**: cari **mentor di luar gerakan**. Mentor di dalam gerakan kasih validasi. Mentor di luar — di profesi lain, di lingkar lain — kasih perspektif. Kombinasi keduanya yang sehat.

## Pesan akhir

> **Indah:** Kalau kamu lagi mempertimbangkan masuk gerakan — please, jangan lompat. **Coba dulu**. Volunteer satu acara, dua acara. Ngeliat dari jauh sebelum berenang masuk. Aktivisme bukan agama, dia profesi yang butuh kapasitas dan strategi.

> **Ferry:** Kalau kamu lagi di tengah gerakan dan mulai cape — **jangan diam-diam**. Cari kawan yang juga aktivis dan bilang "gue lagi cape". Kalimat empat kata itu bisa mencegah breakdown yang lebih besar.

> **Tasya:** Dan kalau kamu udah berhenti — kamu nggak pengkhianat. Kamu **manusia** yang ambil keputusan dewasa. Gerakan butuh manusia, bukan martir. Yang istirahat sekarang bisa balik dalam bentuk berbeda. Kami akan nunggu, dengan ruang yang siap.$body$
where title = 'Antara Aktivis dan Burnout: Cerita 3 Penggerak Komunitas'
  and (body is null or body = '');

commit;

-- ──────────────────────────────────────────────────────────────────────
-- POST-APPLY VERIFICATION (run separately, not in transaction)
-- ──────────────────────────────────────────────────────────────────────
-- select id, title, type, length(body) as body_len
--   from public.karya
--  where id like '88888888-0001-%'
--     or title in (
--       'Lima Cara Sederhana Pemuda Bisa Ikut Audit Anggaran Daerah',
--       'Kenapa Generasi Kita Skeptis terhadap Demokrasi (dan Kenapa Itu Wajar)',
--       'Surat untuk Diriku di Tahun 2030: Soal Politik dan Harapan',
--       'Konstitusi dalam 8 Panel Komik',
--       'Antara Aktivis dan Burnout: Cerita 3 Penggerak Komunitas'
--     )
--  order by type, title;
--
-- Expected: 10 rows, body_len > 1500 untuk Tulisan, > 800 untuk Vlog/Podcast,
-- > 1500 untuk Ilustrasi 6/8 panel.
