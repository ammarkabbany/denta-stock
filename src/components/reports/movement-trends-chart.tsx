import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguageContext } from '@/contexts/language-context'
import { formatDate, formatNumber } from '@/lib/i18n'

interface MovementTrendsChartProps {
  data: Array<{
    date: string
    in: number
    out: number
    adjust: number
  }>
  isLoading?: boolean
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
  }>
  label?: string
  isRTL: boolean
  labels: {
    stockIn: string
    stockOut: string
    adjustments: string
  }
}

function CustomTooltip({
  active,
  payload,
  label,
  isRTL,
  labels,
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null

  const getLabel = (name: string) => {
    if (name === 'in') return labels.stockIn
    if (name === 'out') return labels.stockOut
    return labels.adjustments
  }

  return (
    <div
      className="bg-popover border border-border rounded-lg shadow-lg p-3 min-w-[160px]"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="text-xs font-medium text-foreground mb-2 pb-2 border-b border-border">
        {label}
      </div>
      <div className="space-y-1.5">
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">
                {getLabel(entry.name)}
              </span>
            </div>
            <span className="font-semibold text-foreground tabular-nums">
              {formatNumber(entry.value)}
            </span>
          </div>
        ))}
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
  labels: {
    stockIn: string
    stockOut: string
    adjustments: string
  }
}

function CustomLegend({ payload, isRTL, labels }: CustomLegendProps) {
  if (!payload) return null

  const getLabel = (name: string) => {
    if (name === 'in') return labels.stockIn
    if (name === 'out') return labels.stockOut
    return labels.adjustments
  }

  return (
    <div
      className="flex justify-center gap-6 mt-4"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs font-medium text-muted-foreground">
            {getLabel(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function MovementTrendsChart({
  data,
  isLoading,
}: MovementTrendsChartProps) {
  const { t, language, isRTL } = useLanguageContext()

  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      dateLabel: formatDate(item.date, language, {
        month: 'short',
        day: 'numeric',
      }),
    }))
  }, [data, language])

  if (isLoading) {
    return (
      <Card className="focus:outline-none focus-visible:outline-none">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="focus:outline-none focus-visible:outline-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t.reports.movementTrends}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
            {t.reports.noData}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="focus:outline-none focus-visible:outline-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {t.reports.movementTrends}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[300px]" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
                strokeOpacity={0.5}
              />
              <XAxis
                dataKey="dateLabel"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatNumber(value)}
                width={40}
              />
              <Tooltip
                content={
                  <CustomTooltip
                    isRTL={isRTL}
                    labels={{
                      stockIn: t.reports.stockIn,
                      stockOut: t.reports.stockOut,
                      adjustments: t.reports.adjustments,
                    }}
                  />
                }
              />
              <Legend
                content={
                  <CustomLegend
                    isRTL={isRTL}
                    labels={{
                      stockIn: t.reports.stockIn,
                      stockOut: t.reports.stockOut,
                      adjustments: t.reports.adjustments,
                    }}
                  />
                }
                verticalAlign="bottom"
              />
              <Area
                type="monotone"
                dataKey="in"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIn)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: '#10b981',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="out"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOut)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: '#ef4444',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
