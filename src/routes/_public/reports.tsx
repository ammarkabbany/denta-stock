import { createFileRoute } from '@tanstack/react-router'
import { ReportsPage } from '@/components/reports'

export const Route = createFileRoute('/_public/reports')({
  component: ReportsRoute,
})

function ReportsRoute() {
  return <ReportsPage />
}
