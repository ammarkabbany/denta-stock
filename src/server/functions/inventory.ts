import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { Query } from 'node-appwrite'
import { db } from '../lib/db'
import { authMiddleware } from './auth'
import { getTeamDetails } from './access'
import { Type } from '../lib/appwrite.types'
import type { UserModel, TeamWithPlan } from '@/types/user-model'

// Feature key for the inventory management system
const FEATURE_KEY = 'denta_stock'

// Permission keys
const PERMISSIONS = {
  VIEW: 'inventory.view',
  CREATE: 'inventory.create',
  UPDATE: 'inventory.update',
  DELETE: 'inventory.delete',
} as const

/**
 * Check if user has a specific permission
 */
function checkPermission(user: UserModel | null, permission: string): boolean {
  if (!user?.role?.permissions) return false
  return (
    user.role.permissions.includes('*') ||
    user.role.permissions.includes(permission)
  )
}

/**
 * Check if team has the denta_stock feature enabled
 */
function checkFeature(team: TeamWithPlan | null): boolean {
  if (!team?.plan) return false
  const keys = team.plan.featureKeys ?? []
  return keys.includes(FEATURE_KEY)
}

/**
 * Check if subscription is expired
 */
function checkSubscription(team: TeamWithPlan | null): boolean {
  if (!team) return false
  const trialExpired = team.trialStatus?.expired
  const planExpired = team.planStatus?.expired
  return !(trialExpired || planExpired)
}

/**
 * Validate access - checks feature, subscription, and permission
 * Loads all necessary data in parallel to minimize DB calls.
 */
async function validateAccess(
  user: UserModel,
  permission: string,
): Promise<void> {
  // 1. User is passed in (no fetch needed)

  // 2. Fetch Team Details (includes Plan, Features, Expiry)
  // We only fetch if user is in a team
  if (!user.teamId) {
    throw new Error('User not in a team')
  }

  const team = await getTeamDetails(user.teamId)

  // 3. Synchronous Validation
  // Check feature
  const hasFeature = checkFeature(team)
  if (!hasFeature) {
    throw new Error('Feature not available')
  }

  // Check subscription
  const hasValidSubscription = checkSubscription(team)
  if (!hasValidSubscription) {
    throw new Error('Subscription expired')
  }

  // Check permission
  const hasPermission = checkPermission(user, permission)
  if (!hasPermission) {
    throw new Error('Permission denied')
  }
}

// ============================================================================
// INVENTORY ITEMS
// ============================================================================

const createItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  sku: z.string().max(50).nullable().optional(),
  categoryId: z.string().nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  unitId: z.string().min(1, 'Unit is required'),
  currentStock: z.number().min(0).default(0),
  lowStockThreshold: z.number().min(0).nullable().optional(),
  costPerUnit: z.number().min(0).nullable().optional(),
  location: z.string().max(200).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
})

const updateItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200).optional(),
  sku: z.string().max(50).nullable().optional(),
  categoryId: z.string().nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  unitId: z.string().min(1).optional(),
  lowStockThreshold: z.number().min(0).nullable().optional(),
  costPerUnit: z.number().min(0).nullable().optional(),
  location: z.string().max(200).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
})

export const listInventoryItemsFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z
      .object({
        categoryId: z.string().optional(),
        status: z.enum(['all', 'inStock', 'lowStock', 'outOfStock']).optional(),
        search: z.string().optional(),
        archived: z.boolean().optional(),
      })
      .optional(),
  )
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.VIEW)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    const queries: string[] = [
      Query.equal('teamId', [teamId]),
      Query.equal('archived', [data?.archived ?? false]),
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ]

    if (data?.categoryId) {
      queries.push(Query.equal('categoryId', [data.categoryId]))
    }

    if (data?.search) {
      queries.push(Query.search('name', data.search))
    }

    const result = await db.inventoryItems.list(queries)

    // Filter by status in memory (Appwrite doesn't support complex conditions)
    let items = result.rows

    if (data?.status && data.status !== 'all') {
      items = items.filter((item) => {
        const threshold = item.lowStockThreshold ?? 0
        if (data.status === 'outOfStock') return item.currentStock === 0
        if (data.status === 'lowStock')
          return item.currentStock > 0 && item.currentStock <= threshold
        if (data.status === 'inStock') return item.currentStock > threshold
        return true
      })
    }

    return { items, total: result.total }
  })

export const getInventoryItemFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.VIEW)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    const item = await db.inventoryItems.get(data.id)

    if (!item || item.teamId !== teamId) {
      return null
    }

    return { item }
  })

