import { env } from "./config";

interface Place {
  protocol: string;
  hostname: string;
  host: string;
  origin: string;
}

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

/**
 * Same rule as the current app: each NGO's console at <shortcode>.glific.com talks to api.<shortcode>.glific.com.
 * Local hosts talk to themselves so MSW (or a dev proxy) answers.
 */
export function backendOrigin(place: Place = globalThis.location, overrides = env): string {
  if (overrides.VITE_BACKEND_URL) return overrides.VITE_BACKEND_URL;
  if (LOCAL_HOSTS.has(place.hostname)) return place.origin;
  return `${place.protocol}//${overrides.VITE_API_SUBDOMAIN}.${place.host}`;
}

export const apiBaseUrl = () => `${backendOrigin()}/api`;
