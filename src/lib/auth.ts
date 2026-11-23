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

// The backend answers in three shapes: {error: {message}}, the trial endpoints' {error: "…"}, and the rate
// limiter's plain text.
async function errorMessage(response: Response): Promise<string> {
  const text = await response.text().catch(() => "");
  try {
    const body = JSON.parse(text) as { error?: string | { message?: string } };
    const message = typeof body.error === "string" ? body.error : body.error?.message;
    return message?.trim() || response.statusText;
  } catch {
    // Only short plain text is meant for people; a proxy's HTML error page is not.
    const plain = response.headers.get("content-type")?.startsWith("text/plain") && text.trim().length <= 200;
    return plain ? text.trim() : response.statusText;
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

/** The phone as the backend stores it: digits only, with the country code. */
export const normalisePhone = (phone: string) => phone.replace(/\D/g, "");

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await post(path, { method: "POST", body: JSON.stringify(body) });
  if (!response.ok) throw new AuthError(await errorMessage(response), response.status);
  return (await response.json()) as T;
}

/**
 * Sends a WhatsApp code: to register a new staff account, or to reset a password. For a reset the backend answers
 * the same whether or not the number has an account, so it can't be used to find accounts.
 */
export async function sendOtp(phone: string, purpose: "register" | "reset", captcha?: string | null): Promise<void> {
  await postJson("/v1/registration/send-otp", {
    user: { phone, registration: String(purpose === "register"), ...(captcha ? { token: captcha } : {}) },
  });
}

export interface StaffRegistration {
  name: string;
  email: string;
  phone: string;
  password: string;
  otp: string;
  consentForUpdates: boolean;
}

/** Creates a staff account; it has no role until an admin approves it, so nobody is signed in. */
export async function registerStaff(registration: StaffRegistration): Promise<void> {
  const { consentForUpdates, ...user } = registration;
  await postJson("/v1/registration", { user: { ...user, consent_for_updates: consentForUpdates } });
}

export async function resetPassword(phone: string, otp: string, password: string): Promise<void> {
  await postJson("/v1/registration/reset-password", { user: { phone, otp, password } });
}

export interface TrialSignUp {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  password: string;
}

const trialBody = ({ name, email, phone, organisation, password }: TrialSignUp) => ({
  username: name,
  email,
  phone,
  organization_name: organisation,
  password,
});

type TrialResponse<T = unknown> = { success?: boolean; error?: string; data?: T };

// Trial endpoints report some failures with HTTP 200 and success: false.
function trialResult<T>(body: TrialResponse<T>): T | undefined {
  if (body.success === false) throw new AuthError(body.error?.trim() || "", 200);
  return body.data;
}

/** Emails a code to confirm the trial sign-up. */
export async function startTrial(signUp: TrialSignUp): Promise<void> {
  trialResult(await postJson<TrialResponse>("/v1/trial/create-trial-user", trialBody(signUp)));
}

/** Confirms the emailed code and assigns a trial organisation; returns its login page. */
export async function confirmTrial(signUp: TrialSignUp, otp: string): Promise<string> {
  const data = trialResult(
    await postJson<TrialResponse<{ login_url?: string }>>("/v1/trial/allocate-account", { ...trialBody(signUp), otp }),
  );
  if (!data?.login_url) throw new AuthError("", 500);
  return data.login_url;
}
