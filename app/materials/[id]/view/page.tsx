import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ProtectedPdfViewer } from '@/components/materials/ProtectedPdfViewer'

export default async function MaterialViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireAuth().catch(() => null)

  if (!user) {
    redirect('/auth/login')
  }
  
  const { id } = await params

  // Web閲覧権限確認
  const purchase = await prisma.purchase.findFirst({
    where: {
      userId: user.id,
      materialId: id,
      OR: [
        { purchaseType: 'WEB' },
        { purchaseType: 'PDF' },
      ],
    },
  })

  if (!purchase) {
    redirect(`/materials/${id}`)
  }

  const material = await prisma.material.findUnique({
    where: { id },
    include: {
      course: {
        include: {
          department: {
            include: {
              university: true,
            },
          },
        },
      },
      seller: {
        select: {
          username: true,
          verifiedGpa: true,
        },
      },
    },
  })

  if (!material) {
    redirect('/materials')
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-neonPink text-white px-4 py-3 border-b-4 border-black">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black">{material.title}</h1>
            <p className="text-sm opacity-90">
              {material.course.department.university.name} - {material.course.department.name}
            </p>
          </div>
          <a
            href="/materials"
            className="px-4 py-2 bg-black text-white font-bold border-2 border-white hover:bg-white hover:text-black transition-colors"
          >
            戻る
          </a>
        </div>
      </div>

      <ProtectedPdfViewer pdfUrl={material.pdfUrl!} />
    </div>
  )
}
