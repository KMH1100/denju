'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function PayoutRequestForm({
  userId,
  currentBalance,
}: {
  userId: string
  currentBalance: number
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    payoutDestination: 'AMAZON',
    accountInfo: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const amount = parseInt(formData.amount)

    if (amount < 1000) {
      alert('最低換金額は1,000円です')
      return
    }

    if (amount > currentBalance) {
      alert('残高が不足しています')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/payout-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          payoutDestination: formData.payoutDestination,
          accountInfo: formData.accountInfo,
        }),
      })

      if (res.ok) {
        alert('換金申請を送信しました！管理者の承認をお待ちください。')
        router.push('/profile')
      } else {
        const data = await res.json()
        alert(data.error || '申請に失敗しました')
      }
    } catch (error) {
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="換金額（円）"
          type="number"
          min="1000"
          max={currentBalance}
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />

        <div>
          <label className="block font-bold mb-2 text-sm uppercase">
            換金先
          </label>
          <select
            className="w-full border-4 border-black rounded-none px-4 py-3"
            value={formData.payoutDestination}
            onChange={(e) =>
              setFormData({ ...formData, payoutDestination: e.target.value })
            }
            required
          >
            <option value="AMAZON">Amazonギフト券</option>
            <option value="PAYPAY">PayPay</option>
          </select>
        </div>

        <Input
          label="アカウント情報（メールアドレス等）"
          placeholder="ギフト券の送信先メールアドレスまたはPayPay ID"
          value={formData.accountInfo}
          onChange={(e) =>
            setFormData({ ...formData, accountInfo: e.target.value })
          }
          required
        />

        <div className="bg-yellow-50 border-4 border-yellow-400 p-4">
          <p className="text-sm font-bold mb-2">注意事項</p>
          <ul className="text-sm space-y-1">
            <li>• 申請後、管理者が確認し、24時間以内に処理されます</li>
            <li>• Amazonギフト券の場合、メールで送信されます</li>
            <li>• PayPayの場合、リンクまたはQRコードで送信されます</li>
          </ul>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? '送信中...' : '申請する'}
        </Button>
      </form>
    </Card>
  )
}
