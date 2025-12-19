'use client'

import { createContext, useContext, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { UserModel, TeamWithPlan } from '@/types/user-model'
import { getCurrentUser, getCurrentTeam } from '@/server/functions/access'
import { useLanguageContext } from './language-context'

type AccessContextValue = {
  user: UserModel | null
  currentTeam: TeamWithPlan | null
  isLoading: boolean
  isAuthenticated: boolean
  hasPermission: (perm: string) => boolean
  hasFeature: (keyOrId: string) => boolean
  isFeatureInactive: (keyOrId: string) => boolean
  isOnTrial: () => boolean
  isTrialExpired: () => boolean
  isPlanExpired: () => boolean
  isTrialAboutToExpire: () => boolean
  isPlanAboutToExpire: () => boolean
}

const AccessContext = createContext<AccessContextValue | undefined>(undefined)

export default function TeamProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { setLanguage } = useLanguageContext()

  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['access', 'user'],
    queryFn: () => getCurrentUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })

  // Fetch team data
  const { data: currentTeam, isLoading: teamLoading } = useQuery({
    queryKey: ['access', 'team'],
    queryFn: () => getCurrentTeam(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!user,
  })

  const isLoading = userLoading || teamLoading
  const isAuthenticated = !!user

  // Sync language from user preferences
  useEffect(() => {
    const lang = user?.language as 'en' | 'ar' | undefined
    if (lang) {
      setLanguage(lang)
    }
  }, [user?.language, setLanguage])

  const hasPermission = (perm: string) => {
    if (!user?.role?.permissions) return false
    return (
      user.role.permissions.includes('*') ||
      user.role.permissions.includes(perm)
    )
  }

  const hasFeature = (keyOrId: string) => {
    const keys = currentTeam?.plan?.featureKeys ?? []
    const ids = currentTeam?.plan?.featureIds ?? []
    return keys.includes(keyOrId) || ids.includes(keyOrId)
  }

  const isFeatureInactive = (keyOrId: string) => {
    const inactive = currentTeam?.plan?.inactiveFeatureKeys ?? []
    return inactive.includes(keyOrId)
  }

  const isOnTrial = () => Boolean(currentTeam?.trialStatus?.isTrial)
  const isTrialExpired = () => Boolean(currentTeam?.trialStatus?.expired)
  const isPlanExpired = () => Boolean(currentTeam?.planStatus?.expired)
  const isTrialAboutToExpire = () =>
    Boolean(currentTeam?.trialStatus?.aboutToExpire)
  const isPlanAboutToExpire = () =>
    Boolean(currentTeam?.planStatus?.aboutToExpire)

  return (
    <AccessContext.Provider
      value={{
        user: user ?? null,
        currentTeam: currentTeam ?? null,
        isLoading,
        isAuthenticated,
        hasPermission,
        hasFeature,
        isFeatureInactive,
        isOnTrial,
        isTrialExpired,
        isPlanExpired,
        isTrialAboutToExpire,
        isPlanAboutToExpire,
      }}
    >
      {children}
    </AccessContext.Provider>
  )
}

/**
 * Hook to access the current user, team, and permission helpers.
 */
export function useAccess() {
  const ctx = useContext(AccessContext)
  if (!ctx) throw new Error('useAccess must be used within TeamProvider')
  return ctx
}

/**
 * Hook to get just the current team (backward compatibility).
 */
export function useTeam() {
  const { currentTeam } = useAccess()
  return { currentTeam }
}
