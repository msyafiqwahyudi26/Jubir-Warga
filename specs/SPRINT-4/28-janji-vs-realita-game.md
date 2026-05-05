# Spec #28 — Janji vs Realita Game (Predict & Reveal)

**Sprint**: 4
**Owner**: Claude Code (Window C)
**Estimasi**: 1 minggu
**Priority**: P0 (engagement loop)
**Dependency**: #25 RPJMN scraping (data foundation)
**Source**: `docs/STRATEGY_PIVOT_2026-05-04.md` Section 3.1.3

---

## Goal

Build daily quiz game **fact-grounded** dengan mechanic **Predict & Reveal** (Mechanic A):

```
Janji: "[claim]" dari [pejabat] ([role]), deadline [year].

Menurut kamu, status saat ini?

A. ✅ Aligned — sesuai RPJMN/visi misi
B. 🟢 Partial — sebagian sesuai
C. 🟡 Drift — tidak ada di rencana / target deviasi
D. 🔴 Contradict — bertentangan

→ Reveal: real status from DB + AI reasoning + source citation
→ Score: kalibrasi prediksi (1 poin per benar)
→ Share card: "Gue tepat 7/10 prediksi minggu ini"
```

**Tujuan**: awareness tool — edukasi pasif via game ringan. 30-detik daily. **Tidak butuh login** (anonymous play, optional save score).

Existing Tebak Kata + Tebak Pejabat **dipertahankan** di `/main/`. Janji vs Realita = game baru tambahan, **prominent di Beranda**.

---

## Required reading

1. `docs/STRATEGY_PIVOT_2026-05-04.md` Section 3.1.3
2. `specs/SPRINT-3/13-main.md` — pattern existing Tebak Kata/Pejabat
3. `specs/SPRINT-4/00-overview.md`
4. `specs/SPRINT-4/24-tagih-dashboard-v2.md` — alignment data source

---

## File yang dibuat

```
apps/web/src/app/main/janji-vs-realita/
├── page.tsx                         Server — fetch janji of day + render game
├── game-client.tsx                  Client — quiz state + reveal animation
├── leaderboard.tsx                  Server — top 10 daily/weekly
├── share-card.tsx                   Client — generate shareable result image
└── streak-counter.tsx               Client — streak indicator

apps/web/src/lib/main/janji-vs-realita/
├── janji-of-day.ts                  Deterministic pick janji untuk hari ini
├── score-calculator.ts              Prediction scoring logic
└── share-card-generator.ts          Canvas-based share image

apps/web/src/components/beranda/
└── janji-vs-realita-card.tsx        BARU — prominent card di Beranda hero
```

---

## Step-by-step

### 1. Janji of day picker

```ts
// apps/web/src/lib/main/janji-vs-realita/janji-of-day.ts

/**
 * Deterministic: same date = same janji untuk semua user.
 * Dipilih dari janji_terstruktur dengan editorial_status = 'verified_curator'
 * dan punya alignment_verdict published (jadi reveal valid).
 */
export async function getJanjiOfDay(date: Date) {
  const supabase = await createClient();
  
  // get all eligible janji
  const { data: pool } = await supabase
    .from('janji_terstruktur')
    .select(`
      *, pejabat(*),
      alignment_verdict!inner(verdict, final_reasoning, editorial_status)
    `)
    .eq('editorial_status', 'verified_curator')
    .eq('alignment_verdict.editorial_status', 'approved');
  
  if (!pool || pool.length === 0) return null;
  
  // deterministic pick by day-index modulo
  const epoch = new Date('2026-01-01T00:00:00Z').getTime();
  const dayIndex = Math.floor((date.getTime() - epoch) / (1000 * 60 * 60 * 24));
  return pool[Math.abs(dayIndex) % pool.length];
}
```

### 2. Quiz client component

