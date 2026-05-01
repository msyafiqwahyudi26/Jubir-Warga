import { describe, it, expect, beforeEach } from 'vitest';
import { useNalaStore } from '@/lib/nala/store';

describe('useNalaStore', () => {
  beforeEach(() => {
    useNalaStore.getState().clearChat();
    useNalaStore.getState().closePanel();
    useNalaStore.getState().setContext(null);
  });

  it('opens panel with optional context and tracks state', () => {
    useNalaStore.getState().openPanel('tentang halaman ini');
    const state = useNalaStore.getState();
    expect(state.isPanelOpen).toBe(true);
    expect(state.currentContext).toBe('tentang halaman ini');
  });

  it('addMessage assigns id and createdAt automatically', () => {
    useNalaStore.getState().addMessage({ role: 'user', content: 'halo' });
    const state = useNalaStore.getState();
    expect(state.messages).toHaveLength(1);
    const msg = state.messages[0]!;
    expect(msg).toMatchObject({ role: 'user', content: 'halo' });
    expect(msg.id).toBeTruthy();
    expect(typeof msg.createdAt).toBe('string');
    expect(Number.isNaN(Date.parse(msg.createdAt))).toBe(false);
  });

  it('clearChat empties messages array', () => {
    useNalaStore.getState().addMessage({ role: 'user', content: 'a' });
    useNalaStore.getState().addMessage({ role: 'nala', content: 'b' });
    useNalaStore.getState().clearChat();
    expect(useNalaStore.getState().messages).toEqual([]);
  });
});
