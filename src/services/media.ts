import type { Media, UpdateMediaPayload } from '../types'
import { API_BASE_URL, getAuthToken, createHeaders, removeAuthToken } from '../utils'

class MediaService {
  async getPublicMedia(): Promise<Media[]> {
    const response = await fetch(`${API_BASE_URL}/media`)
    if (!response.ok) throw new Error('Failed to fetch media')
    return response.json() as Promise<Media[]>
  }

  async getProtectedMedia(): Promise<Media[]> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token')

    const response = await fetch(`${API_BASE_URL}/protected/media`, {
      headers: createHeaders(token)
    })

    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken()
        throw new Error('Session expired')
      }
      throw new Error('Failed to fetch media')
    }

    return response.json() as Promise<Media[]>
  }

  async uploadMedia(file: File, title: string, description?: string): Promise<void> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    if (description) formData.append('description', description)

    const response = await fetch(`${API_BASE_URL}/protected/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      const error = await response.json() as { error?: string }
      throw new Error(error.error || 'Upload failed')
    }
  }

  async updateMedia(id: number, payload: UpdateMediaPayload): Promise<void> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token')

    const response = await fetch(`${API_BASE_URL}/protected/media/${id}`, {
      method: 'PUT',
      headers: createHeaders(token),
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const error = await response.json() as { error?: string }
      throw new Error(error.error || 'Update failed')
    }
  }

  async deleteMedia(id: number): Promise<void> {
    const token = getAuthToken()
    if (!token) throw new Error('No authentication token')

    const response = await fetch(`${API_BASE_URL}/protected/media/${id}`, {
      method: 'DELETE',
      headers: createHeaders(token)
    })

    if (!response.ok) {
      const error = await response.json() as { error?: string }
      throw new Error(error.error || 'Delete failed')
    }
  }
}

export const mediaService = new MediaService()
