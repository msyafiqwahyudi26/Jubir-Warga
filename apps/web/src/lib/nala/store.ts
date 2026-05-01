import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Message, ChatMode } from './types';

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

type NalaState = {
  isPanelOpen: boolean;
  openPanel: (context?: string) => void;
  closePanel: () => void;
  togglePanel: () => void;

  mode: ChatMode;
  setMode: (mode: ChatMode) => void;

  messages: Message[];
  addMessage: (msg: Omit<Message, 'id' | 'createdAt'>) => void;
  clearChat: () => void;

  currentContext: string | null;
  setContext: (ctx: string | null) => void;

  isResponding: boolean;
  setResponding: (v: boolean) => void;
};

const isoNow = () => new Date().toISOString();

const newId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

export const useNalaStore = create<NalaState>()(
  persist(
    (set, get) => ({
      isPanelOpen: false,
      openPanel: (context) =>
        set({ isPanelOpen: true, currentContext: context ?? null }),
      closePanel: () => set({ isPanelOpen: false }),
      togglePanel: () => set({ isPanelOpen: !get().isPanelOpen }),

      mode: 'tanya',
      setMode: (mode) => set({ mode }),

      messages: [],
      addMessage: (msg) =>
        set({
          messages: [
            ...get().messages,
            { ...msg, id: newId(), createdAt: isoNow() },
          ],
        }),
      clearChat: () => set({ messages: [] }),

      currentContext: null,
      setContext: (ctx) => set({ currentContext: ctx }),

      isResponding: false,
      setResponding: (v) => set({ isResponding: v }),
    }),
    {
      name: 'jw-nala-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        messages: state.messages,
        mode: state.mode,
      }),
      // Drop chat history older than 24h on rehydrate so beta sessions stay fresh.
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const last = state.messages[state.messages.length - 1];
        if (!last) return;
        const age = Date.now() - new Date(last.createdAt).getTime();
        if (Number.isFinite(age) && age > TWENTY_FOUR_HOURS_MS) {
          state.messages = [];
        }
      },
    },
  ),
);
