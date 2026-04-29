-- ─────────────────────────────────────────────────────────
-- Jubir Warga — Seed data untuk dev/staging
-- Run setelah 0001_init.sql apply.
-- ─────────────────────────────────────────────────────────
-- WARNING: kalau jalankan ulang, gunakan TRUNCATE atau ON CONFLICT DO NOTHING.

-- ── Pejabat ────────────────────────────────────────────────
insert into public.pejabat (id, nama, jabatan, partai, level, dapil, skor) values
  ('11111111-0001-0000-0000-000000000001', 'Joko K.',         'Presiden RI',          'Independen', 'Pusat',    'Nasional',          64),
  ('11111111-0001-0000-0000-000000000002', 'Pramono A.',      'Gubernur DKI Jakarta', 'PDIP',       'Provinsi', 'DKI',                72),
  ('11111111-0001-0000-0000-000000000003', 'Sri Mulyani',     'Menkeu RI',            'Independen', 'Pusat',    'Nasional',          58),
  ('11111111-0001-0000-0000-000000000004', 'Anies B.',        'Eks Gub. DKI',         'NasDem',     'Provinsi', 'DKI',                51),
  ('11111111-0001-0000-0000-000000000005', 'Ridwan K.',       'Eks Gub. Jabar',       'Golkar',     'Provinsi', 'Jabar',              81),
  ('11111111-0001-0000-0000-000000000006', 'Khofifah',        'Gubernur Jawa Timur',  'PKB',        'Provinsi', 'Jatim',              69),
  ('11111111-0001-0000-0000-000000000007', 'Bobby N.',        'Wali Kota Medan',      'Gerindra',   'Kota',     'Medan',              42),
  ('11111111-0001-0000-0000-000000000008', 'Danny P.',        'Wali Kota Makassar',   'NasDem',     'Kota',     'Makassar',           55),
  ('11111111-0001-0000-0000-000000000009', 'Edy R.',          'Eks Gub. Sumut',       'PDIP',       'Provinsi', 'Sumut',              60),
  ('11111111-0001-0000-0000-00000000000a', 'Andi Sudirman',   'Gubernur Sulsel',      'PKS',        'Provinsi', 'Sulsel',             76),
  ('11111111-0001-0000-0000-00000000000b', 'Eri C.',          'Wali Kota Surabaya',   'PDIP',       'Kota',     'Surabaya',           49),
  ('11111111-0001-0000-0000-00000000000c', 'Sanusi',          'Bupati Malang',        'Golkar',     'Kota',     'Malang',             38),
  ('11111111-0001-0000-0000-00000000000d', 'Ridwan Suryadi',  'Anggota DPR',          'PDIP',       'Pusat',    'DKI Jakarta III',    65),
  ('11111111-0001-0000-0000-00000000000e', 'Anisa Putri',     'Wali Kota Jakut',      'Golkar',     'Kota',     'Jakarta Utara',      78)
on conflict (id) do nothing;

