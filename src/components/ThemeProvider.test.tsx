import { render, screen } from '@testing-library/react'
import { ThemeProvider, useTheme } from './ThemeProvider'
import { describe, it, expect } from 'vitest'

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  it('provides theme context', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('throws error when useTheme is used outside provider', () => {
    expect(() => render(<TestComponent />)).toThrow('useTheme must be used within a ThemeProvider')
  })
})