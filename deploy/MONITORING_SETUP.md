# Monitoring Setup — Sentry + Plausible + UptimeRobot

3 tool monitoring untuk Jubir Warga. Semua punya free tier yang cukup untuk MVP/beta. Setup time total: ~30 menit.

---

## 1. Sentry — Error Tracking JS

Apa: Capture semua JS error di production, dengan stack trace + replay session pengguna saat error.
Free tier: 5,000 errors/bulan, 50 replays/bulan, 1 team member.

### Setup (10 menit)

1. Buka https://sentry.io/signup/ → sign up dengan email Mas (atau lewat GitHub OAuth)
2. Pas onboarding pilih **Platform: Browser JavaScript** (BUKAN React, karena kita pakai vanilla CDN)
3. Project name: `jubir-warga-web`
4. Setelah create, Sentry kasih DSN: `https://abc123@o4500000.ingest.sentry.io/4500001`. **Copy DSN itu.**

### Integration

Tambahkan ini di `index.html` **setelah load React, sebelum App.jsx**:

```html
<!-- Sentry (error tracking) — masukkan setelah React/ReactDOM, sebelum App.jsx -->
<script
  src="https://browser.sentry-cdn.com/8.20.0/bundle.tracing.replay.min.js"
  integrity="sha384-PASTEFROMCDNDOCS"
  crossorigin="anonymous">
</script>
<script>
  Sentry.init({
    dsn: "PASTE_DSN_DARI_SENTRY_DI_SINI",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,    // OK untuk public app
        blockAllMedia: false,
      }),
    ],
    environment: window.location.hostname === 'jubir.spdindonesia.org' ? 'production' : 'dev',
    release: 'beta-v2',
    tracesSampleRate: 0.1,        // 10% transaction tracing
    replaysSessionSampleRate: 0.05, // 5% session replay normal
    replaysOnErrorSampleRate: 1.0,  // 100% replay saat error
    beforeSend(event, hint) {
      // Filter out browser noise / dev tools errors
      if (hint?.originalException?.message?.includes('ResizeObserver loop')) return null;
      return event;
    },
  });
</script>
```

### Verify

Setelah deploy, buka browser → DevTools Console → ketik:
```js
throw new Error('Test Sentry');
```
Cek dashboard Sentry dalam 10 detik — harus muncul error baru.

---

## 2. Plausible — Privacy-Friendly Analytics

Apa: Tracking visitor + page view + event, tanpa cookie, tanpa fingerprinting. GDPR-compliant by default. Lightweight (~1 KB script).
Free tier: 30 hari free trial. Paid mulai $9/bulan untuk 10k page views.
Alternatif self-hosted (Mas punya VPS): bisa install Plausible CE gratis.

### Setup managed (5 menit)

1. Buka https://plausible.io → sign up
2. Add a website: `jubir.spdindonesia.org`
3. Plausible kasih snippet, copy.

### Integration

Tambahkan di `<head>` `index.html`:

```html
<!-- Plausible Analytics (cookie-free, GDPR-compliant) -->
<script defer
  data-domain="jubir.spdindonesia.org"
  src="https://plausible.io/js/script.tagged-events.js">
</script>
<script>
  // Helper untuk track custom event (vote, sign petisi, dll)
  window.plausible = window.plausible || function() {
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };
</script>
```

### Track custom events (opsional)

Di `JWStore.actions` (file `src/lib/store.js`), bisa tambah:

```js
sign(petisiId) {
  if (state.signed[petisiId]) return false;
  setField(['signed', petisiId], Date.now());
  // Track ke Plausible
  if (window.plausible) window.plausible('Petisi Signed', { props: { petisiId } });
  return true;
},
```

Lalu di Plausible dashboard, tambah custom goal "Petisi Signed".

### Verify

Buka https://plausible.io/jubir.spdindonesia.org — visitor count harus naik saat ada page view.

---

## 3. UptimeRobot — Uptime Monitoring

Apa: Ping site setiap 5 menit, alert via email/Telegram/Slack kalau down.
Free tier: 50 monitors, 5-minute checks, email alerts.

### Setup (5 menit)

1. Buka https://uptimerobot.com → sign up
2. **+ Add New Monitor**:
   - Type: **HTTPS**
   - Friendly Name: `Jubir Warga`
   - URL: `https://jubir.spdindonesia.org/`
   - Monitoring Interval: **5 minutes**
   - Alert Contacts: pilih email Mas (default sudah ada)
3. Save.
4. (Opsional) Tambah monitor kedua untuk health-check endpoint kalau Phase 2 punya `/api/health`.

### Setup public status page (gratis)

UptimeRobot kasih `https://stats.uptimerobot.com/<id>` URL — public status page yang bisa di-share. Tambah ke Tentang page sebagai trust signal:

```jsx
<a href="https://stats.uptimerobot.com/JUBIR-ID" target="_blank">
  Status sistem
</a>
```

---

## 4. Bonus: GitHub Actions notification

Tambah notification di workflow `deploy.yml` saat deploy gagal (Telegram/Discord/Slack webhook):

```yaml
- name: Notify on failure
  if: failure()
  uses: appleboy/telegram-action@v1
  with:
    to: ${{ secrets.TELEGRAM_CHAT_ID }}
    token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
    message: "❌ Jubir Warga deploy gagal di commit ${{ github.sha }}"
```

---

## Estimated cost (production scale)

| Tool | Free tier | Paid (kalau over) |
|---|---|---|
| Sentry | 5k errors/mo, 50 replays/mo | $26/mo for 50k errors |
| Plausible | 30-day trial | $9/mo for 10k pv |
| UptimeRobot | 50 monitors, 5-min check | $7/mo for 1-min check |
| **Total awal** | **$0** | ~**$42/mo** kalau scale |

Self-hosted alternatives untuk save cost (Phase 2):
- Plausible CE di VPS (gratis, butuh setup)
- Sentry self-hosted (heavy, kurang recommended)
- Uptime Kuma di VPS (open-source UptimeRobot replacement)

---

## Setelah Mas setup 3 akun di atas, kasih saya:
1. Sentry DSN
2. Plausible domain confirmed
3. UptimeRobot — saya tidak butuh apa-apa, monitoring jalan otomatis

Saya tinggal paste DSN ke `index.html` + push, dan production langsung punya error tracking + analytics aktif.
