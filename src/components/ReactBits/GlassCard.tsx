import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  blur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  opacity?: number
  border?: boolean
  glow?: boolean
  onClick?: () => void
}

const blurClasses = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
  '2xl': 'backdrop-blur-2xl',
  '3xl': 'backdrop-blur-3xl',
}

const GlassCard = ({
  children,
  className = '',
  blur = 'xl',
  opacity = 10,
  border = true,
  glow = false,
  onClick,
}: GlassCardProps) => {
  const baseClasses = `relative rounded-2xl ${blurClasses[blur]} bg-white/${opacity} ${
    border ? 'border border-white/20' : ''
  } ${glow ? 'animate-glow' : ''} transition-all duration-300 ${
    onClick ? 'cursor-pointer hover:bg-white/15' : ''
  }`

  return (
    <div className={`${baseClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

export default GlassCard
