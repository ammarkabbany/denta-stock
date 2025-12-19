import { useState, useEffect } from 'react'
import { ResponsiveDialog } from '@/components/common/responsive-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguageContext } from '@/contexts/language-context'
import type { InventoryUnits } from '@/server/lib/appwrite.types'

interface UnitFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit: InventoryUnits | null
  onSubmit: (data: {
    name: string
    nameAr: string | null
    abbreviation: string
    abbreviationAr: string | null
  }) => Promise<void>
  isLoading?: boolean
}

export function UnitFormDialog({
  open,
  onOpenChange,
  unit,
  onSubmit,
  isLoading,
}: UnitFormDialogProps) {
  const { t } = useLanguageContext()
  const [name, setName] = useState('')
  const [nameAr, setNameAr] = useState('')
  const [abbreviation, setAbbreviation] = useState('')
  const [abbreviationAr, setAbbreviationAr] = useState('')

  useEffect(() => {
    if (unit) {
      setName(unit.name)
      setNameAr(unit.nameAr ?? '')
      setAbbreviation(unit.abbreviation)
      setAbbreviationAr(unit.abbreviationAr ?? '')
    } else {
      setName('')
      setNameAr('')
      setAbbreviation('')
      setAbbreviationAr('')
    }
  }, [unit, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !abbreviation.trim()) return

    await onSubmit({
      name: name.trim(),
      nameAr: nameAr.trim() || null,
      abbreviation: abbreviation.trim(),
      abbreviationAr: abbreviationAr.trim() || null,
    })
  }

  const isEditing = !!unit

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
        form="unit-form"
        disabled={isLoading || !name.trim() || !abbreviation.trim()}
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
      title={isEditing ? t.units.editUnit : t.units.addUnit}
      description={isEditing ? t.units.editUnit : t.units.addUnit}
      footer={footer}
    >
      <form id="unit-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.units.name}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pieces"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abbreviation">{t.units.abbreviation}</Label>
            <Input
              id="abbreviation"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              placeholder="e.g. pcs"
              required
              maxLength={10}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nameAr">
              {t.units.nameAr}{' '}
              <span className="text-muted-foreground text-xs">
                ({t.common.optional})
              </span>
            </Label>
            <Input
              id="nameAr"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مثال: قطعة"
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abbreviationAr">
              {t.units.abbreviationAr}{' '}
              <span className="text-muted-foreground text-xs">
                ({t.common.optional})
              </span>
            </Label>
            <Input
              id="abbreviationAr"
              value={abbreviationAr}
              onChange={(e) => setAbbreviationAr(e.target.value)}
              placeholder="مثال: قطعة"
              dir="rtl"
              maxLength={10}
            />
          </div>
        </div>
      </form>
    </ResponsiveDialog>
  )
}
