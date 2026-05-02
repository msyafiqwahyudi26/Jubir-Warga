import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const signPetisiAction = vi.fn();

vi.mock('@/app/aksi/actions', () => ({
  signPetisiAction: (...args: unknown[]) => signPetisiAction(...args),
}));

const { SignPetisiButton } = await import(
  '@/app/aksi/petisi/[id]/sign-petisi-button'
);

describe('<SignPetisiButton />', () => {
  beforeEach(() => {
    signPetisiAction.mockReset();
  });

  it('renders unsigned button when alreadySigned=false', () => {
    render(
      <SignPetisiButton
        petisiId="11111111-1111-1111-1111-111111111111"
        alreadySigned={false}
      />,
    );
    expect(
      screen.getByRole('button', { name: /Tanda tangan petisi/i }),
    ).toBeEnabled();
  });

  it('renders signed badge (no button) when alreadySigned=true', () => {
    render(
      <SignPetisiButton
        petisiId="11111111-1111-1111-1111-111111111111"
        alreadySigned={true}
      />,
    );
    expect(screen.getByText(/Sudah ditandatangani/i)).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
