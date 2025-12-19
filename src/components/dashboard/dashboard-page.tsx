import { useState, useCallback } from 'react'
import {
  IconPackage,
  IconAlertTriangle,
  IconPackageOff,
  IconCurrencyDollar,
} from '@tabler/icons-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout'
import {
  StatCard,
  LowStockAlert,
  RecentMovements,
  QuickActions,
} from '@/components/dashboard'
import {
  StockMovementDialog,
  ItemFormDialog,
  ItemSelectorDialog,
} from '@/components/inventory'
import { UnitFormDialog } from '@/components/settings'
import { useLanguageContext } from '@/contexts/language-context'
import { formatCurrency } from '@/lib/currency'
import { formatNumber } from '@/lib/i18n'
import {
  getDashboardStatsFn,
  listInventoryItemsFn,
  listCategoriesFn,
  listUnitsFn,
  createInventoryItemFn,
  createStockMovementFn,
  createUnitFn,
} from '@/server/functions/inventory'
import type { InventoryItems } from '@/server/lib/appwrite.types'

export function DashboardPage() {
  const { t, language } = useLanguageContext()
  const queryClient = useQueryClient()
  const [currency] = useState<'EGP'>('EGP') // Will come from team settings

  // Dialog state
  const [itemFormOpen, setItemFormOpen] = useState(false)
  const [unitFormOpen, setUnitFormOpen] = useState(false)
  const [movementDialogOpen, setMovementDialogOpen] = useState(false)
  const [movementItem, setMovementItem] = useState<InventoryItems | null>(null)
  const [movementType, setMovementType] = useState<'in' | 'out'>('in')
  const [itemSelectorOpen, setItemSelectorOpen] = useState(false)
  const [pendingMovementType, setPendingMovementType] = useState<'in' | 'out'>(
    'in',
  )

  // Queries
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getDashboardStatsFn(),
  })

  const { data: itemsData } = useQuery({
    queryKey: ['inventory-items-all'],
    queryFn: () => listInventoryItemsFn({ data: { archived: false } }),
  })

  // Also fetch archived items for looking up item names in movements
  const { data: archivedItemsData } = useQuery({
    queryKey: ['inventory-items-archived'],
    queryFn: () => listInventoryItemsFn({ data: { archived: true } }),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['inventory-categories'],
    queryFn: () => listCategoriesFn(),
  })

  const { data: unitsData } = useQuery({
    queryKey: ['inventory-units'],
    queryFn: () => listUnitsFn(),
  })

  const stats = dashboardData?.stats ?? {
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  }

  const items = itemsData?.items ?? []
  const archivedItems = archivedItemsData?.items ?? []
  const allItems = [...items, ...archivedItems]
  const categories = categoriesData?.categories ?? []
  const units = unitsData?.units ?? []

  // Get low stock items with enriched data
  const lowStockItems = (dashboardData?.lowStockItems ?? []).map((item) => {
    const unit = units.find((u) => u.$id === item.unitId)
    const category = item.categoryId
      ? categories.find((c) => c.$id === item.categoryId)
      : null
    return {
      id: item.$id,
      name: item.name,
      currentStock: item.currentStock,
      lowStockThreshold: item.lowStockThreshold ?? 0,
      unitAbbreviation:
        language === 'ar' && unit?.abbreviationAr
          ? unit.abbreviationAr
          : (unit?.abbreviation ?? ''),
      categoryName:
        language === 'ar' && category?.nameAr
          ? category.nameAr
          : (category?.name ?? ''),
    }
  })

  // Get recent movements with enriched data (including archived items)
  const recentMovements = (dashboardData?.recentMovements ?? []).map(
    (movement) => {
      const item = allItems.find((i) => i.$id === movement.itemId)
      return {
        id: movement.$id,
        itemName: item?.name ?? t.errors.itemNotFound,
        isArchived: item?.archived ?? false,
        type: movement.type,
        quantity: movement.quantity,
        previousStock: movement.previousStock,
        newStock: movement.newStock,
        reason: movement.reason,
        createdAt: movement.$createdAt,
        createdByName: '', // Would need user lookup
      }
    },
  )

  // Mutations
  const createItemMutation = useMutation({
    mutationFn: createInventoryItemFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-items-all'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      setItemFormOpen(false)
      toast.success(t.common.success)
    },
    onError: (error: Error) => {
      toast.error(error.message || t.common.error)
    },
  })

  const createMovementMutation = useMutation({
    mutationFn: createStockMovementFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-items-all'] })
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      setMovementDialogOpen(false)
      setMovementItem(null)
      toast.success(t.common.success)
    },
    onError: (error: Error) => {
      toast.error(error.message || t.common.error)
    },
  })

  const createUnitMutation = useMutation({
    mutationFn: createUnitFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-units'] })
      setUnitFormOpen(false)
      toast.success(t.common.success)
    },
    onError: (error: Error) => {
      toast.error(error.message || t.common.error)
    },
  })

  // Handlers
  const handleStockIn = useCallback(() => {
    if (items.length === 0) {
      toast.error(t.inventory.noItems)
      return
    }
    setPendingMovementType('in')
    setItemSelectorOpen(true)
  }, [items, t])

  const handleStockOut = useCallback(() => {
    if (items.length === 0) {
      toast.error(t.inventory.noItems)
      return
    }
    setPendingMovementType('out')
    setItemSelectorOpen(true)
  }, [items, t])

  const handleItemSelect = useCallback(
    (item: InventoryItems) => {
      setMovementItem(item)
      setMovementType(pendingMovementType)
      setItemSelectorOpen(false)
      setMovementDialogOpen(true)
    },
    [pendingMovementType],
  )

  const handleAddItem = useCallback(() => {
    setItemFormOpen(true)
  }, [])

  const handleAddUnit = useCallback(() => {
    setUnitFormOpen(true)
  }, [])

  const handleItemFormSubmit = useCallback(
    async (data: {
      name: string
      sku: string
      categoryId: string
      description: string
      unitId: string
      currentStock: number
      lowStockThreshold: number | null
      costPerUnit: number | null
      location: string
      notes: string
    }) => {
      await createItemMutation.mutateAsync({
        data: {
          name: data.name,
          sku: data.sku || null,
          categoryId: data.categoryId || null,
          description: data.description || null,
          unitId: data.unitId,
          currentStock: data.currentStock,
          lowStockThreshold: data.lowStockThreshold,
          costPerUnit: data.costPerUnit,
          location: data.location || null,
          notes: data.notes || null,
        },
      })
    },
    [createItemMutation],
  )

  const handleMovementSubmit = useCallback(
    async (data: {
      itemId: string
      type: 'in' | 'out' | 'adjust'
      quantity: number
      reason: string | null
      notes: string | null
    }) => {
      await createMovementMutation.mutateAsync({ data })
    },
    [createMovementMutation],
  )

  const handleUnitFormSubmit = useCallback(
    async (data: {
      name: string
      nameAr: string | null
      abbreviation: string
      abbreviationAr: string | null
    }) => {
      await createUnitMutation.mutateAsync({ data })
    },
    [createUnitMutation],
  )

  const movementUnit = movementItem
    ? units.find((u) => u.$id === movementItem.unitId)
    : null

  return (
    <AppShell title={t.dashboard.title}>
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            title={t.dashboard.totalItems}
            value={formatNumber(stats.totalItems)}
            icon={<IconPackage size={20} />}
            variant="default"
            isLoading={dashboardLoading}
          />
          <StatCard
            title={t.dashboard.lowStock}
            value={formatNumber(stats.lowStock)}
            icon={<IconAlertTriangle size={20} />}
            variant="warning"
            isLoading={dashboardLoading}
          />
          <StatCard
            title={t.dashboard.outOfStock}
            value={formatNumber(stats.outOfStock)}
            icon={<IconPackageOff size={20} />}
            variant="danger"
            isLoading={dashboardLoading}
          />
          <StatCard
            title={t.dashboard.totalValue}
            value={formatCurrency(stats.totalValue, currency, language, {
              compact: true,
            })}
            icon={<IconCurrencyDollar size={20} />}
            variant="success"
            isLoading={dashboardLoading}
          />
        </div>

        {/* Quick Actions - Mobile prominent */}
        <div className="md:hidden">
          <QuickActions
            onStockIn={handleStockIn}
            onStockOut={handleStockOut}
            onAddItem={handleAddItem}
            onAddUnit={handleAddUnit}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Low Stock Alerts */}
          <div className="lg:col-span-1">
            <LowStockAlert items={lowStockItems} isLoading={dashboardLoading} />
          </div>

          {/* Recent Movements */}
          <div className="lg:col-span-2">
            <RecentMovements
              movements={recentMovements}
              isLoading={dashboardLoading}
            />
          </div>
        </div>

        {/* Quick Actions - Desktop */}
        <div className="hidden md:block">
          <QuickActions
            onStockIn={handleStockIn}
            onStockOut={handleStockOut}
            onAddItem={handleAddItem}
            onAddUnit={handleAddUnit}
          />
        </div>
      </div>

      {/* Item Selector Dialog */}
      <ItemSelectorDialog
        open={itemSelectorOpen}
        onOpenChange={setItemSelectorOpen}
        items={items}
        units={units}
        onSelect={handleItemSelect}
        title={
          pendingMovementType === 'in'
            ? t.movements.stockIn
            : t.movements.stockOut
        }
      />

      {/* Item Form Dialog */}
      <ItemFormDialog
        open={itemFormOpen}
        onOpenChange={setItemFormOpen}
        item={null}
        categories={categories}
        units={units}
        onSubmit={handleItemFormSubmit}
        isLoading={createItemMutation.isPending}
      />

      {/* Unit Form Dialog */}
      <UnitFormDialog
        open={unitFormOpen}
        onOpenChange={setUnitFormOpen}
        unit={null}
        onSubmit={handleUnitFormSubmit}
        isLoading={createUnitMutation.isPending}
      />

      {/* Stock Movement Dialog */}
      <StockMovementDialog
        open={movementDialogOpen}
        onOpenChange={setMovementDialogOpen}
        item={movementItem}
        unit={movementUnit}
        defaultType={movementType}
        onSubmit={handleMovementSubmit}
        isLoading={createMovementMutation.isPending}
      />
    </AppShell>
  )
}
