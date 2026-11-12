import { accessToken } from "./auth";
import { apiBaseUrl } from "./backend";
import { clearSession } from "./session";

export class ApiError extends Error {
  override name = "ApiError";
  constructor(
    readonly status: number,
    message: string,
    readonly body?: unknown,
  ) {
    super(message);
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function request<T>(path: string, { body, headers, ...init }: RequestOptions = {}): Promise<T> {
  const token = await accessToken();
  const response = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(token ? { authorization: token } : {}),
      ...headers,
    },
    body: body === undefined ? null : JSON.stringify(body),
  });

  const text = await response.text();
  const data: unknown = text ? JSON.parse(text) : undefined;

  if (response.status === 401) clearSession();
  if (!response.ok) {
    throw new ApiError(response.status, `Request failed: ${response.status} ${response.statusText}`, data);
  }
  return data as T;
}

export const apiClient = {
  get: <T>(path: string, init?: RequestOptions) => request<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, body?: unknown, init?: RequestOptions) => request<T>(path, { ...init, method: "POST", body }),
  put: <T>(path: string, body?: unknown, init?: RequestOptions) => request<T>(path, { ...init, method: "PUT", body }),
  delete: <T>(path: string, init?: RequestOptions) => request<T>(path, { ...init, method: "DELETE" }),
};
