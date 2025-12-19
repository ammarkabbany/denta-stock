import { IconLanguage, IconLogout, IconMenu2 } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useLanguageContext } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AppHeaderProps {
  title?: string
}

export function AppHeader({ title }: AppHeaderProps) {
  const { t, toggleLanguage, language } = useLanguageContext()

  return (
    <header className="sticky top-0 z-40 flex items-center h-14 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border md:hidden">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/logo-only-no-bg.png"
          alt="DentaStock"
          className="w-10 h-10 object-contain"
        />
        <span className="font-bold text-foreground">{title || t.appName}</span>
      </Link>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Language Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          className="h-9 w-9"
        >
          <IconLanguage size={18} />
        </Button>

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <IconMenu2 size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={toggleLanguage}>
              <IconLanguage size={16} className="me-2" />
              {language === 'ar' ? 'English' : 'العربية'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              className="text-destructive focus:text-destructive"
            >
              <Link to="/sign-out">
                <IconLogout size={16} className="me-2" />
                {t.auth.signOut}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
