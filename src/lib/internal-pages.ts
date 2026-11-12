import { env } from "./config";

/**
 * Whether internal pages (the /design-system brandbook) are served on this host.
 * They are for the Glific team only, so NGO instances on their own shortcode subdomains never see them.
 */
export function internalPagesEnabled(
  hostname: string = globalThis.location?.hostname ?? "",
  allowed: readonly string[] = env.VITE_DESIGN_SYSTEM_HOSTS,
): boolean {
  return allowed.includes(hostname.toLowerCase());
}
