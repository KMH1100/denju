import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PurchaseButton } from '@/components/materials/PurchaseButton'
import Link from 'next/link'

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireAuth().catch(() => null)
  const { id } = await params

  const material = await prisma.material.findUnique({
    where: { id },
    include: {
      seller: {
        select: {
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
  })

  if (!material || material.status !== 'APPROVED') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <h1 className="text-2xl font-black mb-4">資料が見つかりません</h1>
          <Link href="/materials">
            <Button>一覧に戻る</Button>
          </Link>
        </Card>
      </div>
    )
  }

  let webPurchased = false
  let pdfPurchased = false

  if (user) {
    const purchases = await prisma.purchase.findMany({
      where: {
        userId: user.id,
        materialId: id,
      },
    })

    webPurchased = purchases.some(p => p.purchaseType === 'WEB')
    pdfPurchased = purchases.some(p => p.purchaseType === 'PDF')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neonPink via-electricYellow to-neonPink p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <Card>
          {material.thumbnailUrl && (
            <img
              src={material.thumbnailUrl}
              alt={material.title}
              className="w-full h-64 object-cover border-b-4 border-black mb-6"
            />
          )}

          <div className="mb-4">
            <Badge variant={material.seller.verifiedGpa! >= 3.3 ? 'gold' : 'silver'}>
              GPA {material.seller.verifiedGpa} 出品者
            </Badge>
          </div>

          <h1 className="text-4xl font-black mb-4 uppercase">{material.title}</h1>

          <div className="mb-6 space-y-2">
            <p className="text-lg font-bold">
              {material.course.department.university.name}
            </p>
            <p className="text-md font-semibold">
              {material.course.department.name} - {material.course.name}
            </p>
            <p className="text-sm text-gray-600">
              出品者: {material.seller.username || '匿名'} ({material.seller.university?.name})
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-black mb-2 uppercase">概要</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{material.overview}</p>
          </div>

          <div className="border-t-4 border-black pt-6">
            <h2 className="text-xl font-black mb-4 uppercase">購入オプション</h2>
            
            {!user ? (
              <div className="text-center py-8">
                <p className="mb-4 font-bold">購入するにはログインが必要です</p>
                <Link href="/auth/login">
                  <Button>ログイン</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <h3 className="text-lg font-black mb-2">Web閲覧</h3>
                  <p className="text-3xl font-black mb-4 text-neonPink">
                    ¥{material.priceWeb.toLocaleString()}
                  </p>
                  <p className="text-sm mb-4 text-gray-600">
                    ブラウザ上で資料を閲覧できます（コピーガード付き）
                  </p>
                  {webPurchased || pdfPurchased ? (
                    <Link href={`/materials/${material.id}/view`}>
                      <Button className="w-full" variant="secondary">
                        閲覧する
                      </Button>
                    </Link>
                  ) : (
                    <PurchaseButton
                      materialId={material.id}
                      purchaseType="WEB"
                      price={material.priceWeb}
                      label="Web閲覧を購入"
                    />
                  )}
                </Card>

                <Card>
                  <h3 className="text-lg font-black mb-2">PDFダウンロード</h3>
                  <p className="text-3xl font-black mb-4 text-neonPink">
                    ¥{material.pricePdf.toLocaleString()}
                  </p>
                  <p className="text-sm mb-4 text-gray-600">
                    透かし入りPDFをダウンロードできます
                  </p>
                  {pdfPurchased ? (
                    <>
                      <a
                        href={`/api/download/${material.id}`}
                        download
                        className="block"
                      >
                        <Button className="w-full mb-2" variant="secondary">
                          PDFダウンロード
                        </Button>
                      </a>
                      <Link href={`/materials/${material.id}/view`}>
                        <Button className="w-full" variant="secondary">
                          Web閲覧する
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <PurchaseButton
                      materialId={material.id}
                      purchaseType="PDF"
                      price={material.pricePdf}
                      label="PDFを購入"
                    />
                  )}
                </Card>
              </div>
            )}
          </div>

          <div className="mt-6">
            <Link href="/materials">
              <Button variant="secondary">一覧に戻る</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
