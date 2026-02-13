import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'gold' | 'silver' | 'default'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantStyles = {
    gold: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-charcoal-800 soft-shadow',
    silver: 'bg-gradient-to-r from-gray-300 to-gray-400 text-charcoal-800 soft-shadow',
    default: 'bg-pink-500 text-white soft-shadow',
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold tracking-wider ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
