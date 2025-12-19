import { useState } from 'react'
import { IconChartBar, IconRefresh } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { AppShell } from '@/components/layout'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SummaryCards } from './summary-cards'
import { MovementTrendsChart } from './movement-trends-chart'
import { CategoryChart } from './category-chart'
import { TopItemsTable } from './top-items-table'
import { LowStockTable } from './low-stock-table'
import { useLanguageContext } from '@/contexts/language-context'
import { getReportsDataFn } from '@/server/functions/inventory'

type Period = '7d' | '30d' | '90d' | 'all'

export function ReportsPage() {
  const { t } = useLanguageContext()
  const [period, setPeriod] = useState<Period>('30d')

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['reports-data', period],
    queryFn: () => getReportsDataFn({ data: { period } }),
  })

  const periodOptions = [
    { value: '7d', label: t.reports.last7Days },
    { value: '30d', label: t.reports.last30Days },
    { value: '90d', label: t.reports.last90Days },
    { value: 'all', label: t.reports.allTime },
  ]

  return (
    <AppShell title={t.reports.title}>
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <IconChartBar size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">{t.reports.title}</h1>
              <p className="text-sm text-muted-foreground">
                {t.reports.overview}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={period}
              onValueChange={(v) => setPeriod(v as Period)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <IconRefresh
                size={18}
                className={isFetching ? 'animate-spin' : ''}
              />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards summary={data?.summary ?? null} isLoading={isLoading} />

        {/* Movement Trends Chart */}
        <MovementTrendsChart
          data={data?.movementTrends ?? []}
          isLoading={isLoading}
        />

        {/* Category Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CategoryChart
            data={data?.stockByCategory ?? []}
            type="stock"
            isLoading={isLoading}
          />
          <CategoryChart
            data={data?.stockByCategory ?? []}
            type="value"
            isLoading={isLoading}
          />
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopItemsTable
            items={data?.topMovingItems ?? []}
            isLoading={isLoading}
          />
          <LowStockTable
            items={data?.lowStockItems ?? []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </AppShell>
  )
}
