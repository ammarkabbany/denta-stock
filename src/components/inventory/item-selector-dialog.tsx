import { useState, useMemo } from 'react'
import { IconSearch, IconPackage } from '@tabler/icons-react'
import { ResponsiveDialog } from '@/components/common/responsive-dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLanguageContext } from '@/contexts/language-context'
import { formatNumber } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type {
  InventoryItems,
  InventoryUnits,
} from '@/server/lib/appwrite.types'

interface ItemSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: InventoryItems[]
  units: InventoryUnits[]
  onSelect: (item: InventoryItems) => void
  title?: string
}

export function ItemSelectorDialog({
  open,
  onOpenChange,
  items,
  units,
  onSelect,
  title,
}: ItemSelectorDialogProps) {
  const { t, language } = useLanguageContext()
  const [search, setSearch] = useState('')

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items
    const searchLower = search.toLowerCase()
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.sku?.toLowerCase().includes(searchLower),
    )
  }, [items, search])

  const getUnitById = (id: string) => units.find((u) => u.$id === id)

  const handleSelect = (item: InventoryItems) => {
    onSelect(item)
    onOpenChange(false)
    setSearch('')
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title ?? t.inventory.title}
      description={t.inventory.searchPlaceholder}
    >
      {/* Search */}
      <div className="relative mb-4">
        <IconSearch
          size={18}
          className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder={t.inventory.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ps-10"
          autoFocus
        />
      </div>

      {/* Items List */}
      <ScrollArea className="h-[300px] -mx-4 px-4 sm:mx-0 sm:px-0">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <IconPackage size={32} className="text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {t.inventory.noItems}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredItems.map((item) => {
              const unit = getUnitById(item.unitId)
              const unitDisplay =
                language === 'ar' && unit?.abbreviationAr
                  ? unit.abbreviationAr
                  : (unit?.abbreviation ?? '')

              return (
                <button
                  key={item.$id}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg text-start',
                    'hover:bg-accent transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    {item.sku && (
                      <p className="text-xs text-muted-foreground">
                        #{item.sku}
                      </p>
                    )}
                  </div>
                  <div className="text-end shrink-0">
                    <p className="font-semibold">
                      {formatNumber(item.currentStock)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {unitDisplay}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </ResponsiveDialog>
  )
}