export const createInventoryItemFn = createServerFn({ method: 'POST' })
  .inputValidator(createItemSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.CREATE)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    const item = await db.inventoryItems.create({
      teamId: teamId,
      createdBy: currentUser.$id,
      name: data.name.trim(),
      sku: data.sku?.trim() || null,
      categoryId: data.categoryId || null,
      description: data.description?.trim() || null,
      unitId: data.unitId,
      currentStock: data.currentStock,
      lowStockThreshold: data.lowStockThreshold ?? null,
      costPerUnit: data.costPerUnit ?? null,
      location: data.location?.trim() || null,
      notes: data.notes?.trim() || null,
      imageFileId: null,
      archived: false,
      archivedAt: null,
    })

    return { item }
  })

export const updateInventoryItemFn = createServerFn({ method: 'POST' })
  .inputValidator(updateItemSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.UPDATE)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    const existing = await db.inventoryItems.get(data.id)
    if (!existing || existing.teamId !== teamId) {
      throw new Error('Item not found')
    }

    const { id, ...updateData } = data
    const cleanData: Record<string, unknown> = {}

    if (updateData.name !== undefined) cleanData.name = updateData.name.trim()
    if (updateData.sku !== undefined)
      cleanData.sku = updateData.sku?.trim() || null
    if (updateData.categoryId !== undefined)
      cleanData.categoryId = updateData.categoryId || null
    if (updateData.description !== undefined)
      cleanData.description = updateData.description?.trim() || null
    if (updateData.unitId !== undefined) cleanData.unitId = updateData.unitId
    if (updateData.lowStockThreshold !== undefined)
      cleanData.lowStockThreshold = updateData.lowStockThreshold
    if (updateData.costPerUnit !== undefined)
      cleanData.costPerUnit = updateData.costPerUnit
    if (updateData.location !== undefined)
      cleanData.location = updateData.location?.trim() || null
    if (updateData.notes !== undefined)
      cleanData.notes = updateData.notes?.trim() || null

    const item = await db.inventoryItems.update(id, cleanData)

    return { item }
  })

export const archiveInventoryItemFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.UPDATE)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    const existing = await db.inventoryItems.get(data.id)
    if (!existing || existing.teamId !== teamId) {
      throw new Error('Item not found')
    }

    const item = await db.inventoryItems.update(data.id, {
      archived: true,
      archivedAt: new Date().toISOString(),
    })

    return { item }
  })

export const deleteInventoryItemFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.DELETE)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    const existing = await db.inventoryItems.get(data.id)
    if (!existing || existing.teamId !== teamId) {
      throw new Error('Item not found')
    }

    // Check if item has movements - if so, archive instead of delete
    const movements = await db.stockMovements.list([
      Query.equal('itemId', [data.id]),
      Query.limit(1),
    ])

    if (movements.total > 0) {
      // Archive instead of delete to preserve audit trail
      await db.inventoryItems.update(data.id, {
        archived: true,
        archivedAt: new Date().toISOString(),
      })
      return { archived: true }
    }

    await db.inventoryItems.delete(data.id)
    return { deleted: true }
  })

// ============================================================================
// STOCK MOVEMENTS
// ============================================================================

const createMovementSchema = z.object({
  itemId: z.string().min(1, 'Item is required'),
  type: z.enum(['in', 'out', 'adjust']),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  reason: z.string().max(500).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
})

export const listStockMovementsFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z
      .object({
        itemId: z.string().optional(),
        type: z.enum(['in', 'out', 'adjust']).optional(),
        limit: z.number().min(1).max(100).optional(),
      })
      .optional(),
  )
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.VIEW)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    const queries: string[] = [
      Query.equal('teamId', [teamId]),
      Query.orderDesc('$createdAt'),
      Query.limit(data?.limit ?? 50),
    ]

    if (data?.itemId) {
      queries.push(Query.equal('itemId', [data.itemId]))
    }

    if (data?.type) {
      queries.push(Query.equal('type', [data.type]))
    }

    const result = await db.stockMovements.list(queries)

    return { movements: result.rows, total: result.total }
  })

