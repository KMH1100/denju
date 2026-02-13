'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

interface Material {
  id: string
  title: string
  overview: string
  priceWeb: number
  pricePdf: number
  pdfUrl: string | null
  thumbnailUrl: string | null
  seller: {
    username: string | null
    email: string
    verifiedGpa: number | null
    university: {
      name: string
    } | null
  }
  course: {
    name: string
    department: {
      name: string
      university: {
        name: string
      }
    }
  }
}

interface Verification {
  id: string
  gpaProofImageUrl: string
  user: {
    email: string
    username: string | null
    university: {
      name: string
    } | null
  }
}

export function AuditQueue({
  materials,
  verifications,
}: {
  materials: Material[]
  verifications: Verification[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [gpaInputs, setGpaInputs] = useState<Record<string, string>>({})

  async function handleMaterialAction(materialId: string, action: 'APPROVED' | 'REJECTED') {
    setLoading(materialId)
    
    try {
      const res = await fetch('/api/admin/audit-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId, action }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('処理に失敗しました')
      }
    } catch (error) {
      alert('エラーが発生しました')
    } finally {
      setLoading(null)
    }
  }

  async function handleVerificationAction(
    verificationId: string,
    userId: string,
    action: 'VERIFIED' | 'REJECTED',
    gpa?: number
  ) {
    if (action === 'VERIFIED' && !gpa) {
      alert('GPAを入力してください')
      return
    }

    setLoading(verificationId)
    
    try {
      const res = await fetch('/api/admin/audit-gpa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationId, userId, action, gpa }),
      })

      if (res.ok) {
        router.refresh()
        setGpaInputs({ ...gpaInputs, [verificationId]: '' })
      } else {
        alert('処理に失敗しました')
      }
    } catch (error) {
      alert('エラーが発生しました')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* GPA認証審査 */}
      <section>
        <h2 className="text-3xl font-black mb-4 text-white uppercase">
          GPA認証審査 ({verifications.length})
        </h2>
        
        {verifications.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600">審査待ちの申請はありません</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifications.map(verification => (
              <Card key={verification.id}>
                <div className="mb-4">
                  <p className="font-bold">{verification.user.email}</p>
                  <p className="text-sm text-gray-600">
                    {verification.user.university?.name}
                  </p>
                </div>

                <a
                  href={verification.gpaProofImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-4"
                >
                  <img
                    src={verification.gpaProofImageUrl}
                    alt="GPA証明書"
                    className="w-full h-64 object-contain border-4 border-black"
                  />
                </a>

                <Input
                  label="GPA"
                  type="number"
                  step="0.01"
                  placeholder="例: 3.5"
                  value={gpaInputs[verification.id] || ''}
                  onChange={(e) =>
                    setGpaInputs({ ...gpaInputs, [verification.id]: e.target.value })
                  }
                  className="mb-4"
                />

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleVerificationAction(
                        verification.id,
                        verification.user.email,
                        'VERIFIED',
                        parseFloat(gpaInputs[verification.id])
                      )
                    }
                    disabled={loading === verification.id}
                  >
                    承認
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleVerificationAction(
                        verification.id,
                        verification.user.email,
                        'REJECTED'
                      )
                    }
                    disabled={loading === verification.id}
                  >
                    却下
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 資料審査 */}
      <section>
        <h2 className="text-3xl font-black mb-4 text-white uppercase">
          資料審査 ({materials.length})
        </h2>
        
        {materials.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600">審査待ちの資料はありません</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map(material => (
              <Card key={material.id}>
                {material.thumbnailUrl && (
                  <img
                    src={material.thumbnailUrl}
                    alt={material.title}
                    className="w-full h-48 object-cover border-b-4 border-black mb-4"
                  />
                )}

                <div className="mb-2">
                  <Badge variant={material.seller.verifiedGpa! >= 3.3 ? 'gold' : 'silver'}>
                    GPA {material.seller.verifiedGpa}
                  </Badge>
                </div>

                <h3 className="text-xl font-black mb-2">{material.title}</h3>

                <p className="text-sm mb-2">
                  {material.course.department.university.name} - {material.course.department.name}
                </p>

                <p className="text-sm mb-4 text-gray-700 line-clamp-3">
                  {material.overview}
                </p>

                <div className="mb-4 text-sm">
                  <p>Web: ¥{material.priceWeb} / PDF: ¥{material.pricePdf}</p>
                  <p className="text-gray-600">出品者: {material.seller.email}</p>
                </div>

                {material.pdfUrl && (
                  <a
                    href={material.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-4"
                  >
                    <Button variant="secondary" className="w-full" size="sm">
                      PDFを確認
                    </Button>
                  </a>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="primary"
                    onClick={() => handleMaterialAction(material.id, 'APPROVED')}
                    disabled={loading === material.id}
                  >
                    承認
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleMaterialAction(material.id, 'REJECTED')}
                    disabled={loading === material.id}
                  >
                    却下
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
