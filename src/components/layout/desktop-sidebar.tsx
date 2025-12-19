import { Link, useLocation } from '@tanstack/react-router'
import {
  IconLayoutDashboard,
  IconPackage,
  IconArrowsExchange,
  IconChartBar,
  IconSettings,
  IconLogout,
  IconLanguage,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useLanguageContext } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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

interface DesktopSidebarProps {
  collapsed?: boolean
}

export function DesktopSidebar({ collapsed = false }: DesktopSidebarProps) {
  const location = useLocation()
  const { t, toggleLanguage, language, isRTL } = useLanguageContext()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'hidden md:flex flex-col h-screen bg-sidebar border-e border-sidebar-border',
          'transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex items-center h-16 px-4 border-b border-sidebar-border',
            collapsed ? 'justify-center' : 'gap-3',
          )}
        >
          <img
            src="/logo-only-no-bg.png"
            alt="DentaStock"
            className="w-10 h-10 object-contain"
          />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sidebar-foreground">
                {t.appName}
              </span>
              <span className="text-[10px] text-muted-foreground leading-none">
                {t.appTagline}
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path))
            const Icon = item.icon

            const linkContent = (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                    : 'text-sidebar-foreground',
                  collapsed && 'justify-center px-0',
                )}
              >
                <Icon
                  size={20}
                  stroke={isActive ? 2 : 1.5}
                  className="shrink-0"
                />
                {!collapsed && <span>{t.nav[item.labelKey]}</span>}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side={isRTL ? 'left' : 'right'}>
                    {t.nav[item.labelKey]}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return linkContent
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-2 border-t border-sidebar-border">
          <div
            className={cn(
              'flex gap-1',
              collapsed ? 'flex-col items-center' : 'items-center',
            )}
          >
            {/* Language Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLanguage}
                  className="h-9 w-9 text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <IconLanguage size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isRTL ? 'left' : 'right'}>
                {language === 'ar' ? 'English' : 'العربية'}
              </TooltipContent>
            </Tooltip>

            {!collapsed && <div className="flex-1" />}

            {/* Sign Out */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/sign-out">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive"
                  >
                    <IconLogout size={18} />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side={isRTL ? 'left' : 'right'}>
                {t.auth.signOut}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
