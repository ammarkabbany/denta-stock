import { useState, useEffect } from 'react'
import { ResponsiveDialog } from '@/components/common/responsive-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguageContext } from '@/contexts/language-context'
import type { InventoryCategories } from '@/server/lib/appwrite.types'

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: InventoryCategories | null
  onSubmit: (data: { name: string; nameAr: string | null }) => Promise<void>
  isLoading?: boolean
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSubmit,
  isLoading,
}: CategoryFormDialogProps) {
  const { t } = useLanguageContext()
  const [name, setName] = useState('')
  const [nameAr, setNameAr] = useState('')

  useEffect(() => {
    if (category) {
      setName(category.name)
      setNameAr(category.nameAr ?? '')
    } else {
      setName('')
      setNameAr('')
    }
  }, [category, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    await onSubmit({
      name: name.trim(),
      nameAr: nameAr.trim() || null,
    })
  }

  const isEditing = !!category

  const footer = (
    <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
      <Button
        type="button"
        variant="outline"
        onClick={() => onOpenChange(false)}
        disabled={isLoading}
        className="flex-1 sm:flex-none"
      >
        {t.common.cancel}
      </Button>
      <Button
        type="submit"
        form="category-form"
        disabled={isLoading || !name.trim()}
        className="flex-1 sm:flex-none"
      >
        {isLoading ? t.common.loading : t.common.save}
      </Button>
    </div>
  )

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? t.categories.editCategory : t.categories.addCategory}
      description={
        isEditing ? t.categories.editCategory : t.categories.addCategory
      }
      footer={footer}
    >
      <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t.categories.name}</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. CAD/CAM Blocks"
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nameAr">
            {t.categories.nameAr}{' '}
            <span className="text-muted-foreground text-xs">
              ({t.common.optional})
            </span>
          </Label>
          <Input
            id="nameAr"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            placeholder="مثال: كتل CAD/CAM"
            dir="rtl"
          />
        </div>
      </form>
    </ResponsiveDialog>
  )
}
