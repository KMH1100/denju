import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const auditSchema = z.object({
  materialId: z.string(),
  action: z.enum(['APPROVED', 'REJECTED']),
})

export async function POST(request: Request) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const validated = auditSchema.parse(body)
    
    await prisma.material.update({
      where: { id: validated.materialId },
      data: { status: validated.action },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to audit material' }, { status: 500 })
  }
}
