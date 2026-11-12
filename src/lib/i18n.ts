import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";

export const defaultNS = "translation";
export const resources = { en: { translation: en } } as const;

void i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  defaultNS,
  resources,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export { i18n };
