/**
 * DentaStock Database Setup Script
 *
 * This script creates the required tables in the DentaStock database.
 * Run with: bun run scripts/setup-database.ts
 *
 * Prerequisites:
 * - APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY set in .env
 * - APPWRITE_DB_ID set to DentaStock database ID
 */

import { Client, Databases, Permission, Role } from 'node-appwrite'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const endpoint = process.env.APPWRITE_ENDPOINT
const projectId = process.env.APPWRITE_PROJECT_ID
const apiKey = process.env.APPWRITE_API_KEY
const databaseId = process.env.APPWRITE_DB_ID

if (!endpoint || !projectId || !apiKey || !databaseId) {
  console.error('Missing required environment variables:')
  console.error('  APPWRITE_ENDPOINT:', endpoint ? '✓' : '✗')
  console.error('  APPWRITE_PROJECT_ID:', projectId ? '✓' : '✗')
  console.error('  APPWRITE_API_KEY:', apiKey ? '✓' : '✗')
  console.error('  APPWRITE_DB_ID:', databaseId ? '✓' : '✗')
  process.exit(1)
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey)

const databases = new Databases(client)

// Table definitions
const tables = [
  {
    id: 'inventory_categories',
    name: 'Inventory Categories',
    attributes: [
      { key: 'teamId', type: 'string', size: 50, required: true },
      { key: 'createdBy', type: 'string', size: 50, required: true },
      { key: 'name', type: 'string', size: 100, required: true },
      { key: 'nameAr', type: 'string', size: 100, required: false },
      {
        key: 'sortOrder',
        type: 'integer',
        min: 0,
        max: 9999,
        required: false,
        default: 0,
      },
      { key: 'archived', type: 'boolean', required: false, default: false },
    ],
    indexes: [
      { key: 'idx_teamId', type: 'key', attributes: ['teamId'] },
      { key: 'idx_archived', type: 'key', attributes: ['archived'] },
    ],
  },
  {
    id: 'inventory_units',
    name: 'Inventory Units',
    attributes: [
      { key: 'teamId', type: 'string', size: 50, required: true },
      { key: 'createdBy', type: 'string', size: 50, required: true },
      { key: 'name', type: 'string', size: 50, required: true },
      { key: 'nameAr', type: 'string', size: 50, required: false },
      { key: 'abbreviation', type: 'string', size: 10, required: true },
      { key: 'abbreviationAr', type: 'string', size: 10, required: false },
      {
        key: 'sortOrder',
        type: 'integer',
        min: 0,
        max: 9999,
        required: false,
        default: 0,
      },
      { key: 'archived', type: 'boolean', required: false, default: false },
    ],
    indexes: [
      { key: 'idx_teamId', type: 'key', attributes: ['teamId'] },
      { key: 'idx_archived', type: 'key', attributes: ['archived'] },
    ],
  },
  {
    id: 'inventory_items',
    name: 'Inventory Items',
    attributes: [
      { key: 'teamId', type: 'string', size: 50, required: true },
      { key: 'createdBy', type: 'string', size: 50, required: true },
      { key: 'name', type: 'string', size: 200, required: true },
      { key: 'sku', type: 'string', size: 50, required: false },
      { key: 'categoryId', type: 'string', size: 50, required: false },
      { key: 'description', type: 'string', size: 1000, required: false },
      { key: 'unitId', type: 'string', size: 50, required: true },
      {
        key: 'currentStock',
        type: 'integer',
        min: 0,
        max: 999999999,
        required: false,
        default: 0,
      },
      {
        key: 'lowStockThreshold',
        type: 'integer',
        min: 0,
        max: 999999,
        required: false,
      },
      {
        key: 'costPerUnit',
        type: 'double',
        min: 0,
        max: 999999999,
        required: false,
      },
      { key: 'location', type: 'string', size: 200, required: false },
      { key: 'notes', type: 'string', size: 2000, required: false },
      { key: 'imageFileId', type: 'string', size: 50, required: false },
      { key: 'archived', type: 'boolean', required: false, default: false },
      { key: 'archivedAt', type: 'datetime', required: false },
    ],
    indexes: [
      { key: 'idx_teamId', type: 'key', attributes: ['teamId'] },
      { key: 'idx_archived', type: 'key', attributes: ['archived'] },
      { key: 'idx_categoryId', type: 'key', attributes: ['categoryId'] },
      { key: 'idx_name', type: 'fulltext', attributes: ['name'] },
    ],
  },
  {
    id: 'stock_movements',
    name: 'Stock Movements',
    attributes: [
      { key: 'teamId', type: 'string', size: 50, required: true },
      { key: 'createdBy', type: 'string', size: 50, required: true },
      { key: 'itemId', type: 'string', size: 50, required: true },
      {
        key: 'type',
        type: 'enum',
        elements: ['in', 'out', 'adjust'],
        required: true,
      },
      {
        key: 'quantity',
        type: 'integer',
        min: 1,
        max: 999999999,
        required: true,
      },
      {
        key: 'previousStock',
        type: 'integer',
        min: 0,
        max: 999999999,
        required: true,
      },
      {
        key: 'newStock',
        type: 'integer',
        min: 0,
        max: 999999999,
        required: true,
      },
      { key: 'reason', type: 'string', size: 500, required: false },
      { key: 'notes', type: 'string', size: 2000, required: false },
    ],
    indexes: [
      { key: 'idx_teamId', type: 'key', attributes: ['teamId'] },
      { key: 'idx_itemId', type: 'key', attributes: ['itemId'] },
      { key: 'idx_type', type: 'key', attributes: ['type'] },
    ],
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createAttribute(tableId: string, attr: any) {
  try {
    switch (attr.type) {
      case 'string':
        await databases.createStringAttribute(
          databaseId,
          tableId,
          attr.key,
          attr.size,
          attr.required,
          attr.default ?? null,
          attr.array ?? false,
        )
        break
      case 'integer':
        await databases.createIntegerAttribute(
          databaseId,
          tableId,
          attr.key,
          attr.required,
          attr.min,
          attr.max,
          attr.default ?? null,
          attr.array ?? false,
        )
        break
      case 'double':
        await databases.createFloatAttribute(
          databaseId,
          tableId,
          attr.key,
          attr.required,
          attr.min,
          attr.max,
          attr.default ?? null,
          attr.array ?? false,
        )
        break
      case 'boolean':
        await databases.createBooleanAttribute(
          databaseId,
          tableId,
          attr.key,
          attr.required,
          attr.default ?? null,
          attr.array ?? false,
        )
        break
      case 'datetime':
        await databases.createDatetimeAttribute(
          databaseId,
          tableId,
          attr.key,
          attr.required,
          attr.default ?? null,
          attr.array ?? false,
        )
        break
      case 'enum':
        await databases.createEnumAttribute(
          databaseId,
          tableId,
          attr.key,
          attr.elements,
          attr.required,
          attr.default ?? null,
          attr.array ?? false,
        )
        break
    }
    console.log(`    ✓ Created attribute: ${attr.key}`)
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`    - Attribute already exists: ${attr.key}`)
    } else {
      throw error
    }
  }
}