export const createStockMovementFn = createServerFn({ method: 'POST' })
  .inputValidator(createMovementSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions (need UPDATE to modify stock)
    await validateAccess(currentUser, PERMISSIONS.UPDATE)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    // Get the item
    const item = await db.inventoryItems.get(data.itemId)
    if (!item || item.teamId !== teamId) {
      throw new Error('Item not found')
    }

    const previousStock = item.currentStock
    let newStock: number

    // Calculate new stock based on movement type
    switch (data.type) {
      case 'in':
        newStock = previousStock + data.quantity
        break
      case 'out':
        if (data.quantity > previousStock) {
          throw new Error('Insufficient stock')
        }
        newStock = previousStock - data.quantity
        break
      case 'adjust':
        // For adjust, quantity is the absolute new value
        newStock = data.quantity
        break
      default:
        throw new Error('Invalid movement type')
    }

    // Create the movement record
    const movement = await db.stockMovements.create({
      teamId: teamId,
      createdBy: currentUser.$id,
      itemId: data.itemId,
      type: data.type as Type,
      quantity: data.quantity,
      previousStock,
      newStock,
      reason: data.reason?.trim() || null,
      notes: data.notes?.trim() || null,
    })

    // Update the item's current stock
    await db.inventoryItems.update(data.itemId, {
      currentStock: newStock,
    })

    return { movement, previousStock, newStock }
  })

// ============================================================================
// CATEGORIES
// ============================================================================

export const listCategoriesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.VIEW)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    const result = await db.inventoryCategories.list([
      Query.equal('teamId', [teamId]),
      Query.equal('archived', [false]),
      Query.orderAsc('sortOrder'),
    ])

    return { categories: result.rows }
  },
)

const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  nameAr: z.string().max(100).nullable().optional(),
  sortOrder: z.number().min(0).optional(),
})

export const createCategoryFn = createServerFn({ method: 'POST' })
  .inputValidator(createCategorySchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.CREATE)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    // Get max sort order
    const existing = await db.inventoryCategories.list([
      Query.equal('teamId', [teamId]),
      Query.orderDesc('sortOrder'),
      Query.limit(1),
    ])

    const maxSortOrder = existing.rows[0]?.sortOrder ?? 0

    const category = await db.inventoryCategories.create({
      teamId: teamId,
      createdBy: currentUser.$id,
      name: data.name.trim(),
      nameAr: data.nameAr?.trim() || null,
      sortOrder: data.sortOrder ?? maxSortOrder + 1,
      archived: false,
    })

    return { category }
  })

const updateCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100).optional(),
  nameAr: z.string().max(100).nullable().optional(),
  sortOrder: z.number().min(0).optional(),
})

export const updateCategoryFn = createServerFn({ method: 'POST' })
  .inputValidator(updateCategorySchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.UPDATE)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    const existing = await db.inventoryCategories.get(data.id)
    if (!existing || existing.teamId !== teamId) {
      throw new Error('Category not found')
    }

    const { id, ...updateData } = data
    const cleanData: Record<string, unknown> = {}

    if (updateData.name !== undefined) cleanData.name = updateData.name.trim()
    if (updateData.nameAr !== undefined)
      cleanData.nameAr = updateData.nameAr?.trim() || null
    if (updateData.sortOrder !== undefined)
      cleanData.sortOrder = updateData.sortOrder

    const category = await db.inventoryCategories.update(id, cleanData)

    return { category }
  })

export const deleteCategoryFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.DELETE)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    const existing = await db.inventoryCategories.get(data.id)
    if (!existing || existing.teamId !== teamId) {
      throw new Error('Category not found')
    }

    // Check if category has items
    const items = await db.inventoryItems.list([
      Query.equal('categoryId', [data.id]),
      Query.limit(1),
    ])

    if (items.total > 0) {
      throw new Error('Cannot delete category with associated items')
    }

    await db.inventoryCategories.delete(data.id)
    return { deleted: true }
  })

// ============================================================================
// UNITS
// ============================================================================

export const listUnitsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.VIEW)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    const result = await db.inventoryUnits.list([
      Query.equal('teamId', [teamId]),
      Query.equal('archived', [false]),
      Query.orderAsc('sortOrder'),
    ])

    return { units: result.rows }
  },
)

const createUnitSchema = z.object({
  name: z.string().min(1).max(50),
  nameAr: z.string().max(50).nullable().optional(),
  abbreviation: z.string().min(1).max(10),
  abbreviationAr: z.string().max(10).nullable().optional(),
  sortOrder: z.number().min(0).optional(),
})

export const createUnitFn = createServerFn({ method: 'POST' })
  .inputValidator(createUnitSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.CREATE)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    // Get max sort order
    const existing = await db.inventoryUnits.list([
      Query.equal('teamId', [teamId]),
      Query.orderDesc('sortOrder'),
      Query.limit(1),
    ])

    const maxSortOrder = existing.rows[0]?.sortOrder ?? 0

    const unit = await db.inventoryUnits.create({
      teamId: teamId,
      createdBy: currentUser.$id,
      name: data.name.trim(),
      nameAr: data.nameAr?.trim() || null,
      abbreviation: data.abbreviation.trim(),
      abbreviationAr: data.abbreviationAr?.trim() || null,
      sortOrder: data.sortOrder ?? maxSortOrder + 1,
      archived: false,
    })

    return { unit }
  })

const updateUnitSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50).optional(),
  nameAr: z.string().max(50).nullable().optional(),
  abbreviation: z.string().min(1).max(10).optional(),
  abbreviationAr: z.string().max(10).nullable().optional(),
  sortOrder: z.number().min(0).optional(),
})

export const updateUnitFn = createServerFn({ method: 'POST' })
  .inputValidator(updateUnitSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.UPDATE)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    const existing = await db.inventoryUnits.get(data.id)
    if (!existing || existing.teamId !== teamId) {
      throw new Error('Unit not found')
    }

    const { id, ...updateData } = data
    const cleanData: Record<string, unknown> = {}

    if (updateData.name !== undefined) cleanData.name = updateData.name.trim()
    if (updateData.nameAr !== undefined)
      cleanData.nameAr = updateData.nameAr?.trim() || null
    if (updateData.abbreviation !== undefined)
      cleanData.abbreviation = updateData.abbreviation.trim()
    if (updateData.abbreviationAr !== undefined)
      cleanData.abbreviationAr = updateData.abbreviationAr?.trim() || null
    if (updateData.sortOrder !== undefined)
      cleanData.sortOrder = updateData.sortOrder

    const unit = await db.inventoryUnits.update(id, cleanData)

    return { unit }
  })

export const deleteUnitFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.DELETE)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    const existing = await db.inventoryUnits.get(data.id)
    if (!existing || existing.teamId !== teamId) {
      throw new Error('Unit not found')
    }

    // Check if unit has items
    const items = await db.inventoryItems.list([
      Query.equal('unitId', [data.id]),
      Query.limit(1),
    ])

    if (items.total > 0) {
      throw new Error('Cannot delete unit with associated items')
    }

    await db.inventoryUnits.delete(data.id)
    return { deleted: true }
  })

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export const getDashboardStatsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.VIEW)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    // Get all non-archived items
    const itemsResult = await db.inventoryItems.list([
      Query.equal('teamId', [teamId]),
      Query.equal('archived', [false]),
      Query.limit(1000),
    ])

    const items = itemsResult.rows

    // Calculate stats
    const totalItems = items.length
    let lowStock = 0
    let outOfStock = 0
    let totalValue = 0

    for (const item of items) {
      if (item.currentStock === 0) {
        outOfStock++
      } else if (
        item.lowStockThreshold &&
        item.currentStock <= item.lowStockThreshold
      ) {
        lowStock++
      }

      if (item.costPerUnit) {
        totalValue += item.currentStock * item.costPerUnit
      }
    }

    // Get low stock items for alerts
    const lowStockItems = items
      .filter(
        (item) =>
          item.lowStockThreshold && item.currentStock <= item.lowStockThreshold,
      )
      .slice(0, 10)

    // Get recent movements
    const movementsResult = await db.stockMovements.list([
      Query.equal('teamId', [teamId]),
      Query.orderDesc('$createdAt'),
      Query.limit(10),
    ])

    return {
      stats: {
        totalItems,
        lowStock,
        outOfStock,
        totalValue,
      },
      lowStockItems,
      recentMovements: movementsResult.rows,
    }
  },
)

// ============================================================================
// REPORTS DATA
// ============================================================================

