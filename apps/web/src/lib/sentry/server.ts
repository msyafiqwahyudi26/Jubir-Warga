// Server-side Sentry helpers.
// SDK init lives in apps/web/sentry.server.config.ts, loaded via instrumentation.ts.
export { captureException, captureMessage, withScope, setUser, setTag } from '@sentry/nextjs';
