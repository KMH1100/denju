import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const metadata = {
  title: '出品規約 - DENJU',
  description: 'DENJUの出品規約',
}

export default function ListingTermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-5xl font-black mb-8 text-pink-600 tracking-organic text-center">
          出品規約
        </h1>
        
        <Card className="mb-8">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-charcoal-600 mb-6">最終更新日: 2026年2月13日</p>
            
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-6">
              <p className="font-bold text-charcoal-800 mb-2">⚠️ 重要な注意事項</p>
              <p className="text-sm text-charcoal-700">
                本規約は著作権法、不正競争防止法等の日本の法律に基づいて作成されています。出品前に必ずお読みください。違反した場合、法的責任を問われる可能性があります。
              </p>
            </div>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第1条（出品資格）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>出品者は、当サービスでGPA認証を完了している必要があります。</li>
              <li>出品者は、日本国内の大学に在籍または卒業した者に限ります。</li>
              <li>出品者は、18歳以上である必要があります。</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第2条（出品可能な資料）</h2>
            <p className="text-charcoal-700 leading-relaxed mb-4">出品可能な資料は、以下の条件を全て満たすものに限ります。</p>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>出品者自身が作成したオリジナルの資料であること</li>
              <li>大学の講義、試験、レポート等に関連する学習資料であること</li>
              <li>他人の著作権を侵害していないこと</li>
              <li>大学の規則に違反していないこと</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第3条（出品禁止資料）</h2>
            <p className="text-charcoal-700 leading-relaxed mb-4">以下の資料は出品を禁止します。</p>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li className="font-bold text-red-600">教科書、参考書、問題集等の市販書籍をスキャンまたは撮影したもの</li>
              <li className="font-bold text-red-600">教授が配布したスライド、プリント、資料をそのまま転載したもの</li>
              <li className="font-bold text-red-600">過去の試験問題や解答をそのまま掲載したもの（大学が公開しているものを除く）</li>
              <li className="font-bold text-red-600">他人が作成したレポートやノートをコピーしたもの</li>
              <li>著作権で保護されている図表、写真等を無断で使用したもの</li>
              <li>虚偽の情報や誤解を招く内容を含むもの</li>
              <li>公序良俗に反する内容を含むもの</li>
              <li>大学が明示的に禁止している資料</li>
            </ol>

            <div className="bg-pink-50 border-2 border-pink-300 rounded-2xl p-6 mb-6">
              <p className="font-bold text-charcoal-800 mb-2">✅ 出品可能な例</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-charcoal-700">
                <li>自分で作成した講義ノート（手書き・タイピング）</li>
                <li>自分でまとめた試験対策資料</li>
                <li>自分が作成したレポート（提出済みのもの）</li>
                <li>自分で作成した図表、まとめ表</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第4条（著作権の帰属）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>出品された資料の著作権は、出品者に帰属します。</li>
              <li>出品者は、当サービスに資料を掲載し、購入者に配信する権利を当社に許諾するものとします。</li>
              <li>出品者は、資料の著作権を保有していること、および第三者の権利を侵害していないことを保証します。</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第5条（価格設定）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>出品者は、100円〜5,000円の範囲で価格を設定できます。</li>
              <li>出品者が受け取る金額は、販売価格の80%です（プラットフォーム手数料20%）。</li>
              <li>一度設定した価格は、いつでも変更可能です。</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第6条（審査）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>出品された資料は、当社が内容を審査します。</li>
              <li>審査には通常1〜3営業日を要します。</li>
              <li>本規約に違反する資料は、出品を承認しません。</li>
              <li>当社は、審査の理由を開示する義務を負いません。</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第7条（出品の取消・削除）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>出品者は、いつでも出品を取り消すことができます。</li>
              <li>当社は、以下の場合、事前の通知なく出品を削除することができます。
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>本規約に違反する内容が判明した場合</li>
                  <li>第三者から著作権侵害の申し立てがあった場合</li>
                  <li>その他、当社が不適切と判断した場合</li>
                </ul>
              </li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第8条（出品者の責任）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>出品者は、出品資料が第三者の権利を侵害しないことを保証します。</li>
              <li>出品資料に関して第三者との間で紛争が生じた場合、出品者の責任と費用負担において解決するものとします。</li>
              <li>当社が第三者から損害賠償請求を受けた場合、出品者は当社に生じた損害を賠償するものとします。</li>
            </ol>

            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 mb-6">
              <p className="font-bold text-red-600 mb-2">🚨 著作権侵害について</p>
              <p className="text-sm text-charcoal-700 mb-2">
                他人の著作物を無断で使用した場合、著作権法第119条により、10年以下の懲役または1000万円以下の罰金、またはその両方が科される可能性があります。
              </p>
              <p className="text-sm text-charcoal-700">
                出品前に、必ず自分が作成したオリジナルの資料であることを確認してください。
              </p>
            </div>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第9条（規約の変更）</h2>
            <p className="text-charcoal-700 leading-relaxed mb-4">
              当社は、必要に応じて本規約を変更することができます。変更後は、当サービス上での告知をもって効力を生じるものとします。
            </p>
          </div>
        </Card>

        <div className="flex gap-4 mb-8">
          <Link href="/terms" className="flex-1">
            <Button variant="secondary" size="lg" className="w-full">
              利用規約を読む
            </Button>
          </Link>
          <Link href="/terms/points" className="flex-1">
            <Button variant="secondary" size="lg" className="w-full">
              ポイント規約を読む
            </Button>
          </Link>
        </div>

        <Link href="/materials/upload">
          <Button variant="primary" size="lg" className="w-full">
            規約に同意して資料を出品する
          </Button>
        </Link>
      </div>
    </div>
  )
}
