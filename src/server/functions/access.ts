import { createServerFn } from '@tanstack/react-start'
import { createSessionClient } from '../lib/appwrite'
import { mainDb } from '../lib/db'
import type { UserModel, TeamWithPlan } from '@/types/user-model'
import type {
  UserMeta,
  TeamMember,
  TeamsMeta,
  Feature,
} from '../lib/appwrite.types'
import { getAppwriteSessionFn } from './session'

/**
 * Get user metadata from the Main database.
 */
export const getUserMeta = async (userId: string): Promise<UserMeta | null> => {
  try {
    const result = await mainDb.userMeta.getByUserId(userId)
    return result.rows?.[0] ?? null
  } catch (error) {
    console.error('Error fetching user meta:', error)
    return null
  }
}

/**
 * Get user's team membership.
 */
export const getUserTeamMembership = async (
  userId: string,
): Promise<TeamMember | null> => {
  try {
    const result = await mainDb.teamMember.getByUserId(userId)
    const members = result.rows?.filter((m) => m.active) ?? []
    return members[0] ?? null
  } catch (error) {
    console.error('Error fetching team membership:', error)
    return null
  }
}

/**
 * Get team metadata with plan and features.
 */
export const getTeamMeta = async (
  teamId: string,
): Promise<TeamsMeta | null> => {
  try {
    const result = await mainDb.teamsMeta.getByTeamId(teamId)
    return result.rows?.[0] ?? null
  } catch (error) {
    console.error('Error fetching team meta:', error)
    return null
  }
}

/**
 * Get the current authenticated user with full profile, team, and role info.
 */
/**
 * Get the current authenticated user with full profile, team, and role info.
 */
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<UserModel | null> => {
    try {
      const session = await getAppwriteSessionFn()
      if (!session) return null

      const client = await createSessionClient(session)
      const appwriteUser = await client.account.get()

      // Parallel fetch for user meta and team membership
      const [userMeta, teamMember] = await Promise.all([
        getUserMeta(appwriteUser.$id),
        getUserTeamMembership(appwriteUser.$id),
      ])

      if (!userMeta) return null

      if (!teamMember) {
        // User exists but not in a team
        return {
          $id: userMeta.$id,
          userId: userMeta.userId,
          email: appwriteUser.email,
          fullName: userMeta.fullName,
          phone: userMeta.phone,
          avatarUrl: userMeta.avatarUrl,
          country: userMeta.country,
          language: userMeta.language,
          notificationPreferences: userMeta.notificationPreferences,
          teamId: '',
          joinedAt: '',
          invitedBy: null,
          active: false,
          isAdmin: appwriteUser.labels?.includes('admin') ?? false,
          role: null,
        }
      }

      const role = teamMember.role

      return {
        $id: userMeta.$id,
        userId: userMeta.userId,
        email: appwriteUser.email,
        fullName: userMeta.fullName,
        phone: userMeta.phone,
        avatarUrl: userMeta.avatarUrl,
        country: userMeta.country,
        language: userMeta.language,
        notificationPreferences: userMeta.notificationPreferences,
        teamId: teamMember.teamId,
        joinedAt: teamMember.joinedAt,
        invitedBy: teamMember.invitedBy,
        active: teamMember.active,
        isAdmin: appwriteUser.labels?.includes('admin') ?? false,
        role: role
          ? {
              $id: role.$id,
              name: role.name,
              level: role.level,
              permissions: role.permissions ?? [],
            }
          : null,
      }
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },
)

/**
 * Get team details by ID (internal helper)
 */
