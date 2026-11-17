import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import { safeStorage } from "./storage";

export const defaultNS = "translation";
export const resources = { en: { translation: en } } as const;

// English ships in the first load; other languages are fetched only by the people who use them.
const bundles = {
  en: async () => en,
  hi: async () => (await import("@/locales/hi.json")).default,
};

export type Locale = keyof typeof bundles;
export const locales = Object.keys(bundles) as Locale[];
export const isLocale = (value: unknown): value is Locale => locales.includes(value as Locale);

const LOCALE_KEY = "glific_locale";

void i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  defaultNS,
  resources,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export async function setLocale(locale: Locale): Promise<void> {
  safeStorage.set(LOCALE_KEY, locale);
  if (!i18n.hasResourceBundle(locale, defaultNS)) {
    i18n.addResourceBundle(locale, defaultNS, await bundles[locale]());
  }
  document.documentElement.lang = locale;
  if (i18n.language !== locale) await i18n.changeLanguage(locale);
}

// Remembered so the login page, shown before the user's own language is known, matches their last visit.
const stored = safeStorage.get(LOCALE_KEY);
if (isLocale(stored) && stored !== "en") void setLocale(stored);

export { i18n };
