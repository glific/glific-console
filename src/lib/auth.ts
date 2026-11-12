import { apiBaseUrl } from "./backend";
import { clearSession, getSession, needsRenewal, type Session, setSession } from "./session";

export class AuthError extends Error {
  override name = "AuthError";
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function post(path: string, init: RequestInit): Promise<Response> {
  return fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: { Accept: "application/json", "Content-Type": "application/json", ...init.headers },
  });
}

async function errorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: { message?: string } };
    return body.error?.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

export async function login(phone: string, password: string): Promise<Session> {
  const response = await post("/v1/session", { method: "POST", body: JSON.stringify({ user: { phone, password } }) });
  if (!response.ok) throw new AuthError(await errorMessage(response), response.status);
  const { data } = (await response.json()) as { data: Session };
  setSession(data);
  return data;
}

let renewing: Promise<Session> | null = null;

/** Single-flight: concurrent requests that find the token expiring share one renewal. */
export function renewSession(): Promise<Session> {
  renewing ??= (async () => {
    try {
      const session = getSession();
      if (!session) throw new AuthError("Not signed in", 401);
      const response = await post("/v1/session/renew", {
        method: "POST",
        headers: { authorization: session.renewal_token },
      });
      if (!response.ok) throw new AuthError(await errorMessage(response), response.status);
      const { data } = (await response.json()) as { data: Session };
      setSession(data);
      return data;
    } catch (error) {
      clearSession();
      throw error;
    } finally {
      renewing = null;
    }
  })();
  return renewing;
}

/** A usable access token, renewed first if it expires within 30 seconds; null when signed out. */
export async function accessToken(): Promise<string | null> {
  const session = getSession();
  if (!session) return null;
  if (!needsRenewal(session)) return session.access_token;
  try {
    return (await renewSession()).access_token;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  const token = getSession()?.access_token;
  clearSession();
  if (token) {
    await post("/v1/session", { method: "DELETE", headers: { authorization: token } }).catch(() => undefined);
  }
}
