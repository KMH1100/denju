import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const courseSchema = z.object({
  name: z.string().min(1),
  departmentId: z.string(),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const departmentId = searchParams.get('departmentId')
  
  if (!departmentId) {
    return NextResponse.json({ error: 'departmentId required' }, { status: 400 })
  }

  try {
    const courses = await prisma.course.findMany({
      where: { departmentId },
      orderBy: { name: 'asc' },
    })
    
    return NextResponse.json(courses)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = courseSchema.parse(body)
    
    const course = await prisma.course.create({
      data: validated,
    })
    
    return NextResponse.json(course)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
