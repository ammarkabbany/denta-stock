import { useState } from 'react'
import {
  IconRefresh,
  IconArrowUp,
  IconArrowDown,
  IconAdjustments,
  IconHistory,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { AppShell } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { MovementListItem } from './movement-list-item'
import { useLanguageContext } from '@/contexts/language-context'
import {
  listStockMovementsFn,
  listInventoryItemsFn,
  listUnitsFn,
} from '@/server/functions/inventory'

type MovementFilter = 'all' | 'in' | 'out' | 'adjust'

export function MovementsPage() {
  const { t } = useLanguageContext()
  const [filter, setFilter] = useState<MovementFilter>('all')

  // Queries
  const {
    data: movementsData,
    isLoading: movementsLoading,
    refetch: refetchMovements,
  } = useQuery({
    queryKey: ['stock-movements', { type: filter }],
    queryFn: () =>
      listStockMovementsFn({
        data: {
          type: filter !== 'all' ? filter : undefined,
          limit: 100,
        },
      }),
  })

  // Fetch all items including archived to properly display item names
  const { data: activeItemsData } = useQuery({
    queryKey: ['inventory-items-all'],
    queryFn: () => listInventoryItemsFn({ data: { archived: false } }),
  })

  const { data: archivedItemsData } = useQuery({
    queryKey: ['inventory-items-archived'],
    queryFn: () => listInventoryItemsFn({ data: { archived: true } }),
  })

  const { data: unitsData } = useQuery({
    queryKey: ['inventory-units'],
    queryFn: () => listUnitsFn(),
  })

  const movements = movementsData?.movements ?? []
  // Combine active and archived items for lookup
  const allItems = [
    ...(activeItemsData?.items ?? []),
    ...(archivedItemsData?.items ?? []),
  ]
  const units = unitsData?.units ?? []

  const getItemById = (id: string) => allItems.find((i) => i.$id === id)
  const getUnitById = (id: string) => units.find((u) => u.$id === id)

  return (
    <AppShell title={t.movements.title}>
      <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">{t.movements.title}</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetchMovements()}
            disabled={movementsLoading}
          >
            <IconRefresh
              size={18}
              className={movementsLoading ? 'animate-spin' : ''}
            />
          </Button>
        </div>

        {/* Filter Tabs */}
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as MovementFilter)}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              <IconHistory size={16} className="me-1" />
              {t.common.all}
            </TabsTrigger>
            <TabsTrigger
              value="in"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
            >
              <IconArrowUp size={16} className="me-1" />
              {t.movements.in}
            </TabsTrigger>
            <TabsTrigger
              value="out"
              className="data-[state=active]:bg-red-100 data-[state=active]:text-red-700"
            >
              <IconArrowDown size={16} className="me-1" />
              {t.movements.out}
            </TabsTrigger>
            <TabsTrigger
              value="adjust"
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
            >
              <IconAdjustments size={16} className="me-1" />
              {t.movements.adjust}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Movements List */}
        {movementsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : movements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-muted">
              <IconHistory size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">
              {t.dashboard.noMovements}
            </h3>
          </div>
        ) : (
          <div className="space-y-3">
            {movements.map((movement) => {
              const item = getItemById(movement.itemId)
              const unit = item ? getUnitById(item.unitId) : null
              return (
                <MovementListItem
                  key={movement.$id}
                  movement={movement}
                  item={item}
                  unit={unit}
                />
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
