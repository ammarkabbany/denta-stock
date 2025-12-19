import {
  IconArrowUp,
  IconArrowDown,
  IconAdjustments,
} from '@tabler/icons-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguageContext } from '@/contexts/language-context'
import { formatNumber, formatRelativeTime } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Type } from '@/server/lib/appwrite.types'
import type {
  StockMovements,
  InventoryItems,
  InventoryUnits,
} from '@/server/lib/appwrite.types'

interface MovementListItemProps {
  movement: StockMovements
  item?: InventoryItems | null
  unit?: InventoryUnits | null
}

export function MovementListItem({
  movement,
  item,
  unit,
}: MovementListItemProps) {
  const { t, language } = useLanguageContext()

  const getTypeConfig = () => {
    switch (movement.type) {
      case Type.IN:
        return {
          label: t.movements.in,
          icon: IconArrowUp,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        }
      case Type.OUT:
        return {
          label: t.movements.out,
          icon: IconArrowDown,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          badgeClass: 'bg-red-100 text-red-700 border-red-200',
        }
      case Type.ADJUST:
        return {
          label: t.movements.adjust,
          icon: IconAdjustments,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
        }
      default:
        return {
          label: movement.type,
          icon: IconAdjustments,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
        }
    }
  }

  const config = getTypeConfig()
  const TypeIcon = config.icon

  const unitDisplay =
    language === 'ar' && unit?.abbreviationAr
      ? unit.abbreviationAr
      : (unit?.abbreviation ?? '')

  // Determine item name and archived status
  const itemName = item?.name ?? t.errors.itemNotFound
  const isArchived = item?.archived === true

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full shrink-0',
              config.bgColor,
            )}
          >
            <TypeIcon size={20} className={config.color} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4
                className={cn(
                  'font-medium truncate',
                  isArchived && 'text-muted-foreground',
                )}
              >
                {itemName}
              </h4>
              {isArchived && (
                <Badge
                  variant="outline"
                  className="text-xs bg-gray-100 text-gray-600 border-gray-200"
                >
                  {t.common.archived}
                </Badge>
              )}
              <Badge variant="outline" className={config.badgeClass}>
                {config.label}
              </Badge>
            </div>

            {/* Quantity Change */}
            <div className="flex items-center gap-2 text-sm mb-1">
              <span className="text-muted-foreground">
                {formatNumber(movement.previousStock)}
              </span>
              <span className="text-muted-foreground">→</span>
              <span className={cn('font-semibold', config.color)}>
                {formatNumber(movement.newStock)}
              </span>
              <span className="text-muted-foreground">{unitDisplay}</span>
              <span className={cn('text-xs', config.color)}>
                (
                {movement.type === Type.OUT
                  ? '-'
                  : movement.type === Type.IN
                    ? '+'
                    : ''}
                {formatNumber(movement.quantity)})
              </span>
            </div>

            {/* Reason */}
            {movement.reason && (
              <p className="text-sm text-muted-foreground truncate">
                {movement.reason}
              </p>
            )}

            {/* Time */}
            <p className="text-xs text-muted-foreground mt-1">
              {formatRelativeTime(movement.$createdAt, language)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
