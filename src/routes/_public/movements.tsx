import { createFileRoute } from '@tanstack/react-router'
import { MovementsPage } from '@/components/movements'

export const Route = createFileRoute('/_public/movements')({
  component: MovementsRoute,
})

function MovementsRoute() {
  return <MovementsPage />
}
