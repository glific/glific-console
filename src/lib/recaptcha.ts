import { env } from "./config";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (key: string, options: { action: string }) => Promise<string>;
    };
  }
}

let script: Promise<void> | null = null;

function load(key: string): Promise<void> {
  script ??= new Promise<void>((resolve, reject) => {
    const tag = document.createElement("script");
    tag.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(key)}`;
    tag.async = true;
    tag.onload = () => window.grecaptcha?.ready(resolve);
    tag.onerror = () => {
      script = null;
      reject(new Error("reCAPTCHA failed to load"));
    };
    document.head.append(tag);
  });
  return script;
}

/**
 * An invisible reCAPTCHA v3 token for the backend to check, loaded only on the pages that need one.
 * Null when no site key is configured (local dev, tests); the backend then skips the check.
 */
export async function captchaToken(action: string, key = env.VITE_RECAPTCHA_SITE_KEY): Promise<string | null> {
  if (!key) return null;
  await load(key);
  return (await window.grecaptcha?.execute(key, { action })) ?? null;
}
