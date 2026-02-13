'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface User {
  id: string
  email: string
  username: string | null
  universityId: string | null
  departmentId: string | null
  enrollmentYear: number | null
  university?: { id: string; name: string } | null
  department?: { id: string; name: string } | null
}

interface University {
  id: string
  name: string
}

interface Department {
  id: string
  name: string
}

export function ProfileSettingsForm({ 
  user, 
  universities 
}: { 
  user: User
  universities: University[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  
  const [formData, setFormData] = useState({
    username: user.username || '',
    universityId: user.universityId || '',
    departmentId: user.departmentId || '',
    enrollmentYear: user.enrollmentYear || new Date().getFullYear(),
  })

  // 学年を計算
  const calculateGrade = (enrollmentYear: number) => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1 // 0-11 → 1-12
    
    // 4月以降は次の学年
    const academicYear = currentMonth >= 4 ? currentYear : currentYear - 1
    const grade = academicYear - enrollmentYear + 1
    
    if (grade < 1) return '入学前'
    if (grade > 6) return '卒業'
    return `${grade}年生`
  }

  // 大学が変更されたら学部を取得
  useEffect(() => {
    if (formData.universityId) {
      fetch(`/api/departments?universityId=${formData.universityId}`)
        .then(res => res.json())
        .then(data => setDepartments(data))
        .catch(err => console.error(err))
    } else {
      setDepartments([])
    }
  }, [formData.universityId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('更新に失敗しました')

      alert('プロフィールを更新しました！')
      router.refresh()
    } catch (error) {
      alert('エラーが発生しました')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="ユーザー名"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        placeholder="例: 山田太郎"
        required
      />

      <div>
        <label className="block font-bold mb-3 text-base text-charcoal-800 tracking-wide">
          メールアドレス
        </label>
        <div className="w-full border-2 border-gray-300 rounded-2xl px-6 py-4 bg-gray-50 text-charcoal-600">
          {user.email}
        </div>
        <p className="mt-2 text-sm text-charcoal-500">メールアドレスは変更できません</p>
      </div>

      <div>
        <label className="block font-bold mb-3 text-base text-charcoal-800 tracking-wide">
          所属大学
        </label>
        <select
          value={formData.universityId}
          onChange={(e) => setFormData({ ...formData, universityId: e.target.value, departmentId: '' })}
          className="w-full border-2 border-pink-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all tracking-wide"
          required
        >
          <option value="">大学を選択してください</option>
          {universities.map((univ) => (
            <option key={univ.id} value={univ.id}>
              {univ.name}
            </option>
          ))}
        </select>
      </div>

      {formData.universityId && departments.length > 0 && (
        <div>
          <label className="block font-bold mb-3 text-base text-charcoal-800 tracking-wide">
            学部・学科
          </label>
          <select
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
            className="w-full border-2 border-pink-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all tracking-wide"
            required
          >
            <option value="">学部を選択してください</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block font-bold mb-3 text-base text-charcoal-800 tracking-wide">
          入学年度
        </label>
        <input
          type="number"
          value={formData.enrollmentYear}
          onChange={(e) => setFormData({ ...formData, enrollmentYear: parseInt(e.target.value) })}
          min="2000"
          max={new Date().getFullYear() + 1}
          className="w-full border-2 border-pink-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all tracking-wide"
          required
        />
        <div className="mt-3 p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
          <p className="text-sm text-charcoal-700">
            <span className="font-bold">現在の学年：</span>
            <span className="text-pink-600 font-black text-lg ml-2">
              {calculateGrade(formData.enrollmentYear)}
            </span>
          </p>
          <p className="text-xs text-charcoal-500 mt-2">
            ⚠️ 学年は毎年4月1日に自動的に更新されます
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="primary" size="lg" disabled={loading} className="flex-1">
          {loading ? '更新中...' : '保存する'}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          size="lg" 
          onClick={() => router.push('/profile')}
          className="flex-1"
        >
          キャンセル
        </Button>
      </div>
    </form>
  )
}
