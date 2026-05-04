import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

// Spec #21 — register vitest-axe `toHaveNoViolations` matcher globally so
// a11y tests can call `expect(results).toHaveNoViolations()`.
expect.extend(matchers);

// jsdom doesn't implement Element.scrollTo — stub it so components that
// auto-scroll (e.g. <NalaPanel /> on new message) don't throw under test.
if (typeof Element !== 'undefined' && !Element.prototype.scrollTo) {
  Element.prototype.scrollTo = vi.fn() as typeof Element.prototype.scrollTo;
}

afterEach(() => {
  cleanup();
});
