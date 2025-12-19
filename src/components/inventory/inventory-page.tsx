import { useState, useCallback, useMemo } from 'react'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout'
import { Button } from '@/components/ui/button'
import {
  InventoryFilters,
  InventoryList,
  ItemFormDialog,
  StockMovementDialog,
  DeleteItemDialog,
  ArchiveItemDialog,
  type StockStatus,
} from '@/components/inventory'
import { useLanguageContext } from '@/contexts/language-context'
import { useDebounce } from '@/hooks/use-debounce'
import {
  listInventoryItemsFn,
  listCategoriesFn,
  listUnitsFn,
  createInventoryItemFn,
  updateInventoryItemFn,
  deleteInventoryItemFn,
  archiveInventoryItemFn,
  createStockMovementFn,
} from '@/server/functions/inventory'
import type { InventoryItems } from '@/server/lib/appwrite.types'

export function InventoryPage() {
  const { t } = useLanguageContext()
  const queryClient = useQueryClient()

  // Filter state
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('all')
  const [status, setStatus] = useState<StockStatus>('all')

  // Debounce search for better performance
  const debouncedSearch = useDebounce(search, 300)

  // Dialog state
  const [itemFormOpen, setItemFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItems | null>(null)
  const [movementDialogOpen, setMovementDialogOpen] = useState(false)
  const [movementItem, setMovementItem] = useState<InventoryItems | null>(null)
  const [movementType, setMovementType] = useState<'in' | 'out'>('in')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<InventoryItems | null>(null)
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
  const [archivingItem, setArchivingItem] = useState<InventoryItems | null>(
    null,
  )

  // Queries - use debounced search value
  const {
    data: itemsData,
    isLoading: itemsLoading,
    refetch: refetchItems,
  } = useQuery({
    queryKey: [
      'inventory-items',
      { categoryId, status, search: debouncedSearch },
    ],
    queryFn: () =>
      listInventoryItemsFn({
        data: {
          categoryId: categoryId !== 'all' ? categoryId : undefined,
          status: status !== 'all' ? status : undefined,
          search: debouncedSearch || undefined,
        },
      }),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['inventory-categories'],
    queryFn: () => listCategoriesFn(),
  })

  const { data: unitsData } = useQuery({
    queryKey: ['inventory-units'],
    queryFn: () => listUnitsFn(),
  })

  const items = itemsData?.items ?? []
  const categories = categoriesData?.categories ?? []
  const units = unitsData?.units ?? []

  // Mutations
  const createItemMutation = useMutation({
    mutationFn: createInventoryItemFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      setItemFormOpen(false)
      setEditingItem(null)
      toast.success(t.common.success)
    },
    onError: (error: Error) => {
      toast.error(error.message || t.common.error)
    },
  })

  const updateItemMutation = useMutation({
    mutationFn: updateInventoryItemFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      setItemFormOpen(false)
      setEditingItem(null)
      toast.success(t.common.success)
    },
    onError: (error: Error) => {
      toast.error(error.message || t.common.error)
    },
  })

  const deleteItemMutation = useMutation({
    mutationFn: deleteInventoryItemFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      setDeleteDialogOpen(false)
      setDeletingItem(null)
      toast.success(t.common.success)
    },
    onError: (error: Error) => {
      toast.error(error.message || t.common.error)
    },
  })

  const archiveItemMutation = useMutation({
    mutationFn: archiveInventoryItemFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      setArchiveDialogOpen(false)
      setArchivingItem(null)
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

  // Handlers
  const handleAddItem = useCallback(() => {
    setEditingItem(null)
    setItemFormOpen(true)
  }, [])

  const handleEditItem = useCallback((item: InventoryItems) => {
    setEditingItem(item)
    setItemFormOpen(true)
  }, [])

  const handleDeleteItem = useCallback((item: InventoryItems) => {
    setDeletingItem(item)
    setDeleteDialogOpen(true)
  }, [])

  const handleArchiveItem = useCallback((item: InventoryItems) => {
    setArchivingItem(item)
    setArchiveDialogOpen(true)
  }, [])

  const handleStockIn = useCallback((item: InventoryItems) => {
    setMovementItem(item)
    setMovementType('in')
    setMovementDialogOpen(true)
  }, [])

  const handleStockOut = useCallback((item: InventoryItems) => {
    setMovementItem(item)
    setMovementType('out')
    setMovementDialogOpen(true)
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
      if (editingItem) {
        await updateItemMutation.mutateAsync({
          data: {
            id: editingItem.$id,
            name: data.name,
            sku: data.sku || null,
            categoryId: data.categoryId || null,
            description: data.description || null,
            unitId: data.unitId,
            lowStockThreshold: data.lowStockThreshold,
            costPerUnit: data.costPerUnit,
            location: data.location || null,
            notes: data.notes || null,
          },
        })
      } else {
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
      }
    },
    [editingItem, createItemMutation, updateItemMutation],
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

  const handleDeleteConfirm = useCallback(async () => {
    if (deletingItem) {
      await deleteItemMutation.mutateAsync({ data: { id: deletingItem.$id } })
    }
  }, [deletingItem, deleteItemMutation])

  const handleArchiveConfirm = useCallback(async () => {
    if (archivingItem) {
      await archiveItemMutation.mutateAsync({ data: { id: archivingItem.$id } })
    }
  }, [archivingItem, archiveItemMutation])

  const handleClearFilters = useCallback(() => {
    setSearch('')
    setCategoryId('all')
    setStatus('all')
  }, [])

  const hasActiveFilters = useMemo(
    () => search !== '' || categoryId !== 'all' || status !== 'all',
    [search, categoryId, status],
  )

  const movementUnit = movementItem
    ? units.find((u) => u.$id === movementItem.unitId)
    : null

  return (
    <AppShell title={t.inventory.title}>
      <div className="p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">{t.inventory.title}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetchItems()}
              disabled={itemsLoading}
            >
              <IconRefresh
                size={18}
                className={itemsLoading ? 'animate-spin' : ''}
              />
            </Button>
            <Button onClick={handleAddItem}>
              <IconPlus size={18} className="me-1" />
              {t.inventory.addItem}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <InventoryFilters
          search={search}
          onSearchChange={setSearch}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          status={status}
          onStatusChange={setStatus}
          categories={categories}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Items List */}
        <InventoryList
          items={items}
          categories={categories}
          units={units}
          isLoading={itemsLoading}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          onArchive={handleArchiveItem}
          onStockIn={handleStockIn}
          onStockOut={handleStockOut}
        />

        {/* Item Form Dialog */}
        <ItemFormDialog
          open={itemFormOpen}
          onOpenChange={setItemFormOpen}
          item={editingItem}
          categories={categories}
          units={units}
          onSubmit={handleItemFormSubmit}
          isLoading={
            createItemMutation.isPending || updateItemMutation.isPending
          }
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

        {/* Delete Confirmation Dialog */}
        <DeleteItemDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          item={deletingItem}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteItemMutation.isPending}
        />

        {/* Archive Confirmation Dialog */}
        <ArchiveItemDialog
          open={archiveDialogOpen}
          onOpenChange={setArchiveDialogOpen}
          item={archivingItem}
          onConfirm={handleArchiveConfirm}
          isLoading={archiveItemMutation.isPending}
        />
      </div>
    </AppShell>
  )
}
