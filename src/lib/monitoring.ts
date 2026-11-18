import { env } from "./config";

type SentryModule = typeof import("@sentry/react");
type PostHog = typeof import("posthog-js")["default"];

let sentry: Promise<SentryModule | null> = Promise.resolve(null);
let analytics: Promise<PostHog | null> = Promise.resolve(null);

/**
 * Starts Sentry and PostHog when their keys are set. Both are imported on demand after first paint,
 * so they never count against the initial bundle and stay off entirely where no key is configured.
 */
export function startMonitoring(
  config: Pick<typeof env, "VITE_SENTRY_DSN" | "VITE_POSTHOG_KEY" | "VITE_POSTHOG_HOST"> = env,
  load = {
    sentry: (): Promise<SentryModule> => import("@sentry/react"),
    posthog: async (): Promise<PostHog> => (await import("posthog-js")).default,
  },
) {
  const host = globalThis.location?.hostname ?? "";
  if (config.VITE_SENTRY_DSN) {
    const dsn = config.VITE_SENTRY_DSN;
    sentry = load.sentry().then((Sentry) => {
      Sentry.init({ dsn, environment: import.meta.env.MODE });
      // One build serves every NGO, so the host is what tells their errors apart.
      Sentry.setTag("host", host);
      return Sentry;
    });
  }
  if (config.VITE_POSTHOG_KEY) {
    const key = config.VITE_POSTHOG_KEY;
    analytics = load.posthog().then((posthog) => {
      posthog.init(key, {
        api_host: config.VITE_POSTHOG_HOST,
        capture_pageview: "history_change",
        person_profiles: "identified_only",
      });
      posthog.register({ host });
      return posthog;
    });
  }
}

export function reportError(error: unknown, context?: Record<string, unknown>): void {
  if (import.meta.env.DEV) console.error(error, context);
  void sentry.then((Sentry) => Sentry?.captureException(error, context ? { extra: context } : undefined));
}

export function track(event: string, properties?: Record<string, unknown>): void {
  void analytics.then((posthog) => posthog?.capture(event, properties));
}

/** Waits for pending SDK loads; tests use it to observe calls. */
export async function monitoringReady(): Promise<void> {
  await Promise.all([sentry, analytics]);
}

// Matches the current app's identify and group calls so existing PostHog dashboards keep working.
export function identifyUser(
  user: { id: string; roles: string[] },
  organization: { id: string; isTrial?: boolean | undefined },
): void {
  void analytics.then((posthog) => {
    if (!posthog) return;
    posthog.identify(user.id, user.roles.length ? { access_roles: user.roles } : undefined);
    posthog.group(
      "organization",
      organization.id,
      organization.isTrial === undefined ? undefined : { is_trial: organization.isTrial },
    );
  });
}

export function resetAnalytics(): void {
  void analytics.then((posthog) => posthog?.reset());
}
