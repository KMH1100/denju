'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface University {
  id: string
  name: string
  slug: string
  allowedDomain: string
  departments: {
    id: string
    name: string
    slug: string
    _count: {
      courses: number
    }
  }[]
  _count: {
    users: number
  }
}

export function UniversityManagement({ universities }: { universities: University[] }) {
  const router = useRouter()
  const [showAddUniversity, setShowAddUniversity] = useState(false)
  const [showAddDepartment, setShowAddDepartment] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [newUniversity, setNewUniversity] = useState({
    name: '',
    slug: '',
    allowedDomain: '',
  })

  const [newDepartment, setNewDepartment] = useState({
    name: '',
    slug: '',
  })

  async function handleAddUniversity(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUniversity),
      })

      if (res.ok) {
        setNewUniversity({ name: '', slug: '', allowedDomain: '' })
        setShowAddUniversity(false)
        router.refresh()
      } else {
        alert('追加に失敗しました')
      }
    } catch (error) {
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddDepartment(universityId: string) {
    setLoading(true)

    try {
      const res = await fetch('/api/admin/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDepartment,
          universityId,
        }),
      })

      if (res.ok) {
        setNewDepartment({ name: '', slug: '' })
        setShowAddDepartment(null)
        router.refresh()
      } else {
        alert('追加に失敗しました')
      }
    } catch (error) {
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 大学追加フォーム */}
      <Card>
        <Button
          onClick={() => setShowAddUniversity(!showAddUniversity)}
          variant="secondary"
          className="mb-4"
        >
          {showAddUniversity ? '閉じる' : '+ 大学を追加'}
        </Button>

        {showAddUniversity && (
          <form onSubmit={handleAddUniversity} className="space-y-4">
            <Input
              label="大学名"
              value={newUniversity.name}
              onChange={(e) => setNewUniversity({ ...newUniversity, name: e.target.value })}
              required
            />
            <Input
              label="スラッグ（英数字、ハイフン）"
              placeholder="例: tokyo-university"
              value={newUniversity.slug}
              onChange={(e) => setNewUniversity({ ...newUniversity, slug: e.target.value })}
              required
            />
            <Input
              label="許可ドメイン"
              placeholder="例: *.ac.jp または u-tokyo.ac.jp"
              value={newUniversity.allowedDomain}
              onChange={(e) => setNewUniversity({ ...newUniversity, allowedDomain: e.target.value })}
              required
            />
            <Button type="submit" disabled={loading}>
              追加
            </Button>
          </form>
        )}
      </Card>

      {/* 大学一覧 */}
      <div className="grid grid-cols-1 gap-6">
        {universities.map(university => (
          <Card key={university.id}>
            <div className="mb-4">
              <h2 className="text-2xl font-black mb-2">{university.name}</h2>
              <p className="text-sm text-gray-600 mb-1">
                スラッグ: {university.slug}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                ドメイン: {university.allowedDomain}
              </p>
              <p className="text-sm text-gray-600">
                登録ユーザー数: {university._count.users}
              </p>
            </div>

            {/* 学部追加 */}
            <div className="mb-4">
              <Button
                onClick={() => setShowAddDepartment(
                  showAddDepartment === university.id ? null : university.id
                )}
                variant="secondary"
                size="sm"
                className="mb-2"
              >
                {showAddDepartment === university.id ? '閉じる' : '+ 学部を追加'}
              </Button>

              {showAddDepartment === university.id && (
                <div className="space-y-2 mt-2">
                  <Input
                    label="学部名"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  />
                  <Input
                    label="スラッグ"
                    placeholder="例: engineering"
                    value={newDepartment.slug}
                    onChange={(e) => setNewDepartment({ ...newDepartment, slug: e.target.value })}
                  />
                  <Button
                    onClick={() => handleAddDepartment(university.id)}
                    disabled={loading}
                    size="sm"
                  >
                    追加
                  </Button>
                </div>
              )}
            </div>

            {/* 学部一覧 */}
            <div className="space-y-2">
              <h3 className="font-black uppercase">学部一覧</h3>
              {university.departments.length === 0 ? (
                <p className="text-sm text-gray-600">学部が登録されていません</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {university.departments.map(dept => (
                    <div
                      key={dept.id}
                      className="border-2 border-black p-3 bg-gray-50"
                    >
                      <p className="font-bold">{dept.name}</p>
                      <p className="text-xs text-gray-600">
                        講義数: {dept._count.courses}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
