// Edge-runtime Sentry helpers (middleware, edge route handlers).
// SDK init lives in apps/web/sentry.edge.config.ts, loaded via instrumentation.ts.
export { captureException, captureMessage, withScope, setUser, setTag } from '@sentry/nextjs';
