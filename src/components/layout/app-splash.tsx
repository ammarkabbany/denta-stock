import { useEffect, useState } from 'react'
import { useAccess } from '@/contexts/team-provider'
import { cn } from '@/lib/utils'
import { useLanguageContext } from '@/contexts/language-context'
import { useIsMobile } from '@/hooks/use-mobile'
import './app-splash.css'

export default function AppSplash() {
  const { isLoading } = useAccess()
  const { t } = useLanguageContext()
  const [mounted, setMounted] = useState(true)
  const [visible, setVisible] = useState(true)
  const isMobile = useIsMobile()
  const [exiting, setExiting] = useState(false)
  const [shownAt, setShownAt] = useState<number | null>(null)
  const [seen, setSeen] = useState<boolean>(false)

  useEffect(() => {
    // If splash was already shown this session, never re-show on navigations
    if (seen) {
      setMounted(false)
      setVisible(false)
      setExiting(false)
      return
    }

    if (isLoading) {
      setMounted(true)
      setVisible(true)
      setExiting(false)
      if (shownAt == null) setShownAt(Date.now())
    } else {
      // Trigger logo reveal (scale-up) before exit transition, then mark seen
      setExiting(true)
      const MIN_DURATION_MS = 500 // reduced from 1500ms for faster perceived load
      const elapsed = shownAt ? Date.now() - shownAt : 0
      const remaining = Math.max(0, MIN_DURATION_MS - elapsed)
      const toFade = setTimeout(() => setVisible(false), 260 + remaining)
      const toUnmount = setTimeout(
        () => {
          setSeen(true)
          setMounted(false)
          setShownAt(null)
        },
        260 + 300 + remaining,
      )
      return () => {
        clearTimeout(toFade)
        clearTimeout(toUnmount)
      }
    }
  }, [isLoading, seen, shownAt])

  if (!mounted) return null

  const containerClass = cn(
    'fixed inset-0 z-[9999] min-h-screen flex items-center justify-center bg-gradient-to-b from-[#ffffff] via-[#eaf2ff] to-[#d7e6ff]',
    isMobile
      ? visible
        ? 'translate-y-0'
        : '-translate-y-full'
      : visible
        ? 'opacity-100'
        : 'opacity-0',
    isMobile
      ? 'transition-transform duration-300'
      : 'transition-opacity duration-300',
  )

  return (
    <div id="splash-screen" className={containerClass}>
      <div
        id="splash-content"
        className="relative h-full flex flex-col items-center justify-center gap-4 text-gray-900"
      >
        <div
          className={cn(
            'relative inline-block overflow-hidden will-change-transform',
            exiting ? 'animate-logo-exit' : 'animate-logo-entry',
          )}
        >
          <img
            src="/logo-only-no-bg.png"
            alt="DentaStock"
            width={260}
            height={260}
            className={cn(
              'w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] object-contain',
            )}
            loading="eager"
          />
          {/* Static linear highlight behind logo to amplify shine */}
          <span className="logo-linear" aria-hidden="true" />
          {/* Shine sweep on entry */}
          <span
            className={cn('logo-shine', exiting ? '' : 'animate-shine')}
            aria-hidden="true"
          />
          {/* Bloom glow on exit */}
          <span
            className={cn('logo-bloom', exiting ? 'animate-bloom' : '')}
            aria-hidden="true"
          />
        </div>

        <div
          className="progress text-primary mt-4"
          dir="ltr"
          aria-hidden="true"
        >
          <div className="bar" />
        </div>
        <p
          id="splash-tagline"
          className="text-sm text-gray-500 text-center"
          style={{ direction: 'ltr' }}
        >
          {t.auth?.preparingWorkspace || 'Preparing workspace...'}
        </p>
      </div>
    </div>
  )
}
