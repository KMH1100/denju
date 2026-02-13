import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default async function ProfilePage() {
  const user = await requireAuth()

  const stats = {
    materialsCount: await prisma.material.count({
      where: { sellerId: user.id, status: 'APPROVED' },
    }),
    purchasesCount: await prisma.purchase.count({
      where: { userId: user.id },
    }),
  }

  const recentPurchases = await prisma.purchase.findMany({
    where: { userId: user.id },
    include: {
      material: {
        include: {
          course: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50 py-12">
      <div className="container mx-auto max-w-5xl px-6">
        <h1 className="text-5xl font-black mb-10 text-center text-pink-600 tracking-organic">
          マイプロフィール
        </h1>

        {/* ユーザー情報カード */}
        <Card className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black mb-3 text-charcoal-800">{user.username || '名前未設定'}</h2>
              <p className="text-charcoal-600 mb-2 text-lg">{user.email}</p>
              <p className="font-bold text-pink-600 text-lg">{user.university?.name}</p>
            </div>
            {user.isGpaVerified && (
              <Badge variant={user.verifiedGpa! >= 3.3 ? 'gold' : 'silver'}>
                GPA {user.verifiedGpa}
              </Badge>
            )}
          </div>

          <div className="border-t-2 border-pink-100 pt-6 mb-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-4xl font-black text-pink-600 mb-2">¥{user.balance.toLocaleString()}</p>
                <p className="text-sm font-bold text-charcoal-600 tracking-wide">残高</p>
              </div>
              <div>
                <p className="text-4xl font-black text-yellow-600 mb-2">{stats.materialsCount}</p>
                <p className="text-sm font-bold text-charcoal-600 tracking-wide">出品中</p>
              </div>
              <div>
                <p className="text-4xl font-black text-pink-600 mb-2">{stats.purchasesCount}</p>
                <p className="text-sm font-bold text-charcoal-600 tracking-wide">購入済み</p>
              </div>
            </div>
          </div>

          {/* アクションボタン - 大きく目立つデザイン */}
          <div className="space-y-4">
            {user.isGpaVerified ? (
              <>
                <Link href="/materials/upload" className="block">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-6 text-center hover:scale-105 transition-transform duration-300 soft-shadow-lg cursor-pointer">
                    <p className="text-3xl mb-2">📝</p>
                    <p className="text-2xl font-black text-charcoal-800 mb-2">資料を出品する</p>
                    <p className="text-sm text-charcoal-700">PDFをアップロードして収益を得よう</p>
                  </div>
                </Link>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/profile/settings">
                    <Button variant="secondary" className="w-full" size="lg">
                      プロフィール編集
                    </Button>
                  </Link>
                  <Link href="/profile/payout">
                    <Button variant="primary" className="w-full" size="lg">
                      換金申請
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link href="/profile/verify-gpa" className="block">
                  <div className="bg-gradient-to-r from-pink-400 to-pink-500 rounded-3xl p-6 text-center hover:scale-105 transition-transform duration-300 soft-shadow-lg cursor-pointer">
                    <p className="text-3xl mb-2">🏆</p>
                    <p className="text-2xl font-black text-white mb-2">GPA認証で出品可能に</p>
                    <p className="text-sm text-pink-50">成績証明書をアップロードして出品者になろう</p>
                  </div>
                </Link>
                <Link href="/profile/settings">
                  <Button variant="secondary" className="w-full" size="lg">
                    プロフィール編集
                  </Button>
                </Link>
              </>
            )}
          </div>
        </Card>

        {/* 購入履歴 */}
        <Card>
          <h3 className="text-3xl font-black mb-6 text-charcoal-800 tracking-wide">最近の購入</h3>
          {recentPurchases.length === 0 ? (
            <p className="text-charcoal-600 text-center py-8">購入履歴がありません</p>
          ) : (
            <div className="space-y-4">
              {recentPurchases.map(purchase => (
                <Link
                  key={purchase.id}
                  href={`/materials/${purchase.materialId}`}
                  className="block border-2 border-pink-200 rounded-2xl p-5 hover:border-pink-400 hover:soft-shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-lg text-charcoal-800 mb-1">{purchase.material.title}</p>
                      <p className="text-sm text-charcoal-600">
                        {purchase.material.course.name}
                      </p>
                    </div>
                    <Badge>
                      {purchase.purchaseType === 'WEB' ? 'Web閲覧' : 'PDF購入'}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
