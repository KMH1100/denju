import { requireAuth } from '@/lib/auth'
import { UploadMaterialForm } from '@/components/materials/UploadMaterialForm'
import { redirect } from 'next/navigation'

export default async function UploadMaterialPage() {
  const user = await requireAuth().catch(() => null)
  
  if (!user) {
    redirect('/auth/login')
  }
  
  if (!user.isGpaVerified) {
    redirect('/profile/verify-gpa')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-black mb-8 uppercase">資料を出品</h1>
      <UploadMaterialForm userId={user.id} />
    </div>
  )
}
