import { HttpResponse, http } from "msw";

export const MOCK_PASSWORD = "password";
export const MOCK_OTP = "123456";

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
  http.post("*/api/v1/registration/send-otp", async ({ request }) => {
    const body = (await request.json()) as { user?: { phone?: string } };
    return HttpResponse.json({ data: { phone: body.user?.phone, message: "OTP sent" } });
  }),
  http.post("*/api/v1/registration", async ({ request }) => {
    const body = (await request.json()) as { user?: { otp?: string } };
    if (body.user?.otp !== MOCK_OTP) {
      return HttpResponse.json({ error: { status: 500, message: "Couldn't create user" } }, { status: 500 });
    }
    return HttpResponse.json({ data: mockSession() });
  }),
  http.post("*/api/v1/registration/reset-password", async ({ request }) => {
    const body = (await request.json()) as { user?: { otp?: string } };
    if (body.user?.otp !== MOCK_OTP) {
      return HttpResponse.json({ error: { status: 500, message: "Couldn't update user password" } }, { status: 500 });
    }
    return HttpResponse.json({ data: mockSession() });
  }),
  http.post("*/api/v1/trial/create-trial-user", async ({ request }) => {
    const body = (await request.json()) as { email?: string };
    return HttpResponse.json({ data: { message: `OTP sent successfully to ${body.email}` } });
  }),
  http.post("*/api/v1/trial/allocate-account", async ({ request }) => {
    const body = (await request.json()) as { otp?: string };
    if (body.otp !== MOCK_OTP) return HttpResponse.json({ success: false, error: "Invalid OTP" }, { status: 400 });
    return HttpResponse.json({ success: true, data: { login_url: "https://trial1.glific.test/login" } });
  }),
];
