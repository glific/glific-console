import { env } from "./config";

interface Place {
  protocol: string;
  hostname: string;
  host: string;
  origin: string;
}

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);
// The new app can run on its own subdomain in front of the NGO's: console.<shortcode>.glific.com.
const CONSOLE_PREFIX = "console.";

/**
 * Each NGO's console talks to api.<shortcode>.glific.com, the same backend as the current app, whether it is served
 * at <shortcode>.glific.com or console.<shortcode>.glific.com. Local hosts talk to themselves so MSW answers.
 */
export function backendOrigin(place: Place = globalThis.location, overrides = env): string {
  if (overrides.VITE_BACKEND_URL) return overrides.VITE_BACKEND_URL;
  if (LOCAL_HOSTS.has(place.hostname)) return place.origin;
  const host = place.host.startsWith(CONSOLE_PREFIX) ? place.host.slice(CONSOLE_PREFIX.length) : place.host;
  return `${place.protocol}//${overrides.VITE_API_SUBDOMAIN}.${host}`;
}

export const apiBaseUrl = () => `${backendOrigin()}/api`;

/**
 * Pages not rebuilt yet open in the current app: <shortcode>.glific.com beside console.<shortcode>.glific.com.
 * Served anywhere else, the current app is assumed to share the origin.
 */
export function currentAppUrl(path: string, place: Place = globalThis.location, overrides = env): string {
  if (overrides.VITE_CURRENT_APP_URL) return `${overrides.VITE_CURRENT_APP_URL}${path}`;
  if (!place.host.startsWith(CONSOLE_PREFIX)) return `${place.origin}${path}`;
  return `${place.protocol}//${place.host.slice(CONSOLE_PREFIX.length)}${path}`;
}
