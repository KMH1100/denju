import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const verificationSchema = z.object({
  gpaProofImageUrl: z.string().url(),
})

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    
    const body = await request.json()
    const validated = verificationSchema.parse(body)
    
    // 既存の申請をチェック
    const existingVerification = await prisma.identityVerification.findFirst({
      where: {
        userId: user.id,
        status: 'PENDING',
      },
    })
    
    if (existingVerification) {
      return NextResponse.json(
        { error: '既に審査待ちの申請があります' },
        { status: 400 }
      )
    }
    
    const verification = await prisma.identityVerification.create({
      data: {
        userId: user.id,
        gpaProofImageUrl: validated.gpaProofImageUrl,
        status: 'PENDING',
      },
    })
    
    return NextResponse.json(verification)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to submit verification' }, { status: 500 })
  }
}
