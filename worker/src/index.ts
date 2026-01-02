import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { sign, verify } from 'hono/jwt'

interface Env {
  expositor_db: D1Database
  expositor_storage: R2Bucket
  JWT_SECRET: string
}

interface MediaRow {
  id: number
  title: string
  description: string
  url: string
  type: 'image' | 'video'
  order_index: number
  created_at: string
}


interface UpdatePayload {
  title?: string
  description?: string
  order_index?: number
}

interface LayoutRowRaw {
  id: string
  name: string
  template: string
  elements_json: string
  is_preset: number
  created_at: string
  updated_at: string
}

interface LayoutApiRow {
  id: string
  name: string
  template: string
  elements: unknown
  is_preset: number
  created_at: string
  updated_at: string
}

type HttpStatusCode = 200 | 201 | 400 | 401 | 404 | 500

const app = new Hono<{ Bindings: Env }>()

// CORS middleware
app.use('*', cors({
  origin: (origin) => {
    // Allow local development
    if (origin === 'http://localhost:5173' || origin === 'http://localhost:3000') {
      return origin
    }
    // Allow production and all preview deployments
    if (origin.endsWith('.pyme-expositor.pages.dev') || origin === 'https://pyme-expositor.pages.dev') {
      return origin
    }
    // Default to null (block) if no match
    return null
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}))

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_VIDEO_BYTES = 200 * 1024 * 1024

const createUnsignedToken = (user: string, ttlMs: number): string => {
  const payload = { user, exp: Date.now() + ttlMs }
  return btoa(JSON.stringify(payload))
}

const verifyUnsignedToken = (token: string): boolean => {
  try {
    const decoded = JSON.parse(atob(token)) as { exp?: unknown }
    const exp = decoded.exp
    return typeof exp === 'number' && exp > Date.now()
  } catch {
    return false
  }
}

const createAuthToken = async (user: string, secret?: string): Promise<string> => {
  // Prefer signed JWT when a secret is configured.
  if (secret && secret.trim().length > 0) {
    const nowSeconds = Math.floor(Date.now() / 1000)
    const ttlSeconds = 60 * 60 * 24 * 7
    return sign({ sub: user, exp: nowSeconds + ttlSeconds }, secret)
  }

  console.warn('JWT_SECRET is not configured; using unsigned token fallback')
  return createUnsignedToken(user, 1000 * 60 * 60 * 24)
}

const verifyAuthToken = async (token: string, secret?: string): Promise<boolean> => {
  if (secret && secret.trim().length > 0) {
    try {
      const payload = await verify(token, secret)
      const exp = (payload as Record<string, unknown>).exp
      if (typeof exp !== 'number') return false
      return exp > Math.floor(Date.now() / 1000)
    } catch {
      return false
    }
  }
  return verifyUnsignedToken(token)
}

const safeJsonParse = (value: string): unknown => {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const parseLayoutUpsertPayload = (payload: unknown): {
  ok: true
  value: { id?: string; name: string; template: string; elements: unknown[]; is_preset: number }
} | {
  ok: false
  error: string
} => {
  if (!isRecord(payload)) return { ok: false, error: 'Invalid JSON' }

  const idValue = payload.id
  const nameValue = payload.name
  const templateValue = payload.template
  const elementsValue = payload.elements
  const isPresetValue = payload.isPreset

  const id = typeof idValue === 'string' && idValue.trim().length > 0 ? idValue.trim() : undefined
  const name = typeof nameValue === 'string' ? nameValue.trim() : ''
  const template = typeof templateValue === 'string' ? templateValue.trim() : ''

  if (name.length === 0) return { ok: false, error: 'Name is required' }
  if (template.length === 0) return { ok: false, error: 'Template is required' }
  if (!Array.isArray(elementsValue)) return { ok: false, error: 'Elements must be an array' }

  const is_preset = isPresetValue === true ? 1 : 0

  return {
    ok: true,
    value: {
      id,
      name,
      template,
      elements: elementsValue,
      is_preset,
    },
  }
}

// Middleware for protected routes
import type { Context } from 'hono'

const authMiddleware = async (c: Context<{ Bindings: Env }>, next: () => Promise<void>) => {
  const auth = c.req.header('Authorization')
  console.warn('Auth header:', auth ? 'Present' : 'Missing')
  
  if (!auth || !auth.startsWith('Bearer ')) {
    console.error('No Bearer token found')
    return c.json({ error: 'Unauthorized: No Bearer token' }, 401)
  }

  const token = auth.substring(7)
  const ok = await verifyAuthToken(token, c.env.JWT_SECRET)
  if (!ok) {
    console.error('Token verification failed')
    return c.json({ error: 'Invalid or expired token' }, 401)
  }

  console.warn('Auth middleware passed')
  await next()
}

// Public Routes
app.get('/api/media', async (c) => {
  try {
    const db = c.env.expositor_db
    const result = await db
      .prepare('SELECT id, title, description, url, type FROM media ORDER BY order_index ASC')
      .all<Omit<MediaRow, 'order_index' | 'created_at'>>()

    return c.json(result.results || [])
  } catch (error) {
    console.error('Error fetching media:', error)
    return c.json({ error: 'Failed to fetch media' }, 500)
  }
})

/**
 * Process login payload and return a plain result object.
 * This pure function is exported for unit testing without requiring a full Hono Context.
 */
export function processLoginPayload(payload: unknown): { status: HttpStatusCode; body: Record<string, unknown> } {
  if (!payload || typeof payload !== 'object') {
    return { status: 400, body: { error: 'Invalid JSON' } }
  }

  // Defensive access
  const password = String((payload as Record<string, unknown>).password ?? '')

  if (password === 'secretpassword') {
    return { status: 200, body: { user: 'owner' } }
  }

  return { status: 401, body: { error: 'Invalid credentials' } }
}

app.post('/api/login', async (c) => {
  try {
    let body: unknown = {}
    try {
      body = await c.req.json()
    } catch (err) {
      console.error('Login JSON parse error:', err)
      // Use the exported pure function to keep behavior consistent
      const result = processLoginPayload(null)
      return c.json(result.body, result.status as HttpStatusCode)
    }

    const result = processLoginPayload(body)

    if (result.status !== 200) {
      return c.json(result.body, result.status as HttpStatusCode)
    }

    const user = String((result.body as Record<string, unknown>).user ?? 'owner')
    const token = await createAuthToken(user, c.env.JWT_SECRET)
    return c.json({ token }, 200)
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Failed to process login' }, 500)
  }
})

// Protected Routes
app.use('/api/protected/*', authMiddleware)

app.get('/api/protected/media', async (c) => {
  try {
    console.warn('GET /api/protected/media called')
    const db = c.env.expositor_db
    const result = await db
      .prepare('SELECT * FROM media ORDER BY order_index ASC')
      .all<MediaRow>()

    console.warn('Returned media:', result.results?.length || 0, 'items')
    return c.json(result.results || [])
  } catch (error) {
    console.error('Error fetching protected media:', error)
    return c.json({ error: 'Failed to fetch media', details: String(error) }, 500)
  }
})

app.post('/api/protected/media', async (c) => {
  try {
    console.warn('POST /api/protected/media called')
    const formData = await c.req.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string | null
    const description = formData.get('description') as string | null

    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }

    if (!title || title.trim().length === 0) {
      return c.json({ error: 'Title is required' }, 400)
    }

    const mediaType = file.type.startsWith('image/') ? 'image' : (file.type.startsWith('video/') ? 'video' : 'unknown')
    if (mediaType === 'unknown') {
      return c.json({ error: 'Unsupported file type' }, 400)
    }

    const maxBytes = mediaType === 'image' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES
    if (file.size > maxBytes) {
      const maxMb = Math.round(maxBytes / (1024 * 1024))
      return c.json({ error: `File too large. Maximum size is ${maxMb}MB` }, 400)
    }

    const fileKey = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`
    const buffer = await file.arrayBuffer()

    await c.env.expositor_storage.put(fileKey, buffer, {
      httpMetadata: {
        contentType: file.type,
      },
    })

    // mediaType computed above
    // Use the worker's media endpoint instead of a placeholder domain
    // This URL will be served by the /media/:key endpoint
    const workerUrl = new URL(c.req.url).origin
    const storageUrl = `${workerUrl}/media/${fileKey}`

    const db = c.env.expositor_db
    const maxOrder = await db.prepare('SELECT MAX(order_index) as max_order FROM media').first<{ max_order: number | null }>()
    const nextOrder = (maxOrder?.max_order ?? -1) + 1

    await db.prepare(
      'INSERT INTO media (title, description, url, type, order_index) VALUES (?, ?, ?, ?, ?)'
    ).bind(title, description || '', storageUrl, mediaType, nextOrder).run()

    return c.json({ success: true, message: 'Media uploaded successfully' }, 201)
  } catch (error) {
    console.error('Upload error:', error)
    return c.json({ error: 'Failed to upload media' }, 500)
  }
})

app.put('/api/protected/media/:id', async (c) => {
  try {
    console.warn('PUT /api/protected/media/:id called')
    const id = c.req.param('id')
    const body = await c.req.json() as UpdatePayload

    const db = c.env.expositor_db

    const media = await db.prepare('SELECT id FROM media WHERE id = ?').bind(id).first<{ id: number }>()
    if (!media) {
      return c.json({ error: 'Media not found' }, 404)
    }

    const updates: string[] = []
    const values: (string | number)[] = []

    if (body.title !== undefined) {
      updates.push('title = ?')
      values.push(body.title)
    }

    if (body.description !== undefined) {
      updates.push('description = ?')
      values.push(body.description)
    }

    if (body.order_index !== undefined) {
      updates.push('order_index = ?')
      values.push(body.order_index)
    }

    if (updates.length === 0) {
      return c.json({ error: 'No fields to update' }, 400)
    }

    values.push(Number(id))

    const query = `UPDATE media SET ${updates.join(', ')} WHERE id = ?`
    await db.prepare(query).bind(...values).run()

    return c.json({ success: true, message: 'Media updated successfully' })
  } catch (error) {
    console.error('Update error:', error)
    return c.json({ error: 'Failed to update media' }, 500)
  }
})

app.delete('/api/protected/media/:id', async (c) => {
  try {
    console.warn('DELETE /api/protected/media/:id called')
    const id = c.req.param('id')
    const db = c.env.expositor_db

    const media = await db.prepare('SELECT url FROM media WHERE id = ?').bind(id).first<{ url: string }>()
    if (!media) {
      return c.json({ error: 'Media not found' }, 404)
    }

    const fileKey = media.url.split('/').pop()
    if (fileKey) {
      try {
        await c.env.expositor_storage.delete(fileKey)
      } catch (storageError) {
        console.error('Error deleting from storage:', storageError)
      }
    }

    await db.prepare('DELETE FROM media WHERE id = ?').bind(id).run()

    return c.json({ success: true, message: 'Media deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    return c.json({ error: 'Failed to delete media' }, 500)
  }
})

// Layout persistence (D1)
app.get('/api/protected/layouts', async (c) => {
  try {
    const db = c.env.expositor_db
    const result = await db
      .prepare('SELECT id, name, template, elements_json, is_preset, created_at, updated_at FROM layouts ORDER BY updated_at DESC')
      .all<LayoutRowRaw>()

    const rows = (result.results || []).map((row): LayoutApiRow => {
      const parsed = safeJsonParse(row.elements_json)
      const elements = Array.isArray(parsed) ? parsed : []
      return {
        id: row.id,
        name: row.name,
        template: row.template,
        elements,
        is_preset: row.is_preset,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }
    })

    return c.json(rows)
  } catch (error) {
    console.error('Error listing layouts:', error)
    return c.json({ error: 'Failed to list layouts' }, 500)
  }
})

app.get('/api/protected/layouts/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const db = c.env.expositor_db
    const row = await db
      .prepare('SELECT id, name, template, elements_json, is_preset, created_at, updated_at FROM layouts WHERE id = ?')
      .bind(id)
      .first<LayoutRowRaw>()

    if (!row) return c.json({ error: 'Layout not found' }, 404)

    const parsed = safeJsonParse(row.elements_json)
    const elements = Array.isArray(parsed) ? parsed : []

    const result: LayoutApiRow = {
      id: row.id,
      name: row.name,
      template: row.template,
      elements,
      is_preset: row.is_preset,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }

    return c.json(result)
  } catch (error) {
    console.error('Error fetching layout:', error)
    return c.json({ error: 'Failed to fetch layout' }, 500)
  }
})

app.post('/api/protected/layouts', async (c) => {
  try {
    const payload = await c.req.json()
    const parsed = parseLayoutUpsertPayload(payload)
    if (!parsed.ok) return c.json({ error: parsed.error }, 400)

    const db = c.env.expositor_db
    const id = parsed.value.id ?? crypto.randomUUID()
    const elementsJson = JSON.stringify(parsed.value.elements)

    await db
      .prepare(
        "INSERT INTO layouts (id, name, template, elements_json, is_preset, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))"
      )
      .bind(id, parsed.value.name, parsed.value.template, elementsJson, parsed.value.is_preset)
      .run()

    const row = await db
      .prepare('SELECT id, name, template, elements_json, is_preset, created_at, updated_at FROM layouts WHERE id = ?')
      .bind(id)
      .first<LayoutRowRaw>()

    if (!row) return c.json({ error: 'Failed to create layout' }, 500)

    const elements = parsed.value.elements
    const result: LayoutApiRow = {
      id: row.id,
      name: row.name,
      template: row.template,
      elements,
      is_preset: row.is_preset,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }

    return c.json(result, 201)
  } catch (error) {
    console.error('Error creating layout:', error)
    return c.json({ error: 'Failed to create layout' }, 500)
  }
})

app.put('/api/protected/layouts/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const payload = await c.req.json()
    const parsed = parseLayoutUpsertPayload({ ...(isRecord(payload) ? payload : {}), id })
    if (!parsed.ok) return c.json({ error: parsed.error }, 400)

    const db = c.env.expositor_db
    const existing = await db.prepare('SELECT id FROM layouts WHERE id = ?').bind(id).first<{ id: string }>()
    if (!existing) return c.json({ error: 'Layout not found' }, 404)

    const elementsJson = JSON.stringify(parsed.value.elements)

    await db
      .prepare(
        "UPDATE layouts SET name = ?, template = ?, elements_json = ?, is_preset = ?, updated_at = datetime('now') WHERE id = ?"
      )
      .bind(parsed.value.name, parsed.value.template, elementsJson, parsed.value.is_preset, id)
      .run()

    const row = await db
      .prepare('SELECT id, name, template, elements_json, is_preset, created_at, updated_at FROM layouts WHERE id = ?')
      .bind(id)
      .first<LayoutRowRaw>()

    if (!row) return c.json({ error: 'Failed to update layout' }, 500)

    const result: LayoutApiRow = {
      id: row.id,
      name: row.name,
      template: row.template,
      elements: parsed.value.elements,
      is_preset: row.is_preset,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }

    return c.json(result)
  } catch (error) {
    console.error('Error updating layout:', error)
    return c.json({ error: 'Failed to update layout' }, 500)
  }
})

app.delete('/api/protected/layouts/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const db = c.env.expositor_db

    const existing = await db.prepare('SELECT id FROM layouts WHERE id = ?').bind(id).first<{ id: string }>()
    if (!existing) return c.json({ error: 'Layout not found' }, 404)

    await db.prepare('DELETE FROM layouts WHERE id = ?').bind(id).run()
    return c.json({ success: true })
  } catch (error) {
    console.error('Error deleting layout:', error)
    return c.json({ error: 'Failed to delete layout' }, 500)
  }
})

app.post('/api/protected/layouts/:id/publish', async (c) => {
  try {
    const id = c.req.param('id')
    const db = c.env.expositor_db

    const layout = await db
      .prepare('SELECT id, name, template, elements_json, is_preset, created_at, updated_at FROM layouts WHERE id = ?')
      .bind(id)
      .first<LayoutRowRaw>()

    if (!layout) return c.json({ error: 'Layout not found' }, 404)

    const publishedKey = `layout:${id}:published`
    const configJson = JSON.stringify({
      id: layout.id,
      name: layout.name,
      template: layout.template,
      elements: safeJsonParse(layout.elements_json),
      is_preset: layout.is_preset,
      created_at: layout.created_at,
      updated_at: layout.updated_at,
    })

    const existing = await db
      .prepare('SELECT id FROM site_config WHERE key = ?')
      .bind(publishedKey)
      .first<{ id: number }>()

    if (existing) {
      await db
        .prepare("UPDATE site_config SET config = ?, updated_at = datetime('now') WHERE key = ?")
        .bind(configJson, publishedKey)
        .run()
    } else {
      await db
        .prepare("INSERT INTO site_config (key, config, updated_at) VALUES (?, ?, datetime('now'))")
        .bind(publishedKey, configJson)
        .run()
    }

    console.warn(`Layout ${id} published successfully`)
    return c.json({ success: true, message: 'Layout published' })
  } catch (error) {
    console.error('Error publishing layout:', error)
    return c.json({ error: 'Failed to publish layout' }, 500)
  }
})

// Serve media files from R2 storage
app.get('/media/:key', async (c) => {
  try {
    const key = c.req.param('key')
    const object = await c.env.expositor_storage.get(key)
    
    if (!object) {
      return c.json({ error: 'Media not found' }, 404)
    }
    
    const headers = new Headers()
    
    // Get content type from R2 metadata or infer from extension
    const contentType = object.httpMetadata?.contentType || inferContentType(key)
    headers.set('Content-Type', contentType)
    headers.set('Cache-Control', 'public, max-age=31536000') // Cache for 1 year
    
    // Set CORS headers for media
    headers.set('Access-Control-Allow-Origin', '*')
    
    // For proper display of images/gifs
    if (contentType.startsWith('image/')) {
      headers.set('Content-Disposition', 'inline')
    }
    
    return new Response(object.body, { headers })
  } catch (error) {
    console.error('Error serving media:', error)
    return c.json({ error: 'Failed to serve media' }, 500)
  }
})

// Helper function to infer content type from file extension
function inferContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const mimeTypes: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'bmp': 'image/bmp',
    'avif': 'image/avif',
    // Videos
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'mkv': 'video/x-matroska',
    // Audio (in case needed)
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
  }
  return mimeTypes[ext || ''] || 'application/octet-stream'
}

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'healthy' })
})

// Default config template (used when no config exists)
const defaultConfigTemplate = {
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#1e293b',
    fontFamily: 'Inter',
    borderRadius: '0.5rem',
    mode: 'dark'
  },
  header: {
    enabled: true,
    navLinkStyle: 'none',
    navLinks: [],
    logo: { enabled: true, url: '' }
  },
  hero: {
    enabled: true,
    title: 'Showcase Your Creative Work',
    subtitle: 'Discover and explore a curated collection of stunning images and videos.',
    ctaText: 'Explore Media',
    ctaLink: '#gallery'
  },
  gallery: {
    enabled: true,
    title: 'Featured Media',
    subtitle: 'Explore our latest collection of high-quality images and videos'
  },
  footer: {
    enabled: true,
    copyright: '© 2024 Your Brand. All rights reserved.'
  },
  effects: {
    cursor: { enabled: false, type: 'default' },
    background: { enabled: false, type: 'none', speed: 1, intensity: 0.5 },
    cards: { animation: 'none', hover: 'none' },
    animations: { enabled: true, pageTransitions: true },
    particles: { enabled: false }
  }
}

// Config endpoints for the editor - Now with D1 storage
app.get('/api/config', async (c) => {
  try {
    const db = c.env.expositor_db
    // Try to get published config first (for public landing page)
    const result = await db.prepare(
      "SELECT config FROM site_config WHERE key = 'published'"
    ).first<{ config: string }>()
    
    if (result?.config) {
      return c.json(JSON.parse(result.config))
    }
    
    // Return default config if no published config exists
    return c.json(defaultConfigTemplate)
  } catch (error) {
    console.error('Error fetching config:', error)
    return c.json(defaultConfigTemplate)
  }
})

app.get('/api/config/:key', async (c) => {
  try {
    const key = c.req.param('key')
    const db = c.env.expositor_db
    
    // Fetch config by key (draft or published)
    const result = await db.prepare(
      "SELECT config FROM site_config WHERE key = ?"
    ).bind(key).first<{ config: string }>()
    
    if (result?.config) {
      console.warn(`Config loaded for key '${key}':`, result.config.substring(0, 200) + '...')
      return c.json(JSON.parse(result.config))
    }
    
    // Return default config if none exists
    console.warn(`No config found for key '${key}', returning default`)
    return c.json(defaultConfigTemplate)
  } catch (error) {
    console.error('Error fetching config key:', error)
    return c.json(defaultConfigTemplate)
  }
})

// Protected config save endpoint
app.post('/api/config', async (c) => {
  try {
    // Check auth
    const auth = c.req.header('Authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    const token = auth.substring(7)
    const ok = await verifyAuthToken(token, c.env.JWT_SECRET)
    if (!ok) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

    const body = await c.req.json()
    const db = c.env.expositor_db
    const configJson = JSON.stringify(body)
    
    // Check if draft exists
    const existing = await db.prepare(
      "SELECT id FROM site_config WHERE key = 'draft'"
    ).first<{ id: number }>()
    
    if (existing) {
      // Update existing draft
      await db.prepare(
        "UPDATE site_config SET config = ?, updated_at = datetime('now') WHERE key = 'draft'"
      ).bind(configJson).run()
    } else {
      // Insert new draft
      await db.prepare(
        "INSERT INTO site_config (key, config, updated_at) VALUES ('draft', ?, datetime('now'))"
      ).bind(configJson).run()
    }
    
    console.warn('Draft config saved successfully')
    return c.json({ success: true, message: 'Config saved' })
  } catch (error) {
    console.error('Error saving config:', error)
    return c.json({ error: 'Failed to save config', details: String(error) }, 500)
  }
})

// Protected publish endpoint - copies draft to published
app.post('/api/config/publish', async (c) => {
  try {
    // Check auth
    const auth = c.req.header('Authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    const token = auth.substring(7)
    const ok = await verifyAuthToken(token, c.env.JWT_SECRET)
    if (!ok) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

    const db = c.env.expositor_db
    
    // Get the draft config
    const draft = await db.prepare(
      "SELECT config FROM site_config WHERE key = 'draft'"
    ).first<{ config: string }>()
    
    if (!draft?.config) {
      return c.json({ error: 'No draft config to publish' }, 400)
    }
    
    // Check if published exists
    const existingPublished = await db.prepare(
      "SELECT id FROM site_config WHERE key = 'published'"
    ).first<{ id: number }>()
    
    if (existingPublished) {
      // Update existing published
      await db.prepare(
        "UPDATE site_config SET config = ?, updated_at = datetime('now') WHERE key = 'published'"
      ).bind(draft.config).run()
    } else {
      // Insert new published
      await db.prepare(
        "INSERT INTO site_config (key, config, updated_at) VALUES ('published', ?, datetime('now'))"
      ).bind(draft.config).run()
    }
    
    console.warn('Config published successfully')
    return c.json({ success: true, message: 'Config published' })
  } catch (error) {
    console.error('Error publishing config:', error)
    return c.json({ error: 'Failed to publish config' }, 500)
  }
})

// Serve static assets from the public directory
app.get('*', async (c) => {
  // Try to serve static files
  const url = new URL(c.req.url)
  let pathname = url.pathname

  // Default to index.html for root path
  if (pathname === '/') {
    pathname = '/index.html'
  }

  try {
    const response = await c.env.ASSETS.fetch(new Request(new URL(pathname, c.req.url), c.req))
    
    // If asset is found, return it
    if (response.status === 200) {
      return response
    }
  } catch {
    // Asset not found, continue
  }

  // If it's an API route or asset we couldn't find, return 404
  if (pathname.startsWith('/api/')) {
    return c.json({ error: 'Not found' }, 404)
  }

  // For SPA, serve index.html for any route not found (client-side routing)
  try {
    return await c.env.ASSETS.fetch(new Request(new URL('/index.html', c.req.url), c.req))
  } catch {
    return c.json({ error: 'Not found' }, 404)
  }
})

export default app
