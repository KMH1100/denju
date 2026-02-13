'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PurchaseButtonProps {
  materialId: string
  purchaseType: 'WEB' | 'PDF'
  price: number
  label: string
  isPurchased?: boolean
}

export function PurchaseButton({
  materialId,
  purchaseType,
  price,
  label,
  isPurchased = false,
}: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handlePurchase() {
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId,
          purchaseType,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || '購入処理に失敗しました')
        setLoading(false)
        return
      }

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe initialization failed')
      }

      // Stripe Checkoutへリダイレクト
      await stripe.redirectToCheckout({ sessionId: data.sessionId })
    } catch (error) {
      console.error('Purchase error:', error)
      alert('エラーが発生しました')
      setLoading(false)
    }
  }

  if (isPurchased) {
    return (
      <Button disabled className="w-full">
        購入済み
      </Button>
    )
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={loading}
      variant="primary"
      className="w-full"
    >
      {loading ? '処理中...' : `${label} - ¥${price.toLocaleString()}`}
    </Button>
  )
}
