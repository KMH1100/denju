import { requireAuth } from '@/lib/auth'
import { GpaVerificationForm } from '@/components/profile/GpaVerificationForm'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default async function VerifyGpaPage() {
  const user = await requireAuth().catch(() => null)
  
  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-black mb-8 uppercase">GPA認証</h1>
      
      {user.isGpaVerified ? (
        <Card>
          <div className="text-center">
            <Badge variant="gold" className="text-xl px-6 py-3 mb-4">
              認証済み
            </Badge>
            <p className="text-2xl font-bold mb-2">GPA: {user.verifiedGpa}</p>
            <p className="text-gray-600">
              あなたのGPAは認証されています。資料の出品が可能です。
            </p>
          </div>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <h2 className="text-xl font-black mb-4 uppercase">GPA認証について</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• 資料を出品するには、GPAの認証が必要です</li>
              <li>• 成績証明書または成績表の画像をアップロードしてください</li>
              <li>• 管理者が目視で確認し、24時間以内に承認されます</li>
              <li>• GPA 3.3以上で金バッジ、それ以下で銀バッジが付与されます</li>
            </ul>
          </Card>
          
          <GpaVerificationForm userId={user.id} />
        </>
      )}
    </div>
  )
}
