import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enResources from './locales/en/index';

const resources = {
  en: {
    common: enResources.common,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    keySeparator: '.',
    defaultNS: 'common',

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });
