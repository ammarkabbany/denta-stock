import { useState, useCallback } from 'react'
import { IconPlus, IconEdit, IconTrash, IconRuler } from '@tabler/icons-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { UnitFormDialog } from './unit-form-dialog'
import { DeleteConfirmDialog } from './delete-confirm-dialog'
import { useLanguageContext } from '@/contexts/language-context'
import {
  listUnitsFn,
  createUnitFn,
  updateUnitFn,
  deleteUnitFn,
} from '@/server/functions/inventory'
import type { InventoryUnits } from '@/server/lib/appwrite.types'

export function UnitsTab() {
  const { t, language } = useLanguageContext()
  const queryClient = useQueryClient()

  const [formOpen, setFormOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<InventoryUnits | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingUnit, setDeletingUnit] = useState<InventoryUnits | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['inventory-units'],
    queryFn: () => listUnitsFn(),
  })

  const units = data?.units ?? []

  const createMutation = useMutation({
    mutationFn: createUnitFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-units'] })
      setFormOpen(false)
      toast.success(t.common.success)
    },
    onError: (error: Error) => {
      toast.error(error.message || t.common.error)
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateUnitFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-units'] })
      setFormOpen(false)
      setEditingUnit(null)
      toast.success(t.common.success)
    },
    onError: (error: Error) => {
      toast.error(error.message || t.common.error)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUnitFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-units'] })
      setDeleteDialogOpen(false)
      setDeletingUnit(null)
      toast.success(t.common.success)
    },
    onError: (error: Error) => {
      toast.error(error.message || t.units.cannotDelete)
    },
  })

  const handleAdd = useCallback(() => {
    setEditingUnit(null)
    setFormOpen(true)
  }, [])

  const handleEdit = useCallback((unit: InventoryUnits) => {
    setEditingUnit(unit)
    setFormOpen(true)
  }, [])

  const handleDelete = useCallback((unit: InventoryUnits) => {
    setDeletingUnit(unit)
    setDeleteDialogOpen(true)
  }, [])

  const handleFormSubmit = useCallback(
    async (data: {
      name: string
      nameAr: string | null
      abbreviation: string
      abbreviationAr: string | null
    }) => {
      if (editingUnit) {
        await updateMutation.mutateAsync({
          data: { id: editingUnit.$id, ...data },
        })
      } else {
        await createMutation.mutateAsync({ data })
      }
    },
    [editingUnit, createMutation, updateMutation],
  )

  const handleDeleteConfirm = useCallback(() => {
    if (deletingUnit) {
      deleteMutation.mutate({ data: { id: deletingUnit.$id } })
    }
  }, [deletingUnit, deleteMutation])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{t.units.title}</h3>
        <Button size="sm" onClick={handleAdd}>
          <IconPlus size={16} className="me-1" />
          {t.units.addUnit}
        </Button>
      </div>

      {units.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-muted">
              <IconRuler size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {t.settings.noUnits}
            </p>
            <Button size="sm" variant="outline" onClick={handleAdd}>
              <IconPlus size={16} className="me-1" />
              {t.settings.addFirst} {t.units.title.toLowerCase()}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {units.map((unit) => (
            <Card key={unit.$id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/50">
                    <IconRuler
                      size={20}
                      className="text-secondary-foreground"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {language === 'ar' && unit.nameAr
                          ? unit.nameAr
                          : unit.name}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {language === 'ar' && unit.abbreviationAr
                          ? unit.abbreviationAr
                          : unit.abbreviation}
                      </Badge>
                    </div>
                    {language === 'ar' && unit.nameAr && (
                      <p className="text-xs text-muted-foreground">
                        {unit.name} ({unit.abbreviation})
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(unit)}
                  >
                    <IconEdit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(unit)}
                    className="text-destructive hover:text-destructive"
                  >
                    <IconTrash size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <UnitFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        unit={editingUnit}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t.units.deleteUnit}
        description={t.units.cannotDelete}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
