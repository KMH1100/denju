'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function GpaVerificationForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!imageFile) {
      alert('成績証明書の画像をアップロードしてください')
      return
    }

    setLoading(true)

    try {
      // 画像アップロード
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('type', 'gpa')
      
      const uploadRes = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const error = await uploadRes.json()
        throw new Error(error.error || '画像のアップロードに失敗しました')
      }

      const uploadData = await uploadRes.json()

      const res = await fetch('/api/verify-gpa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gpaProofImageUrl: uploadData.url,
        }),
      })

      if (!res.ok) {
        throw new Error('申請に失敗しました')
      }

      alert('GPA認証申請を送信しました！管理者の承認をお待ちください。')
      router.refresh()
    } catch (error) {
      console.error('Verification error:', error)
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-bold mb-2 text-sm uppercase">
            成績証明書・成績表の画像
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border-4 border-black rounded-none px-4 py-3"
            required
          />
          <p className="text-sm text-gray-600 mt-2">
            ※ GPAが確認できる書類の画像をアップロードしてください
          </p>
        </div>

        {preview && (
          <div className="border-4 border-black p-4">
            <p className="font-bold mb-2 text-sm uppercase">プレビュー</p>
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-full h-auto"
            />
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? '送信中...' : '認証申請を送信'}
        </Button>
      </form>
    </Card>
  )
}
