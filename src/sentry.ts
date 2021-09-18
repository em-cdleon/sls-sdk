import {
  SENTRY_DSN,
  SENTRY_ENVIRONMENT
} from './constants'

export const config = {
  dsn: SENTRY_DSN,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  environment: SENTRY_ENVIRONMENT,
  tracesSampleRate: 0.01
}

