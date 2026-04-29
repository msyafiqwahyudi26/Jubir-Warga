# Spec #5 — Nala AI global slide-over panel

**Sprint**: 2
**Owner**: Claude Code (executor) · audited oleh planner
**Estimasi**: 4-5 jam
**Dependency**: Spec #4 (mascot + trigger button siap). Bisa parallel asal Spec #4 mascot komponen sudah ada.
**Required reading**: CLAUDE.md section 4.5 (persona Nala system prompt); Design v2 doc Section 4.14 & 4.15 (AI Nala chat + halaman); `apps/legacy/src/lib/nala-prompts.js`.

---

## Goal

Nala harus terasa hadir di seluruh platform — bukan cuma 1 page tersendiri. Cara: slide-over panel (drawer dari kanan) yang bisa di-trigger dari **manapun** via floating `<NalaTriggerButton>` atau header button. Panel ini berisi chat interface (mock untuk Sprint 2 — backend Claude API integration di Sprint 4).

State persistent saat user navigate antar page (Zustand store + localStorage cache). Empty state: 4 suggested prompt cards. Setelah user submit prompt: muncul respons mock yang plausible.

## Konteks

Design v2 doc explicitly: "AI Jubir [Nala] chat panel global yang dapat dipanggil dari mana saja via tombol header." Ini differentiator utama Jubir Warga vs Twitter/Discord/Reddit. Implementasi-nya bukan modal pop-up tapi slide-over panel — supaya user bisa lihat konten utama di belakang panel sambil chat (mis. baca thread + tanya Nala soal thread itu).

Sprint 2 scope: panel + UI + mock response. Sprint 4 scope: integrasi Claude API real + RAG ke konten Jubir Warga.

## File yang dibuat

```
apps/web/src/components/nala/
├── nala-panel.tsx                Main panel (slide-over)
├── nala-panel-trigger.tsx        Header button (Sparkles icon) — re-export dari NalaTriggerButton dengan style header variant
├── nala-message-bubble.tsx       Chat message bubble (user vs nala)
├── nala-prompt-chips.tsx         Suggested prompt chips (4 displayed di empty state)
└── nala-composer.tsx             Bottom textarea + send button

apps/web/src/lib/nala/
├── store.ts                      Zustand store untuk panel state + chat history
├── mock-responses.ts             Pre-canned responses untuk demo
└── types.ts                      Types: Message, ChatMode, ChatSession
```

## File yang diubah

- `apps/web/src/components/site-header.tsx` — tambah `<NalaPanelTrigger />` di header (di samping notif/avatar)
- `apps/web/src/app/layout.tsx` — render `<NalaPanel />` di root (sticky portal)
- `apps/web/src/app/page.tsx` (Beranda) — `<NalaTriggerButton context="tentang topik hari ini" />` floating bottom-right

---

## State management — Zustand store

`apps/web/src/lib/nala/store.ts`:

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Message, ChatMode } from './types';

type NalaState = {
  // Panel UI
  isPanelOpen: boolean;
  openPanel: (context?: string) => void;
  closePanel: () => void;
  togglePanel: () => void;

  // Chat
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  messages: Message[];
  addMessage: (msg: Omit<Message, 'id' | 'createdAt'>) => void;
  clearChat: () => void;

  // Context
  currentContext: string | null;  // "tentang topik hari ini" / "tentang artikel ini" / null
  setContext: (ctx: string | null) => void;

  // Loading
  isResponding: boolean;
  setResponding: (v: boolean) => void;
};

export const useNalaStore = create<NalaState>()(
  persist(
    (set, get) => ({
      isPanelOpen: false,
      openPanel: (context) => set({ isPanelOpen: true, currentContext: context ?? null }),
      closePanel: () => set({ isPanelOpen: false }),
      togglePanel: () => set({ isPanelOpen: !get().isPanelOpen }),

      mode: 'tanya',
      setMode: (mode) => set({ mode }),
      messages: [],
      addMessage: (msg) => set({ messages: [...get().messages, { ...msg, id: crypto.randomUUID(), createdAt: new Date().toISOString() }] }),
      clearChat: () => set({ messages: [] }),

      currentContext: null,
      setContext: (ctx) => set({ currentContext: ctx }),

      isResponding: false,
      setResponding: (v) => set({ isResponding: v }),
    }),
    {
      name: 'jw-nala-store',
      partialize: (state) => ({
        messages: state.messages,
        mode: state.mode,
      }),
    }
  )
);
```

Catatan: `persist` middleware Zustand simpan messages + mode di localStorage. Auto-clear setelah 24 jam — perlu logic tambahan: saat init store, cek timestamp message terakhir, kalau >24h, clear.

## Types

`apps/web/src/lib/nala/types.ts`:

```ts
export type ChatMode = 'tanya' | 'coach' | 'writing' | 'advocacy';

