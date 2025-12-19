import { IconTrendingUp } from '@tabler/icons-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useLanguageContext } from '@/contexts/language-context'
import { formatNumber } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface TopItemsTableProps {
  items: Array<{
    itemId: string
    itemName: string
    totalIn: number
    totalOut: number
    totalMovement: number
    isArchived?: boolean
  }>
  isLoading?: boolean
}

export function TopItemsTable({ items, isLoading }: TopItemsTableProps) {
  const { t } = useLanguageContext()

  if (isLoading) {
    return (
      <Card className="focus:outline-none focus-visible:outline-none">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-14 rounded-full" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="text-end space-y-1">
                  <Skeleton className="h-6 w-12 ms-auto" />
                  <Skeleton className="h-3 w-16" />
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
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10">
              <IconTrendingUp size={14} className="text-primary" />
            </div>
            {t.reports.topItems}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
            {t.reports.noData}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="focus:outline-none focus-visible:outline-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10">
            <IconTrendingUp size={14} className="text-primary" />
          </div>
          {t.reports.topItems}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.itemId}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm',
                    index === 0
                      ? 'bg-amber-100 text-amber-700'
                      : index === 1
                        ? 'bg-zinc-200 text-zinc-700'
                        : index === 2
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-primary/10 text-primary',
                  )}
                >
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        'font-medium text-sm',
                        item.isArchived && 'text-muted-foreground',
                      )}
                    >
                      {item.itemName}
                    </p>
                    {item.isArchived && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 bg-gray-100 text-gray-600 border-gray-200"
                      >
                        {t.common.archived}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 text-emerald-600 border-emerald-200 bg-emerald-50"
                    >
                      ↑ {formatNumber(item.totalIn)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 text-red-600 border-red-200 bg-red-50"
                    >
                      ↓ {formatNumber(item.totalOut)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-end">
                <p className="text-lg font-bold tabular-nums">
                  {formatNumber(item.totalMovement)}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t.reports.totalMovements}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
