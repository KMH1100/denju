import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-7xl font-black mb-6 text-pink-600 tracking-organic">
            DENJU
          </h1>
          <p className="text-xl font-bold text-charcoal-700 tracking-wider">大学試験対策ノート売買プラットフォーム</p>
        </div>
        
        <Suspense fallback={<div className="text-center text-charcoal-600">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