```tsx
// apps/web/src/app/main/janji-vs-realita/game-client.tsx
'use client';

const VERDICT_OPTIONS = [
  { key: 'aligned', label: '✅ Aligned', desc: 'Sesuai RPJMN/visi misi' },
  { key: 'partial', label: '🟢 Partial', desc: 'Sebagian sesuai' },
  { key: 'drift', label: '🟡 Drift', desc: 'Tidak di rencana atau deviasi target' },
  { key: 'contradict', label: '🔴 Contradict', desc: 'Bertentangan' },
];

export function GameClient({ janji, correctVerdict }) {
  const [phase, setPhase] = useState<'predict' | 'reveal'>('predict');
  const [selected, setSelected] = useState<string | null>(null);
  
  const isCorrect = selected === correctVerdict;
  
  return (
    <div className="card">
      <div className="kicker">— hari ini</div>
      <h1 className="display">Janji vs Realita</h1>
      
      <blockquote className="quote">
        "{janji.claim}"
      </blockquote>
      <div className="meta">
        <strong>{janji.pejabat.name}</strong> ({janji.pejabat.role}) ·
        deadline {janji.deadline_year}
      </div>
      
      {phase === 'predict' && (
        <>
          <p className="prompt">
            Menurut kamu, status saat ini di RPJMN/RPJMD?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {VERDICT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setSelected(opt.key);
                  setPhase('reveal');
                  saveScore(opt.key === correctVerdict);
                }}
                className="option-card"
              >
                <span className="label">{opt.label}</span>
                <span className="desc">{opt.desc}</span>
              </button>
            ))}
          </div>
        </>
      )}
      
      {phase === 'reveal' && (
        <RevealView
          janji={janji}
          predicted={selected}
          actual={correctVerdict}
          isCorrect={isCorrect}
          reasoning={janji.alignment_verdict[0].final_reasoning}
        />
      )}
    </div>
  );
}
```

### 3. RevealView dengan AI reasoning

```tsx
function RevealView({ janji, predicted, actual, isCorrect, reasoning }) {
  return (
    <div>
      <div className={isCorrect ? 'banner-mint' : 'banner-coral'}>
        {isCorrect ? '🎉 Tepat!' : `Hampir! Jawaban: ${actual}`}
      </div>
      
      <div className="reveal-detail">
        <h3>Status sebenarnya: {actual}</h3>
        <p>{reasoning}</p>
        <small className="muted">
          {janji.alignment_verdict[0].editorial_status === 'verified_curator'
            ? '✅ Terverifikasi Kurator'
            : '🤖 Kurasi AI'}
        </small>
      </div>
      
      <div className="actions">
        <Link href={`/tagih/pejabat/${janji.pejabat.id}`}>
          Lihat semua janji {janji.pejabat.name} →
        </Link>
        <ShareCard janji={janji} predicted={predicted} actual={actual} />
        <Link href="/main/janji-vs-realita">Main lagi besok</Link>
      </div>
      
      <Leaderboard mode="daily" />
    </div>
  );
}
```

### 4. Score persistence (anonymous via localStorage)

```ts
// apps/web/src/lib/main/janji-vs-realita/score-calculator.ts

export function saveScore(correct: boolean, date: Date = new Date()) {
  const key = 'janji-vs-realita-scores';
  const stored = JSON.parse(localStorage.getItem(key) ?? '{}');
  const dateKey = date.toISOString().slice(0, 10);
  
  if (stored[dateKey]) return;  // already played today
  
  stored[dateKey] = { correct, played_at: Date.now() };
  localStorage.setItem(key, JSON.stringify(stored));
  
  // optional: if logged in, sync ke server (existing game_scores pattern)
  syncToServerIfLoggedIn(correct, dateKey);
}

export function calculateStreak(): number {
  const stored = JSON.parse(localStorage.getItem('janji-vs-realita-scores') ?? '{}');
  const dates = Object.keys(stored).sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  for (const d of dates) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - streak);
    if (d === expected.toISOString().slice(0, 10)) streak++;
    else break;
  }
  return streak;
}

export function calculateAccuracy(): { correct: number; total: number; pct: number } {
  const stored = JSON.parse(localStorage.getItem('janji-vs-realita-scores') ?? '{}');
  const total = Object.keys(stored).length;
  const correct = Object.values(stored).filter((s: any) => s.correct).length;
  return { correct, total, pct: total ? Math.round((correct / total) * 100) : 0 };
}
```

### 5. Share card generator

