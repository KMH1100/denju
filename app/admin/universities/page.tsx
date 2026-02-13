import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UniversityManagement } from '@/components/admin/UniversityManagement'
import { redirect } from 'next/navigation'

export default async function AdminUniversitiesPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/')
  }

  const universities = await prisma.university.findMany({
    include: {
      departments: {
        include: {
          _count: {
            select: { courses: true },
          },
        },
      },
      _count: {
        select: { users: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-4">
      <div className="container mx-auto max-w-6xl py-8">
        <h1 
          className="text-5xl font-black mb-8 text-center text-white uppercase"
          style={{ textShadow: '4px 4px 0px #000000' }}
        >
          大学・学部マスタ管理
        </h1>

        <UniversityManagement universities={universities} />
      </div>
    </div>
  )
}
