import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProfileSchema = z.object({
  username: z.string().min(1, '名前を入力してください'),
  universityId: z.string().min(1, '大学を選択してください'),
  departmentId: z.string().min(1, '学部を選択してください'),
  enrollmentYear: z.number().int().min(2000).max(new Date().getFullYear() + 1),
})

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    
    const validated = updateProfileSchema.parse(body)
    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: validated.username,
        universityId: validated.universityId,
        departmentId: validated.departmentId,
        enrollmentYear: validated.enrollmentYear,
      },
    })
    
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'プロフィールの更新に失敗しました' },
      { status: 400 }
    )
  }
}
