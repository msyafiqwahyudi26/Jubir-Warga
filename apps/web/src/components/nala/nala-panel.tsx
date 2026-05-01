'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useNalaStore } from '@/lib/nala/store';
import { NalaMascot } from './nala-mascot';
import { NalaPromptChips } from './nala-prompt-chips';
import { NalaMessageBubble } from './nala-message-bubble';
import { NalaComposer } from './nala-composer';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function NalaPanel() {
  const isPanelOpen = useNalaStore((s) => s.isPanelOpen);
  const closePanel = useNalaStore((s) => s.closePanel);
  const messages = useNalaStore((s) => s.messages);
  const currentContext = useNalaStore((s) => s.currentContext);

  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  // Auto-scroll to bottom on new message.
  useEffect(() => {
    if (!isPanelOpen) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length, isPanelOpen]);

  // Lock body scroll while panel open.
  useEffect(() => {
    if (!isPanelOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isPanelOpen]);

  // Focus management: trap inside panel; restore previous focus on close.
  useEffect(() => {
    if (!isPanelOpen) return;
    lastFocusRef.current =
      (document.activeElement as HTMLElement | null) ?? null;
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePanel();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = panelRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute('aria-hidden'));
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      lastFocusRef.current?.focus?.();
    };
  }, [isPanelOpen, closePanel]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-jw-blue/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closePanel}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Chat dengan Nala"
        aria-hidden={!isPanelOpen}
        className={`fixed right-0 top-0 h-full w-full sm:w-[420px] bg-jw-cream border-l border-jw-line shadow-jw-lg z-50 flex flex-col transition-transform duration-300 ease-out ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="px-5 py-4 border-b border-jw-line flex items-center gap-3 bg-jw-cream">
          <NalaMascot expression="excited" size={40} />
          <div className="flex-1 min-w-0">
            <div className="font-display text-lg font-semibold text-jw-blue leading-tight">
              Nala
            </div>
            {currentContext ? (
              <div className="text-xs text-jw-muted truncate">
                Konteks: {currentContext}
              </div>
            ) : (
              <div className="text-xs text-jw-muted">
                Sahabat warga di Jubir Warga
              </div>
            )}
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={closePanel}
            aria-label="Tutup panel Nala"
            className="p-1.5 rounded-jw-md text-jw-ink hover:text-jw-coral hover:bg-jw-pill-coral-bg/40 transition"
          >
            <X size={20} aria-hidden />
          </button>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        >
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            messages.map((msg) => (
              <NalaMessageBubble key={msg.id} message={msg} />
            ))
          )}
        </div>

        <NalaComposer />
      </aside>
    </>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-6">
      <NalaMascot expression="curious" size={120} className="mx-auto" />
      <p className="font-display text-xl text-jw-blue mt-4">
        Halo! Mau ngobrolin apa hari ini?
      </p>
      <p className="text-sm text-jw-muted mt-1">
        Pilih salah satu, atau ketik sendiri.
      </p>
      <NalaPromptChips className="mt-6 text-left" />
    </div>
  );
}
