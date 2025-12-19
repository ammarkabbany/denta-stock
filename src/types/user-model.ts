// User and team model types for the access control system

/**
 * User model with team membership and role information.
 * Combines data from Appwrite auth, user_meta, and team_member tables.
 */
export interface UserModel {
  /** user_meta document ID */
  $id: string
  /** Appwrite user ID */
  userId: string
  /** User's email address */
  email: string
  /** User's full name */
  fullName: string
  /** Optional phone number */
  phone: string | null
  /** Optional avatar URL */
  avatarUrl: string | null
  /** Optional country code */
  country: string | null
  /** Preferred language */
  language: string | null
  /** Notification preferences */
  notificationPreferences: string[] | null
  /** Team ID the user belongs to */
  teamId: string
  /** When the user joined the team */
  joinedAt: string
  /** User ID who invited this user */
  invitedBy: string | null
  /** Whether the team membership is active */
  active: boolean
  /** Whether the user is a system admin */
  isAdmin: boolean
  /** User's role with permissions */
  role: {
    $id: string
    name: string
    level: number
    permissions: string[]
  } | null
}

/**
 * Extended team type with plan and status information.
 */
export interface TeamWithPlan {
  $id: string
  teamId: string
  teamName: string
  logoUrl?: string | null
  createdBy: string
  subscribedAt: string
  expireDate: string | null
  active: boolean
  isTrial: boolean | null
  country: string | null
  currency: string | null
  planId: string | null
  plan: {
    $id: string
    name: string
    description: string | null
    featureIds: string[]
    featureKeys: string[]
    inactiveFeatureKeys: string[]
    durationDays?: number
  } | null
  trialStatus: {
    isTrial: boolean
    expired: boolean
    expireDate: string | null
    aboutToExpire: boolean
    daysRemaining: number | null
  }
  planStatus: {
    expired: boolean
    expireDate: string | null
    aboutToExpire: boolean
    daysRemaining: number | null
  }
}
