import { Suspense } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

function ErrorContent({ searchParams }: { searchParams: { message?: string; university?: string } }) {
  const message = searchParams.message
  const university = searchParams.university

  const errorMessages: Record<string, string> = {
    domain_mismatch: `選択した大学（${decodeURIComponent(university || '')}）のドメインと一致するメールアドレスでログインしてください`,
    university_required: '大学を選択してください',
    university_not_found: '選択された大学が見つかりません',
    auth_failed: '認証に失敗しました',
    db_error: 'データベースエラーが発生しました',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-400 to-red-500 flex items-center justify-center p-4">
      <Card className="max-w-md">
        <h1 className="text-3xl font-black mb-4 uppercase text-red-500">認証エラー</h1>
        <p className="mb-6 text-lg">
          {message ? errorMessages[message] || '不明なエラーが発生しました' : 'エラーが発生しました'}
        </p>
        <Link href="/auth/login">
          <Button className="w-full">ログイン画面に戻る</Button>
        </Link>
      </Card>
    </div>
  )
}

export default function ErrorPage({ searchParams }: { searchParams: { message?: string; university?: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent searchParams={searchParams} />
    </Suspense>
  )
}
