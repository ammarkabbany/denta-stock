import { useState, useEffect, useCallback } from 'react'
import {
  type Language,
  DEFAULT_LANGUAGE,
  getTranslations,
  getDirection,
} from '@/lib/i18n'

const LANGUAGE_STORAGE_KEY = 'dentastock-language'

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return stored === 'ar' || stored === 'en' ? stored : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate on client
  useEffect(() => {
    setLanguageState(getInitialLanguage())
    setIsHydrated(true)
  }, [])

  const t = getTranslations(language)
  const direction = getDirection(language)
  const isRTL = direction === 'rtl'

  useEffect(() => {
    if (!isHydrated) return

    // Update document direction and language
    document.documentElement.dir = direction
    document.documentElement.lang = language

    // Store preference
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    } catch {
      // Ignore storage errors
    }
  }, [language, direction, isHydrated])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'))
  }, [])

  return {
    language,
    setLanguage,
    toggleLanguage,
    t,
    direction,
    isRTL,
  }
}

export type UseLanguageReturn = ReturnType<typeof useLanguage>
