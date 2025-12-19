import { IconAlertTriangle } from '@tabler/icons-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useLanguageContext } from '@/contexts/language-context'
import type { InventoryItems } from '@/server/lib/appwrite.types'

interface DeleteItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryItems | null
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export function DeleteItemDialog({
  open,
  onOpenChange,
  item,
  onConfirm,
  isLoading,
}: DeleteItemDialogProps) {
  const { t } = useLanguageContext()

  if (!item) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
              <IconAlertTriangle size={20} className="text-destructive" />
            </div>
            <AlertDialogTitle>{t.inventory.deleteItem}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {t.common.confirm} <strong>{item.name}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t.common.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? t.common.loading : t.common.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
