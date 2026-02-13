import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-bold mb-3 text-base text-charcoal-800 tracking-wide">
          {label}
        </label>
      )}
      <textarea
        className={`w-full border-2 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all min-h-[160px] tracking-wide ${error ? 'border-red-400' : 'border-pink-200'} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
