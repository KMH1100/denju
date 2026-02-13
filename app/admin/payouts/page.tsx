import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PayoutManagement } from '@/components/admin/PayoutManagement'
import { redirect } from 'next/navigation'

export default async function AdminPayoutsPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/')
  }

  const payoutRequests = await prisma.payoutRequest.findMany({
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
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 p-4">
      <div className="container mx-auto max-w-6xl py-8">
        <h1 
          className="text-5xl font-black mb-8 text-center text-white uppercase"
          style={{ textShadow: '4px 4px 0px #000000' }}
        >
          管理者 - 換金申請管理
        </h1>

        <PayoutManagement requests={payoutRequests} />
      </div>
    </div>
  )
}
