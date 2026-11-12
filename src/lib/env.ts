// No DOM or "@/" imports: vite.config.ts imports this to validate env at dev/build start.

export interface Env {
  /** Backend origin override (local dev). Unset: derived per NGO host, api.<shortcode>.glific.com. */
  readonly VITE_BACKEND_URL: string | null;
  readonly VITE_API_SUBDOMAIN: string;
  readonly VITE_ENABLE_MOCKS: boolean;
  /** Hosts that serve /design-system. Every NGO runs the same build on its own subdomain, so it is per host. */
  readonly VITE_DESIGN_SYSTEM_HOSTS: readonly string[];
  readonly VITE_SENTRY_DSN: string | null;
  readonly VITE_POSTHOG_KEY: string | null;
  readonly VITE_POSTHOG_HOST: string;
}

export class EnvError extends Error {
  override name = "EnvError";
}

type RawEnv = Record<string, string | boolean | undefined>;

function optionalString(raw: RawEnv, key: keyof Env): string | null {
  const value = raw[key];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function optionalUrl(raw: RawEnv, key: keyof Env, problems: string[]): string | null {
  const value = optionalString(raw, key);
  if (value === null) return null;
  try {
    new URL(value);
    return value.replace(/\/+$/, "");
  } catch {
    problems.push(`${key} must be an absolute URL, got "${value}"`);
    return null;
  }
}

function optionalBoolean(raw: RawEnv, key: keyof Env, problems: string[]): boolean {
  const value = raw[key];
  if (value === undefined || value === "" || value === "false" || value === false) return false;
  if (value === "true" || value === true) return true;
  problems.push(`${key} must be "true" or "false", got "${String(value)}"`);
  return false;
}

function optionalList(raw: RawEnv, key: keyof Env): string[] {
  const value = raw[key];
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function parseEnv(raw: RawEnv): Env {
  const problems: string[] = [];
  const env: Env = {
    VITE_BACKEND_URL: optionalUrl(raw, "VITE_BACKEND_URL", problems),
    VITE_API_SUBDOMAIN: optionalString(raw, "VITE_API_SUBDOMAIN") ?? "api",
    VITE_ENABLE_MOCKS: optionalBoolean(raw, "VITE_ENABLE_MOCKS", problems),
    VITE_DESIGN_SYSTEM_HOSTS: optionalList(raw, "VITE_DESIGN_SYSTEM_HOSTS"),
    VITE_SENTRY_DSN: optionalUrl(raw, "VITE_SENTRY_DSN", problems),
    VITE_POSTHOG_KEY: optionalString(raw, "VITE_POSTHOG_KEY"),
    VITE_POSTHOG_HOST: optionalUrl(raw, "VITE_POSTHOG_HOST", problems) ?? "https://us.i.posthog.com",
  };
  if (problems.length > 0) {
    throw new EnvError(`Invalid environment:\n  - ${problems.join("\n  - ")}\nSee .env.example.`);
  }
  return env;
}
