import { Hono } from 'hono'
import { cors } from 'hono/cors'

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

interface UploadPayload {
  title: string
  description: string
}

interface UpdatePayload {
  title?: string
  description?: string
  order_index?: number
}

interface LoginPayload {
  password: string
}

interface TokenPayload {
  user: string
  exp: number
}

const app = new Hono<{ Bindings: Env }>()

// CORS middleware
app.use('*', cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://pyme-expositor.pages.dev',
    'https://master.pyme-expositor.pages.dev',
    'https://production-ready-eslint-fixe.pyme-expositor.pages.dev'
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}))

// Simple JWT token generation and verification
const generateToken = (secret: string): string => {
  const payload: TokenPayload = {
    user: 'owner',
    exp: Date.now() + 3600000
  }
  return btoa(JSON.stringify(payload))
}

const verifyToken = (token: string, secret: string): boolean => {
  try {
    const decoded = JSON.parse(atob(token)) as TokenPayload
    return decoded.exp > Date.now()
  } catch {
    return false
  }
}

// Middleware for protected routes
const authMiddleware = async (c: any, next: any) => {
  const auth = c.req.header('Authorization')
  console.log('Auth header:', auth ? 'Present' : 'Missing')
  
  if (!auth || !auth.startsWith('Bearer ')) {
    console.log('No Bearer token found')
    return c.json({ error: 'Unauthorized: No Bearer token' }, 401)
  }

  const token = auth.substring(7)
  if (!verifyToken(token, c.env.JWT_SECRET)) {
    console.log('Token verification failed')
    return c.json({ error: 'Invalid or expired token' }, 401)
  }

  console.log('Auth middleware passed')
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

app.post('/api/login', async (c) => {
  try {
    const body = await c.req.json() as LoginPayload

    const password = body.password

    if (password === 'secretpassword') {
      const token = generateToken(c.env.JWT_SECRET)
      return c.json({ token })
    }

    return c.json({ error: 'Invalid credentials' }, 401)
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Failed to process login' }, 500)
  }
})

// Protected Routes
app.use('/api/protected/*', authMiddleware)

app.get('/api/protected/media', async (c) => {
  try {
    console.log('GET /api/protected/media called')
    const db = c.env.expositor_db
    const result = await db
      .prepare('SELECT * FROM media ORDER BY order_index ASC')
      .all<MediaRow>()

    console.log('Returned media:', result.results?.length || 0, 'items')
    return c.json(result.results || [])
  } catch (error) {
    console.error('Error fetching protected media:', error)
    return c.json({ error: 'Failed to fetch media', details: String(error) }, 500)
  }
})

app.post('/api/protected/media', async (c) => {
  try {
    console.log('POST /api/protected/media called')
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

    const fileKey = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`
    const buffer = await file.arrayBuffer()

    await c.env.expositor_storage.put(fileKey, buffer, {
      httpMetadata: {
        contentType: file.type,
      },
    })

    const mediaType = file.type.startsWith('image/') ? 'image' : 'video'
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
    console.log('PUT /api/protected/media/:id called')
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
    console.log('DELETE /api/protected/media/:id called')
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
      console.log(`Config loaded for key '${key}':`, result.config.substring(0, 200) + '...')
      return c.json(JSON.parse(result.config))
    }
    
    // Return default config if none exists
    console.log(`No config found for key '${key}', returning default`)
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
    if (!verifyToken(token, c.env.JWT_SECRET)) {
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
    
    console.log('Draft config saved successfully')
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
    if (!verifyToken(token, c.env.JWT_SECRET)) {
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
    
    console.log('Config published successfully')
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
  } catch (e) {
    // Asset not found, continue
  }

  // If it's an API route or asset we couldn't find, return 404
  if (pathname.startsWith('/api/')) {
    return c.json({ error: 'Not found' }, 404)
  }

  // For SPA, serve index.html for any route not found (client-side routing)
  try {
    return await c.env.ASSETS.fetch(new Request(new URL('/index.html', c.req.url), c.req))
  } catch (e) {
    return c.json({ error: 'Not found' }, 404)
  }
})

export default app
