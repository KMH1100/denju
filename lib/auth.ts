import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) return null
  
  const user = await prisma.user.findUnique({
    where: { email: authUser.email! },
    include: {
      university: true,
    },
  })
  
  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required')
  }
  return user
}

// ドメイン検証ロジック
export function validateUniversityDomain(email: string, allowedDomain: string): boolean {
  const emailDomain = email.split('@')[1]
  
  // ワイルドカード対応（例: *.ac.jp）
  if (allowedDomain.startsWith('*.')) {
    const baseDomain = allowedDomain.slice(2)
    return emailDomain.endsWith(baseDomain)
  }
  
  // 完全一致
  return emailDomain === allowedDomain
}
