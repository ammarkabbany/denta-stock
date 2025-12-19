import {
  Client,
  TablesDB,
  ID,
  type Models,
  Permission,
  Role,
  Query,
} from 'node-appwrite'
import type {
  InventoryCategories,
  InventoryUnits,
  InventoryItems,
  StockMovements,
  // Main DB types
  UserMeta,
  TeamsMeta,
  TeamMember,
  Role as RoleType,
  Plan,
  Feature,
} from './appwrite.types'

// Lazy-initialize client to avoid errors when this file is imported on the client side
let _client: Client | null = null
let _tablesDB: TablesDB | null = null

function getClient() {
  if (!_client) {
    _client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!)
  }
  return _client
}

function getTablesDB() {
  if (!_tablesDB) {
    _tablesDB = new TablesDB(getClient())
  }
  return _tablesDB
}

export const db = {
  inventoryCategories: {
    create: (
      data: Omit<InventoryCategories, keyof Models.Row>,
      options?: { rowId?: string; permissions?: string[] },
    ) =>
      getTablesDB().createRow<InventoryCategories>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'inventory_categories',
        rowId: options?.rowId ?? ID.unique(),
        data,
        permissions: [
          Permission.read(Role.team(data.teamId)),
          Permission.update(Role.team(data.teamId)),
        ],
      }),
    get: (id: string) =>
      getTablesDB().getRow<InventoryCategories>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'inventory_categories',
        rowId: id,
      }),
    update: (
      id: string,
      data: Partial<Omit<InventoryCategories, keyof Models.Row>>,
      options?: { permissions?: string[] },
    ) =>
      getTablesDB().updateRow<InventoryCategories>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'inventory_categories',
        rowId: id,
        data,
        ...(options?.permissions ? { permissions: options.permissions } : {}),
      }),
    delete: (id: string) =>
      getTablesDB().deleteRow({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'inventory_categories',
        rowId: id,
      }),
    list: (queries?: string[]) =>
      getTablesDB().listRows<InventoryCategories>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'inventory_categories',
        queries,
      }),
  },
  inventoryUnits: {
    create: (
      data: Omit<InventoryUnits, keyof Models.Row>,
      options?: { rowId?: string; permissions?: string[] },
    ) =>
      getTablesDB().createRow<InventoryUnits>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'inventory_units',
        rowId: options?.rowId ?? ID.unique(),
        data,
        permissions: [
          Permission.read(Role.team(data.teamId)),
          Permission.update(Role.team(data.teamId)),
        ],
      }),
    get: (id: string) =>
      getTablesDB().getRow<InventoryUnits>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'inventory_units',
        rowId: id,
      }),
    update: (
      id: string,
      data: Partial<Omit<InventoryUnits, keyof Models.Row>>,
      options?: { permissions?: string[] },
    ) =>
      getTablesDB().updateRow<InventoryUnits>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'inventory_units',
        rowId: id,
        data,
        ...(options?.permissions ? { permissions: options.permissions } : {}),
      }),
    delete: (id: string) =>
      getTablesDB().deleteRow({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'inventory_units',
        rowId: id,
      }),
    list: (queries?: string[]) =>
      getTablesDB().listRows<InventoryUnits>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'inventory_units',
        queries,
      }),
  },
  inventoryItems: {
    create: (
      data: Omit<InventoryItems, keyof Models.Row>,
      options?: { rowId?: string; permissions?: string[] },
    ) =>
      getTablesDB().createRow<InventoryItems>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'inventory_items',
        rowId: options?.rowId ?? ID.unique(),
        data,
        permissions: [
          Permission.read(Role.team(data.teamId)),
          Permission.update(Role.team(data.teamId)),
        ],
      }),
    get: (id: string) =>
      getTablesDB().getRow<InventoryItems>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'inventory_items',
        rowId: id,
      }),
    update: (
      id: string,
      data: Partial<Omit<InventoryItems, keyof Models.Row>>,
      options?: { permissions?: string[] },
    ) =>
      getTablesDB().updateRow<InventoryItems>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'inventory_items',
        rowId: id,
        data,
        ...(options?.permissions ? { permissions: options.permissions } : {}),
      }),
    delete: (id: string) =>
      getTablesDB().deleteRow({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'inventory_items',
        rowId: id,
      }),
    list: (queries?: string[]) =>
      getTablesDB().listRows<InventoryItems>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'inventory_items',
        queries,
      }),
  },
  stockMovements: {
    create: (
      data: Omit<StockMovements, keyof Models.Row>,
      options?: { rowId?: string; permissions?: string[] },
    ) =>
      getTablesDB().createRow<StockMovements>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'stock_movements',
        rowId: options?.rowId ?? ID.unique(),
        data,
        permissions: [
          Permission.read(Role.team(data.teamId)),
          Permission.update(Role.team(data.teamId)),
        ],
      }),
    get: (id: string) =>
      getTablesDB().getRow<StockMovements>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'stock_movements',
        rowId: id,
      }),
    update: (
      id: string,
      data: Partial<Omit<StockMovements, keyof Models.Row>>,
      options?: { permissions?: string[] },
    ) =>
      getTablesDB().updateRow<StockMovements>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'stock_movements',
        rowId: id,
        data,
        ...(options?.permissions ? { permissions: options.permissions } : {}),
      }),
    delete: (id: string) =>
      getTablesDB().deleteRow({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'stock_movements',
        rowId: id,
      }),
    list: (queries?: string[]) =>
      getTablesDB().listRows<StockMovements>({
        databaseId: process.env.APPWRITE_DB_ID!,
        tableId: 'stock_movements',
        queries,
      }),
  },
}

