import * as Sentry from "@sentry/react";

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

if (sentryDsn) {
  const tracesSampleRate = Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? "1");
  const replaysSessionSampleRate = Number(
    import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? "0.1",
  );
  const replaysOnErrorSampleRate = Number(
    import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE ?? "1",
  );

  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ?? import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate,
    tracePropagationTargets: [
      /^\//,
      /^https?:\/\/localhost(?::\d+)?\//,
      /^https?:\/\/127\.0\.0\.1(?::\d+)?\//,
    ],
    replaysSessionSampleRate,
    replaysOnErrorSampleRate,
  });
}

export { Sentry };
