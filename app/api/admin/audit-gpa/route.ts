import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const auditSchema = z.object({
  verificationId: z.string(),
  userId: z.string(),
  action: z.enum(['VERIFIED', 'REJECTED']),
  gpa: z.number().optional(),
})

export async function POST(request: Request) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const validated = auditSchema.parse(body)
    
    await prisma.$transaction(async (tx) => {
      // 認証ステータス更新
      await tx.identityVerification.update({
        where: { id: validated.verificationId },
        data: { status: validated.action },
      })
      
      // 承認の場合、ユーザー情報を更新
      if (validated.action === 'VERIFIED' && validated.gpa) {
        await tx.user.update({
          where: { email: validated.userId },
          data: {
            verifiedGpa: validated.gpa,
            isGpaVerified: true,
          },
        })
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('GPA audit error:', error)
    return NextResponse.json({ error: 'Failed to audit GPA' }, { status: 500 })
  }
}
