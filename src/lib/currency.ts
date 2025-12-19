// Currency utilities with localized symbols

import type { Language } from './i18n'

export type CurrencyCode =
  | 'EGP' // Egyptian Pound
  | 'SYP' // Syrian Pound
  | 'SAR' // Saudi Riyal
  | 'AED' // UAE Dirham
  | 'JOD' // Jordanian Dinar
  | 'KWD' // Kuwaiti Dinar
  | 'QAR' // Qatari Riyal
  | 'BHD' // Bahraini Dinar
  | 'OMR' // Omani Rial
  | 'LBP' // Lebanese Pound
  | 'IQD' // Iraqi Dinar
  | 'USD' // US Dollar
  | 'EUR' // Euro
  | 'GBP' // British Pound

export interface CurrencyInfo {
  code: CurrencyCode
  nameEn: string
  nameAr: string
  symbolEn: string
  symbolAr: string
  decimals: number
}

export const currencies: Record<CurrencyCode, CurrencyInfo> = {
  EGP: {
    code: 'EGP',
    nameEn: 'Egyptian Pound',
    nameAr: 'جنيه مصري',
    symbolEn: 'EGP',
    symbolAr: 'ج.م',
    decimals: 2,
  },
  SYP: {
    code: 'SYP',
    nameEn: 'Syrian Pound',
    nameAr: 'ليرة سورية',
    symbolEn: 'SYP',
    symbolAr: 'ل.س',
    decimals: 0,
  },
  SAR: {
    code: 'SAR',
    nameEn: 'Saudi Riyal',
    nameAr: 'ريال سعودي',
    symbolEn: 'SAR',
    symbolAr: 'ر.س',
    decimals: 2,
  },
  AED: {
    code: 'AED',
    nameEn: 'UAE Dirham',
    nameAr: 'درهم إماراتي',
    symbolEn: 'AED',
    symbolAr: 'د.إ',
    decimals: 2,
  },
  JOD: {
    code: 'JOD',
    nameEn: 'Jordanian Dinar',
    nameAr: 'دينار أردني',
    symbolEn: 'JOD',
    symbolAr: 'د.أ',
    decimals: 3,
  },
  KWD: {
    code: 'KWD',
    nameEn: 'Kuwaiti Dinar',
    nameAr: 'دينار كويتي',
    symbolEn: 'KWD',
    symbolAr: 'د.ك',
    decimals: 3,
  },
  QAR: {
    code: 'QAR',
    nameEn: 'Qatari Riyal',
    nameAr: 'ريال قطري',
    symbolEn: 'QAR',
    symbolAr: 'ر.ق',
    decimals: 2,
  },
  BHD: {
    code: 'BHD',
    nameEn: 'Bahraini Dinar',
    nameAr: 'دينار بحريني',
    symbolEn: 'BHD',
    symbolAr: 'د.ب',
    decimals: 3,
  },
  OMR: {
    code: 'OMR',
    nameEn: 'Omani Rial',
    nameAr: 'ريال عماني',
    symbolEn: 'OMR',
    symbolAr: 'ر.ع',
    decimals: 3,
  },
  LBP: {
    code: 'LBP',
    nameEn: 'Lebanese Pound',
    nameAr: 'ليرة لبنانية',
    symbolEn: 'LBP',
    symbolAr: 'ل.ل',
    decimals: 0,
  },
  IQD: {
    code: 'IQD',
    nameEn: 'Iraqi Dinar',
    nameAr: 'دينار عراقي',
    symbolEn: 'IQD',
    symbolAr: 'د.ع',
    decimals: 0,
  },
  USD: {
    code: 'USD',
    nameEn: 'US Dollar',
    nameAr: 'دولار أمريكي',
    symbolEn: '$',
    symbolAr: '$',
    decimals: 2,
  },
  EUR: {
    code: 'EUR',
    nameEn: 'Euro',
    nameAr: 'يورو',
    symbolEn: '€',
    symbolAr: '€',
    decimals: 2,
  },
  GBP: {
    code: 'GBP',
    nameEn: 'British Pound',
    nameAr: 'جنيه إسترليني',
    symbolEn: '£',
    symbolAr: '£',
    decimals: 2,
  },
}

export const currencyList = Object.values(currencies)

export function getCurrencyInfo(code: CurrencyCode): CurrencyInfo {
  return currencies[code]
}

export function getCurrencySymbol(code: CurrencyCode, lang: Language): string {
  const info = currencies[code]
  return lang === 'ar' ? info.symbolAr : info.symbolEn
}

export function getCurrencyName(code: CurrencyCode, lang: Language): string {
  const info = currencies[code]
  return lang === 'ar' ? info.nameAr : info.nameEn
}

export function formatCurrency(
  amount: number | null | undefined,
  currencyCode: CurrencyCode,
  lang: Language,
  options?: {
    showSymbol?: boolean
    compact?: boolean
  },
): string {
  if (amount === null || amount === undefined) {
    return '-'
  }

  const { showSymbol = true, compact = false } = options ?? {}
  const info = currencies[currencyCode]

  // Always use en-US locale for Western numerals, regardless of language
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: compact ? 0 : info.decimals,
    maximumFractionDigits: info.decimals,
    notation: compact && Math.abs(amount) >= 10000 ? 'compact' : 'standard',
  })

  const formattedNumber = formatter.format(amount)

  if (!showSymbol) {
    return formattedNumber
  }

  // Use Arabic symbol when language is Arabic, English symbol otherwise
  const symbol = lang === 'ar' ? info.symbolAr : info.symbolEn

  // In Arabic, symbol typically comes after the number
  // In English, it depends on the currency
  if (lang === 'ar') {
    return `${formattedNumber} ${symbol}`
  }

  // For USD, EUR, GBP - symbol before
  if (['USD', 'EUR', 'GBP'].includes(currencyCode)) {
    return `${symbol}${formattedNumber}`
  }

  // For other currencies in English - symbol after
  return `${formattedNumber} ${symbol}`
}

// Get display label for currency selector
export function getCurrencyLabel(code: CurrencyCode, lang: Language): string {
  const info = currencies[code]
  const symbol = lang === 'ar' ? info.symbolAr : info.symbolEn
  const name = lang === 'ar' ? info.nameAr : info.nameEn
  return `${code} - ${symbol} (${name})`
}
