import { useState } from 'react'
import { IconSettings, IconFolder, IconRuler } from '@tabler/icons-react'
import { AppShell } from '@/components/layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GeneralTab } from './general-tab'
import { CategoriesTab } from './categories-tab'
import { UnitsTab } from './units-tab'
import { useLanguageContext } from '@/contexts/language-context'

type SettingsTab = 'general' | 'categories' | 'units'

export function SettingsPage() {
  const { t } = useLanguageContext()
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')

  return (
    <AppShell title={t.settings.title}>
      <div className="p-4 md:p-6 space-y-4 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <IconSettings size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{t.settings.title}</h1>
            <p className="text-sm text-muted-foreground">
              {t.settings.categoriesAndUnits}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as SettingsTab)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">
              <IconSettings size={16} className="me-1.5" />
              {t.settings.general}
            </TabsTrigger>
            <TabsTrigger value="categories">
              <IconFolder size={16} className="me-1.5" />
              {t.categories.title}
            </TabsTrigger>
            <TabsTrigger value="units">
              <IconRuler size={16} className="me-1.5" />
              {t.units.title}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            <GeneralTab />
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            <CategoriesTab />
          </TabsContent>

          <TabsContent value="units" className="mt-4">
            <UnitsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
