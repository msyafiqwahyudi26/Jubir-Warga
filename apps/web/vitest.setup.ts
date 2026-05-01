import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// jsdom doesn't implement Element.scrollTo — stub it so components that
// auto-scroll (e.g. <NalaPanel /> on new message) don't throw under test.
if (typeof Element !== 'undefined' && !Element.prototype.scrollTo) {
  Element.prototype.scrollTo = vi.fn() as typeof Element.prototype.scrollTo;
}

afterEach(() => {
  cleanup();
});
