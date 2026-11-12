import { env } from "./config";

export function internalPagesEnabled(
  hostname: string = globalThis.location?.hostname ?? "",
  allowed: readonly string[] = env.VITE_DESIGN_SYSTEM_HOSTS,
): boolean {
  return allowed.includes(hostname.toLowerCase());
}
