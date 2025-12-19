import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguageContext } from '@/contexts/language-context'
import { formatNumber } from '@/lib/i18n'
import { formatCurrency } from '@/lib/currency'

interface CategoryChartProps {
  data: Array<{
    categoryId: string
    categoryName: string
    categoryNameAr: string | null
    itemCount: number
    totalStock: number
    totalValue: number
  }>
  type: 'stock' | 'value'
  isLoading?: boolean
  currency?: 'EGP' | 'USD' | 'SAR' | 'AED' | 'SYP'
}

const COLORS = [
  '#0d9488', // teal-600
  '#8b5cf6', // violet-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#ec4899', // pink-500
  '#6366f1', // indigo-500
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      name: string
      value: number
      percent: number
      fill: string
    }
  }>
  type: 'stock' | 'value'
  currency: 'EGP' | 'USD' | 'SAR' | 'AED' | 'SYP'
  language: 'ar' | 'en'
  isRTL: boolean
  labels: {
    totalValue: string
    totalStock: string
  }
}

function CustomTooltip({
  active,
  payload,
  type,
  currency,
  language,
  isRTL,
  labels,
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0]
  const percent = ((data.payload.percent || 0) * 100).toFixed(1)

  return (
    <div
      className="bg-popover border border-border rounded-lg shadow-lg p-3 min-w-[140px]"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: data.payload.fill }}
        />
        <span className="font-medium text-sm text-foreground truncate">
          {data.name}
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            {type === 'value' ? labels.totalValue : labels.totalStock}
          </span>
          <span className="font-semibold text-foreground">
            {type === 'value'
              ? formatCurrency(data.value, currency, language)
              : formatNumber(data.value)}
          </span>
        </div>
        <div className="flex justify-between items-center gap-4 text-sm">
          <span className="text-muted-foreground">%</span>
          <span className="font-semibold text-foreground">{percent}%</span>
        </div>
      </div>
    </div>
  )
}

interface CustomLegendProps {
  payload?: Array<{
    value: string
    color: string
  }>
  isRTL: boolean
}

function CustomLegend({ payload, isRTL }: CustomLegendProps) {
  if (!payload) return null

  return (
    <div
      className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 px-2"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground truncate max-w-[100px]">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function CategoryChart({
  data,
  type,
  isLoading,
  currency = 'EGP',
}: CategoryChartProps) {
  const { t, language, isRTL } = useLanguageContext()

  const chartData = useMemo(() => {
    const total = data.reduce(
      (sum, item) =>
        sum + (type === 'stock' ? item.totalStock : item.totalValue),
      0,
    )

    return data
      .filter((item) =>
        type === 'stock' ? item.totalStock > 0 : item.totalValue > 0,
      )
      .map((item) => {
        const value = type === 'stock' ? item.totalStock : item.totalValue
        return {
          name:
            language === 'ar' && item.categoryNameAr
              ? item.categoryNameAr
              : item.categoryName,
          value,
          percent: total > 0 ? value / total : 0,
        }
      })
      .sort((a, b) => b.value - a.value) // Sort by value descending
  }, [data, type, language])

  const title =
    type === 'stock' ? t.reports.stockByCategory : t.reports.valueByCategory

  if (isLoading) {
    return (
      <Card className="focus:outline-none focus-visible:outline-none">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[280px]">
            <Skeleton className="h-40 w-40 rounded-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card className="focus:outline-none focus-visible:outline-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
            {t.reports.noData}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="focus:outline-none focus-visible:outline-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[280px]" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="transition-opacity hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip
                content={
                  <CustomTooltip
                    type={type}
                    currency={currency}
                    language={language}
                    isRTL={isRTL}
                    labels={{
                      totalValue: t.reports.totalValue,
                      totalStock: t.reports.totalStock,
                    }}
                  />
                }
              />
              <Legend
                content={<CustomLegend isRTL={isRTL} />}
                verticalAlign="bottom"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
