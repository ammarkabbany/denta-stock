import {
  IconAlertTriangle,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguageContext } from '@/contexts/language-context'
import { cn } from '@/lib/utils'

interface LowStockItem {
  id: string
  name: string
  currentStock: number
  lowStockThreshold: number
  unitAbbreviation: string
  categoryName?: string
}

interface LowStockAlertProps {
  items: LowStockItem[]
  className?: string
  isLoading?: boolean
}

export function LowStockAlert({
  items,
  className,
  isLoading,
}: LowStockAlertProps) {
  const { t, isRTL } = useLanguageContext()
  const ChevronIcon = isRTL ? IconChevronLeft : IconChevronRight

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <IconAlertTriangle size={18} className="text-warning-foreground" />
            {t.dashboard.lowStockAlerts}
          </CardTitle>
          {!isLoading && items.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {items.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-12" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            {t.dashboard.noAlerts}
          </p>
        ) : (
          <div className="space-y-2">
            {items.slice(0, 5).map((item) => {
              const isOutOfStock = item.currentStock === 0

              return (
                <Link
                  key={item.id}
                  to="/inventory"
                  className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-accent transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    {item.categoryName && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.categoryName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={isOutOfStock ? 'destructive' : 'secondary'}
                      className={cn(
                        'text-xs',
                        !isOutOfStock &&
                          'bg-warning/10 text-warning-foreground hover:bg-warning/20',
                      )}
                    >
                      {item.currentStock} {item.unitAbbreviation}
                    </Badge>
                    <ChevronIcon
                      size={16}
                      className="text-muted-foreground group-hover:text-foreground transition-colors"
                    />
                  </div>
                </Link>
              )
            })}

            {items.length > 5 && (
              <Link to="/inventory">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-primary"
                >
                  {t.dashboard.viewAll} ({items.length})
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
