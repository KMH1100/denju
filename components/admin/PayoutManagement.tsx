'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

interface PayoutRequest {
  id: string
  amount: number
  payoutDestination: string
  accountInfo: string
  createdAt: Date
  user: {
    email: string
    username: string | null
    balance: number
    university: {
      name: string
    } | null
  }
}

export function PayoutManagement({ requests }: { requests: PayoutRequest[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  async function handleApprove(requestId: string) {
    const note = notes[requestId]
    
    if (!note) {
      alert('ギフトコードまたはメモを入力してください')
      return
    }

    setLoading(requestId)
    
    try {
      const res = await fetch('/api/admin/process-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          action: 'COMPLETED',
          adminNote: note,
        }),
      })

      if (res.ok) {
        router.refresh()
        setNotes({ ...notes, [requestId]: '' })
      } else {
        alert('処理に失敗しました')
      }
    } catch (error) {
      alert('エラーが発生しました')
    } finally {
      setLoading(null)
    }
  }

  async function handleReject(requestId: string) {
    if (!confirm('この申請を却下しますか？')) return

    setLoading(requestId)
    
    try {
      const res = await fetch('/api/admin/process-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          action: 'REJECTED',
          adminNote: notes[requestId] || '却下されました',
        }),
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

  if (requests.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-600">申請はありません</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {requests.map(request => (
        <Card key={request.id}>
          <div className="mb-4">
            <h3 className="text-2xl font-black mb-2">
              ¥{request.amount.toLocaleString()}
            </h3>
            <p className="font-bold">{request.user.email}</p>
            <p className="text-sm text-gray-600">
              {request.user.university?.name}
            </p>
            <p className="text-sm text-gray-600">
              現在の残高: ¥{request.user.balance.toLocaleString()}
            </p>
          </div>

          <div className="mb-4 p-4 bg-gray-100 border-2 border-black">
            <p className="text-sm font-bold mb-1">換金先</p>
            <p className="text-lg font-bold mb-2">{request.payoutDestination}</p>
            <p className="text-sm font-bold mb-1">アカウント情報</p>
            <p className="break-all">{request.accountInfo}</p>
          </div>

          <Textarea
            label="ギフトコード / メモ"
            placeholder="Amazonギフトコード、PayPayリンク等を入力"
            value={notes[request.id] || ''}
            onChange={(e) =>
              setNotes({ ...notes, [request.id]: e.target.value })
            }
            className="mb-4"
          />

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="primary"
              onClick={() => handleApprove(request.id)}
              disabled={loading === request.id}
            >
              完了
            </Button>
            <Button
              variant="danger"
              onClick={() => handleReject(request.id)}
              disabled={loading === request.id}
            >
              却下
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
