import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/components/settings'

export const Route = createFileRoute('/_public/settings')({
  component: SettingsRoute,
})

function SettingsRoute() {
  return <SettingsPage />
}
