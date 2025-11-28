export interface Media {
  id: number
  title: string
  description: string
  url: string
  type: 'image' | 'video'
  order_index?: number
  created_at?: string
  updated_at?: string
}

export interface User {
  id: number
  username: string
  created_at?: string
  updated_at?: string
}

export interface ApiResponse<T> {
  success?: boolean
  data?: T
  error?: string
  message?: string
}

export interface AuthResponse {
  token: string
}

export interface LoginPayload {
  password: string
}

export interface UploadMediaPayload {
  file: File
  title: string
  description?: string
}

export interface UpdateMediaPayload {
  title?: string
  description?: string
  order_index?: number
}

export interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export interface EditingState {
  id: number | null
  field: 'title' | 'description' | null
}

export interface EditValues {
  [key: number]: {
    title: string
    description: string
  }
}
