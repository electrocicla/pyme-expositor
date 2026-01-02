import { API_BASE_URL } from '../utils'

// ============ TYPES & INTERFACES ============

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
  status: 'validating' | 'compressing' | 'uploading' | 'finalizing'
  speed?: number // bytes per second
  estimatedTimeRemaining?: number // seconds
}

export interface UploadLogEntry {
  timestamp: string;
  eventType: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  title: string;
  duration?: number;
  error?: string;
  attemptNumber?: number;
}

export interface MediaUploadResponse {
  success: boolean
  message: string
  data?: {
    fileKey: string
    title: string
    description: string
    type: 'image' | 'video'
    url: string
    originalSize: number
    compressedSize?: number
    compressionRatio?: number
  }
}

export interface MediaUploadError {
  error: string
  details?: string
  code?: string
  retryable?: boolean
}

export interface CompressionResult {
  blob: Blob
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

export interface RetryConfig {
  maxRetries: number
  initialDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
}

// ============ CONSTANTS ============

export const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
export const VALID_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
export const ALL_VALID_TYPES = [...VALID_IMAGE_TYPES, ...VALID_VIDEO_TYPES]

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB for images
export const MAX_VIDEO_SIZE = 200 * 1024 * 1024 // 200MB for videos
export const MAX_FILE_SIZE = MAX_VIDEO_SIZE
export const ALLOWED_EXTENSIONS = '.jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov'

// Image compression settings
export const IMAGE_COMPRESSION_OPTIONS = {
  maxWidth: 2560,
  maxHeight: 2560,
  quality: 0.85 // 85% quality
}

// Retry configuration
export const RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2
}

// ============ UTILITIES ============

/**
 * Format bytes to human readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get file type category
 */
export const getFileTypeCategory = (mimeType: string): 'image' | 'video' | 'unknown' => {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  return 'unknown'
}

/**
 * Sleep for specified milliseconds
 */
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Calculate exponential backoff delay
 */
const getRetryDelay = (attemptNumber: number, config: RetryConfig): number => {
  const delay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attemptNumber - 1)
  return Math.min(delay, config.maxDelayMs)
}

// ============ VALIDATION ============

/**
 * Comprehensive file validation
 */
export const validateFile = (
  file: File,
  options?: {
    maxSize?: number
    allowedTypes?: string[]
  }
): { valid: boolean; error?: string } => {
  if (!file) {
    return {
      valid: false,
      error: 'No file provided'
    }
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty'
    }
  }

  if (!file.name || file.name.length === 0) {
    return {
      valid: false,
      error: 'File must have a valid name'
    }
  }

  const allowedTypes = options?.allowedTypes || ALL_VALID_TYPES

  if (!allowedTypes.includes(file.type)) {
    const typesList = allowedTypes.includes('image/jpeg') ? 'JPEG, PNG, GIF, WebP, MP4, WebM' : 'specified types'
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${typesList}. Got: ${file.type || 'unknown'}`
    }
  }

  let maxSize = options?.maxSize || MAX_FILE_SIZE
  if (file.type.startsWith('image/')) {
    maxSize = MAX_IMAGE_SIZE
  } else if (file.type.startsWith('video/')) {
    maxSize = MAX_VIDEO_SIZE
  }

  if (file.size > maxSize) {
    const maxMB = (maxSize / (1024 * 1024)).toFixed(0)
    const fileMB = (file.size / (1024 * 1024)).toFixed(2)
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxMB}MB, got ${fileMB}MB`
    }
  }

  return { valid: true }
}

/**
 * Validate text inputs
 */
export const validateInputs = (
  title: string,
  description: string
): { valid: boolean; error?: string } => {
  if (!title || title.trim().length === 0) {
    return {
      valid: false,
      error: 'Title is required'
    }
  }

  if (title.trim().length > 255) {
    return {
      valid: false,
      error: 'Title must be 255 characters or less'
    }
  }

  if (description && description.length > 1000) {
    return {
      valid: false,
      error: 'Description must be 1000 characters or less'
    }
  }

  return { valid: true }
}

// ============ IMAGE COMPRESSION ============

/**
 * Compress image using canvas
 */
export const compressImage = async (
  file: File,
  onProgress?: (status: string) => void
): Promise<CompressionResult> => {
  onProgress?.('Compressing image...')

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const img = new Image()

        img.onload = () => {
          try {
            // Calculate new dimensions maintaining aspect ratio
            let width = img.width
            let height = img.height
            const maxWidth = IMAGE_COMPRESSION_OPTIONS.maxWidth || 2560
            const maxHeight = IMAGE_COMPRESSION_OPTIONS.maxHeight || 2560

            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height)
              width *= ratio
              height *= ratio
            }

            // Create canvas and compress
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            if (!ctx) {
              reject(new Error('Failed to get canvas context'))
              return
            }

            ctx.drawImage(img, 0, 0, width, height)

            // Convert to blob with quality settings
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Failed to compress image'))
                  return
                }

                resolve({
                  blob,
                  originalSize: file.size,
                  compressedSize: blob.size,
                  compressionRatio: (1 - blob.size / file.size) * 100
                })
              },
              file.type === 'image/png' ? 'image/png' : 'image/jpeg',
              IMAGE_COMPRESSION_OPTIONS.quality || 0.85
            )
          } catch (error) {
            reject(error)
          }
        }

        img.onerror = () => {
          reject(new Error('Failed to load image'))
        }

        img.src = e.target?.result as string
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Prepare file for upload (compress if image)
 */
export const prepareFile = async (
  file: File,
  onProgress?: (status: string) => void
): Promise<{ fileToUpload: File; originalSize: number; compressedSize?: number }> => {
  const category = getFileTypeCategory(file.type)

  if (category === 'image' && file.type !== 'image/gif') {
    try {
      const result = await compressImage(file, onProgress)
      const compressedFile = new File([result.blob], file.name, {
        type: file.type,
        lastModified: Date.now()
      })

      return {
        fileToUpload: compressedFile,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize
      }
    } catch (error) {
      console.warn('Image compression failed, using original:', error)
      return {
        fileToUpload: file,
        originalSize: file.size
      }
    }
  }

  return {
    fileToUpload: file,
    originalSize: file.size
  }
}

// ============ UPLOAD ============

/**
 * Main upload function with retry logic, compression, and progress tracking
 */
export const uploadMedia = async (
  file: File,
  title: string,
  description: string,
  token: string,
  onProgress?: (progress: UploadProgress) => void,
  retryConfig?: Partial<RetryConfig>
): Promise<{ response: MediaUploadResponse; error: null } | { response: null; error: MediaUploadError }> => {
  const config = { ...RETRY_CONFIG, ...retryConfig }
  let lastError: MediaUploadError | null = null

  // Validate inputs
  if (!file) {
    return {
      response: null,
      error: { error: 'No file provided', retryable: false }
    }
  }

  if (!title || title.trim().length === 0) {
    return {
      response: null,
      error: { error: 'Title is required', retryable: false }
    }
  }

  if (!token) {
    return {
      response: null,
      error: { error: 'Authentication required', retryable: false }
    }
  }

  // Validate file
  const fileValidation = validateFile(file)
  if (!fileValidation.valid) {
    return {
      response: null,
      error: { error: fileValidation.error || 'Invalid file', retryable: false }
    }
  }

  // Validate inputs
  const inputValidation = validateInputs(title, description)
  if (!inputValidation.valid) {
    return {
      response: null,
      error: { error: inputValidation.error || 'Invalid input', retryable: false }
    }
  }

  // Attempt upload with retries
  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      // Step 1: Prepare file (compression)
      onProgress?.({
        loaded: 0,
        total: file.size,
        percentage: 0,
        status: 'compressing',
        speed: 0
      })

      const prepared = await prepareFile(file, (status) => {
        console.warn(status)
      })

      const fileToUpload = prepared.fileToUpload
      const totalSize = fileToUpload.size

      // Step 2: Create form data
      onProgress?.({
        loaded: 0,
        total: totalSize,
        percentage: 0,
        status: 'uploading',
        speed: 0
      })

      // Upload using XMLHttpRequest for better progress tracking
      const result = await uploadWithProgress(
        fileToUpload,
        title,
        description,
        token,
        (progress) => {
          // Calculate speed and ETA
          const speed = totalSize / (Date.now() / 1000)
          const remaining = totalSize - progress
          const eta = speed > 0 ? remaining / speed : 0

          onProgress?.({
            loaded: progress,
            total: totalSize,
            percentage: Math.round((progress / totalSize) * 100),
            status: 'uploading',
            speed,
            estimatedTimeRemaining: eta
          })
        }
      )

      if (result.response) {
        // Success
        onProgress?.({
          loaded: totalSize,
          total: totalSize,
          percentage: 100,
          status: 'finalizing'
        })

        return {
          response: {
            ...result.response,
            data: {
              fileKey: result.response.data?.fileKey || '',
              title: result.response.data?.title || '',
              description: result.response.data?.description || '',
              type: result.response.data?.type || 'image',
              url: result.response.data?.url || '',
              originalSize: prepared.originalSize,
              compressedSize: prepared.compressedSize,
              compressionRatio: result.response.data?.compressionRatio
            }
          },
          error: null
        }
      } else {
        // Error
        lastError = result.error
        
        // Check if retryable
        if (!lastError?.retryable && attempt === 1) {
          return { response: null, error: lastError }
        }

        if (attempt < config.maxRetries) {
          const delay = getRetryDelay(attempt, config)
          console.warn(`Upload attempt ${attempt} failed, retrying in ${delay}ms...`, lastError)
          await sleep(delay)
          continue
        }
      }
    } catch (error) {
      lastError = {
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : String(error),
        retryable: true
      }

      if (attempt < config.maxRetries) {
        const delay = getRetryDelay(attempt, config)
        console.warn(`Upload attempt ${attempt} failed with exception, retrying in ${delay}ms...`, error)
        await sleep(delay)
        continue
      }
    }
  }

  return {
    response: null,
    error: lastError || {
      error: 'Upload failed after all retry attempts',
      retryable: false
    }
  }
}

/**
 * Upload file with progress tracking using XMLHttpRequest
 */
const uploadWithProgress = async (
  file: File,
  title: string,
  description: string,
  token: string,
  onProgress: (loaded: number) => void
): Promise<{ response: MediaUploadResponse; error: null } | { response: null; error: MediaUploadError }> => {
  return new Promise((resolve) => {
    const uploadId = Math.random().toString(36).substring(7)
    const uploadStartTime = Date.now()
    
    console.warn(`[Upload-${uploadId}] === Starting XHR Upload ===`)
    console.warn(`[Upload-${uploadId}] File: ${file.name}, Size: ${file.size} bytes, Type: ${file.type}`)
    console.warn(`[Upload-${uploadId}] Title: "${title}", Description: "${description}"`)
    console.warn(`[Upload-${uploadId}] Token present: ${!!token}, Token length: ${token?.length || 0}`)
    console.warn(`[Upload-${uploadId}] API Base URL: ${API_BASE_URL}`)

    const xhr = new XMLHttpRequest()
    const formData = new FormData()

    formData.append('file', file)
    formData.append('title', title.trim())
    formData.append('description', description?.trim() || '')

    console.warn(`[Upload-${uploadId}] FormData created, entries:`)
    for (const [key, value] of formData.entries()) {
      if (key === 'file') {
        console.warn(`[Upload-${uploadId}]   - file: File object (${(value as File).size} bytes)`)
      } else {
        console.warn(`[Upload-${uploadId}]   - ${key}: ${String(value).substring(0, 50)}`)
      }
    }

    let responseReceived = false
    let progressEventFired = false

    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (!progressEventFired) {
        console.warn(`[Upload-${uploadId}] First progress event fired`)
        progressEventFired = true
      }
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100)
        console.warn(`[Upload-${uploadId}] Progress: ${event.loaded}/${event.total} (${percent}%)`)
        onProgress(event.loaded)
      }
    })

    // Handle completion
    xhr.addEventListener('load', () => {
      responseReceived = true
      const duration = Date.now() - uploadStartTime
      console.warn(`[Upload-${uploadId}] Load event fired after ${duration}ms`)
      console.warn(`[Upload-${uploadId}] Status: ${xhr.status}`)
      console.warn(`[Upload-${uploadId}] Response headers: ${JSON.stringify({
        contentType: xhr.getResponseHeader('content-type'),
        contentLength: xhr.getResponseHeader('content-length')
      })}`)
      console.warn(`[Upload-${uploadId}] Response body (first 500 chars): ${xhr.responseText?.substring(0, 500)}`)

      try {
        const status = xhr.status
        const responseText = xhr.responseText

        if (!responseText) {
          console.warn(`[Upload-${uploadId}] Empty response body`)
          resolve({
            response: null,
            error: {
              error: 'Empty response from server',
              code: String(status),
              retryable: status >= 500
            }
          })
          return
        }

        let data
        try {
          data = JSON.parse(responseText)
          console.warn(`[Upload-${uploadId}] Parsed JSON response:`, data)
        } catch (parseError) {
          console.error(`[Upload-${uploadId}] JSON parse error:`, parseError)
          resolve({
            response: null,
            error: {
              error: 'Invalid server response format',
              details: responseText,
              code: String(status),
              retryable: false
            }
          })
          return
        }

        if (status === 201 || status === 200) {
          if (data.success) {
            console.warn(`[Upload-${uploadId}] ✓ SUCCESS`)
            resolve({
              response: data as MediaUploadResponse,
              error: null
            })
          } else {
            console.warn(`[Upload-${uploadId}] Server returned success=false: ${data.error}`)
            resolve({
              response: null,
              error: {
                error: data.error || 'Upload failed',
                details: data.details,
                code: String(status),
                retryable: false
              }
            })
          }
        } else if (status === 400 || status === 401 || status === 403 || status === 413) {
          console.warn(`[Upload-${uploadId}] Client error ${status}: ${data.error}`)
          resolve({
            response: null,
            error: {
              error: data.error || `Upload failed (${status})`,
              details: data.details,
              code: String(status),
              retryable: false
            }
          })
        } else if (status >= 500) {
          console.error(`[Upload-${uploadId}] Server error ${status}: ${data.error}`)
          resolve({
            response: null,
            error: {
              error: data.error || `Server error (${status})`,
              details: data.details,
              code: String(status),
              retryable: true
            }
          })
        } else {
          console.warn(`[Upload-${uploadId}] Unexpected status ${status}: ${data.error}`)
          resolve({
            response: null,
            error: {
              error: `HTTP ${status}: ${data.error || 'Unknown error'}`,
              code: String(status),
              retryable: false
            }
          })
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to parse response'
        console.error(`[Upload-${uploadId}] Exception during response handling:`, error)
        resolve({
          response: null,
          error: {
            error: message,
            details: xhr.responseText,
            code: String(xhr.status),
            retryable: xhr.status >= 500
          }
        })
      }
    })

    // Handle network errors
    xhr.addEventListener('error', () => {
      if (!responseReceived) {
        const duration = Date.now() - uploadStartTime
        console.error(`[Upload-${uploadId}] Network error after ${duration}ms`)
        resolve({
          response: null,
          error: {
            error: 'Network error. Check your connection',
            details: xhr.statusText,
            retryable: true
          }
        })
      }
    })

    // Handle abort
    xhr.addEventListener('abort', () => {
      if (!responseReceived) {
        const duration = Date.now() - uploadStartTime
        console.warn(`[Upload-${uploadId}] Aborted after ${duration}ms`)
        resolve({
          response: null,
          error: {
            error: 'Upload cancelled',
            retryable: false
          }
        })
      }
    })

    // Handle timeout
    xhr.addEventListener('timeout', () => {
      if (!responseReceived) {
        const duration = Date.now() - uploadStartTime
        console.error(`[Upload-${uploadId}] Timeout after ${duration}ms`)
        resolve({
          response: null,
          error: {
            error: 'Upload timeout',
            details: 'The upload took too long to complete',
            retryable: true
          }
        })
      }
    })

    // Configure request
    xhr.timeout = 600000
    const uploadUrl = `${API_BASE_URL}/protected/media`
    console.warn(`[Upload-${uploadId}] Opening POST to: ${uploadUrl}`)
    xhr.open('POST', uploadUrl)
    
    console.warn(`[Upload-${uploadId}] Setting Authorization header (${token?.length || 0} chars)`)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    
    console.warn(`[Upload-${uploadId}] Calling xhr.send(formData)...`)
    xhr.send(formData)
    console.warn(`[Upload-${uploadId}] xhr.send() returned control`)
  })
}

