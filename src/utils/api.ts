const API_WORKER_URL = 'https://pyme-expositor-worker.electrocicla.workers.dev'

export const API_BASE_URL = import.meta.env.DEV 
  ? '/api'
  : `${API_WORKER_URL}/api`

export interface ApiMedia {
  id: number
  title: string
  description?: string
  url: string
  type: 'image' | 'video'
  category_id?: string
  order_index?: number
  tags?: string[]
}

export const createHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

export const getAuthToken = (): string | undefined => {
  return localStorage.getItem('auth-token') ?? undefined
}

export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth-token', token)
}

export const removeAuthToken = (): void => {
  localStorage.removeItem('auth-token')
}

// API client methods
 
export const api = {
  async get<T>(path: string): Promise<T> {
    const token = getAuthToken()
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: createHeaders(token),
    })
    if (!res.ok) throw new Error(`API error: ${res.statusText}`)
    return res.json()
  },

  async post<T>(path: string, data: unknown): Promise<T> {
    const token = getAuthToken()
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: createHeaders(token),
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(`API error: ${res.statusText}`)
    return res.json()
  },

  async put<T>(path: string, data: unknown): Promise<T> {
    const token = getAuthToken()
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: createHeaders(token),
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(`API error: ${res.statusText}`)
    return res.json()
  },

  async delete<T>(path: string): Promise<T> {
    const token = getAuthToken()
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: createHeaders(token),
    })
    if (!res.ok) throw new Error(`API error: ${res.statusText}`)
    return res.json()
  },

  // Convenience methods
  getMedia(): Promise<ApiMedia[]> {
    return api.get<ApiMedia[]>('/media')
  },

  getProtectedMedia(): Promise<ApiMedia[]> {
    return api.get<ApiMedia[]>('/protected/media')
  }
  ,
  getConfig(key?: string): Promise<Record<string, unknown>> {
    const path = key ? `/config/${key}` : '/config'
    return api.get<Record<string, unknown>>(path)
  },

  saveConfig(config: unknown): Promise<void> {
    return api.post<void>('/config', config)
  },

  publishConfig(): Promise<void> {
    return api.post<void>('/config/publish', {})
  },
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export const validateFile = (
  file: File,
  maxSize: number = 100 * 1024 * 1024
): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Unsupported file type' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: `File too large. Maximum: ${formatFileSize(maxSize)}` }
  }

  return { valid: true }
}

export const truncateText = (text: string, maxLength: number = 50): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof TypeError) {
    return error.message.includes('Failed to fetch') || error.message.includes('Network')
  }
  return false
}

export const retry = async <T,>(
  fn: () => Promise<T>,
  options = { maxAttempts: 3, delayMs: 1000 }
): Promise<T> => {
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === options.maxAttempts || !isRetryableError(error)) {
        throw error
      }
      await delay(options.delayMs * attempt)
    }
  }
  throw new Error('Max retry attempts exceeded')
}
