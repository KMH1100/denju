import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-bold mb-3 text-base text-charcoal-800 tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`w-full border-2 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all tracking-wide ${error ? 'border-red-400' : 'border-pink-200'} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
