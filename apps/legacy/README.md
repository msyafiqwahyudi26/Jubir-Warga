# Jubir Warga — Rumah online anak muda Indonesia

> Suara warga, rumahnya di sini.

Beta web aplikasi Jubir Warga 2.0 — community hub anak muda Indonesia 17–39 tahun untuk ngumpul, bersuara, berkarya, dan belajar. Lahir dari SPD (Sindikasi Pemilu & Demokrasi), dalam pembentukan PT independen 2026.

**Live:** [https://jubir.spdindonesia.org](https://jubir.spdindonesia.org)

---

## Quick Start

### Run lokal (development)
```bash
# Pakai Python http server (paling cepat)
python -m http.server 8000

# Buka browser ke http://localhost:8000/index.html
```

### Run lokal (single-file, no server needed)
1. Build standalone: `python scripts/build_standalone.py`
2. Dobel-klik `Standalone.html` — auto buka di browser

### Deploy ke production
```bash
# Push ke GitHub (akan auto-deploy via webhook ke VPS)
git push origin main
```

---

## Project Structure

```
jubirwarga/
├── public/                  # Static assets, PWA manifest, icons
├── src/
│   ├── components/          # Shared UI components
│   │   ├── layout/          # Header, Footer
│   │   ├── nala/            # Nala mascot SVG + chat
│   │   ├── ui/              # Button, Pill, Card, Avatar
│   │   ├── illustrations/   # Inline SVG ilustrasi
│   │   └── icons/           # Lucide icon helper
│   ├── pages/               # Per-page components
│   │   ├── komunitas/       # Forum hub + detail
│   │   ├── karya/           # Creator space + reader
│   │   ├── kelas/           # Learning + lesson player
│   │   ├── aksi/            # Polling + Petisi + Lapor
│   │   ├── tagih/           # Tagih Janji + detail
│   │   ├── nala/            # AI Companion
│   │   ├── main/            # Mini games
│   │   ├── profil/          # User profile + paspor
│   │   ├── auth/            # Login + Onboarding
│   │   └── statis/          # About, Privacy, Terms
│   ├── data/                # Mock data (akan di-replace API)
│   ├── lib/                 # Utilities, hooks
│   └── styles/              # Global styles, design tokens
├── docs/                    # Strategi, pitch deck, planning
├── deploy/                  # Infra & deployment configs
├── scripts/                 # Dev utilities (build, push, etc)
├── archive/                 # Old versions (untouched)
├── index.html               # Dev mode entry
└── Standalone.html          # Single-file build output
```

---

## Tech Stack (Beta)

| Layer | Tech | Notes |
|---|---|---|
| **UI Framework** | React 18 + Babel CDN | Multi-file dev, single-file deploy |
| **Styling** | Tailwind CDN + custom CSS | Brand tokens hardcoded |
| **State** | React state + localStorage | Mock backend |
| **Backend** | Mock data dari `src/data/` | Phase 2: Supabase |
| **AI** | Mock pre-canned responses | Phase 2: Claude API |
| **Hosting** | Nginx + VPS Hostinger Jakarta | + SSL Let's Encrypt |
| **PWA** | Service Worker + Manifest | Installable di Android/iOS |

**Phase 2 (Bulan 2-3):** Migrate ke Next.js + Supabase + Claude API + React Native mobile app.

---

## Brand

| Token | Hex | Pakai untuk |
|---|---|---|
| `--brand-blue` | `#1A2256` | Headline, CTA primary, footer |
| `--brand-cream` | `#FFFAEE` | Background utama |
| `--accent-coral` | `#E8632B` | CTA secondary, anotasi, accent |
| `--accent-marigold` | `#F2B137` | Level badge, "berjalan" status |
| `--accent-mint` | `#7FB69E` | "Ditepati" status, success |

**Typography:** Inter (UI), Vollkorn italic (display), Caveat (anotasi tangan), Fira Code (data/angka).

**Mascot:** Nala — beo claymorphism dengan 5 ekspresi (curious, excited, mentor, thinking, confident).

---

## Status (per April 2026)

✅ **Done:**
- 9 halaman utama (Beranda, Komunitas, Karya, Kelas, Aksi, Tagih Janji, Main, Nala, Profil)
- 6 detail pages (Thread, Reading, Lesson, Petisi, Janji, Paspor Public)
- Brand identity lengkap
- Citizen Wordle / Tebak Kata mini game playable
- Mascot Nala SVG dengan 5 ekspresi
- PWA manifest + service worker
- VPS deployment dengan SSL
- Folder structure scalable

🔧 **In progress (per RENCANA_1_BULAN.md):**
- Mobile responsive audit
- Polish visual consistency
- Spot the Hoaks + Tebak Pasal mini games
- Mock backend interactions (vote, comment, sign)
- Auto-deploy via GitHub Actions

⏳ **Phase 2:**
- Migrate ke Next.js
- Supabase integration
- Claude API for Nala
- React Native mobile app
- Auth real

---

## Contributing

Lihat [docs/RENCANA_1_BULAN.md](docs/RENCANA_1_BULAN.md) untuk roadmap detail.

Saat onboard developer baru:
1. Clone repo
2. `python -m http.server 8000`
3. Buka `http://localhost:8000`
4. Edit file di `src/`
5. Reload browser untuk lihat perubahan
6. Build standalone: `python scripts/build_standalone.py`

---

## License

Internal project — Inisiatif SPD (Sindikasi Pemilu & Demokrasi). Akan dirilis di bawah PT independen 2026.

## Contact

- IG: [@jubirwarga.id](https://instagram.com/jubirwarga.id)
- Email: info@jubirwarga.id
- Partnership: partnerships@jubirwarga.id
