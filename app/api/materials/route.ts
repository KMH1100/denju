import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const materialSchema = z.object({
  title: z.string().min(1),
  overview: z.string().min(1),
  priceWeb: z.number().min(0),
  pricePdf: z.number().min(0),
  pdfUrl: z.string().url(),
  thumbnailUrl: z.string().url().nullable().optional(),
  courseId: z.string(),
})

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    
    if (!user.isGpaVerified) {
      return NextResponse.json({ error: 'GPA verification required' }, { status: 403 })
    }
    
    const body = await request.json()
    const validated = materialSchema.parse(body)
    
    const material = await prisma.material.create({
      data: {
        ...validated,
        sellerId: user.id,
        status: 'PENDING',
      },
    })
    
    return NextResponse.json(material)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const courseId = searchParams.get('courseId')
  
  try {
    const materials = await prisma.material.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(courseId && { courseId }),
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            verifiedGpa: true,
            university: true,
          },
        },
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
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(materials)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 })
  }
}