// ============================================
// Main DB Operations (shared with DentaAuto)
// ============================================

export const mainDb = {
  userMeta: {
    create: (
      data: Omit<UserMeta, keyof Models.Row>,
      options?: { rowId?: string; permissions?: string[] },
    ) =>
      getTablesDB().createRow<UserMeta>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'user_meta',
        rowId: options?.rowId ?? ID.unique(),
        data,
        permissions: options?.permissions ?? [Permission.read(Role.users())],
      }),
    get: (id: string) =>
      getTablesDB().getRow<UserMeta>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'user_meta',
        rowId: id,
      }),
    getByUserId: (userId: string) =>
      getTablesDB().listRows<UserMeta>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'user_meta',
        queries: [Query.equal('userId', userId)],
      }),
    update: (id: string, data: Partial<Omit<UserMeta, keyof Models.Row>>) =>
      getTablesDB().updateRow<UserMeta>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'user_meta',
        rowId: id,
        data,
      }),
    list: (queries?: string[]) =>
      getTablesDB().listRows<UserMeta>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'user_meta',
        queries,
      }),
  },
  teamsMeta: {
    create: (
      data: Omit<TeamsMeta, keyof Models.Row>,
      options?: { rowId?: string; permissions?: string[] },
    ) =>
      getTablesDB().createRow<TeamsMeta>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'teams_meta',
        rowId: options?.rowId ?? ID.unique(),
        data,
        permissions: options?.permissions ?? [],
      }),
    get: (id: string) =>
      getTablesDB().getRow<TeamsMeta>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'teams_meta',
        rowId: id,
      }),
    getByTeamId: (teamId: string) =>
      getTablesDB().listRows<TeamsMeta>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'teams_meta',
        queries: [
          Query.equal('teamId', teamId),
          Query.equal('active', true),
          Query.select([
            '$id',
            'teamName',
            'teamId',
            'logoUrl',
            'currency',
            'expireDate',
            'isTrial',
            'subscribedAt',
            'planId',
            'createdBy',
            'active',
            'country',
            'plan.name',
            'plan.description',
            'plan.featureIds',
            'plan.durationDays',
            'plan.features.name',
            'plan.features.active',
            'plan.features.key',
          ]),
        ],
      }),
    update: (id: string, data: Partial<Omit<TeamsMeta, keyof Models.Row>>) =>
      getTablesDB().updateRow<TeamsMeta>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'teams_meta',
        rowId: id,
        data,
      }),
    list: (queries?: string[]) =>
      getTablesDB().listRows<TeamsMeta>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'teams_meta',
        queries,
      }),
  },
  teamMember: {
    create: (
      data: Omit<TeamMember, keyof Models.Row>,
      options?: { rowId?: string; permissions?: string[] },
    ) =>
      getTablesDB().createRow<TeamMember>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'team_member',
        rowId: options?.rowId ?? ID.unique(),
        data,
        permissions: options?.permissions ?? [],
      }),
    get: (id: string) =>
      getTablesDB().getRow<TeamMember>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'team_member',
        rowId: id,
      }),
    getByUserId: (userId: string) =>
      getTablesDB().listRows<TeamMember>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'team_member',
        queries: [
          Query.equal('userId', userId),
          Query.equal('active', true),
          Query.select([
            '$id',
            'joinedAt',
            'invitedBy',
            'roleId',
            'active',
            'teamId',
            'userId',
            'role.name',
            'role.level',
            'role.permissions',
          ]),
        ],
      }),
    getByTeamId: (teamId: string) =>
      getTablesDB().listRows<TeamMember>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'team_member',
        queries: [Query.equal('teamId', teamId)],
      }),
    update: (id: string, data: Partial<Omit<TeamMember, keyof Models.Row>>) =>
      getTablesDB().updateRow<TeamMember>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'team_member',
        rowId: id,
        data,
      }),
    list: (queries?: string[]) =>
      getTablesDB().listRows<TeamMember>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'team_member',
        queries,
      }),
  },
  role: {
    get: (id: string) =>
      getTablesDB().getRow<RoleType>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'role',
        rowId: id,
      }),
    list: (queries?: string[]) =>
      getTablesDB().listRows<RoleType>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'role',
        queries,
      }),
  },
  plan: {
    get: (id: string) =>
      getTablesDB().getRow<Plan>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'plan',
        rowId: id,
      }),
    list: (queries?: string[]) =>
      getTablesDB().listRows<Plan>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'plan',
        queries,
      }),
  },
  feature: {
    get: (id: string) =>
      getTablesDB().getRow<Feature>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'feature',
        rowId: id,
      }),
    list: (queries?: string[]) =>
      getTablesDB().listRows<Feature>({
        databaseId: process.env.APPWRITE_MAIN_DB_ID!,
        tableId: 'feature',
        queries,
      }),
  },
}
