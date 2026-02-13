import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-full font-bold tracking-organic transition-all duration-300 ease-in-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'
  
  const variantStyles = {
    primary: 'bg-pink-500 text-white hover:bg-pink-600 soft-shadow hover:soft-shadow-lg',
    secondary: 'bg-yellow-500 text-charcoal-800 hover:bg-pink-500 hover:text-white soft-shadow hover:soft-shadow-lg',
    danger: 'bg-red-400 text-white hover:bg-red-500 soft-shadow hover:soft-shadow-lg',
  }
  
  const sizeStyles = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  }
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
