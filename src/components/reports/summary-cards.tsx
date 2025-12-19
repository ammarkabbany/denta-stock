import {
  IconPackage,
  IconArrowUp,
  IconArrowDown,
  IconAdjustments,
  IconAlertTriangle,
  IconCurrencyDollar,
} from '@tabler/icons-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguageContext } from '@/contexts/language-context'
import { formatNumber } from '@/lib/i18n'
import { formatCurrency } from '@/lib/currency'
import { cn } from '@/lib/utils'

interface SummaryCardsProps {
  summary: {
    totalItems: number
    totalValue: number
    totalMovements: number
    totalIn: number
    totalOut: number
    totalAdjust: number
    lowStockCount: number
    outOfStockCount: number
  } | null
  isLoading?: boolean
  currency?: 'EGP' | 'USD' | 'SAR' | 'AED' | 'SYP'
}

export function SummaryCards({
  summary,
  isLoading,
  currency = 'EGP',
}: SummaryCardsProps) {
  const { t, language } = useLanguageContext()

  const cards = [
    {
      title: t.reports.totalMovements,
      value: summary?.totalMovements ?? 0,
      icon: IconPackage,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: t.reports.stockIn,
      value: summary?.totalIn ?? 0,
      icon: IconArrowUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: t.reports.stockOut,
      value: summary?.totalOut ?? 0,
      icon: IconArrowDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: t.reports.adjustments,
      value: summary?.totalAdjust ?? 0,
      icon: IconAdjustments,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: t.dashboard.lowStock,
      value: summary?.lowStockCount ?? 0,
      icon: IconAlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: t.reports.totalValue,
      value: formatCurrency(summary?.totalValue ?? 0, currency, language, {
        compact: true,
      }),
      icon: IconCurrencyDollar,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      isFormatted: true,
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-20 sm:h-24 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="overflow-hidden focus:outline-none focus-visible:outline-none"
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg shrink-0',
                  card.bgColor,
                )}
              >
                <card.icon
                  size={18}
                  className={cn(card.color, 'sm:w-5 sm:h-5')}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight line-clamp-2">
                  {card.title}
                </p>
                <p className="text-base sm:text-lg font-bold mt-0.5 break-words">
                  {card.isFormatted
                    ? card.value
                    : formatNumber(card.value as number)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