// ============ LOGGING ============

/**
 * Log upload event for monitoring
 */
export const logUploadEvent = (
  eventType: 'start' | 'success' | 'error' | 'retry',
  data: {
    fileName: string
    fileSize: number
    fileType: string
    title: string
    duration?: number
    error?: string
    attemptNumber?: number
  }
): void => {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    eventType,
    ...data
  }

  console.warn(`[Media Upload] ${eventType.toUpperCase()}:`, logEntry)

  // Store in sessionStorage for debugging
  try {
    const existing = sessionStorage.getItem('mediaUploadLogs') || '[]'
    const logs = JSON.parse(existing)
    logs.push(logEntry)
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.shift()
    }
    sessionStorage.setItem('mediaUploadLogs', JSON.stringify(logs))
  } catch (e) {
    console.warn('Failed to store upload logs', e)
  }
}

/**
 * Get upload logs from session storage
 */
export const getUploadLogs = (): UploadLogEntry[] => {
  try {
    const logs = sessionStorage.getItem('mediaUploadLogs')
    return logs ? JSON.parse(logs) : []
  } catch {
    return []
  }
}

/**
 * Clear upload logs
 */
export const clearUploadLogs = (): void => {
  try {
    sessionStorage.removeItem('mediaUploadLogs')
  } catch {
    // Ignore
  }
}
