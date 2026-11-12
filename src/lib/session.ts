import { safeStorage } from "./storage";

export interface Session {
  access_token: string;
  renewal_token: string;
  /** ISO timestamp. */
  token_expiry_time: string;
  last_login_time?: string | null;
  is_trial?: boolean;
  trial_expiration_date?: string | null;
}

// Same key and shape as the current app, so a signed-in session carries over between the two.
export const SESSION_KEY = "glific_session";
const RENEW_BEFORE_MS = 30_000;

const listeners = new Set<() => void>();
let cached: { raw: string | null; session: Session | null } = { raw: null, session: null };

function parse(raw: string | null): Session | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<Session>;
    return value.access_token && value.renewal_token && value.token_expiry_time ? (value as Session) : null;
  } catch {
    return null;
  }
}

export function getSession(): Session | null {
  const raw = safeStorage.get(SESSION_KEY);
  if (raw !== cached.raw) cached = { raw, session: parse(raw) };
  return cached.session;
}

function notify() {
  for (const listener of listeners) listener();
}

export function setSession(update: Partial<Session>): void {
  safeStorage.set(SESSION_KEY, JSON.stringify({ ...getSession(), ...update }));
  notify();
}

export function clearSession(): void {
  safeStorage.remove(SESSION_KEY);
  notify();
}

export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === SESSION_KEY) listener();
  };
  globalThis.addEventListener?.("storage", onStorage);
  return () => {
    listeners.delete(listener);
    globalThis.removeEventListener?.("storage", onStorage);
  };
}

export function needsRenewal(session: Session, now = Date.now()): boolean {
  return new Date(session.token_expiry_time).getTime() - now <= RENEW_BEFORE_MS;
}
