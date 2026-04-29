// ─────────────────────────────────────────────────────────
// Jubir Warga — Formatting helpers (Bahasa Indonesia)
//
// Date, number, currency, relative time, slug, truncate.
// Tidak ada dependency. Pakai via window.JWFormat.X.
// ─────────────────────────────────────────────────────────

(function (global) {
  'use strict';

  const BULAN = [
    'Januari', 'Februari', 'Maret',  'April',
    'Mei',     'Juni',     'Juli',   'Agustus',
    'September','Oktober', 'November','Desember',
  ];
  const BULAN_SINGKAT = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];
  const HARI = [
    'Minggu', 'Senin', 'Selasa', 'Rabu',
    'Kamis',  'Jumat', 'Sabtu',
  ];

  // ── Date ─────────────────────────────────────────────
  function date(input, opts = {}) {
    const d = (input instanceof Date) ? input : new Date(input);
    if (isNaN(d.getTime())) return '—';
    const { withDay = false, short = false } = opts;
    const day   = d.getDate();
    const month = (short ? BULAN_SINGKAT : BULAN)[d.getMonth()];
    const year  = d.getFullYear();
    const base  = `${day} ${month} ${year}`;
    return withDay ? `${HARI[d.getDay()]}, ${base}` : base;
  }

  function dateShort(input) {
    return date(input, { short: true });
  }

  function dateTime(input) {
    const d = (input instanceof Date) ? input : new Date(input);
    if (isNaN(d.getTime())) return '—';
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${dateShort(d)} • ${hh}:${mm}`;
  }

  // ── Relative time ("3 jam lalu") ─────────────────────
  function relativeTime(input) {
    const d   = (input instanceof Date) ? input : new Date(input);
    if (isNaN(d.getTime())) return '—';
    const now = Date.now();
    const sec = Math.floor((now - d.getTime()) / 1000);
    if (sec < 60)         return 'baru saja';
    if (sec < 3600)       return `${Math.floor(sec / 60)} menit lalu`;
    if (sec < 86400)      return `${Math.floor(sec / 3600)} jam lalu`;
    if (sec < 86400 * 7)  return `${Math.floor(sec / 86400)} hari lalu`;
    if (sec < 86400 * 30) return `${Math.floor(sec / (86400 * 7))} minggu lalu`;
    if (sec < 86400 * 365)return `${Math.floor(sec / (86400 * 30))} bulan lalu`;
    return `${Math.floor(sec / (86400 * 365))} tahun lalu`;
  }

  // ── Number ───────────────────────────────────────────
  // Indonesian: titik untuk ribuan (1.234), koma untuk desimal (1,5)
  function number(n, opts = {}) {
    if (n == null || isNaN(n)) return '—';
    const { decimals = 0 } = opts;
    return Number(n).toLocaleString('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  // 1.234.567 → "1,2 jt"; 12.345 → "12,3 rb"
  function numberCompact(n) {
    if (n == null || isNaN(n)) return '—';
    const abs = Math.abs(n);
    if (abs >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace('.', ',')} M`;
    if (abs >= 1_000_000)     return `${(n / 1_000_000).toFixed(1).replace('.', ',')} jt`;
    if (abs >= 1_000)         return `${(n / 1_000).toFixed(1).replace('.', ',')} rb`;
    return String(n);
  }

  // ── Currency (IDR) ───────────────────────────────────
  function rupiah(n, opts = {}) {
    if (n == null || isNaN(n)) return '—';
    const { compact = false } = opts;
    if (compact) return `Rp ${numberCompact(n)}`;
    return `Rp ${number(n)}`;
  }

  // ── Percentage ───────────────────────────────────────
  function percent(n, opts = {}) {
    if (n == null || isNaN(n)) return '—';
    const { decimals = 0 } = opts;
    return `${Number(n).toFixed(decimals).replace('.', ',')}%`;
  }

  // ── Slug ─────────────────────────────────────────────
  function slug(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }

  // ── Truncate ────────────────────────────────────────
  function truncate(str, max = 120, suffix = '…') {
    const s = String(str || '');
    return s.length > max ? s.slice(0, max - suffix.length) + suffix : s;
  }

  // ── Pluralize (basic Bahasa) ────────────────────────
  // Bahasa biasanya tidak pakai pluralization morfologis, jadi
  // helper ini cuma untuk word repetition seperti "warga-warga".
  function pluralize(word, count) {
    if (count <= 1) return word;
    return `${word}-${word}`;
  }

  // ── Initials (untuk avatar fallback) ────────────────
  function initials(name, max = 2) {
    return String(name || '')
      .split(/\s+/)
      .filter(Boolean)
      .map(w => w[0])
      .join('')
      .slice(0, max)
      .toUpperCase();
  }

  // ── Phone format Indonesia ──────────────────────────
  function phoneId(raw) {
    const digits = String(raw || '').replace(/\D/g, '');
    if (digits.startsWith('62')) return `+62 ${digits.slice(2)}`;
    if (digits.startsWith('0'))  return digits.replace(/^(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
    return raw;
  }

  // ── Export ───────────────────────────────────────────
  global.JWFormat = {
    date,
    dateShort,
    dateTime,
    relativeTime,
    number,
    numberCompact,
    rupiah,
    percent,
    slug,
    truncate,
    pluralize,
    initials,
    phoneId,
    // constants
    BULAN,
    BULAN_SINGKAT,
    HARI,
  };
})(window);
