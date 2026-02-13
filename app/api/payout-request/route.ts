import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const payoutRequestSchema = z.object({
  amount: z.number().min(1000),
  payoutDestination: z.enum(['AMAZON', 'PAYPAY']),
  accountInfo: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    
    const body = await request.json()
    const validated = payoutRequestSchema.parse(body)
    
    // 残高チェック
    if (validated.amount > user.balance) {
      return NextResponse.json(
        { error: '残高が不足しています' },
        { status: 400 }
      )
    }
    
    // 既存の未処理申請をチェック
    const existingRequest = await prisma.payoutRequest.findFirst({
      where: {
        userId: user.id,
        status: 'PENDING',
      },
    })
    
    if (existingRequest) {
      return NextResponse.json(
        { error: '既に申請中の換金があります' },
        { status: 400 }
      )
    }
    
    const payoutRequest = await prisma.payoutRequest.create({
      data: {
        userId: user.id,
        amount: validated.amount,
        payoutDestination: validated.payoutDestination,
        accountInfo: validated.accountInfo,
        status: 'PENDING',
      },
    })
    
    return NextResponse.json(payoutRequest)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to submit payout request' }, { status: 500 })
  }
}
