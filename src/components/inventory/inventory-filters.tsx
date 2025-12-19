import { IconSearch, IconFilter, IconX } from '@tabler/icons-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLanguageContext } from '@/contexts/language-context'
import type { InventoryCategories } from '@/server/lib/appwrite.types'

export type StockStatus = 'all' | 'inStock' | 'lowStock' | 'outOfStock'

interface InventoryFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  categoryId: string
  onCategoryChange: (value: string) => void
  status: StockStatus
  onStatusChange: (value: StockStatus) => void
  categories: InventoryCategories[]
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export function InventoryFilters({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  status,
  onStatusChange,
  categories,
  onClearFilters,
  hasActiveFilters,
}: InventoryFiltersProps) {
  const { t, language } = useLanguageContext()

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <IconSearch
          size={18}
          className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder={t.inventory.searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="ps-10"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-2">
        {/* Category Filter */}
        <Select value={categoryId} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[160px]">
            <IconFilter size={16} className="me-2 text-muted-foreground" />
            <SelectValue placeholder={t.inventory.allCategories} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.inventory.allCategories}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.$id} value={cat.$id}>
                {language === 'ar' && cat.nameAr ? cat.nameAr : cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={status}
          onValueChange={(v) => onStatusChange(v as StockStatus)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t.inventory.allStatuses} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.inventory.allStatuses}</SelectItem>
            <SelectItem value="inStock">{t.inventory.inStock}</SelectItem>
            <SelectItem value="lowStock">
              {t.inventory.lowStockStatus}
            </SelectItem>
            <SelectItem value="outOfStock">
              {t.inventory.outOfStockStatus}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground"
          >
            <IconX size={16} className="me-1" />
            {t.common.close}
          </Button>
        )}
      </div>
    </div>
  )
}
