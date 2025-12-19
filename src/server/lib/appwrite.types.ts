import { type Models } from 'node-appwrite'

export enum Type {
  IN = 'in',
  OUT = 'out',
  ADJUST = 'adjust',
}

export type InventoryCategories = Models.Row & {
  teamId: string
  createdBy: string
  name: string
  nameAr: string | null
  sortOrder: number
  archived: boolean
}

export type InventoryUnits = Models.Row & {
  teamId: string
  createdBy: string
  name: string
  nameAr: string | null
  abbreviation: string
  abbreviationAr: string | null
  sortOrder: number
  archived: boolean
}

export type InventoryItems = Models.Row & {
  teamId: string
  createdBy: string
  name: string
  sku: string | null
  categoryId: string | null
  description: string | null
  unitId: string
  currentStock: number
  lowStockThreshold: number | null
  costPerUnit: number | null
  location: string | null
  notes: string | null
  imageFileId: string | null
  archived: boolean
  archivedAt: string | null
}

export type StockMovements = Models.Row & {
  teamId: string
  createdBy: string
  itemId: string
  type: Type
  quantity: number
  previousStock: number
  newStock: number
  reason: string | null
  notes: string | null
}

// ============================================
// Main DB Types (shared with DentaAuto)
// ============================================

/**
 * Subscription plan definition.
 */
export type Plan = Models.Row & {
  name: string
  description: string | null
  memberLimit: number
  featureIds: string[] | null
  features: Feature[] | null
  active: boolean
  durationDays: number
}

/**
 * Individual feature that can be enabled for a plan.
 */
export type Feature = Models.Row & {
  key: string
  name: string
  description: string | null
  category: string | null
  active: boolean
}

/**
 * Extended user profile stored in the database.
 */
export type UserMeta = Models.Row & {
  userId: string
  fullName: string
  phone: string | null
  avatarUrl: string | null
  country: string | null
  language: string | null
  notificationPreferences: string[] | null
}

/**
 * Team-level metadata and subscription info.
 */
export type TeamsMeta = Models.Row & {
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
  plan: Plan | null
}

/**
 * Role definition used for team-member permissions.
 */
export type Role = Models.Row & {
  name: string
  level: number
  permissions: string[] | null
}

/**
 * Link between a user and a team with an assigned role.
 */
export type TeamMember = Models.Row & {
  teamId: string
  userId: string
  joinedAt: string
  invitedBy: string | null
  roleId: string | null
  active: boolean
  role: Role | null
}
