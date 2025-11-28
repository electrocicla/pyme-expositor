import type { AuthResponse } from '../types'
import { API_BASE_URL, setAuthToken, removeAuthToken } from '../utils'

class AuthService {
  async login(password: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })

    if (!response.ok) {
      const error = await response.json() as { error?: string }
      throw new Error(error.error || 'Login failed')
    }

    const data = await response.json() as AuthResponse
    setAuthToken(data.token)
    return data.token
  }

  logout(): void {
    removeAuthToken()
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth-token')
  }
}

export const authService = new AuthService()
