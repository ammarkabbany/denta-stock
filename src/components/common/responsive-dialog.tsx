import * as React from 'react'
import { IconX } from '@tabler/icons-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

interface ResponsiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          {/* Fixed Header */}
          <DrawerHeader className="border-b bg-background sticky top-0 z-10 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <DrawerTitle className="text-lg font-semibold truncate">
                  {title}
                </DrawerTitle>
                {description && (
                  <DrawerDescription className="text-sm text-muted-foreground mt-1 truncate">
                    {description}
                  </DrawerDescription>
                )}
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="shrink-0 -me-2">
                  <IconX size={20} />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1 overflow-auto">
            <div className={cn('px-4 py-4', className)}>{children}</div>
          </ScrollArea>

          {/* Fixed Footer */}
          {footer && (
            <DrawerFooter className="border-t bg-background sticky bottom-0 z-10 pt-4">
              {footer}
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn('max-w-lg max-h-[90vh] flex flex-col', className)}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-2">{children}</div>
        {footer && (
          <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Export sub-components for custom layouts
export { DrawerClose } from '@/components/ui/drawer'
