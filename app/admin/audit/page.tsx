import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AuditQueue } from '@/components/admin/AuditQueue'
import { redirect } from 'next/navigation'

export default async function AdminAuditPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/')
  }

  const pendingMaterials = await prisma.material.findMany({
    where: { status: 'PENDING' },
    include: {
      seller: {
        include: {
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

  const pendingVerifications = await prisma.identityVerification.findMany({
    where: { status: 'PENDING' },
    include: {
      user: {
        include: {
          university: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto max-w-6xl py-8">
        <h1 
          className="text-5xl font-black mb-8 text-center text-white uppercase"
          style={{ textShadow: '4px 4px 0px #000000' }}
        >
          管理者 - 審査Queue
        </h1>

        <AuditQueue 
          materials={pendingMaterials}
          verifications={pendingVerifications}
        />
      </div>
    </div>
  )
}
