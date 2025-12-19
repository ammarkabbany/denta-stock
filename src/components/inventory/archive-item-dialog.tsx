import { IconArchive } from '@tabler/icons-react'
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

interface ArchiveItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryItems | null
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export function ArchiveItemDialog({
  open,
  onOpenChange,
  item,
  onConfirm,
  isLoading,
}: ArchiveItemDialogProps) {
  const { t } = useLanguageContext()

  if (!item) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
              <IconArchive size={20} className="text-amber-600" />
            </div>
            <AlertDialogTitle>{t.inventory.archiveItem}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {t.inventory.archiveConfirm} <strong>{item.name}</strong>?
            <br />
            <span className="text-muted-foreground text-sm mt-1 block">
              {t.inventory.archiveDescription}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t.common.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-amber-600 text-white hover:bg-amber-700"
          >
            {isLoading ? t.common.loading : t.inventory.archiveItem}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
