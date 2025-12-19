import {
  IconLanguage,
  IconMoon,
  IconSun,
  IconDeviceDesktop,
} from '@tabler/icons-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLanguageContext } from '@/contexts/language-context'
import { useTheme } from 'next-themes'

export function GeneralTab() {
  const { t, language, setLanguage } = useLanguageContext()
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-4">
      {/* Language */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <IconLanguage size={18} />
            {t.settings.language}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={language}
            onValueChange={(v) => setLanguage(v as 'ar' | 'en')}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ar">العربية</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            {theme === 'dark' ? (
              <IconMoon size={18} />
            ) : theme === 'light' ? (
              <IconSun size={18} />
            ) : (
              <IconDeviceDesktop size={18} />
            )}
            {t.settings.theme}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setTheme('light')}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                theme === 'light'
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent bg-muted/50 hover:bg-muted'
              }`}
            >
              <IconSun size={20} />
              <span className="text-xs font-medium">{t.settings.light}</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                theme === 'dark'
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent bg-muted/50 hover:bg-muted'
              }`}
            >
              <IconMoon size={20} />
              <span className="text-xs font-medium">{t.settings.dark}</span>
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                theme === 'system'
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent bg-muted/50 hover:bg-muted'
              }`}
            >
              <IconDeviceDesktop size={20} />
              <span className="text-xs font-medium">{t.settings.system}</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
