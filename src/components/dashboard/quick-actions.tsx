import {
  IconPlus,
  IconArrowDown,
  IconArrowUp,
  IconRuler,
} from '@tabler/icons-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguageContext } from '@/contexts/language-context'
import { cn } from '@/lib/utils'

interface QuickActionsProps {
  className?: string
  onStockIn?: () => void
  onStockOut?: () => void
  onAddItem?: () => void
  onAddUnit?: () => void
}

export function QuickActions({
  className,
  onStockIn,
  onStockOut,
  onAddItem,
  onAddUnit,
}: QuickActionsProps) {
  const { t } = useLanguageContext()

  const actions = [
    {
      label: t.movements.stockIn,
      icon: IconArrowDown,
      onClick: onStockIn,
      variant: 'default' as const,
      className: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    {
      label: t.movements.stockOut,
      icon: IconArrowUp,
      onClick: onStockOut,
      variant: 'default' as const,
      className: 'bg-red-600 hover:bg-red-700 text-white',
    },
    {
      label: t.inventory.addItem,
      icon: IconPlus,
      onClick: onAddItem,
      variant: 'default' as const,
      className: 'bg-primary hover:bg-primary/90',
    },
    {
      label: t.units.addUnit,
      icon: IconRuler,
      onClick: onAddUnit,
      variant: 'default' as const,
      className: 'bg-zinc-600 hover:bg-zinc-700 text-white',
    },
  ]

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          {t.dashboard.quickActions}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.label}
                variant={action.variant}
                className={cn(
                  'flex flex-col items-center gap-1.5 h-auto py-3 px-2',
                  action.className,
                )}
                onClick={action.onClick}
              >
                <Icon size={20} />
                <span className="text-xs font-medium text-center leading-tight whitespace-nowrap">
                  {action.label}
                </span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
