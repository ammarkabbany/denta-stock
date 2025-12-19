import { createFileRoute } from '@tanstack/react-router'
import { InventoryPage } from '@/components/inventory/inventory-page'

export const Route = createFileRoute('/_public/inventory')({
  component: InventoryRoute,
})

function InventoryRoute() {
  return <InventoryPage />
}
