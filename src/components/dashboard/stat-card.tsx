import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: 'default' | 'warning' | 'danger' | 'success'
  className?: string
  isLoading?: boolean
}

const variantStyles = {
  default: {
    icon: 'bg-primary/10 text-primary',
    trend: 'text-muted-foreground',
  },
  warning: {
    icon: 'bg-warning/10 text-warning-foreground',
    trend: 'text-warning-foreground',
  },
  danger: {
    icon: 'bg-destructive/10 text-destructive',
    trend: 'text-destructive',
  },
  success: {
    icon: 'bg-success/10 text-success-foreground',
    trend: 'text-success-foreground',
  },
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  variant = 'default',
  className,
  isLoading,
}: StatCardProps) {
  const styles = variantStyles[variant]

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-tight">
              {title}
            </p>
            {isLoading ? (
              <Skeleton className="h-7 sm:h-8 w-16 mt-1" />
            ) : (
              <p className="text-xl sm:text-2xl font-bold mt-1 break-words">
                {value}
              </p>
            )}
            {trend && !isLoading && (
              <p
                className={cn(
                  'text-xs mt-1',
                  trend.isPositive
                    ? 'text-success-foreground'
                    : 'text-destructive',
                )}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </p>
            )}
          </div>
          <div
            className={cn(
              'flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg shrink-0',
              styles.icon,
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
