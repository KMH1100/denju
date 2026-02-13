import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getCurrentUser } from '@/lib/auth'

const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'],
  variable: '--font-noto-sans',
  weight: ['400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  title: 'DENJU - 大学試験対策ノート売買プラットフォーム',
  description: '先輩から後輩へ、知識を伝授。GPAで安心、大学生のための試験対策ノート売買プラットフォーム',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  return (
    <html lang="ja">
      <body className={notoSansJP.variable}>
        <Navbar user={user} />
        {children}
        <Footer />
      </body>
    </html>
  )
}
