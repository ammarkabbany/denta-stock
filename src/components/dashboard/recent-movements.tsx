import {
  IconArrowDown,
  IconArrowUp,
  IconAdjustments,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguageContext } from '@/contexts/language-context'
import { formatRelativeTime, formatNumber } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Type } from '@/server/lib/appwrite.types'

interface Movement {
  id: string
  itemName: string
  isArchived?: boolean
  type: Type
  quantity: number
  previousStock: number
  newStock: number
  reason?: string | null
  createdAt: string
  createdByName?: string
}

interface RecentMovementsProps {
  movements: Movement[]
  className?: string
  isLoading?: boolean
}

const typeConfig = {
  [Type.IN]: {
    icon: IconArrowDown,
    label: 'in',
    className: 'bg-emerald-50 text-emerald-600',
    iconClass: 'text-emerald-600',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  [Type.OUT]: {
    icon: IconArrowUp,
    label: 'out',
    className: 'bg-red-50 text-red-600',
    iconClass: 'text-red-600',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
  },
  [Type.ADJUST]: {
    icon: IconAdjustments,
    label: 'adjust',
    className: 'bg-blue-50 text-blue-600',
    iconClass: 'text-blue-600',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
  },
}

export function RecentMovements({
  movements,
  className,
  isLoading,
}: RecentMovementsProps) {
  const { t, language, isRTL } = useLanguageContext()
  const ChevronIcon = isRTL ? IconChevronLeft : IconChevronRight

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            {t.dashboard.recentMovements}
          </CardTitle>
          <Link to="/movements">
            <Button variant="ghost" size="sm" className="text-primary -me-2">
              {t.dashboard.viewAll}
              <ChevronIcon size={16} className="ms-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : movements.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            {t.dashboard.noMovements}
          </p>
        ) : (
          <div className="space-y-3">
            {movements.slice(0, 5).map((movement) => {
              const config = typeConfig[movement.type]
              const Icon = config.icon

              return (
                <div key={movement.id} className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5',
                      config.className,
                    )}
                  >
                    <Icon size={16} className={config.iconClass} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={cn(
                          'text-sm font-medium truncate',
                          movement.isArchived && 'text-muted-foreground',
                        )}
                      >
                        {movement.itemName}
                      </p>
                      {movement.isArchived && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-100 text-gray-600 border-gray-200"
                        >
                          {t.common.archived}
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className={cn('text-xs shrink-0', config.badgeClass)}
                      >
                        {movement.type === Type.IN
                          ? '+'
                          : movement.type === Type.OUT
                            ? '-'
                            : ''}
                        {formatNumber(movement.quantity)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {movement.previousStock} → {movement.newStock}
                      </span>
                      {movement.reason && (
                        <>
                          <span className="text-xs text-muted-foreground">
                            •
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {movement.reason}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(movement.createdAt, language)}
                      {movement.createdByName && (
                        <> • {movement.createdByName}</>
                      )}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
