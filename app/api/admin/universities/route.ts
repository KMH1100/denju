import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const universitySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  allowedDomain: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const validated = universitySchema.parse(body)
    
    const university = await prisma.university.create({
      data: validated,
    })
    
    return NextResponse.json(university)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create university' }, { status: 500 })
  }
}
