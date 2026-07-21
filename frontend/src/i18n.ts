import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { appConfig, type SupportedLanguage } from './config'
import { en } from './locales/en'
import { hi } from './locales/hi'
import { te } from './locales/te'

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  te: { translation: te },
} as const

const savedLanguage = localStorage.getItem(appConfig.storageKeys.language)
const browserLanguage = navigator.language.split('-')[0]
const initialLanguage: SupportedLanguage =
  savedLanguage === 'hi' || savedLanguage === 'te'
    ? savedLanguage
    : browserLanguage === 'hi' || browserLanguage === 'te'
      ? browserLanguage
      : appConfig.defaultLanguage

document.documentElement.lang = initialLanguage

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: appConfig.defaultLanguage,
  supportedLngs: Object.keys(appConfig.languages),
  interpolation: { escapeValue: false },
})

export const localeFor = (language: string) =>
  language.startsWith('hi')
    ? appConfig.languages.hi.locale
    : language.startsWith('te')
      ? appConfig.languages.te.locale
      : appConfig.languages.en.locale

export const changeLanguage = async (language: SupportedLanguage) => {
  localStorage.setItem(appConfig.storageKeys.language, language)
  document.documentElement.lang = language
  await i18n.changeLanguage(language)
}

export default i18n
