import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Login from './Login'
import { ThemeProvider } from './ThemeProvider'
import { api } from '../utils/api'

// Mock the API
vi.mock('../utils/api', () => ({
  api: {
    post: vi.fn(),
  },
  setAuthToken: vi.fn(),
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderLogin = () => {
  return render(
    <ThemeProvider>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </ThemeProvider>
  )
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders login form', () => {
    renderLogin()

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByText('Owner Dashboard')).toBeInTheDocument()
  })

  it('shows error on failed login', async () => {
    const mockApi = vi.mocked(api)
    mockApi.post.mockRejectedValue(new Error('Invalid password'))

    renderLogin()

    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid password. Please try again.')
    })

    expect(mockApi.post).toHaveBeenCalledWith('/login', { password: 'wrongpassword' })
  })

  it('navigates to editor on successful login', async () => {
    const mockApi = vi.mocked(api)
    mockApi.post.mockResolvedValue({ token: 'fake-token' })

    renderLogin()

    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(passwordInput, { target: { value: 'secretpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/editor')
    })

    expect(localStorage.getItem('auth-token')).toBe('fake-token')
  })

  it('disables form during loading', async () => {
    const mockApi = vi.mocked(api)
    mockApi.post.mockImplementation(() => new Promise(() => {})) // Never resolves

    renderLogin()

    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(passwordInput, { target: { value: 'password' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(passwordInput).toBeDisabled()
      expect(screen.getByText('Signing in...')).toBeInTheDocument()
    })
  })
})