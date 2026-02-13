import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const checkoutSchema = z.object({
  materialId: z.string(),
  purchaseType: z.enum(['WEB', 'PDF']),
})

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    
    const body = await request.json()
    const validated = checkoutSchema.parse(body)
    
    const material = await prisma.material.findUnique({
      where: { id: validated.materialId },
      include: {
        seller: true,
        course: {
          include: {
            department: {
              include: {
                university: true,
              },
            },
          },
        },
      },
    })
    
    if (!material || material.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Material not found or not approved' }, { status: 404 })
    }
    
    // 既に購入済みかチェック
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_materialId_purchaseType: {
          userId: user.id,
          materialId: validated.materialId,
          purchaseType: validated.purchaseType,
        },
      },
    })
    
    if (existingPurchase) {
      return NextResponse.json({ error: 'Already purchased' }, { status: 400 })
    }
    
    const amount = validated.purchaseType === 'WEB' ? material.priceWeb : material.pricePdf
    
    // Stripe Checkoutセッション作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: `${material.title} (${validated.purchaseType === 'WEB' ? 'Web閲覧' : 'PDFダウンロード'})`,
              description: `${material.course.department.university.name} - ${material.course.department.name} - ${material.course.name}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/materials/${validated.materialId}?purchased=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/materials/${validated.materialId}?cancelled=true`,
      metadata: {
        userId: user.id,
        materialId: validated.materialId,
        purchaseType: validated.purchaseType,
        sellerId: material.sellerId,
        amount: amount.toString(),
      },
    })
    
    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
