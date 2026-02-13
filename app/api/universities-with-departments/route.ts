import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      include: {
        departments: {
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    })
    
    return NextResponse.json(universities)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}
