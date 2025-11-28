import React, { useState, useRef } from 'react'
import { Upload, Trash2, AlertCircle } from 'lucide-react'
import { PanelHeader } from '../shared'
import { getAuthToken, API_BASE_URL } from '../../../../utils/api'

interface MediaFile {
  id: number
  title: string
  description: string
  url: string
  type: 'image' | 'video'
  created_at?: string
}

export const MediaPanel: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles) return

    setIsUploading(true)
    setError(null)

    try {
      const token = getAuthToken()
      if (!token) {
        setError('Not authenticated. Please log in again.')
        return
      }
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', file.name.replace(/\.[^/.]+$/, ''))
        formData.append('description', `Uploaded: ${new Date().toLocaleDateString()}`)

        const response = await fetch(`${API_BASE_URL}/protected/media`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Upload failed: ${response.statusText}`)
        }
      }

      // Reload files after upload
      await loadFiles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const loadFiles = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.warn('No auth token available')
        return
      }

      const response = await fetch(`${API_BASE_URL}/protected/media`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFiles(data)
      } else {
        const errorData = await response.json()
        console.error('Failed to load files:', errorData)
      }
    } catch (err) {
      console.error('Failed to load files:', err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const token = getAuthToken()
      if (!token) {
        setError('Not authenticated. Please log in again.')
        return
      }

      const response = await fetch(`${API_BASE_URL}/protected/media/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setFiles(files.filter(f => f.id !== id))
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete file')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  React.useEffect(() => {
    loadFiles()
  }, [])

  return (
    <div className="h-full flex flex-col bg-slate-900/40 border-r border-slate-800/50">
      <PanelHeader title="Media Manager" />

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Upload Section */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'Uploading...' : 'Upload Media'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Files List */}
        <div className="space-y-2">
          {files.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No media files uploaded yet</p>
          ) : (
            files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{file.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{file.type}</p>
                </div>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="flex-shrink-0 p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-2"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
