import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { calcTargetProgress } from '@/lib/kelas/constants';

const markModulCompleteAction = vi.fn();
const routerPush = vi.fn();
const routerRefresh = vi.fn();

vi.mock('@/app/kelas/actions', () => ({
  markModulCompleteAction: (...args: unknown[]) =>
    markModulCompleteAction(...args),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPush, refresh: routerRefresh }),
}));

const { ModuleProgressButton } = await import(
  '@/app/kelas/[id]/modul/[modulId]/module-progress-button'
);

describe('calcTargetProgress', () => {
  it('returns 0 for ord=0', () => {
    expect(calcTargetProgress(0, 4)).toBe(0);
  });

  it('returns 25 for 1/4', () => {
    expect(calcTargetProgress(1, 4)).toBe(25);
  });

  it('returns 100 for 4/4', () => {
    expect(calcTargetProgress(4, 4)).toBe(100);
  });

  it('clamps to 100 if ord > total', () => {
    expect(calcTargetProgress(5, 4)).toBe(100);
  });

  it('returns 0 when total is 0 (defensive)', () => {
    expect(calcTargetProgress(1, 0)).toBe(0);
  });
});

describe('<ModuleProgressButton />', () => {
  beforeEach(() => {
    markModulCompleteAction.mockReset();
    routerPush.mockReset();
    routerRefresh.mockReset();
  });

  it('renders "Tandai selesai" when modul not yet covered by progress', () => {
    render(
      <ModuleProgressButton
        kelasId="11111111-1111-1111-1111-111111111111"
        modulId="22222222-2222-2222-2222-222222222222"
        modulOrd={2}
        totalModul={4}
        currentProgress={25}
        nextHref="/kelas/x/modul/y"
      />,
    );
    expect(
      screen.getByRole('button', { name: /Tandai selesai/i }),
    ).toBeEnabled();
  });

  it('renders "sudah selesai" badge when progress already meets target (idempotent)', () => {
    render(
      <ModuleProgressButton
        kelasId="11111111-1111-1111-1111-111111111111"
        modulId="22222222-2222-2222-2222-222222222222"
        modulOrd={2}
        totalModul={4}
        currentProgress={50}
        nextHref={null}
      />,
    );
    expect(
      screen.getByText(/Modul ini sudah selesai/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