export const getTeamDetails = async (
  teamId: string,
): Promise<TeamWithPlan | null> => {
  try {
    // Get team meta
    const teamMeta = await getTeamMeta(teamId)
    if (!teamMeta) return null

    let plan = teamMeta.plan

    // If plan exists but features are missing (due to depth limits or query issues), fetch the full plan
    if (
      plan &&
      (!plan.features || plan.features.length === 0) &&
      teamMeta.planId
    ) {
      try {
        const fullPlan = await mainDb.plan.get(teamMeta.planId)
        if (fullPlan) {
          plan = fullPlan
        }
      } catch (e) {
        console.error('Error fetching full plan:', e)
      }
    }

    // Compute feature keys
    const featureKeys: string[] =
      plan?.features
        ?.filter((f: Feature) => f?.active !== false)
        ?.map((f: Feature) => f?.key) ?? []
    const inactiveFeatureKeys: string[] =
      plan?.features
        ?.filter((f: Feature) => f?.active === false)
        ?.map((f: Feature) => f?.key) ?? []

    // Parse dates safely
    const safeParseDate = (val: unknown): Date | null => {
      if (val == null) return null
      if (val instanceof Date) return isNaN(val.getTime()) ? null : val
      if (typeof val === 'string') {
        const d = new Date(val.trim())
        return isNaN(d.getTime()) ? null : d
      }
      return null
    }

    const subscribedAtDate = safeParseDate(teamMeta.subscribedAt)
    const explicitExpire = safeParseDate(teamMeta.expireDate)

    // Derive expire date from subscribedAt + plan.durationDays
    let derivedExpire: Date | null = null
    if (subscribedAtDate && plan?.durationDays) {
      const days = Number(plan.durationDays) || 0
      if (days > 0) {
        derivedExpire = new Date(subscribedAtDate)
        derivedExpire.setDate(derivedExpire.getDate() + days)
      }
    }

    const finalExpireDate = explicitExpire ?? derivedExpire
    const finalExpireDateStr = finalExpireDate?.toISOString() ?? null

    const now = Date.now()
    const daysRemainingRaw = finalExpireDate
      ? Math.ceil((finalExpireDate.getTime() - now) / (24 * 60 * 60 * 1000))
      : null
    const daysRemaining =
      daysRemainingRaw === null ? null : Math.max(0, daysRemainingRaw)
    const isBeforeExpiry = Boolean(
      finalExpireDate && now < finalExpireDate.getTime(),
    )

    const isTrial =
      Boolean(teamMeta.isTrial) || plan?.name?.toLowerCase() === 'trial'
    const trialAboutToExpire = Boolean(
      isTrial &&
        isBeforeExpiry &&
        daysRemainingRaw !== null &&
        daysRemainingRaw <= 7,
    )
    const planAboutToExpire = Boolean(
      !isTrial &&
        isBeforeExpiry &&
        daysRemainingRaw !== null &&
        daysRemainingRaw <= 7,
    )
    const trialExpired = Boolean(
      isTrial && finalExpireDate && now > finalExpireDate.getTime(),
    )
    const planExpired = Boolean(
      !isTrial && finalExpireDate && now > finalExpireDate.getTime(),
    )

    return {
      $id: teamMeta.$id,
      teamId: teamMeta.teamId,
      teamName: teamMeta.teamName,
      logoUrl: teamMeta.logoUrl,
      createdBy: teamMeta.createdBy,
      subscribedAt: teamMeta.subscribedAt,
      expireDate: teamMeta.expireDate,
      active: teamMeta.active,
      isTrial: teamMeta.isTrial,
      country: teamMeta.country,
      currency: teamMeta.currency,
      planId: teamMeta.planId,
      plan: plan
        ? {
            $id: plan.$id,
            name: plan.name,
            description: plan.description,
            featureIds: plan.featureIds ?? [],
            featureKeys,
            inactiveFeatureKeys,
            durationDays: plan.durationDays,
          }
        : null,
      trialStatus: {
        isTrial,
        expired: trialExpired,
        expireDate: finalExpireDateStr,
        aboutToExpire: trialAboutToExpire,
        daysRemaining: isTrial ? daysRemaining : null,
      },
      planStatus: {
        expired: planExpired,
        expireDate: finalExpireDateStr,
        aboutToExpire: planAboutToExpire,
        daysRemaining: !isTrial ? daysRemaining : null,
      },
    }
  } catch (error) {
    console.error('Error getting team details:', error)
    return null
  }
}

/**
 * Get the current user's team with plan and subscription status.
 */
export const getCurrentTeam = createServerFn({ method: 'GET' }).handler(
  async (): Promise<TeamWithPlan | null> => {
    try {
      const session = await getAppwriteSessionFn()
      if (!session) return null

      const client = await createSessionClient(session)
      const appwriteUser = await client.account.get()

      // Get team membership
      const teamMember = await getUserTeamMembership(appwriteUser.$id)
      if (!teamMember?.teamId) return null

      // Use shared helper
      return getTeamDetails(teamMember.teamId)
    } catch (error) {
      console.error('Error getting current team:', error)
      return null
    }
  },
)

/**
 * Check if the current user has a specific permission.
 */
export const hasPermission = async (permission: string): Promise<boolean> => {
  const user = await getCurrentUser()
  if (!user?.role?.permissions) return false
  return (
    user.role.permissions.includes('*') ||
    user.role.permissions.includes(permission)
  )
}

/**
 * Check if the current user has a specific feature.
 */
export const hasFeature = async (keyOrId: string): Promise<boolean> => {
  const team = await getCurrentTeam()
  if (!team?.plan) return false
  const keys = team.plan.featureKeys ?? []
  const ids = team.plan.featureIds ?? []
  return keys.includes(keyOrId) || ids.includes(keyOrId)
}