-- ── Janji ──────────────────────────────────────────────────
insert into public.janji (id, pejabat_id, topik, janji_text, status, deadline, pemantau_count, evidence_count) values
  ('22222222-0001-0000-0000-000000000001', '11111111-0001-0000-0000-000000000001', 'Ekonomi',         '"Kami akan turunkan harga BBM 30% dalam 100 hari pertama."',                     'Berjalan',  '2026-12-31', 1284, 3),
  ('22222222-0001-0000-0000-000000000002', '11111111-0001-0000-0000-000000000002', 'Transportasi',    '"Tambah 50 km jalur sepeda baru sebelum akhir 2026."',                            'Berjalan',  '2026-12-31',  612, 2),
  ('22222222-0001-0000-0000-000000000003', '11111111-0001-0000-0000-000000000003', 'Ekonomi',         '"Subsidi BBM dialihkan ke transportasi publik massal."',                          'Mandek',    '2027-06-30',  893, 1),
  ('22222222-0001-0000-0000-000000000004', '11111111-0001-0000-0000-000000000004', 'Lingkungan',      '"Ruang terbuka hijau 30% di Jakarta dalam masa jabatan."',                         'Mandek',    '2027-03-31',  847, 4),
  ('22222222-0001-0000-0000-000000000005', '11111111-0001-0000-0000-000000000005', 'Pendidikan',      '"Bangun 1.000 sekolah vokasi di Jawa Barat."',                                    'Ditepati',  null,         621, 5),
  ('22222222-0001-0000-0000-000000000006', '11111111-0001-0000-0000-000000000006', 'UMKM',            '"Akses kredit Rp10 juta untuk 100.000 UMKM Jatim."',                              'Berjalan',  '2027-06-30',  412, 2),
  ('22222222-0001-0000-0000-000000000007', '11111111-0001-0000-0000-000000000007', 'Sampah',          '"Atasi sampah Medan dalam 1 tahun."',                                             'Diingkari', '2026-04-30',  298, 3),
  ('22222222-0001-0000-0000-000000000008', '11111111-0001-0000-0000-000000000008', 'Banjir',          '"Bebas banjir di 5 titik kritis Makassar."',                                      'Belum',     '2027-12-31',  156, 0),
  ('22222222-0001-0000-0000-000000000009', '11111111-0001-0000-0000-000000000009', 'Lingkungan',      '"Tanam 1 juta pohon di Sumut sebelum 2027."',                                     'Berjalan',  '2026-12-31',  178, 1),
  ('22222222-0001-0000-0000-00000000000a', '11111111-0001-0000-0000-00000000000a', 'Kesehatan',       '"Tambah 50 puskesmas di pesisir Sulsel."',                                        'Ditepati',  null,         234, 4),
  ('22222222-0001-0000-0000-00000000000b', '11111111-0001-0000-0000-00000000000b', 'Banjir',          '"Atasi banjir 10 titik kritis Surabaya 2026."',                                   'Mandek',    '2026-12-31',  567, 2),
  ('22222222-0001-0000-0000-00000000000c', '11111111-0001-0000-0000-00000000000c', 'Pelayanan',       '"Konsultasi publik sebelum naikkan tarif parkir."',                                'Diingkari', '2026-04-15',   89, 3),
  ('22222222-0001-0000-0000-00000000000d', '11111111-0001-0000-0000-00000000000d', 'Ketenagakerjaan', '"Dorong revisi UU PPRT selesai sebelum akhir 2025."',                              'Berjalan',  '2025-12-31',  340, 1),
  ('22222222-0001-0000-0000-00000000000e', '11111111-0001-0000-0000-00000000000e', 'Keamanan',        '"Tambah 50 titik CCTV di kawasan padat hunian."',                                  'Ditepati',  null,         187, 2)
on conflict (id) do nothing;

-- ── Petisi ─────────────────────────────────────────────────
insert into public.petisi (id, title, summary, body, icon, target, current_count, deadline, tags, status) values
  ('33333333-0001-0000-0000-000000000001',
    'Audit Transparan APBD Jakarta 2026',
    'Mendesak Pemprov DKI buka audit lengkap pengeluaran APBD 2026, akses publik, dan format machine-readable.',
    e'Kami warga Jakarta meminta Pemprov DKI untuk:\n\n1. Membuka audit lengkap APBD 2026 dengan format machine-readable (CSV/JSON), bukan PDF scan yang tidak bisa di-search.\n2. Public dashboard untuk track realisasi vs perencanaan, real-time per OPD.\n3. Kanal pengaduan publik yang dijawab dalam SLA 14 hari kerja, dengan tracking nomor.',
    '📋', 20000, 14230, '2026-06-15', ARRAY['Transparansi','APBD','Jakarta'], 'active'),
  ('33333333-0001-0000-0000-000000000002',
    'Kembalikan Jam KRL 04.00 WIB',
    'Jadwal KRL paling pagi dimajukan ke 04.00 WIB untuk pekerja shift pagi & ibu-ibu pasar tradisional.',
    null, '🚇', 10000, 7340, '2026-05-20', ARRAY['Transportasi','KRL'], 'active'),
  ('33333333-0001-0000-0000-000000000003',
    'Akses Internet Gratis untuk Sekolah Negeri',
    'Setiap sekolah negeri di Indonesia dapat akses internet minimum 50 Mbps gratis sepanjang tahun ajaran.',
    null, '💻', 50000, 31890, '2026-07-30', ARRAY['Pendidikan','Digital'], 'active'),
  ('33333333-0001-0000-0000-000000000004',
    'Hentikan Penebangan Pohon di Jl. Soekarno-Hatta Bandung',
    'Jalur hijau yang melindungi pejalan kaki & sepeda terancam pelebaran jalan. Kami minta moratorium dulu.',
    null, '🌳',  5000,  3210, '2026-06-12', ARRAY['Lingkungan','Bandung'], 'active')
