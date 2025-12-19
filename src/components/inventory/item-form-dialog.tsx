import { useState, useEffect } from 'react'
import { IconPlus } from '@tabler/icons-react'
import { ResponsiveDialog } from '@/components/common/responsive-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLanguageContext } from '@/contexts/language-context'
import type {
  InventoryItems,
  InventoryCategories,
  InventoryUnits,
} from '@/server/lib/appwrite.types'

interface ItemFormData {
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
}

interface ItemFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: InventoryItems | null
  categories: InventoryCategories[]
  units: InventoryUnits[]
  onSubmit: (data: ItemFormData) => Promise<void>
  isLoading?: boolean
}

const initialFormData: ItemFormData = {
  name: '',
  sku: '',
  categoryId: '',
  description: '',
  unitId: '',
  currentStock: 0,
  lowStockThreshold: null,
  costPerUnit: null,
  location: '',
  notes: '',
}

export function ItemFormDialog({
  open,
  onOpenChange,
  item,
  categories,
  units,
  onSubmit,
  isLoading,
}: ItemFormDialogProps) {
  const { t, language } = useLanguageContext()
  const [formData, setFormData] = useState<ItemFormData>(initialFormData)
  const [errors, setErrors] = useState<
    Partial<Record<keyof ItemFormData, string>>
  >({})

  const isEditing = !!item

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        sku: item.sku ?? '',
        categoryId: item.categoryId ?? '',
        description: item.description ?? '',
        unitId: item.unitId,
        currentStock: item.currentStock,
        lowStockThreshold: item.lowStockThreshold,
        costPerUnit: item.costPerUnit,
        location: item.location ?? '',
        notes: item.notes ?? '',
      })
    } else {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [item, open])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ItemFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = t.errors.required
    }

    if (!formData.unitId) {
      newErrors.unitId = t.errors.required
    }

    if (formData.currentStock < 0) {
      newErrors.currentStock = t.errors.negativeStock
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    await onSubmit(formData)
  }

  const updateField = <K extends keyof ItemFormData>(
    field: K,
    value: ItemFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

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
        form="item-form"
        disabled={isLoading}
        className="flex-1 sm:flex-none"
      >
        {isLoading ? (
          t.common.loading
        ) : (
          <>
            <IconPlus size={18} className="me-1" />
            {isEditing ? t.common.save : t.common.add}
          </>
        )}
      </Button>
    </div>
  )

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? t.inventory.editItem : t.inventory.addItem}
      description={isEditing ? t.inventory.editItem : t.inventory.addItem}
      footer={footer}
    >
      <form id="item-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            {t.inventory.name} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder={t.inventory.name}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* SKU */}
        <div className="space-y-2">
          <Label htmlFor="sku">
            {t.inventory.sku}{' '}
            <span className="text-muted-foreground text-xs">
              ({t.common.optional})
            </span>
          </Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => updateField('sku', e.target.value)}
            placeholder="ABC-123"
          />
        </div>

        {/* Category & Unit Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Category */}
          <div className="space-y-2">
            <Label>{t.inventory.category}</Label>
            <Select
              value={formData.categoryId || 'none'}
              onValueChange={(v) =>
                updateField('categoryId', v === 'none' ? '' : v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t.inventory.category} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.$id} value={cat.$id}>
                    {language === 'ar' && cat.nameAr ? cat.nameAr : cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Unit */}
          <div className="space-y-2">
            <Label>
              {t.inventory.unit} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.unitId}
              onValueChange={(v) => updateField('unitId', v)}
            >
              <SelectTrigger
                className={errors.unitId ? 'border-destructive' : ''}
              >
                <SelectValue placeholder={t.inventory.unit} />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.$id} value={unit.$id}>
                    {language === 'ar' && unit.nameAr ? unit.nameAr : unit.name}{' '}
                    (
                    {language === 'ar' && unit.abbreviationAr
                      ? unit.abbreviationAr
                      : unit.abbreviation}
                    )
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.unitId && (
              <p className="text-sm text-destructive">{errors.unitId}</p>
            )}
          </div>
        </div>

        {/* Stock & Threshold Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Current Stock - only for new items */}
          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="currentStock">{t.inventory.currentStock}</Label>
              <Input
                id="currentStock"
                type="number"
                min={0}
                value={formData.currentStock}
                onChange={(e) =>
                  updateField('currentStock', parseInt(e.target.value) || 0)
                }
                className={errors.currentStock ? 'border-destructive' : ''}
              />
              {errors.currentStock && (
                <p className="text-sm text-destructive">
                  {errors.currentStock}
                </p>
              )}
            </div>
          )}

          {/* Low Stock Threshold */}
          <div className="space-y-2">
            <Label htmlFor="lowStockThreshold">
              {t.inventory.lowStockThreshold}
            </Label>
            <Input
              id="lowStockThreshold"
              type="number"
              min={0}
              value={formData.lowStockThreshold ?? ''}
              onChange={(e) =>
                updateField(
                  'lowStockThreshold',
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
              placeholder="0"
            />
          </div>

          {/* Cost per Unit */}
          <div className="space-y-2">
            <Label htmlFor="costPerUnit">{t.inventory.costPerUnit}</Label>
            <Input
              id="costPerUnit"
              type="number"
              min={0}
              step={0.01}
              value={formData.costPerUnit ?? ''}
              onChange={(e) =>
                updateField(
                  'costPerUnit',
                  e.target.value ? parseFloat(e.target.value) : null,
                )
              }
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">{t.inventory.location}</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder={t.inventory.location}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">{t.inventory.description}</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder={t.inventory.description}
            rows={2}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">{t.inventory.notes}</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder={t.inventory.notes}
            rows={2}
          />
        </div>
      </form>
    </ResponsiveDialog>
  )
}
