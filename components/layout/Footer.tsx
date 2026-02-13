import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t-2 border-pink-100 mt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="text-2xl font-black text-pink-600 mb-4 tracking-organic">DENJU</h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              先輩から後輩へ、知識を伝授。<br />
              大学試験対策ノート売買プラットフォーム
            </p>
          </div>

          <div>
            <h4 className="font-bold text-charcoal-800 mb-3">サービス</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/materials" className="text-charcoal-600 hover:text-pink-600 transition-colors">
                  資料を探す
                </Link>
              </li>
              <li>
                <Link href="/materials/upload" className="text-charcoal-600 hover:text-pink-600 transition-colors">
                  資料を出品
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-charcoal-600 hover:text-pink-600 transition-colors">
                  プロフィール
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-charcoal-800 mb-3">規約・ポリシー</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-charcoal-600 hover:text-pink-600 transition-colors">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/terms/listing" className="text-charcoal-600 hover:text-pink-600 transition-colors">
                  出品規約
                </Link>
              </li>
              <li>
                <Link href="/terms/points" className="text-charcoal-600 hover:text-pink-600 transition-colors">
                  ポイント規約
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-pink-100 pt-6 text-center">
          <p className="text-sm text-charcoal-500">
            © 2026 DENJU. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