export const getReportsDataFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z
      .object({
        period: z.enum(['7d', '30d', '90d', 'all']).optional(),
      })
      .optional(),
  )
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Check access permissions
    await validateAccess(currentUser, PERMISSIONS.VIEW)

    // Get user's team from currentUser (already validated)
    const teamId = currentUser.teamId

    const period = data?.period ?? '30d'

    // Calculate date range
    let startDate: Date | null = null
    const now = new Date()

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'all':
        startDate = null
        break
    }

    // Get active items
    const activeItemsResult = await db.inventoryItems.list([
      Query.equal('teamId', [teamId]),
      Query.equal('archived', [false]),
      Query.limit(1000),
    ])

    const activeItems = activeItemsResult.rows

    // Get all items including archived (for looking up item names in movements)
    const allItemsResult = await db.inventoryItems.list([
      Query.equal('teamId', [teamId]),
      Query.limit(1000),
    ])

    const allItems = allItemsResult.rows

    // Get movements within period
    const movementQueries: string[] = [
      Query.equal('teamId', [teamId]),
      Query.orderDesc('$createdAt'),
      Query.limit(1000),
    ]

    if (startDate) {
      movementQueries.push(
        Query.greaterThan('$createdAt', startDate.toISOString()),
      )
    }

    const movementsResult = await db.stockMovements.list(movementQueries)
    const movements = movementsResult.rows

    // Get categories
    const categoriesResult = await db.inventoryCategories.list([
      Query.equal('teamId', [teamId]),
      Query.equal('archived', [false]),
    ])

    const categories = categoriesResult.rows

    // Calculate stock by category (only active items)
    const stockByCategory = categories.map((cat) => {
      const categoryItems = activeItems.filter(
        (item) => item.categoryId === cat.$id,
      )
      const totalStock = categoryItems.reduce(
        (sum, item) => sum + item.currentStock,
        0,
      )
      const totalValue = categoryItems.reduce(
        (sum, item) => sum + item.currentStock * (item.costPerUnit ?? 0),
        0,
      )
      return {
        categoryId: cat.$id,
        categoryName: cat.name,
        categoryNameAr: cat.nameAr,
        itemCount: categoryItems.length,
        totalStock,
        totalValue,
      }
    })

    // Add uncategorized
    const uncategorizedItems = activeItems.filter((item) => !item.categoryId)
    if (uncategorizedItems.length > 0) {
      stockByCategory.push({
        categoryId: 'uncategorized',
        categoryName: 'Uncategorized',
        categoryNameAr: 'غير مصنف',
        itemCount: uncategorizedItems.length,
        totalStock: uncategorizedItems.reduce(
          (sum, item) => sum + item.currentStock,
          0,
        ),
        totalValue: uncategorizedItems.reduce(
          (sum, item) => sum + item.currentStock * (item.costPerUnit ?? 0),
          0,
        ),
      })
    }

    // Calculate movement trends (group by day)
    const movementsByDay: Record<
      string,
      { date: string; in: number; out: number; adjust: number }
    > = {}

    movements.forEach((movement) => {
      const date = movement.$createdAt.split('T')[0]
      if (!movementsByDay[date]) {
        movementsByDay[date] = { date, in: 0, out: 0, adjust: 0 }
      }
      movementsByDay[date][movement.type as 'in' | 'out' | 'adjust'] +=
        movement.quantity
    })

    const movementTrends = Object.values(movementsByDay).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    // Calculate summary stats
    const totalIn = movements
      .filter((m) => m.type === 'in')
      .reduce((sum, m) => sum + m.quantity, 0)
    const totalOut = movements
      .filter((m) => m.type === 'out')
      .reduce((sum, m) => sum + m.quantity, 0)
    const totalAdjust = movements
      .filter((m) => m.type === 'adjust')
      .reduce((sum, m) => sum + m.quantity, 0)

    // Top moving items - use allItems to include archived items
    const itemMovements: Record<string, { in: number; out: number }> = {}
    movements.forEach((movement) => {
      if (!itemMovements[movement.itemId]) {
        itemMovements[movement.itemId] = { in: 0, out: 0 }
      }
      if (movement.type === 'in') {
        itemMovements[movement.itemId].in += movement.quantity
      } else if (movement.type === 'out') {
        itemMovements[movement.itemId].out += movement.quantity
      }
    })

    const topMovingItems = Object.entries(itemMovements)
      .map(([itemId, data]) => {
        const item = allItems.find((i) => i.$id === itemId)
        return {
          itemId,
          itemName: item?.name ?? 'Unknown',
          isArchived: item?.archived ?? false,
          totalIn: data.in,
          totalOut: data.out,
          totalMovement: data.in + data.out,
        }
      })
      .sort((a, b) => b.totalMovement - a.totalMovement)
      .slice(0, 10)

    // Low stock items (only active items)
    const lowStockItems = activeItems
      .filter(
        (item) =>
          item.lowStockThreshold && item.currentStock <= item.lowStockThreshold,
      )
      .map((item) => ({
        itemId: item.$id,
        itemName: item.name,
        currentStock: item.currentStock,
        threshold: item.lowStockThreshold ?? 0,
        deficit: (item.lowStockThreshold ?? 0) - item.currentStock,
      }))
      .sort((a, b) => b.deficit - a.deficit)

    // Total inventory value (only active items)
    const totalValue = activeItems.reduce(
      (sum, item) => sum + item.currentStock * (item.costPerUnit ?? 0),
      0,
    )

    return {
      summary: {
        totalItems: activeItems.length,
        totalValue,
        totalMovements: movements.length,
        totalIn,
        totalOut,
        totalAdjust,
        lowStockCount: lowStockItems.length,
        outOfStockCount: activeItems.filter((i) => i.currentStock === 0).length,
      },
      stockByCategory,
      movementTrends,
      topMovingItems,
      lowStockItems,
    }
  })
