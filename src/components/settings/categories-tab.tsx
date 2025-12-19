import { useState, useCallback } from 'react'
import { IconPlus, IconEdit, IconTrash, IconFolder } from '@tabler/icons-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CategoryFormDialog } from './category-form-dialog'
import { DeleteConfirmDialog } from './delete-confirm-dialog'
import { useLanguageContext } from '@/contexts/language-context'
import {
  listCategoriesFn,
  createCategoryFn,
  updateCategoryFn,
  deleteCategoryFn,
} from '@/server/functions/inventory'
import type { InventoryCategories } from '@/server/lib/appwrite.types'

export function CategoriesTab() {
  const { t, language } = useLanguageContext()
  const queryClient = useQueryClient()

  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] =
    useState<InventoryCategories | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] =
    useState<InventoryCategories | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['inventory-categories'],
    queryFn: () => listCategoriesFn(),
  })

  const categories = data?.categories ?? []

  const createMutation = useMutation({
    mutationFn: createCategoryFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] })
      setFormOpen(false)
      toast.success(t.common.success)
    },
    onError: (error: Error) => {
      toast.error(error.message || t.common.error)
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateCategoryFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] })
      setFormOpen(false)
      setEditingCategory(null)
      toast.success(t.common.success)
    },
    onError: (error: Error) => {
      toast.error(error.message || t.common.error)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] })
      setDeleteDialogOpen(false)
      setDeletingCategory(null)
      toast.success(t.common.success)
    },
    onError: (error: Error) => {
      toast.error(error.message || t.categories.cannotDelete)
    },
  })

  const handleAdd = useCallback(() => {
    setEditingCategory(null)
    setFormOpen(true)
  }, [])

  const handleEdit = useCallback((category: InventoryCategories) => {
    setEditingCategory(category)
    setFormOpen(true)
  }, [])

  const handleDelete = useCallback((category: InventoryCategories) => {
    setDeletingCategory(category)
    setDeleteDialogOpen(true)
  }, [])

  const handleFormSubmit = useCallback(
    async (data: { name: string; nameAr: string | null }) => {
      if (editingCategory) {
        await updateMutation.mutateAsync({
          data: { id: editingCategory.$id, ...data },
        })
      } else {
        await createMutation.mutateAsync({ data })
      }
    },
    [editingCategory, createMutation, updateMutation],
  )

  const handleDeleteConfirm = useCallback(() => {
    if (deletingCategory) {
      deleteMutation.mutate({ data: { id: deletingCategory.$id } })
    }
  }, [deletingCategory, deleteMutation])

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
        <h3 className="font-medium">{t.categories.title}</h3>
        <Button size="sm" onClick={handleAdd}>
          <IconPlus size={16} className="me-1" />
          {t.categories.addCategory}
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-muted">
              <IconFolder size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {t.settings.noCategories}
            </p>
            <Button size="sm" variant="outline" onClick={handleAdd}>
              <IconPlus size={16} className="me-1" />
              {t.settings.addFirst} {t.categories.title.toLowerCase()}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <Card key={category.$id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <IconFolder size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {language === 'ar' && category.nameAr
                        ? category.nameAr
                        : category.name}
                    </p>
                    {language === 'ar' && category.nameAr && (
                      <p className="text-xs text-muted-foreground">
                        {category.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(category)}
                  >
                    <IconEdit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category)}
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

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t.categories.deleteCategory}
        description={t.categories.cannotDelete}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
