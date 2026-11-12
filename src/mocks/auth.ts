import { HttpResponse, http } from "msw";

export const MOCK_PASSWORD = "password";

export function mockSession(expiresInMs = 60 * 60 * 1000) {
  const stamp = Date.now();
  return {
    access_token: `access-${stamp}`,
    renewal_token: `renewal-${stamp}`,
    token_expiry_time: new Date(stamp + expiresInMs).toISOString(),
    last_login_time: null,
    is_trial: false,
    trial_expiration_date: null,
  };
}

export const authHandlers = [
  http.post("*/api/v1/session", async ({ request }) => {
    const body = (await request.json()) as { user?: { phone?: string; password?: string } };
    if (body.user?.password !== MOCK_PASSWORD) {
      return HttpResponse.json({ error: { status: 401, message: "Invalid phone or password" } }, { status: 401 });
    }
    return HttpResponse.json({ data: mockSession() });
  }),
  // Any token renews: a real session left by the current app on the same origin must not sign you out in mock mode.
  http.post("*/api/v1/session/renew", ({ request }) =>
    request.headers.get("authorization")
      ? HttpResponse.json({ data: mockSession() })
      : HttpResponse.json({ error: { status: 401, message: "Invalid token" } }, { status: 401 }),
  ),
  http.delete("*/api/v1/session", () => HttpResponse.json({ data: {} })),
];
