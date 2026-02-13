// このファイルは参考用です。実際のlayout.tsxに統合してください

import { getCurrentUser } from '@/lib/auth'
import { Navbar } from '@/components/layout/Navbar'

export default async function RootLayoutWithNavbar({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <html lang="ja">
      <body>
        <Navbar user={user} />
        {children}
      </body>
    </html>
  )
}
