import { requireAuth } from '@/lib/auth'
import { ProfileSettingsForm } from '@/components/profile/ProfileSettingsForm'
import { Card } from '@/components/ui/Card'
import { prisma } from '@/lib/prisma'

export default async function ProfileSettingsPage() {
  const user = await requireAuth()
  
  // ユーザーの大学と学部も取得
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      university: true,
      department: true,
    },
  })
  
  // すべての大学を取得
  const universities = await prisma.university.findMany({
    orderBy: { name: 'asc' },
  })
  
  // 学部は大学選択後に動的に取得するため、ここでは取得しない
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-5xl font-black mb-8 text-pink-600 tracking-organic text-center">
          プロフィール設定
        </h1>
        
        <Card>
          <ProfileSettingsForm 
            user={fullUser!} 
            universities={universities}
          />
        </Card>
      </div>
    </div>
  )
}
