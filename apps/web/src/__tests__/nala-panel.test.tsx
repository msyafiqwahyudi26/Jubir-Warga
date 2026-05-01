import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NalaPanel } from '@/components/nala/nala-panel';
import { useNalaStore } from '@/lib/nala/store';

describe('<NalaPanel />', () => {
  beforeEach(() => {
    useNalaStore.getState().clearChat();
    useNalaStore.getState().closePanel();
    useNalaStore.getState().setContext(null);
  });

  it('renders empty state when no messages and panel is open', () => {
    useNalaStore.getState().openPanel();
    render(<NalaPanel />);
    expect(
      screen.getByText(/Halo! Mau ngobrolin apa hari ini\?/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Tutup panel Nala/i)).toBeInTheDocument();
  });

  it('renders user message text when chat has history', () => {
    useNalaStore.getState().openPanel();
    useNalaStore
      .getState()
      .addMessage({ role: 'user', content: 'Halo Nala' });
    render(<NalaPanel />);
    expect(screen.getByText('Halo Nala')).toBeInTheDocument();
  });
});