```ts
// apps/web/src/lib/main/janji-vs-realita/share-card-generator.ts

export async function generateShareCard(data: {
  pejabatName: string;
  predicted: string;
  actual: string;
  isCorrect: boolean;
  date: string;
  accuracy: { correct: number; total: number };
}): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d')!;
  
  // background jw-cream
  ctx.fillStyle = '#FFFAEE';
  ctx.fillRect(0, 0, 1080, 1080);
  
  // header
  ctx.fillStyle = '#1A2256';
  ctx.font = 'bold 60px Vollkorn';
  ctx.fillText('Janji vs Realita', 60, 120);
  
  // ... (canvas drawing detail)
  
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

export async function shareToInstagram(blob: Blob) {
  if (navigator.share) {
    const file = new File([blob], 'janji-vs-realita.png', { type: 'image/png' });
    await navigator.share({
      title: 'Janji vs Realita — Jubir Warga',
      text: 'Pantau janji pejabat bareng warga muda. #JubirWarga',
      files: [file],
    });
  } else {
    // fallback download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'janji-vs-realita.png';
    a.click();
  }
}
```

### 6. Beranda card

```tsx
// apps/web/src/components/beranda/janji-vs-realita-card.tsx
import { getJanjiOfDay } from '@/lib/main/janji-vs-realita/janji-of-day';

export async function JanjiVsRealitaCard() {
  const janji = await getJanjiOfDay(new Date());
  if (!janji) return null;
  
  return (
    <div className="card-prominent">
      <span className="kicker">— main hari ini · 30 detik</span>
      <h2 className="display-lg">Janji vs Realita</h2>
      <p className="lead">
        Tebak status janji "{janji.claim.slice(0, 80)}..." dari {janji.pejabat.name}
      </p>
      <Link href="/main/janji-vs-realita" className="btn-primary">
        Main sekarang →
      </Link>
    </div>
  );
}
```

### 7. Leaderboard daily

```tsx
// apps/web/src/app/main/janji-vs-realita/leaderboard.tsx
export async function Leaderboard({ mode }: { mode: 'daily' | 'weekly' }) {
  const today = new Date().toISOString().slice(0, 10);
  const supabase = await createClient();
  
  const { data: scores } = await supabase
    .from('game_scores')
    .select('user_id, score, profiles(name, chapter_id)')
    .eq('game', 'janji-vs-realita')
    .gte('played_at', today)
    .order('score', { ascending: false })
    .limit(10);
  
  return (
    <ol>
      {scores?.map((s, i) => (
        <li key={s.user_id}>
          <span className="rank">{i + 1}</span>
          <span className="name">{s.profiles.name}</span>
          <span className="score">{s.score}/10</span>
        </li>
      ))}
    </ol>
  );
}
```

---

## Acceptance checklist

- [ ] `/main/janji-vs-realita` page accessible without login
- [ ] Janji of day deterministic — same per user same date
- [ ] 4 verdict option tampil dengan icon + label + desc
- [ ] Click option → reveal phase: actual + AI reasoning + source
- [ ] Verification badge tampil (Terverifikasi Kurator / Kurasi AI)
- [ ] Score saved di localStorage (anonymous) + optional server sync (logged in)
- [ ] Streak indicator di header game
- [ ] Accuracy stats (correct/total/%)
- [ ] Share card generation working (PNG download atau native share)
- [ ] Daily leaderboard top 10 tampil
- [ ] Beranda render `<JanjiVsRealitaCard>` prominent
- [ ] Mobile responsive 375px
- [ ] One-game-per-day enforce (localStorage check)
- [ ] Empty state kalau belum ada janji eligible (await curator review)

---

## Out of scope (defer)

- ❌ Daily Verdict swipe mechanic (Sprint 5+)
- ❌ Multiplayer / group play
- ❌ Tournament / weekly bracket
- ❌ AI explanation chat (Sprint 5)
- ❌ Push notification "game baru" (Sprint 5)

---

## Coordinate paralel — Window C territory

✅ Aman: `apps/web/src/app/main/janji-vs-realita/**`, `apps/web/src/lib/main/janji-vs-realita/**`, `apps/web/src/components/beranda/janji-vs-realita-card.tsx`
❌ JANGAN edit: existing `/main/tebak-kata` + `/main/tebak-pejabat` (Sprint 3 — keep)

Pull-rebase reflex.

---

## Commit message

```
feat(game): Janji vs Realita — Predict & Reveal mechanic

- Daily fact-grounded quiz, 30-detik
- 4 verdict prediction (Aligned/Partial/Drift/Contradict)
- Reveal: actual + AI reasoning + verification badge + source citation
- Anonymous play (localStorage score) + optional server sync
- Streak counter + accuracy stats + share card (PNG/native share)
- Daily leaderboard top 10
- Beranda prominent card

Per Spec #28 — engagement loop fact-grounded. Consume #24 + #29 data.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```
