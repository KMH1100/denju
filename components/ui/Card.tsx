import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
}

export function Card({ children, className = '', hoverable = false }: CardProps) {
  const hoverStyles = hoverable ? 'hover:soft-shadow-lg hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer' : ''
  
  return (
    <div className={`rounded-3xl soft-shadow bg-white p-8 ${hoverStyles} ${className}`}>
      {children}
    </div>
  )
}
