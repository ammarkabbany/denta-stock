import { Link, useLocation } from '@tanstack/react-router'
import {
  IconLayoutDashboard,
  IconPackage,
  IconArrowsExchange,
  IconChartBar,
  IconSettings,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useLanguageContext } from '@/contexts/language-context'

interface NavItem {
  path: string
  labelKey: keyof typeof import('@/lib/i18n').translations.ar.nav
  icon: typeof IconLayoutDashboard
}

const navItems: NavItem[] = [
  { path: '/', labelKey: 'dashboard', icon: IconLayoutDashboard },
  { path: '/inventory', labelKey: 'inventory', icon: IconPackage },
  { path: '/movements', labelKey: 'movements', icon: IconArrowsExchange },
  { path: '/reports', labelKey: 'reports', icon: IconChartBar },
  { path: '/settings', labelKey: 'settings', icon: IconSettings },
]

export function BottomNav() {
  const location = useLocation()
  const { t } = useLanguageContext()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path))
          const Icon = item.icon

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                'active:bg-accent/50',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon
                size={22}
                stroke={isActive ? 2.5 : 1.5}
                className="shrink-0"
              />
              <span
                className={cn(
                  'text-[10px] font-medium leading-none',
                  isActive && 'font-semibold',
                )}
              >
                {t.nav[item.labelKey]}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
