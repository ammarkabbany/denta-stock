import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { authMiddleware } from '@/server/functions/auth'
import { FeatureGate } from '@/components/guards/feature-gate'

export const Route = createFileRoute('/_public')({
  loader: async ({ location }) => {
    const { currentUser } = await authMiddleware()

    // This app requires authentication - redirect to sign-in if not logged in
    if (!currentUser) {
      if (
        location.pathname !== '/sign-in' &&
        location.pathname !== '/sign-out'
      ) {
        throw redirect({ to: '/sign-in', search: { redirect: location.href } })
      }
    }

    return {
      currentUser,
    }
  },
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <FeatureGate>
      <Outlet />
    </FeatureGate>
  )
}
