/**
 * Typed, validated environment. Validated in vite.config.ts at dev/build start
 * and again at runtime, so a missing variable fails fast instead of surfacing as a broken request.
 * Kept free of DOM and alias imports so vite.config.ts can import it.
 */

export interface Env {
  /** Base URL for API requests, e.g. `/api` or `https://api.glific.org/api`. */
  readonly VITE_API_URL: string;
  /** Serve API responses from MSW handlers in the browser (dev only). */
  readonly VITE_ENABLE_MOCKS: boolean;
  /**
   * Hostnames that serve the internal /design-system page, e.g. `prod.glific.com`. Every NGO runs the same build
   * on its own shortcode subdomain, so this is decided per host at runtime. Empty: served nowhere.
   */
  readonly VITE_DESIGN_SYSTEM_HOSTS: readonly string[];
}

export class EnvError extends Error {
  override name = "EnvError";
}

type RawEnv = Record<string, string | boolean | undefined>;

function requireString(raw: RawEnv, key: keyof Env, problems: string[]): string {
  const value = raw[key];
  if (typeof value !== "string" || value.trim() === "") {
    problems.push(`${key} is required`);
    return "";
  }
  return value.trim();
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
    VITE_API_URL: requireString(raw, "VITE_API_URL", problems),
    VITE_ENABLE_MOCKS: optionalBoolean(raw, "VITE_ENABLE_MOCKS", problems),
    VITE_DESIGN_SYSTEM_HOSTS: optionalList(raw, "VITE_DESIGN_SYSTEM_HOSTS"),
  };
  if (problems.length > 0) {
    throw new EnvError(`Invalid environment:\n  - ${problems.join("\n  - ")}\nSee .env.example.`);
  }
  return env;
}
