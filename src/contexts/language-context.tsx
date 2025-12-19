import { createContext, useContext, type ReactNode } from 'react'
import { useLanguage, type UseLanguageReturn } from '@/hooks/use-language'

const LanguageContext = createContext<UseLanguageReturn | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const languageValue = useLanguage()

  return (
    <LanguageContext.Provider value={languageValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguageContext() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider')
  }
  return context
}