async function createIndex(tableId: string, index: any) {
  try {
    await databases.createIndex(
      databaseId,
      tableId,
      index.key,
      index.type,
      index.attributes,
    )
    console.log(`    ✓ Created index: ${index.key}`)
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`    - Index already exists: ${index.key}`)
    } else {
      throw error
    }
  }
}

async function setup() {
  console.log('🚀 DentaStock Database Setup')
  console.log(`   Database ID: ${databaseId}`)
  console.log('')

  for (const table of tables) {
    console.log(`📦 Creating table: ${table.name} (${table.id})`)

    // Create collection/table
    try {
      await databases.createCollection(
        databaseId,
        table.id,
        table.name,
        [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ],
        true, // documentSecurity = true (row-level permissions)
      )
      console.log(`  ✓ Created table: ${table.id}`)
    } catch (error: any) {
      if (error.code === 409) {
        console.log(`  - Table already exists: ${table.id}`)
      } else {
        throw error
      }
    }

    // Create attributes
    for (const attr of table.attributes) {
      await createAttribute(table.id, attr)
    }

    // Wait for attributes to be ready before creating indexes
    console.log('    Waiting for attributes to be available...')
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create indexes
    for (const index of table.indexes) {
      await createIndex(table.id, index)
    }

    console.log('')
  }

  console.log('✅ Database setup complete!')
}

setup().catch((error) => {
  console.error('❌ Setup failed:', error)
  process.exit(1)
})
