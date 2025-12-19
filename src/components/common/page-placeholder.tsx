import { IconHammer } from '@tabler/icons-react'
import { AppShell } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguageContext } from '@/contexts/language-context'

interface PagePlaceholderProps {
  titleKey: keyof typeof import('@/lib/i18n').translations.ar.nav
}

export function PagePlaceholder({ titleKey }: PagePlaceholderProps) {
  const { t } = useLanguageContext()
  const title = t.nav[titleKey]

  return (
    <AppShell title={title}>
      <div className="p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-muted">
              <IconHammer size={32} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground">{t.common.loading}</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