export type Message = {
  id: string;
  role: 'user' | 'nala';
  content: string;          // Markdown
  citations?: Citation[];   // Untuk respons Nala
  createdAt: string;        // ISO 8601
};

export type Citation = {
  index: number;            // [1], [2], dll
  title: string;
  url?: string;
};

export type ChatSession = {
  id: string;
  title: string;            // Auto-generated dari first user message
  createdAt: string;
  messages: Message[];
};
```

## Mock responses

`apps/web/src/lib/nala/mock-responses.ts`:

Library 8-10 pre-canned response berdasar pattern keyword di user prompt. Setiap respons:
- Natural Bahasa Indonesia, gaya Nala (lihat persona system prompt CLAUDE.md section 4.5)
- 2-4 paragraf
- Include 1-2 citation footnote `[1]`
- Include 2-3 follow-up suggestion di akhir

Pattern matching simple: contains keyword → return matching response. Default fallback kalau tidak match.

```ts
type MockResponseRule = {
  keywords: string[];      // Match if user message contains any
  response: string;        // Markdown body
  citations?: Citation[];
};

export const MOCK_RESPONSES: MockResponseRule[] = [
  {
    keywords: ['pasal 28e', 'kebebasan beragama', 'hak ekspresi'],
    response: `Pasal 28E itu salah satu pasal HAM di UUD 1945. Isinya menjamin tiga hal utama:

1. **Kebebasan memeluk agama dan beribadah** sesuai keyakinan masing-masing
2. **Kebebasan berserikat, berkumpul, dan menyatakan pendapat**
3. **Hak untuk meyakini kepercayaan, menyatakan pikiran dan sikap** sesuai hati nurani

Konkretnya: kalau kamu mau bikin podcast politik, demo damai, atau pindah agama — pasal ini yang melindungi. Tapi praktiknya... [1] sering ada gap antara teks konstitusi dan realita di lapangan, terutama di kasus yang melibatkan isu sensitif.

Mau aku jelasin contoh kasus terkini, atau kamu pengen tau bedanya 28E sama 28I?`,
    citations: [
      { index: 1, title: 'Laporan Kebebasan Berekspresi 2025', url: 'https://example.org/laporan-kebebasan-2025' },
    ],
  },
  // ... 7-9 rules lain
];

export function getMockResponse(userMessage: string): { content: string; citations: Citation[] } {
  const normalized = userMessage.toLowerCase();
  const match = MOCK_RESPONSES.find((rule) =>
    rule.keywords.some((kw) => normalized.includes(kw))
  );
  if (match) return { content: match.response, citations: match.citations ?? [] };

  // Fallback
  return {
    content: `Hmm, pertanyaan menarik. Aku lagi dalam mode beta — belum punya akses ke sumber lengkap untuk topik ini. Tapi aku bisa kasih beberapa arah eksplorasi:

- Cek thread komunitas terkait di /komunitas
- Lihat kelas yang relevan di /kelas
- Atau kamu bisa post pertanyaan ini di forum, biar warga lain bantu jawab

Kalau Mas mau, aku bisa bantu draft pertanyaan supaya jelas?`,
    citations: [],
  };
}
```

**Catatan content**: 8-10 mock responses ini Mas (atau planner) yang seharusnya curate, bukan Claude Code generate sendiri. Spec ini provide skeleton + 1 example, sisanya isi belakangan atau Mas approve sebelum hard-code.

---

## Komponen detail

### 1. `nala-panel.tsx`

```tsx
'use client';

