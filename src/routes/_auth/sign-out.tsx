import { signOutFn } from '@/server/functions/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/sign-out')({
  beforeLoad: async () => {
    await signOutFn()
    // Use window.location.href to ensure a full page reload and clear all client state
    window.location.href = '/'
    // We still return a redirect as a fallback/type requirement, though accessible code won't reach here
    throw redirect({ to: '/' })
  },
})