on conflict (id) do nothing;

-- ── Polling ────────────────────────────────────────────────
insert into public.polling (id, question, options, total_votes, deadline) values
  ('44444444-0001-0000-0000-000000000001',
    'Subsidi BBM mau dialihkan ke mana? (max 1 pilihan)',
    '[{"id":"a","label":"Transportasi publik & KRL","emoji":"🚇","votes":1820},
      {"id":"b","label":"Subsidi pangan & sembako","emoji":"🛒","votes":1430},
      {"id":"c","label":"Beasiswa pendidikan","emoji":"📚","votes":1077}]'::jsonb,
    4327, '2026-05-30')
on conflict (id) do nothing;

-- ── Kampanye ───────────────────────────────────────────────
insert into public.kampanye (id, title, description, icon, participant_count, featured) values
  ('55555555-0001-0000-0000-000000000001', 'Gerakan 1000 Warga Pantau APBD', 'Bergabunglah memantau penggunaan anggaran daerahmu bersama komunitas.',     '🔍', 1243, true),
  ('55555555-0001-0000-0000-000000000002', 'Literasi Digital Desa 2026',     'Bantu warga desa pahami informasi dan cegah hoaks online.',                  '📱',  456, false),
  ('55555555-0001-0000-0000-000000000003', 'Kawal Reforma Agraria',          'Pantau distribusi lahan dan sengketa agraria di daerahmu.',                  '🌾',  789, false),
  ('55555555-0001-0000-0000-000000000004', 'Jakarta Ramah Sepeda 2027',      'Audit & advokasi 200 km jalur sepeda yang dijanjikan Pemprov.',              '🚲',  312, false)
on conflict (id) do nothing;

-- ── Laporan (sample) ───────────────────────────────────────
insert into public.laporan (id, category, title, description, location, city, status, dukungan_count) values
  ('66666666-0001-0000-0000-000000000001', 'jalan',    'Lubang besar di Jl. Tebet Barat dekat halte',          null, 'Jakarta · Tebet',     'jakarta',  'Diterima',         24),
  ('66666666-0001-0000-0000-000000000002', 'banjir',   'Banjir setiap hujan di Kel. Antapani',                 null, 'Bandung · Antapani',  'bandung',  'Ditindaklanjuti',  87),
  ('66666666-0001-0000-0000-000000000003', 'sampah',   'Sampah menumpuk dekat SDN 03 Sukun',                   null, 'Malang · Sukun',      'malang',   'Diterima',         12),
  ('66666666-0001-0000-0000-000000000004', 'listrik',  'Lampu jalan mati 2 minggu di Tj. Duren',               null, 'Jakarta · Tj. Duren', 'jakarta',  'Selesai',          45),
  ('66666666-0001-0000-0000-000000000005', 'layanan',  'Pelayanan KTP lambat di Disdukcapil Surabaya Selatan', null, 'Surabaya',            'surabaya', 'Ditindaklanjuti', 156),
  ('66666666-0001-0000-0000-000000000006', 'drainase', 'Drainase mampet di Kel. Petisah Tengah',               null, 'Medan · Petisah',     'medan',    'Diterima',         33)
on conflict (id) do nothing;

-- ── Kelas ──────────────────────────────────────────────────
insert into public.kelas (id, title, description, duration, level, price_idr, participant_count, featured) values
  ('77777777-0001-0000-0000-000000000001', 'Kelas Jubir Warga: dari Resah ke Suara ke Aksi',          'Program 6 minggu intensif untuk mengubah kepedulianmu jadi tindakan nyata.',       '6 minggu', 'Menengah', 350000, 124, true),
  ('77777777-0001-0000-0000-000000000002', 'Youth Political Participation in the Digital Age',         null,                                                                              '4 minggu', 'Pemula',   200000, 234, false),
  ('77777777-0001-0000-0000-000000000003', 'Politics and Popular Culture: Meme, Musik, dan Makna',     null,                                                                              '3 minggu', 'Pemula',        0, 567, false),
  ('77777777-0001-0000-0000-000000000004', 'Social Marketing & Fundraising untuk Gerakan Sosial',      null,                                                                              '5 minggu', 'Menengah', 250000, 189, false),
  ('77777777-0001-0000-0000-000000000005', 'Standup Comedy untuk Kritik Politik',                       null,                                                                              '2 minggu', 'Pemula',   150000, 312, false),
  ('77777777-0001-0000-0000-000000000006', 'Fan-based Movement & Volunteer Management',                null,                                                                              '4 minggu', 'Menengah', 200000, 145, false),
  ('77777777-0001-0000-0000-000000000007', 'Political Vlog Content Creation',                          null,                                                                              '3 minggu', 'Pemula',   175000, 298, false)
