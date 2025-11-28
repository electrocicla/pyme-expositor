import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTheme } from './ThemeProvider'

interface Media {
  id: number
  title: string
  description: string
  url: string
  type: string
  order_index: number
}

interface EditingState {
  id: number | null
  field: 'title' | 'description' | null
}

const Dashboard = () => {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editing, setEditing] = useState<EditingState>({ id: null, field: null })
  const [editValues, setEditValues] = useState<Record<number, { title: string; description: string }>>({})
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchMedia()
  }, [token, navigate])

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/protected/media', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setMedia(data)
        const initialValues: Record<number, { title: string; description: string }> = {}
        data.forEach((m: Media) => {
          initialValues[m.id] = { title: m.title, description: m.description }
        })
        setEditValues(initialValues)
      } else {
        localStorage.removeItem('token')
        navigate('/login')
      }
    } catch (err) {
      setError('Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)
    const file = formData.get('file') as File

    if (!file) {
      setError('Please select a file')
      setUploading(false)
      return
    }

    try {
      const res = await fetch('/api/protected/media', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })

      if (res.ok) {
        setSuccess('Media uploaded successfully!')
        e.currentTarget.reset()
        await fetchMedia()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to upload media')
      }
    } catch (err) {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleEditStart = (id: number, field: 'title' | 'description') => {
    setEditing({ id, field })
  }

  const handleEditChange = (id: number, field: 'title' | 'description', value: string) => {
    setEditValues(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }))
  }

  const handleEditSave = async (id: number) => {
    const values = editValues[id]
    if (!values) return

    try {
      const res = await fetch(`/api/protected/media/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description
        })
      })

      if (res.ok) {
        setMedia(media.map(m =>
          m.id === id
            ? { ...m, title: values.title, description: values.description }
            : m
        ))
        setEditing({ id: null, field: null })
        setSuccess('Changes saved!')
        setTimeout(() => setSuccess(''), 2000)
      } else {
        setError('Failed to save changes')
      }
    } catch (err) {
      setError('Save failed. Please try again.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this media? This action cannot be undone.')) {
      return
    }

    try {
      const res = await fetch(`/api/protected/media/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        setMedia(media.filter(m => m.id !== id))
        setSuccess('Media deleted successfully')
        setTimeout(() => setSuccess(''), 2000)
      } else {
        setError('Failed to delete media')
      }
    } catch (err) {
      setError('Delete failed. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-400 animate-spin mx-auto" />
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/20 dark:border-slate-700/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.293 1.293a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.828a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 7a3 3 0 100 6 3 3 0 000-6zm-4.293-1.293a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414L5.707 7.414a1 1 0 010-1.414zM3 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm0-4a1 1 0 011 1v1a1 1 0 11-2 0V7a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              View Landing
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Alerts */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3 animate-in fade-in">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex gap-3 animate-in fade-in">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-green-800 dark:text-green-300">{success}</p>
          </div>
        )}

        {/* Upload Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Upload New Media
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Add images or videos to your collection
              </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 sm:space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Select File
                </label>
                <label className="relative block border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 sm:p-8 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-700/50">
                  <input
                    name="file"
                    type="file"
                    accept="image/*,video/*"
                    disabled={uploading}
                    className="hidden"
                    required
                  />
                  <div className="text-center space-y-2">
                    <svg className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M2 12a10 10 0 1020 0 10 10 0 01-20 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        PNG, JPG, GIF, MP4, WebM up to 100MB
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Title and Description Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter media title"
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Description
                  </label>
                  <input
                    id="description"
                    name="description"
                    type="text"
                    placeholder="Enter media description"
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Upload Button */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Upload Media
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Media Grid Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Your Media Collection
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {media.length} {media.length === 1 ? 'item' : 'items'} in your collection
            </p>
          </div>

          {media.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {media.map(m => (
                <div
                  key={m.id}
                  className="group bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300"
                >
                  {/* Media Preview */}
                  <div className="relative aspect-video overflow-hidden bg-slate-200 dark:bg-slate-700">
                    {m.type === 'image' ? (
                      <img
                        src={m.url}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <video
                        src={m.url}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Title */}
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Title
                      </label>
                      {editing.id === m.id && editing.field === 'title' ? (
                        <input
                          autoFocus
                          type="text"
                          value={editValues[m.id]?.title || ''}
                          onChange={e => handleEditChange(m.id, 'title', e.target.value)}
                          className="w-full mt-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-blue-500 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onBlur={() => handleEditSave(m.id)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleEditSave(m.id)
                            if (e.key === 'Escape') setEditing({ id: null, field: null })
                          }}
                        />
                      ) : (
                        <p
                          onClick={() => handleEditStart(m.id, 'title')}
                          className="mt-2 text-base font-semibold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
                        >
                          {editValues[m.id]?.title || m.title}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        Description
                      </label>
                      {editing.id === m.id && editing.field === 'description' ? (
                        <textarea
                          autoFocus
                          value={editValues[m.id]?.description || ''}
                          onChange={e => handleEditChange(m.id, 'description', e.target.value)}
                          className="w-full mt-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-blue-500 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={3}
                          onBlur={() => handleEditSave(m.id)}
                          onKeyDown={e => {
                            if (e.key === 'Escape') setEditing({ id: null, field: null })
                          }}
                        />
                      ) : (
                        <p
                          onClick={() => handleEditStart(m.id, 'description')}
                          className="mt-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 min-h-10"
                        >
                          {editValues[m.id]?.description || m.description || 'Click to add description'}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="flex-1 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="hidden sm:inline">View</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center space-y-4">
              <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No media yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Upload your first image or video using the form above
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 px-4 sm:px-6 lg:px-8 py-8 mt-12 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-600 dark:text-slate-400">
          <p>&copy; 2024 Expositor. All rights reserved. Powered by Cloudflare Workers & React.</p>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard
