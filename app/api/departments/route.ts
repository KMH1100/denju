import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const universityId = searchParams.get('universityId')
  
  if (!universityId) {
    return NextResponse.json({ error: 'universityId required' }, { status: 400 })
  }

  try {
    const departments = await prisma.department.findMany({
      where: { universityId },
      orderBy: { name: 'asc' },
    })
    
    return NextResponse.json(departments)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 })
  }
}
