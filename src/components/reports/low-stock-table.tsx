import { IconAlertTriangle } from '@tabler/icons-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { useLanguageContext } from '@/contexts/language-context'
import { formatNumber } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface LowStockTableProps {
  items: Array<{
    itemId: string
    itemName: string
    currentStock: number
    threshold: number
    deficit: number
  }>
  isLoading?: boolean
}

export function LowStockTable({ items, isLoading }: LowStockTableProps) {
  const { t } = useLanguageContext()

  if (isLoading) {
    return (
      <Card className="focus:outline-none focus-visible:outline-none">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="focus:outline-none focus-visible:outline-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-100">
              <IconAlertTriangle size={14} className="text-amber-600" />
            </div>
            {t.reports.lowStockReport}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
            {t.dashboard.noAlerts}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="focus:outline-none focus-visible:outline-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-100">
            <IconAlertTriangle size={14} className="text-amber-600" />
          </div>
          {t.reports.lowStockReport}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          {items.map((item) => {
            const percentage =
              item.threshold > 0
                ? Math.round((item.currentStock / item.threshold) * 100)
                : 0
            const isOutOfStock = item.currentStock === 0
            const isCritical = percentage < 25

            return (
              <div
                key={item.itemId}
                className="p-3 rounded-lg bg-muted/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{item.itemName}</p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-sm font-bold tabular-nums',
                        isOutOfStock
                          ? 'text-red-600'
                          : isCritical
                            ? 'text-amber-600'
                            : 'text-foreground',
                      )}
                    >
                      {formatNumber(item.currentStock)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / {formatNumber(item.threshold)}
                    </span>
                  </div>
                </div>
                <Progress
                  value={percentage}
                  className={cn(
                    'h-1.5',
                    isOutOfStock
                      ? '[&>div]:bg-red-500'
                      : isCritical
                        ? '[&>div]:bg-amber-500'
                        : '[&>div]:bg-emerald-500',
                  )}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {t.reports.deficit}:{' '}
                    <span className="font-medium text-foreground">
                      {formatNumber(item.deficit)}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'font-medium',
                      isOutOfStock
                        ? 'text-red-600'
                        : isCritical
                          ? 'text-amber-600'
                          : 'text-emerald-600',
                    )}
                  >
                    {percentage}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
