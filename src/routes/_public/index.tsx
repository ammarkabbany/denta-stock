import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/')({
  component: Index,
})

function Index() {
  return <DashboardPage />
}
