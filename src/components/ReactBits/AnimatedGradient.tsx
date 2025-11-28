import type { ReactNode } from 'react'

interface AnimatedGradientProps {
  children?: ReactNode
  from?: string
  via?: string
  to?: string
  className?: string
  speed?: 'slow' | 'normal' | 'fast'
}

const speedClasses = {
  slow: '[animation-duration:20s]',
  normal: '[animation-duration:15s]',
  fast: '[animation-duration:10s]',
}

const AnimatedGradient = ({
  children,
  from = 'from-purple-400',
  via = 'via-pink-500',
  to = 'to-red-500',
  className = '',
  speed = 'normal',
}: AnimatedGradientProps) => {
  return (
    <div
      className={`bg-linear-to-br ${from} ${via} ${to} bg-size-[200%_200%] animate-gradient ${speedClasses[speed]} ${className}`}
    >
      {children}
    </div>
  )
}

export default AnimatedGradient
