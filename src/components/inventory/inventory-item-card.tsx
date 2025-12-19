import {
  IconPackage,
  IconAlertTriangle,
  IconPackageOff,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconArchive,
  IconArrowUp,
  IconArrowDown,
} from '@tabler/icons-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguageContext } from '@/contexts/language-context'
import { formatNumber } from '@/lib/i18n'
import { formatCurrency } from '@/lib/currency'
import { cn } from '@/lib/utils'
import type {
  InventoryItems,
  InventoryCategories,
  InventoryUnits,
} from '@/server/lib/appwrite.types'

interface InventoryItemCardProps {
  item: InventoryItems
  category?: InventoryCategories | null
  unit?: InventoryUnits | null
  onEdit: (item: InventoryItems) => void
  onDelete: (item: InventoryItems) => void
  onArchive: (item: InventoryItems) => void
  onStockIn: (item: InventoryItems) => void
  onStockOut: (item: InventoryItems) => void
}

export function InventoryItemCard({
  item,
  category,
  unit,
  onEdit,
  onDelete,
  onArchive,
  onStockIn,
  onStockOut,
}: InventoryItemCardProps) {
  const { t, language } = useLanguageContext()

  const getStockStatus = () => {
    if (item.currentStock === 0) {
      return {
        label: t.inventory.outOfStockStatus,
        variant: 'destructive' as const,
        icon: IconPackageOff,
      }
    }
    if (item.lowStockThreshold && item.currentStock <= item.lowStockThreshold) {
      return {
        label: t.inventory.lowStockStatus,
        variant: 'warning' as const,
        icon: IconAlertTriangle,
      }
    }
    return {
      label: t.inventory.inStock,
      variant: 'success' as const,
      icon: IconPackage,
    }
  }

  const status = getStockStatus()
  const StatusIcon = status.icon

  const unitDisplay =
    language === 'ar' && unit?.abbreviationAr
      ? unit.abbreviationAr
      : (unit?.abbreviation ?? '')

  const categoryDisplay =
    language === 'ar' && category?.nameAr
      ? category.nameAr
      : (category?.name ?? '')

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Item Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-base truncate">{item.name}</h3>
              {item.sku && (
                <span className="text-xs text-muted-foreground shrink-0">
                  #{item.sku}
                </span>
              )}
            </div>

            {categoryDisplay && (
              <p className="text-sm text-muted-foreground mb-2 truncate">
                {categoryDisplay}
              </p>
            )}

            {/* Stock Info */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <StatusIcon
                  size={16}
                  className={cn(
                    status.variant === 'destructive' && 'text-destructive',
                    status.variant === 'warning' && 'text-amber-500',
                    status.variant === 'success' && 'text-emerald-500',
                  )}
                />
                <span className="font-semibold text-lg">
                  {formatNumber(item.currentStock)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {unitDisplay}
                </span>
              </div>

              <Badge
                variant={
                  status.variant === 'warning'
                    ? 'outline'
                    : status.variant === 'destructive'
                      ? 'destructive'
                      : 'secondary'
                }
                className={cn(
                  status.variant === 'warning' &&
                    'border-amber-500 text-amber-600 bg-amber-50',
                  status.variant === 'success' &&
                    'bg-emerald-50 text-emerald-600',
                )}
              >
                {status.label}
              </Badge>
            </div>

            {/* Cost */}
            {item.costPerUnit !== null && (
              <p className="text-sm text-muted-foreground mt-2">
                {formatCurrency(item.costPerUnit, 'EGP', language)} /{' '}
                {unitDisplay}
              </p>
            )}
          </div>

          {/* More Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <IconDotsVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <IconEdit size={16} className="me-2" />
                {t.common.edit}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive(item)}>
                <IconArchive size={16} className="me-2" />
                {t.inventory.archiveItem}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(item)}
                className="text-destructive focus:text-destructive"
              >
                <IconTrash size={16} className="me-2" />
                {t.common.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stock Action Buttons - Prominent at bottom */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-10 text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-300"
            onClick={() => onStockIn(item)}
          >
            <IconArrowUp size={18} className="me-1.5" />
            {t.movements.stockIn}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-10 text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700 hover:border-red-300 disabled:opacity-50"
            onClick={() => onStockOut(item)}
            disabled={item.currentStock === 0}
          >
            <IconArrowDown size={18} className="me-1.5" />
            {t.movements.stockOut}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
