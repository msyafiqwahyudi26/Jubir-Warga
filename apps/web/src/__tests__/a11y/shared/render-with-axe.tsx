// Spec #21 — shared helper for a11y tests.
// Renders a React element with @testing-library, runs axe-core, returns the
// result so callers can assert toHaveNoViolations.
//
// jsdom does NOT compute getComputedStyle reliably for color values, so the
// color-contrast rule in axe is disabled here — contrast is audited manually
// (see docs/A11Y_AUDIT_2026-05-04.md). All other WCAG 2.1 AA rules run.

import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';

const AXE_OPTIONS = {
  rules: {
    'color-contrast': { enabled: false },
  },
} as const;

export async function renderAndScan(ui: ReactElement) {
  const { container } = render(ui);
  const results = await axe(container, AXE_OPTIONS);
  return { container, results };
}