on conflict (id) do nothing;

-- Modul untuk kelas utama
insert into public.kelas_modul (id, kelas_id, ord, title, duration, type) values
  ('77777777-0001-0001-0001-000000000001', '77777777-0001-0000-0000-000000000001', 1, 'Resah ke Pertanyaan',    '90 mnt',  'video'),
  ('77777777-0001-0001-0001-000000000002', '77777777-0001-0000-0000-000000000001', 2, 'Mendengar Tanpa Setuju', '90 mnt',  'video'),
  ('77777777-0001-0001-0001-000000000003', '77777777-0001-0000-0000-000000000001', 3, 'Riset Cepat & Sumber',   '120 mnt', 'workshop'),
  ('77777777-0001-0001-0001-000000000004', '77777777-0001-0000-0000-000000000001', 4, 'Menulis Opini Publik',   '90 mnt',  'video'),
  ('77777777-0001-0001-0001-000000000005', '77777777-0001-0000-0000-000000000001', 5, 'Kampanye Sederhana',     '120 mnt', 'workshop'),
  ('77777777-0001-0001-0001-000000000006', '77777777-0001-0000-0000-000000000001', 6, 'Audiensi & Negosiasi',   '180 mnt', 'capstone')
on conflict (id) do nothing;

-- ── Karya (sample) ─────────────────────────────────────────
insert into public.karya (id, type, title, body, meta, tags, views, featured) values
  ('88888888-0001-0000-0000-000000000001', 'Tulisan',   'Lima Alasan Pemuda Masih Apatis terhadap Pemilu Lokal',                                       null, '7 mnt',   ARRAY['Pemilu','Pemuda','Apatisme'], 1240, true),
  ('88888888-0001-0000-0000-000000000002', 'Vlog',      'Ngobrol sama Ibu PKL soal APBD — ternyata mereka lebih paham dari yang kita kira',          null, '12:34',   ARRAY['APBD','Lokal','Wawancara'],   3450, true),
  ('88888888-0001-0000-0000-000000000003', 'Ilustrasi', 'Kenapa Suara Kita Bisa Hilang — dalam 6 panel visual',                                       null, '6 panel', ARRAY['Pemilu','Visual'],             890, false),
  ('88888888-0001-0000-0000-000000000004', 'Tulisan',   'Demokrasi Deliberatif: Teori yang Bisa Kita Coba di RT/RW',                                  null, '12 mnt',  ARRAY['Demokrasi','Lokal','Teori'],   670, false),
  ('88888888-0001-0000-0000-000000000005', 'Podcast',   'Obrolan Pagi: Gerakan Pemuda & Pemilu 2029',                                                 null, '45:22',   ARRAY['Pemilu 2029','Pemuda'],       1120, false)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────
-- Verify count
-- ─────────────────────────────────────────────────────────
do $$
declare counts text;
begin
  select string_agg(t.tab || ': ' || t.cnt, ', ' order by t.tab) into counts from (
    select 'pejabat' as tab,       count(*)::text as cnt from public.pejabat       union all
    select 'janji',                count(*)::text       from public.janji          union all
    select 'petisi',               count(*)::text       from public.petisi         union all
    select 'polling',              count(*)::text       from public.polling        union all
    select 'kampanye',             count(*)::text       from public.kampanye       union all
    select 'laporan',              count(*)::text       from public.laporan        union all
    select 'kelas',                count(*)::text       from public.kelas          union all
    select 'kelas_modul',          count(*)::text       from public.kelas_modul    union all
    select 'karya',                count(*)::text       from public.karya
  ) t;
  raise notice 'Seed data loaded: %', counts;
end $$;
