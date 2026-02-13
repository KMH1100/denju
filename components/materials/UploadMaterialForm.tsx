'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface University {
  id: string
  name: string
  departments: Department[]
}

interface Department {
  id: string
  name: string
}

interface Course {
  id: string
  name: string
}

export function UploadMaterialForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [universities, setUniversities] = useState<University[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [newCourseName, setNewCourseName] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    priceWeb: '',
    pricePdf: '',
    universityId: '',
    departmentId: '',
    courseId: '',
  })
  
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    fetchUniversities()
  }, [])

  useEffect(() => {
    if (formData.universityId) {
      fetchDepartments(formData.universityId)
    }
  }, [formData.universityId])

  useEffect(() => {
    if (formData.departmentId) {
      fetchCourses(formData.departmentId)
    }
  }, [formData.departmentId])

  async function fetchUniversities() {
    const res = await fetch('/api/universities-with-departments')
    const data = await res.json()
    setUniversities(data)
  }

  async function fetchDepartments(universityId: string) {
    const university = universities.find(u => u.id === universityId)
    setDepartments(university?.departments || [])
    setFormData(prev => ({ ...prev, departmentId: '', courseId: '' }))
  }

  async function fetchCourses(departmentId: string) {
    const res = await fetch(`/api/courses?departmentId=${departmentId}`)
    const data = await res.json()
    setCourses(data)
    setFormData(prev => ({ ...prev, courseId: '' }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!pdfFile) {
      alert('PDFファイルをアップロードしてください')
      return
    }

    setLoading(true)
    setUploading(true)

    try {
      // PDFアップロード
      const pdfFormData = new FormData()
      pdfFormData.append('file', pdfFile)
      
      const pdfRes = await fetch('/api/upload/pdf', {
        method: 'POST',
        body: pdfFormData,
      })

      if (!pdfRes.ok) {
        const error = await pdfRes.json()
        throw new Error(error.error || 'PDFのアップロードに失敗しました')
      }

      const pdfData = await pdfRes.json()

      let thumbnailUrl = null
      if (thumbnailFile) {
        const thumbnailFormData = new FormData()
        thumbnailFormData.append('file', thumbnailFile)
        thumbnailFormData.append('type', 'thumbnail')
        
        const thumbnailRes = await fetch('/api/upload/image', {
          method: 'POST',
          body: thumbnailFormData,
        })

        if (thumbnailRes.ok) {
          const thumbnailData = await thumbnailRes.json()
          thumbnailUrl = thumbnailData.url
        }
      }

      // コースIDの決定（新規作成または既存）
      let finalCourseId = formData.courseId
      if (!finalCourseId && newCourseName) {
        const courseRes = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newCourseName,
            departmentId: formData.departmentId,
          }),
        })
        const newCourse = await courseRes.json()
        finalCourseId = newCourse.id
      }

      // 資料作成
      const materialRes = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          overview: formData.overview,
          priceWeb: parseInt(formData.priceWeb),
          pricePdf: parseInt(formData.pricePdf),
          pdfUrl: pdfData.url,
          thumbnailUrl,
          courseId: finalCourseId,
        }),
      })

      if (!materialRes.ok) {
        throw new Error('資料の登録に失敗しました')
      }

      alert('資料を出品しました！管理者の承認をお待ちください。')
      router.push('/materials')
    } catch (error) {
      console.error('Upload error:', error)
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="資料タイトル"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <Textarea
          label="概要説明"
          value={formData.overview}
          onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Web閲覧価格（円）"
            type="number"
            value={formData.priceWeb}
            onChange={(e) => setFormData({ ...formData, priceWeb: e.target.value })}
            required
          />
          <Input
            label="PDFダウンロード価格（円）"
            type="number"
            value={formData.pricePdf}
            onChange={(e) => setFormData({ ...formData, pricePdf: e.target.value })}
            required
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-2 text-sm uppercase">大学</label>
            <select
              className="w-full border-4 border-black rounded-none px-4 py-3"
              value={formData.universityId}
              onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
              required
            >
              <option value="">-- 選択 --</option>
              {universities.map(uni => (
                <option key={uni.id} value={uni.id}>{uni.name}</option>
              ))}
            </select>
          </div>

          {departments.length > 0 && (
            <div>
              <label className="block font-bold mb-2 text-sm uppercase">学部</label>
              <select
                className="w-full border-4 border-black rounded-none px-4 py-3"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                required
              >
                <option value="">-- 選択 --</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
          )}

          {courses.length > 0 && (
            <div>
              <label className="block font-bold mb-2 text-sm uppercase">講義名</label>
              <select
                className="w-full border-4 border-black rounded-none px-4 py-3"
                value={formData.courseId}
                onChange={(e) => {
                  setFormData({ ...formData, courseId: e.target.value })
                  setNewCourseName('')
                }}
              >
                <option value="">-- 選択または新規作成 --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
              <Input
                label="新規講義名（上で選択しなかった場合）"
                value={newCourseName}
                onChange={(e) => {
                  setNewCourseName(e.target.value)
                  setFormData({ ...formData, courseId: '' })
                }}
                placeholder="例: 経営学概論"
                className="mt-4"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block font-bold mb-2 text-sm uppercase">PDF資料</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="w-full border-4 border-black rounded-none px-4 py-3"
            required
          />
        </div>

        <div>
          <label className="block font-bold mb-2 text-sm uppercase">サムネイル画像（任意）</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            className="w-full border-4 border-black rounded-none px-4 py-3"
          />
        </div>

        {/* 規約同意 */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-6">
          <p className="font-bold text-charcoal-800 mb-4 text-lg">⚠️ 出品前に必ずお読みください</p>
          
          <div className="space-y-3 mb-4 text-sm text-charcoal-700">
            <p className="font-bold text-red-600">以下の資料は出品禁止です：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>教科書、参考書、問題集等の市販書籍をスキャン・撮影したもの</li>
              <li>教授が配布したスライド、プリント、資料をそのまま転載したもの</li>
              <li>過去の試験問題や解答をそのまま掲載したもの</li>
              <li>他人が作成したレポートやノートをコピーしたもの</li>
            </ul>
            <p className="font-bold text-pink-600 mt-3">出品できるのは：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>自分で作成した講義ノート</li>
              <li>自分でまとめた試験対策資料</li>
              <li>自分が作成したレポート（提出済みのもの）</li>
            </ul>
          </div>

          <div className="flex items-start gap-3 mb-4">
            <input
              type="checkbox"
              id="agreedToTerms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 text-pink-600 border-2 border-pink-300 rounded focus:ring-2 focus:ring-pink-400"
            />
            <label htmlFor="agreedToTerms" className="text-sm text-charcoal-700 cursor-pointer">
              <a href="/terms/listing" target="_blank" className="font-bold text-pink-600 hover:text-pink-700 underline">
                出品規約
              </a>
              、
              <a href="/terms" target="_blank" className="font-bold text-pink-600 hover:text-pink-700 underline">
                利用規約
              </a>
              、
              <a href="/terms/points" target="_blank" className="font-bold text-pink-600 hover:text-pink-700 underline">
                ポイント規約
              </a>
              に同意し、出品する資料が自分で作成したオリジナルのものであり、第三者の著作権を侵害していないことを保証します。
            </label>
          </div>

          <p className="text-xs text-red-600 font-bold">
            ※ 著作権侵害は法的責任を問われる可能性があります（10年以下の懲役または1000万円以下の罰金）
          </p>
        </div>

        <Button type="submit" disabled={loading || uploading || !agreedToTerms} className="w-full">
          {uploading ? 'アップロード中...' : loading ? '処理中...' : agreedToTerms ? '出品する' : '規約に同意してください'}
        </Button>
      </form>
    </Card>
  )
}
