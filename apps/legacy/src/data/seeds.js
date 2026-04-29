// ─────────────────────────────────────────────────────────
// Jubir Warga — Combined Mock Data Index
//
// Setelah semua file data/*.js dimuat, file ini menggabungkan
// mereka jadi window.JWData supaya page bisa pakai pola:
//
//   const { threads, kelas, janji } = window.JWData;
//
// PENTING: file ini WAJIB dimuat TERAKHIR setelah semua
// data/*.js. Lihat urutan <script> di index.html.
//
// Untuk lookup user/pejabat dari id, pakai helper
// JWData.byId.user(id) / .pejabat(id).
// ─────────────────────────────────────────────────────────

(function (global) {
  'use strict';

  function indexById(arr) {
    const map = {};
    (arr || []).forEach(item => { if (item && item.id) map[item.id] = item; });
    return map;
  }

  const data = {
    // Domain collections
    users:           global.JWUsers          || [],
    pejabat:         global.JWPejabat        || [],
    partai:          global.JWPartai         || [],

    threads:         global.JWThreads        || [],
    topikUtama:      global.JWTopikUtama     || [],
    lokasi:          global.JWLokasi         || [],
    formatThread:    global.JWThreadFormat   || [],
    chapters:        global.JWChapters       || [],
    subKomunitas:    global.JWSubKomunitas   || [],
    events:          global.JWEvents         || [],
    mitra:           global.JWMitra          || [],

    karya:           global.JWKarya          || [],
    karyaTypes:      global.JWKaryaTypes     || {},
    topKreator:      global.JWTopKreator     || [],

    kelas:           global.JWKelas          || [],
    mentors:         global.JWMentors        || [],
    testimoni:       global.JWTestimoni      || [],
    kelasMeta:       global.JWKelasMeta      || {},

    janji:           global.JWJanji          || [],
    janjiStatus:     global.JWJanjiStatus    || {},
    provinsiMVP:     global.JWProvinsiMVP    || [],

    polling:         global.JWPolling        || [],
    petisi:          global.JWPetisi         || [],
    laporan:         global.JWLaporan        || [],
    kampanye:        global.JWKampanye       || [],
    laporanKategori: global.JWLaporanKategori|| [],

    games:           global.JWGames          || [],
    civicWords:      global.JWCivicWords     || [],
    civicHints:      global.JWCivicHints     || {},
    hoaksQuiz:       global.JWHoaksQuiz      || [],
    pasalQuiz:       global.JWPasalQuiz      || [],
    leaderboard:     global.JWLeaderboard    || [],
    badges:          global.JWBadges         || [],
  };

  // ── Lookup index by id ───────────────────────────────
  const byIdMap = {
    user:        indexById(data.users),
    pejabat:     indexById(data.pejabat),
    thread:      indexById(data.threads),
    karya:       indexById(data.karya),
    kelas:       indexById(data.kelas),
    janji:       indexById(data.janji),
    petisi:      indexById(data.petisi),
    laporan:     indexById(data.laporan),
    kampanye:    indexById(data.kampanye),
    chapter:     indexById(data.chapters),
    badge:       indexById(data.badges),
  };

  data.byId = {
    user:     id => byIdMap.user[id]     || null,
    pejabat:  id => byIdMap.pejabat[id]  || null,
    thread:   id => byIdMap.thread[id]   || null,
    karya:    id => byIdMap.karya[id]    || null,
    kelas:    id => byIdMap.kelas[id]    || null,
    janji:    id => byIdMap.janji[id]    || null,
    petisi:   id => byIdMap.petisi[id]   || null,
    laporan:  id => byIdMap.laporan[id]  || null,
    kampanye: id => byIdMap.kampanye[id] || null,
    chapter:  id => byIdMap.chapter[id]  || null,
    badge:    id => byIdMap.badge[id]    || null,
  };

  // ── Convenience query ────────────────────────────────
  data.q = {
    threadsByCategory:  cat => data.threads.filter(t => t.cat === cat),
    threadsByLokasi:    loc => data.threads.filter(t => t.loc === loc),
    threadsHot:         ()  => data.threads.filter(t => t.hot),
    karyaByType:        type => data.karya.filter(k => k.type === type),
    karyaFeatured:      ()  => data.karya.filter(k => k.featured),
    janjiByStatus:      st  => data.janji.filter(j => j.status === st),
    janjiByLevel:       lvl => data.janji.filter(j => {
      const p = data.byId.pejabat(j.pejabatId);
      return p && p.level === lvl;
    }),
    petisiActive:       ()  => data.petisi.filter(p => new Date(p.deadline.split(' ').reverse().join('-')) > new Date() || true), // semua aktif untuk demo
    pejabatBySkor:      ()  => [...data.pejabat].sort((a,b) => b.skor - a.skor),
    leaderboardWithUsers: () => data.leaderboard.map(row => ({
      ...row,
      user: data.byId.user(row.userId),
    })),
  };

  global.JWData = data;

  // Console hint untuk developer
  if (typeof console !== 'undefined' && console.info) {
    const counts = [
      `users: ${data.users.length}`,
      `threads: ${data.threads.length}`,
      `karya: ${data.karya.length}`,
      `kelas: ${data.kelas.length}`,
      `janji: ${data.janji.length}`,
      `petisi: ${data.petisi.length}`,
    ].join(', ');
    console.info(`[Jubir Warga] window.JWData siap. ${counts}`);
  }
})(window);
