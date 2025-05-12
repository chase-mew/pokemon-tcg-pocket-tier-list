import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./locales/en/translation.json";
import deTranslation from "./locales/de/translation.json";
import deATTranslation from "./locales/de-AT/translation.json";
import esTranslation from "./locales/es/translation.json";
import frTranslation from "./locales/fr/translation.json";
import jaTranslation from "./locales/ja/translation.json";
import koTranslation from "./locales/ko/translation.json";
import zhCNTranslation from "./locales/zh-CN/translation.json";
import zhTWTranslation from "./locales/zh-TW/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      de: {
        translation: deTranslation,
      },
      "de-AT": {
        translation: deATTranslation,
      },
      es: {
        translation: esTranslation,
      },
      fr: {
        translation: frTranslation,
      },
      ja: {
        translation: jaTranslation,
      },
      ko: {
        translation: koTranslation,
      },
      "zh-CN": {
        translation: zhCNTranslation,
      },
      "zh-TW": {
        translation: zhTWTranslation,
      },
    },
    fallbackLng: {
      "de-AT": ["de"],
      "zh-TW": ["zh-CN"],
      default: ["en"],
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["navigator"],
      caches: [],
    },
  });

export default i18n;
