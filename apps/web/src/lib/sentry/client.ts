// Client-side Sentry helpers.
// SDK init lives in apps/web/sentry.client.config.ts (Next.js convention).
export { captureException, captureMessage, withScope, setUser, setTag } from '@sentry/nextjs';
