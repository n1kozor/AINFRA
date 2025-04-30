import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'hu'],
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    ns: ['common', 'dashboard', 'devices', 'plugins'],
    defaultNS: 'common',

    returnObjects: true
  });

export default i18n;