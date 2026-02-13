import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const metadata = {
  title: 'ポイント規約 - DENJU',
  description: 'DENJUのポイント付与・換金規約',
}

export default function PointTermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-5xl font-black mb-8 text-yellow-600 tracking-organic text-center">
          ポイント規約
        </h1>
        
        <Card className="mb-8">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-charcoal-600 mb-6">最終更新日: 2026年2月13日</p>
            
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-6">
              <p className="font-bold text-charcoal-800 mb-2">💰 ポイントについて</p>
              <p className="text-sm text-charcoal-700">
                本規約は資金決済法に基づいて作成されています。DENJUのポイントは「自家型前払式支払手段」に該当します。
              </p>
            </div>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第1条（ポイントの定義）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>「ポイント」とは、当サービス内でのみ利用可能な電子的な価値を指します。</li>
              <li>1ポイント＝1円相当として扱います。</li>
              <li>ポイントは、現金、有価証券その他の財産的価値を有するものではありません。</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第2条（ポイントの付与）</h2>
            <p className="text-charcoal-700 leading-relaxed mb-4">ポイントは、以下の方法で付与されます。</p>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>資料の販売: 販売価格の80%がポイントとして付与されます
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm">
                  <li>例: 500円の資料が売れた場合、400ポイント付与</li>
                  <li>プラットフォーム手数料20%を差し引いた金額</li>
                </ul>
              </li>
              <li>キャンペーン: 当社が実施するキャンペーンによる付与</li>
            </ol>

            <div className="bg-pink-50 border-2 border-pink-300 rounded-2xl p-6 mb-6">
              <p className="font-bold text-charcoal-800 mb-2">📊 手数料について</p>
              <p className="text-sm text-charcoal-700 mb-2">
                当社がプラットフォーム手数料として20%を受け取る理由:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-charcoal-700">
                <li>サーバー・インフラ運用費用</li>
                <li>決済手数料（Stripe等）</li>
                <li>資料の審査・管理費用</li>
                <li>著作権保護機能（透かし、コピーガード）の提供</li>
                <li>カスタマーサポート費用</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第3条（ポイントの確認）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>ポイント残高は、プロフィールページで確認できます。</li>
              <li>ポイント付与・使用履歴は、プロフィールページで確認できます。</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第4条（ポイントの換金）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>ポイントは、以下の方法で換金できます。
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Amazonギフトカード（最低500ポイント〜）</li>
                </ul>
              </li>
              <li>換金申請は、プロフィールページから行えます。</li>
              <li>換金には以下の条件があります。
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>最低換金額: 500ポイント</li>
                  <li>換金手数料: 無料</li>
                  <li>換金処理期間: 申請後5〜10営業日</li>
                </ul>
              </li>
              <li>換金申請後のキャンセルはできません。</li>
            </ol>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-6">
              <p className="font-bold text-charcoal-800 mb-2">🎁 Amazonギフトカードについて</p>
              <p className="text-sm text-charcoal-700 mb-2">
                換金方法としてAmazonギフトカードを選択した理由:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-charcoal-700">
                <li>銀行振込に比べて手数料が不要</li>
                <li>個人情報（銀行口座）の登録が不要</li>
                <li>迅速な受け取りが可能（メールで即時配信）</li>
                <li>教科書、参考書等の購入に使える</li>
              </ul>
              <p className="text-xs text-charcoal-600 mt-3">
                ※ 将来的には、PayPay等の他の換金方法も追加予定です
              </p>
            </div>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第5条（ポイントの有効期限）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>ポイントの有効期限は、最後にポイントを獲得または使用した日から1年間です。</li>
              <li>有効期限が切れたポイントは自動的に失効します。</li>
              <li>有効期限の1ヶ月前に、登録メールアドレスに通知を送信します。</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第6条（ポイントの譲渡禁止）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>ポイントは、他の利用者に譲渡することはできません。</li>
              <li>ポイントを第三者に売買、譲渡、質入れ等することはできません。</li>
              <li>相続、法人格の合併等による承継もできません。</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第7条（ポイントの取消）</h2>
            <p className="text-charcoal-700 leading-relaxed mb-4">以下の場合、当社はポイントを取り消すことができます。</p>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>不正な方法でポイントを取得した場合</li>
              <li>本規約に違反した場合</li>
              <li>出品した資料が著作権侵害等で削除された場合</li>
              <li>購入者から返金要請があり、当社がこれを認めた場合</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第8条（サービス終了時の扱い）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>当社が当サービスを終了する場合、3ヶ月前に告知します。</li>
              <li>サービス終了日までに、保有ポイントを換金することができます。</li>
              <li>サービス終了日以降、未使用のポイントは失効します。</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第9条（法令の遵守）</h2>
            <p className="text-charcoal-700 leading-relaxed mb-4">
              本ポイントは、資金決済法第3条第1項第1号に定める「自家型前払式支払手段」に該当します。当社は、同法に基づく義務を遵守します。
            </p>

            <div className="bg-pink-50 border-2 border-pink-300 rounded-2xl p-6 mb-6">
              <p className="font-bold text-charcoal-800 mb-2">⚖️ 資金決済法について</p>
              <p className="text-sm text-charcoal-700">
                資金決済法により、前払式支払手段の発行者は、未使用残高が一定額を超えた場合、その半額以上を供託または保全する義務があります。当社は、法令に従い適切に管理しています。
              </p>
            </div>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第10条（規約の変更）</h2>
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
          <Link href="/terms/listing" className="flex-1">
            <Button variant="secondary" size="lg" className="w-full">
              出品規約を読む
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
