import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateUniversityDomain } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const universityId = searchParams.get('universityId')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      try {
        // 大学情報を取得
        if (!universityId) {
          return NextResponse.redirect(`${origin}/auth/error?message=university_required`)
        }
        
        const university = await prisma.university.findUnique({
          where: { id: universityId },
        })
        
        if (!university) {
          return NextResponse.redirect(`${origin}/auth/error?message=university_not_found`)
        }
        
        // ドメイン検証
        const email = data.user.email!
        if (!validateUniversityDomain(email, university.allowedDomain)) {
          // 認証失敗：ドメイン不一致
          await supabase.auth.signOut()
          return NextResponse.redirect(`${origin}/auth/error?message=domain_mismatch&university=${encodeURIComponent(university.name)}`)
        }
        
        // ユーザーをDBに作成または更新
        await prisma.user.upsert({
          where: { email },
          update: {
            universityId: university.id,
          },
          create: {
            email,
            universityId: university.id,
            role: email === process.env.ADMIN_EMAIL ? 'ADMIN' : 'USER',
          },
        })
        
        return NextResponse.redirect(`${origin}${next}`)
      } catch (dbError) {
        console.error('Database error:', dbError)
        return NextResponse.redirect(`${origin}/auth/error?message=db_error`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/error?message=auth_failed`)
}