import { useNalaStore } from '@/lib/nala/store';
import { X } from 'lucide-react';
import { NalaMascot } from './nala-mascot';
import { NalaPromptChips } from './nala-prompt-chips';
import { NalaMessageBubble } from './nala-message-bubble';
import { NalaComposer } from './nala-composer';
import { useEffect, useRef } from 'react';

export function NalaPanel() {
  const { isPanelOpen, closePanel, messages, currentContext } = useNalaStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    if (isPanelOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isPanelOpen, closePanel]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-jw-blue/30 backdrop-blur-sm z-40 transition-opacity ${
          isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closePanel}
        aria-hidden
      />

      {/* Slide-over panel */}
      <aside
        className={`fixed right-0 top-0 h-full w-full sm:w-[420px] bg-jw-cream border-l border-jw-line shadow-jw-lg z-50 flex flex-col transition-transform ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Chat dengan Nala"
        aria-modal="true"
      >
        {/* Header */}
        <header className="px-5 py-4 border-b border-jw-line flex items-center gap-3">
          <NalaMascot expression="excited" size={40} />
          <div className="flex-1">
            <div className="font-display text-lg font-semibold text-jw-blue">Nala</div>
            {currentContext && (
              <div className="text-xs text-jw-ink/60 truncate">Konteks: {currentContext}</div>
            )}
          </div>
          <button onClick={closePanel} aria-label="Tutup panel">
            <X size={20} className="text-jw-ink hover:text-jw-coral" />
          </button>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            messages.map((msg) => <NalaMessageBubble key={msg.id} message={msg} />)
          )}
        </div>

        {/* Composer */}
        <NalaComposer />
      </aside>
    </>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-8">
      <NalaMascot expression="curious" size={120} className="mx-auto" />
      <p className="font-display text-xl text-jw-blue mt-4">Halo! Mau ngobrolin apa hari ini?</p>
      <p className="text-sm text-jw-ink/60 mt-1">Pilih salah satu, atau ketik sendiri.</p>
      <NalaPromptChips className="mt-6" />
    </div>
  );
}
```

### 2. `nala-message-bubble.tsx`

Render markdown body, citation footnote (klik scroll ke definition), action buttons (copy, share, save, lapor).

User message: bubble di kanan, bg cream, border subtle.
Nala message: bubble di kiri, bg white, border, dengan mini mascot icon di kiri-atas.

### 3. `nala-prompt-chips.tsx`

```tsx
import { SUGGESTED_PROMPTS } from '@/components/nala/nala-prompts';
import { useNalaStore } from '@/lib/nala/store';

export function NalaPromptChips({ className }: { className?: string }) {
  const { mode, addMessage, setResponding } = useNalaStore();
  const prompts = SUGGESTED_PROMPTS.filter((p) => p.mode === mode).slice(0, 4);

  const handleClick = async (text: string) => {
    addMessage({ role: 'user', content: text });
    setResponding(true);
    // Simulate delay
    await new Promise((r) => setTimeout(r, 800));
    const { getMockResponse } = await import('@/lib/nala/mock-responses');
    const { content, citations } = getMockResponse(text);
    addMessage({ role: 'nala', content, citations });
    setResponding(false);
  };

  return (
    <div className={`grid grid-cols-1 gap-2 ${className ?? ''}`}>
      {prompts.map((p) => (
        <button
          key={p.id}
          onClick={() => handleClick(p.text)}
          className="text-left rounded-jw-md border border-jw-line bg-white px-3 py-2 text-sm text-jw-ink hover:border-jw-coral hover:bg-jw-pill-coral-bg/30 transition"
        >
          {p.text}
        </button>
      ))}
    </div>
  );
}
```

### 4. `nala-composer.tsx`

Bottom sticky textarea + send button. Auto-resize. Submit via Enter (Shift+Enter for newline).

```tsx
'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { useNalaStore } from '@/lib/nala/store';

export function NalaComposer() {
  const [text, setText] = useState('');
  const { addMessage, setResponding, isResponding } = useNalaStore();

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isResponding) return;
    addMessage({ role: 'user', content: trimmed });
    setText('');
    setResponding(true);
    await new Promise((r) => setTimeout(r, 800));
    const { getMockResponse } = await import('@/lib/nala/mock-responses');
    const { content, citations } = getMockResponse(trimmed);
    addMessage({ role: 'nala', content, citations });
    setResponding(false);
  };

  return (
    <div className="border-t border-jw-line p-3">
      <div className="flex items-end gap-2 rounded-jw-lg border border-jw-line bg-white p-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Tanya Nala apa aja..."
          rows={1}
          className="flex-1 resize-none bg-transparent outline-none text-sm leading-snug max-h-32"
          disabled={isResponding}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || isResponding}
          className="p-2 rounded-jw-md bg-jw-coral text-white hover:bg-jw-coral/90 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Kirim"
        >
          <Send size={16} />
        </button>
      </div>
      {isResponding && (
        <div className="mt-2 text-xs text-jw-ink/60 flex items-center gap-1.5">
          <span className="inline-flex gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-jw-coral animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-jw-coral animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-jw-coral animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          Nala lagi mikir...
        </div>
      )}
    </div>
  );
}
```

### 5. Header trigger

`apps/web/src/components/site-header.tsx` — tambah:

```tsx
import { Sparkles } from 'lucide-react';
import { useNalaStore } from '@/lib/nala/store';

// Inside component
const openPanel = useNalaStore((s) => s.openPanel);

// In JSX
<button
  onClick={() => openPanel()}
  className="flex items-center gap-1.5 rounded-jw-md border border-jw-coral bg-jw-coral/10 px-3 py-1.5 text-sm font-semibold text-jw-coral hover:bg-jw-coral/20 transition"
  aria-label="Buka chat dengan Nala"
>
  <Sparkles size={14} />
  <span className="hidden sm:inline">Tanya Nala</span>
</button>
```

Karena SiteHeader adalah Server Component di Spec sebelumnya, perlu **wrap trigger di Client Component sub** atau ubah seluruh header jadi Client Component.

Saran: bikin `<HeaderNalaButton>` Client Component dedicated.

---

## Acceptance checklist

- [ ] Semua file di section "File yang dibuat" ada
- [ ] Panel slide-over render dari kanan, smooth transition (300ms ease-out)
- [ ] Backdrop blur saat panel open
- [ ] ESC keyboard untuk close panel
- [ ] Click backdrop untuk close panel
- [ ] **Empty state**: Nala mascot `curious`, headline "Halo! Mau ngobrolin apa hari ini?", 4 prompt chips
- [ ] **Submit prompt chip** → user message muncul → 800ms delay → Nala typing indicator → Nala response muncul dengan citation footnote
- [ ] **Composer**: textarea auto-resize, Enter send, Shift+Enter newline
- [ ] Send button disabled saat empty atau saat responding
- [ ] **Persistence**: refresh page → chat history tetap (kecuali sudah >24 jam)
- [ ] **Trigger button** di header berfungsi
- [ ] **Floating trigger button** di Beranda berfungsi (open panel dengan context "tentang topik hari ini")
- [ ] Mobile responsive: panel full-width di mobile (<640px), 420px di desktop
- [ ] Accessibility: `role="dialog"`, `aria-modal="true"`, focus trap saat open

## Out of scope (next sprint)

- ❌ Real Claude API integration — Sprint 4
- ❌ RAG (Retrieval-Augmented Generation) ke konten Jubir Warga — Sprint 4
- ❌ Save chat session permanent — Sprint 4 (akan butuh DB table)
- ❌ Mode selector UI di panel (4 mode) — Sprint 3 polish
- ❌ Multi-session chat history sidebar — Sprint 3 polish
- ❌ Streaming response (word-by-word reveal) — Sprint 4

## Notes untuk Sprint 4 (Claude API integration)

Saat upgrade ke real API:
- Replace `getMockResponse()` dengan call ke server action yang invoke Claude API
- Tambah RAG: query Supabase untuk konten relevan (threads, karya, janji) berdasar user message embedding
- Add rate limit: 20 prompt/hari free, unlimited untuk Pro Rp 49K/bulan (per FAQ landing copy)
- Add abuse detection: flag konten ujaran kebencian / fitnah sebelum kirim ke API
- Logging: catat query+response untuk QA (TANPA PII user)
