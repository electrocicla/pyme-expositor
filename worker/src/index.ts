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
  origin: ['http://localhost:5173', 'http://localhost:3000'],
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
const authMiddleware = (c: any, next: any) => {
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = auth.substring(7)
  if (!verifyToken(token, c.env.JWT_SECRET)) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }

  return next()
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
app.get('/api/protected/media', async (c) => {
  try {
    const auth = c.req.header('Authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = auth.substring(7)
    if (!verifyToken(token, c.env.JWT_SECRET)) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

    const db = c.env.expositor_db
    const result = await db
      .prepare('SELECT * FROM media ORDER BY order_index ASC')
      .all<MediaRow>()

    return c.json(result.results || [])
  } catch (error) {
    console.error('Error fetching protected media:', error)
    return c.json({ error: 'Failed to fetch media' }, 500)
  }
})

app.post('/api/protected/media', async (c) => {
  try {
    const auth = c.req.header('Authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = auth.substring(7)
    if (!verifyToken(token, c.env.JWT_SECRET)) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

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
    const storageUrl = `https://storage.example.com/${fileKey}`

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
    const auth = c.req.header('Authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = auth.substring(7)
    if (!verifyToken(token, c.env.JWT_SECRET)) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

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
    const auth = c.req.header('Authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = auth.substring(7)
    if (!verifyToken(token, c.env.JWT_SECRET)) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

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

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'healthy' })
})

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404)
})

export default app
