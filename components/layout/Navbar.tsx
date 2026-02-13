'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export function Navbar({ user }: { user: any | null }) {
  const pathname = usePathname()

  return (
    <nav className="bg-white soft-shadow">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-3xl font-black text-pink-600 tracking-organic hover:text-pink-700 transition-colors">
            DENJU
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/materials">
              <Button variant={pathname === '/materials' ? 'primary' : 'secondary'} size="sm">
                資料を探す
              </Button>
            </Link>

            {user ? (
              <>
                {user.isGpaVerified && (
                  <Link href="/materials/upload">
                    <Button variant="primary" size="sm">
                      資料を売る
                    </Button>
                  </Link>
                )}
                
                <Link href="/profile">
                  <Button variant="secondary" size="sm">
                    プロフィール
                  </Button>
                </Link>

                {user.role === 'ADMIN' && (
                  <Link href="/admin/audit">
                    <Button variant="primary" size="sm">
                      管理画面
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <Link href="/auth/login">
                <Button variant="primary" size="sm">
                  ログイン
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
