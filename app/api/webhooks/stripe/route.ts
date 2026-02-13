import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // checkout.session.completed イベント処理
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    const { userId, materialId, purchaseType, sellerId, amount } = session.metadata!

    try {
      // トランザクションで購入記録と売上加算を実行
      await prisma.$transaction(async (tx) => {
        // 購入記録を作成
        await tx.purchase.create({
          data: {
            userId,
            materialId,
            purchaseType: purchaseType as 'WEB' | 'PDF',
            amount: parseInt(amount),
            stripeSessionId: session.id,
          },
        })

        // 出品者の残高を80%加算
        const sellerEarnings = Math.floor(parseInt(amount) * 0.8)
        await tx.user.update({
          where: { id: sellerId },
          data: {
            balance: {
              increment: sellerEarnings,
            },
          },
        })
      })

      console.log('Purchase completed:', { userId, materialId, purchaseType })
    } catch (error) {
      console.error('Database error in webhook:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
