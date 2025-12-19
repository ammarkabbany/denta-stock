import { useState, useEffect } from 'react'
import { IconDownload, IconX, IconDeviceMobile } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useLanguageContext } from '@/contexts/language-context'
import { cn } from '@/lib/utils'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'pwa-install-dismissed'
const DISMISS_DURATION = 3 * 24 * 60 * 60 * 1000 // 3 days
const SHOW_DELAY = 5000 // 5 seconds

export function PWAInstallPrompt() {
  const { t } = useLanguageContext()
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    // Check if already dismissed recently
    const dismissedAt = localStorage.getItem(DISMISS_KEY)
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10)
      if (Date.now() - dismissedTime < DISMISS_DURATION) {
        return
      }
    }

    // Check if already installed (standalone mode)
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone
    ) {
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show after delay for better UX
      setTimeout(() => setIsVisible(true), SHOW_DELAY)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      )
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    setIsInstalling(true)
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        setIsVisible(false)
      }
    } catch (error) {
      console.error('Install prompt error:', error)
    } finally {
      setIsInstalling(false)
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem(DISMISS_KEY, Date.now().toString())
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-20 sm:bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 sm:left-auto sm:max-w-sm z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <Card className="relative overflow-hidden border-primary/20 shadow-lg">
        {/* Gradient accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-primary" />

        <div className="p-4">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 end-3 p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label={t.common.close}
          >
            <IconX size={16} />
          </button>

          <div className="flex gap-4">
            {/* Icon */}
            <div className="shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center">
                <IconDeviceMobile size={24} className="text-primary" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pe-6">
              <h3 className="font-semibold text-sm mb-1">
                {t.pwa.installTitle}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {t.pwa.installDescription}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className={cn(
                    'h-8 px-3 text-xs',
                    'bg-primary hover:bg-primary/90',
                  )}
                >
                  <IconDownload size={14} className="me-1.5" />
                  {isInstalling ? t.common.loading : t.pwa.installButton}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="h-8 px-3 text-xs text-muted-foreground"
                >
                  {t.pwa.notNow}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
