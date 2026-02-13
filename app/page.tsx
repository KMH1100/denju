import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50">
      <div className="container mx-auto px-6 py-20">
        {/* ヒーローセクション */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <h1 className="text-8xl font-black mb-8 text-pink-600 tracking-organic">
            DENJU
          </h1>
          <p className="text-3xl font-bold mb-6 text-charcoal-800 tracking-wide">
            大学試験対策ノート売買プラットフォーム
          </p>
          <p className="text-xl text-charcoal-600 mb-12 max-w-2xl mx-auto leading-relaxed tracking-wider">
            先輩から後輩へ、知識を伝授。
            <br />
            GPAで安心の信頼性。
          </p>
          
          <div className="flex gap-6 justify-center">
            <Link href="/materials">
              <Button size="lg" variant="primary">
                資料を探す
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="secondary">
                ログイン / 登録
              </Button>
            </Link>
          </div>
        </div>

        {/* 特徴 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          <Card hoverable>
            <div className="text-center">
              <div className="text-7xl mb-6">🏆</div>
              <h3 className="text-2xl font-bold mb-4 text-pink-600 tracking-wide">GPA認証で安心</h3>
              <p className="text-charcoal-600 text-base leading-relaxed">
                成績証明書で確認。優秀な出品者には金・銀バッジで信頼度をわかりやすく表示。
              </p>
            </div>
          </Card>

          <Card hoverable>
            <div className="text-center">
              <div className="text-7xl mb-6">🔒</div>
              <h3 className="text-2xl font-bold mb-4 text-pink-600 tracking-wide">安心の保護機能</h3>
              <p className="text-charcoal-600 text-base leading-relaxed">
                透かしやコピーガードで、あなたのノートをしっかり保護します。
              </p>
            </div>
          </Card>

          <Card hoverable>
            <div className="text-center">
              <div className="text-7xl mb-6">💰</div>
              <h3 className="text-2xl font-bold mb-4 text-pink-600 tracking-wide">お小遣い稼ぎに</h3>
              <p className="text-charcoal-600 text-base leading-relaxed">
                あなたのノートが誰かの役に立つ。売上の80%があなたの収入になります。
              </p>
            </div>
          </Card>
        </div>

        {/* 使い方 */}
        <div className="max-w-5xl mx-auto">
          <Card>
            <h2 className="text-4xl font-black mb-12 text-center text-charcoal-800 tracking-wide">
              かんたん3ステップ
            </h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-charcoal-800 font-black text-2xl">1</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-charcoal-800 tracking-wide">大学メールでログイン</h3>
                  <p className="text-charcoal-600 text-base leading-relaxed">
                    所属大学を選んでGoogleアカウントでログイン。大学メールアドレスで本人確認するから安心です。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center text-white font-black text-2xl">2</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-charcoal-800 tracking-wide">GPA認証（出品したい人のみ）</h3>
                  <p className="text-charcoal-600 text-base leading-relaxed">
                    ノートを出品したい場合は成績証明書をアップロード。24時間以内に確認します。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-charcoal-800 font-black text-2xl">3</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-charcoal-800 tracking-wide">さっそく使ってみよう</h3>
                  <p className="text-charcoal-600 text-base leading-relaxed">
                    ノートを購入したり、自分のノートを出品したり。クレジットカード決済で簡単・安全にお取引できます。
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
