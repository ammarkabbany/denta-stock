import { IconPackageOff } from '@tabler/icons-react'
import { InventoryItemCard } from './inventory-item-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguageContext } from '@/contexts/language-context'
import type {
  InventoryItems,
  InventoryCategories,
  InventoryUnits,
} from '@/server/lib/appwrite.types'

interface InventoryListProps {
  items: InventoryItems[]
  categories: InventoryCategories[]
  units: InventoryUnits[]
  isLoading?: boolean
  onEdit: (item: InventoryItems) => void
  onDelete: (item: InventoryItems) => void
  onArchive: (item: InventoryItems) => void
  onStockIn: (item: InventoryItems) => void
  onStockOut: (item: InventoryItems) => void
}

export function InventoryList({
  items,
  categories,
  units,
  isLoading,
  onEdit,
  onDelete,
  onArchive,
  onStockIn,
  onStockOut,
}: InventoryListProps) {
  const { t } = useLanguageContext()

  const getCategoryById = (id: string | null) =>
    id ? categories.find((c) => c.$id === id) : null

  const getUnitById = (id: string) => units.find((u) => u.$id === id)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-muted">
          <IconPackageOff size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">{t.inventory.noItems}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {t.inventory.addItem}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <InventoryItemCard
          key={item.$id}
          item={item}
          category={getCategoryById(item.categoryId)}
          unit={getUnitById(item.unitId)}
          onEdit={onEdit}
          onDelete={onDelete}
          onArchive={onArchive}
          onStockIn={onStockIn}
          onStockOut={onStockOut}
        />
      ))}
    </div>
  )
}
