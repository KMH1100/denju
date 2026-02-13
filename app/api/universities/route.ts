import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    })
    
    return NextResponse.json(universities)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch universities' }, { status: 500 })
  }
}
