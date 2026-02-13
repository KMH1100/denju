import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const payoutSchema = z.object({
  requestId: z.string(),
  action: z.enum(['COMPLETED', 'REJECTED']),
  adminNote: z.string(),
})

export async function POST(request: Request) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const validated = payoutSchema.parse(body)
    
    await prisma.$transaction(async (tx) => {
      const payoutRequest = await tx.payoutRequest.findUnique({
        where: { id: validated.requestId },
      })
      
      if (!payoutRequest) {
        throw new Error('Payout request not found')
      }
      
      // ステータス更新
      await tx.payoutRequest.update({
        where: { id: validated.requestId },
        data: {
          status: validated.action,
          adminNote: validated.adminNote,
        },
      })
      
      // 完了の場合、残高から減算
      if (validated.action === 'COMPLETED') {
        await tx.user.update({
          where: { id: payoutRequest.userId },
          data: {
            balance: {
              decrement: payoutRequest.amount,
            },
          },
        })
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Payout processing error:', error)
    return NextResponse.json({ error: 'Failed to process payout' }, { status: 500 })
  }
}
