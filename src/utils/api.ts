export const API_BASE_URL = '/api'

export const createHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth-token')
}

export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth-token', token)
}

export const removeAuthToken = (): void => {
  localStorage.removeItem('auth-token')
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
    return { valid: false, error: 'Tipo de archivo no soportado' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: `Archivo muy grande. Máximo: ${formatFileSize(maxSize)}` }
  }

  return { valid: true }
}

export const truncateText = (text: string, maxLength: number = 50): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('es-ES', {
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
