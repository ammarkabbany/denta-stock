import { type ReactNode } from 'react'
import { DesktopSidebar } from './desktop-sidebar'
import { BottomNav } from './bottom-nav'
import { AppHeader } from './app-header'
import { PWAInstallPrompt } from '@/components/common'
import SubscriptionBanner from '@/components/subscription-banner'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: ReactNode
  title?: string
  showHeader?: boolean
}

export function AppShell({
  children,
  title,
  showHeader = true,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar - sticky so it doesn't scroll with content */}
      <div className="hidden md:block sticky top-0 h-screen">
        <DesktopSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        {showHeader && <AppHeader title={title} />}

        {/* Subscription/Trial Banner - shows below header */}
        <SubscriptionBanner />

        {/* Page Content */}
        <main
          className={cn(
            'flex-1',
            'pb-20 md:pb-0', // Bottom padding for mobile nav
          )}
        >
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  )
}
