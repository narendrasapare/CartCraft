export const appConfig = {
  currency: 'INR',
  defaultLanguage: 'en',
  languages: {
    en: { locale: 'en-IN' },
    hi: { locale: 'hi-IN' },
    te: { locale: 'te-IN' },
  },
  storageKeys: {
    cartId: 'cartcraft.cartId',
    language: 'cartcraft.language',
  },
  limits: {
    cartQuantity: { min: 1, max: 99 },
    displayName: { minLength: 2, maxLength: 100 },
    password: { minLength: 12, maxLength: 72 },
  },
} as const

export type SupportedLanguage = keyof typeof appConfig.languages
