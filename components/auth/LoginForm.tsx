'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface University {
  id: string
  name: string
  slug: string
}

export function LoginForm() {
  const [universities, setUniversities] = useState<University[]>([])
  const [selectedUniversityId, setSelectedUniversityId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUniversities()
  }, [])

  async function fetchUniversities() {
    const res = await fetch('/api/universities')
    const data = await res.json()
    setUniversities(data)
  }

  async function handleGoogleLogin() {
    if (!selectedUniversityId) {
      alert('大学を選択してください')
      return
    }

    setLoading(true)
    const supabase = createClient()
    
    const redirectUrl = `${window.location.origin}/api/auth/callback?universityId=${selectedUniversityId}`
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })

    if (error) {
      console.error('Login error:', error)
      alert('ログインに失敗しました')
      setLoading(false)
    }
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">ログイン</h2>
      
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-sm text-gray-700">
          所属大学を選択
        </label>
        <select
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
          value={selectedUniversityId}
          onChange={(e) => setSelectedUniversityId(e.target.value)}
        >
          <option value="">大学を選んでください</option>
          {universities.map((uni) => (
            <option key={uni.id} value={uni.id}>
              {uni.name}
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={handleGoogleLogin}
        disabled={loading || !selectedUniversityId}
        className="w-full"
      >
        {loading ? 'ログイン中...' : 'Googleでログイン'}
      </Button>

      <p className="mt-4 text-sm text-gray-500 text-center">
        選択した大学のメールアドレスでログインしてください
      </p>
    </Card>
  )
}
