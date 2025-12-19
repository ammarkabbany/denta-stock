import { useState, useEffect } from 'react'
import {
  IconArrowUp,
  IconArrowDown,
  IconAdjustments,
} from '@tabler/icons-react'
import { ResponsiveDialog } from '@/components/common/responsive-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguageContext } from '@/contexts/language-context'
import { formatNumber } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type {
  InventoryItems,
  InventoryUnits,
} from '@/server/lib/appwrite.types'

type MovementType = 'in' | 'out' | 'adjust'

interface StockMovementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryItems | null
  unit?: InventoryUnits | null
  defaultType?: MovementType
  onSubmit: (data: {
    itemId: string
    type: MovementType
    quantity: number
    reason: string | null
    notes: string | null
  }) => Promise<void>
  isLoading?: boolean
}

export function StockMovementDialog({
  open,
  onOpenChange,
  item,
  unit,
  defaultType = 'in',
  onSubmit,
  isLoading,
}: StockMovementDialogProps) {
  const { t, language } = useLanguageContext()
  const [type, setType] = useState<MovementType>(defaultType)
  const [quantity, setQuantity] = useState<number>(1)
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setType(defaultType)
      setQuantity(1)
      setReason('')
      setNotes('')
      setError(null)
    }
  }, [open, defaultType])

  if (!item) return null

  const unitDisplay =
    language === 'ar' && unit?.abbreviationAr
      ? unit.abbreviationAr
      : (unit?.abbreviation ?? '')

  const calculateNewStock = (): number => {
    switch (type) {
      case 'in':
        return item.currentStock + quantity
      case 'out':
        return item.currentStock - quantity
      case 'adjust':
        return quantity
      default:
        return item.currentStock
    }
  }

  const newStock = calculateNewStock()

  const validate = (): boolean => {
    if (quantity < 1) {
      setError(t.errors.required)
      return false
    }

    if (type === 'out' && quantity > item.currentStock) {
      setError(t.errors.insufficientStock)
      return false
    }

    if (type === 'adjust' && quantity < 0) {
      setError(t.errors.negativeStock)
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    await onSubmit({
      itemId: item.$id,
      type,
      quantity,
      reason: reason.trim() || null,
      notes: notes.trim() || null,
    })
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
        form="movement-form"
        disabled={isLoading}
        className={cn(
          'flex-1 sm:flex-none',
          type === 'in' && 'bg-emerald-600 hover:bg-emerald-700',
          type === 'out' && 'bg-red-600 hover:bg-red-700',
          type === 'adjust' && 'bg-blue-600 hover:bg-blue-700',
        )}
      >
        {isLoading ? t.common.loading : t.common.confirm}
      </Button>
    </div>
  )

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t.movements.addMovement}
      description={item.name}
      footer={footer}
    >
      <form id="movement-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Movement Type Tabs */}
        <Tabs value={type} onValueChange={(v) => setType(v as MovementType)}>
          <TabsList className="grid w-full grid-cols-3">
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

        {/* Current Stock Display */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">
            {t.movements.previousStock}
          </span>
          <span className="font-semibold">
            {formatNumber(item.currentStock)} {unitDisplay}
          </span>
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <Label htmlFor="quantity">
            {type === 'adjust' ? t.movements.newStock : t.movements.quantity}{' '}
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="quantity"
            type="number"
            min={type === 'adjust' ? 0 : 1}
            max={type === 'out' ? item.currentStock : undefined}
            value={quantity}
            onChange={(e) => {
              setQuantity(parseInt(e.target.value) || 0)
              setError(null)
            }}
            className={cn('text-lg', error ? 'border-destructive' : '')}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {/* New Stock Preview */}
        <div
          className={cn(
            'flex items-center justify-between p-3 rounded-lg',
            type === 'in' && 'bg-emerald-50',
            type === 'out' && 'bg-red-50',
            type === 'adjust' && 'bg-blue-50',
          )}
        >
          <span className="text-sm text-muted-foreground">
            {t.movements.newStock}
          </span>
          <span
            className={cn(
              'font-bold text-lg',
              type === 'in' && 'text-emerald-600',
              type === 'out' && 'text-red-600',
              type === 'adjust' && 'text-blue-600',
            )}
          >
            {formatNumber(Math.max(0, newStock))} {unitDisplay}
          </span>
        </div>

        {/* Reason */}
        <div className="space-y-2">
          <Label htmlFor="reason">{t.movements.reason}</Label>
          <Input
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t.movements.reason}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">{t.inventory.notes}</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t.inventory.notes}
            rows={2}
          />
        </div>
      </form>
    </ResponsiveDialog>
  )
}
