import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const departmentSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  universityId: z.string(),
})

export async function POST(request: Request) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const validated = departmentSchema.parse(body)
    
    const department = await prisma.department.create({
      data: validated,
    })
    
    return NextResponse.json(department)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create department' }, { status: 500 })
  }
}
