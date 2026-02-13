import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export const metadata = {
  title: '利用規約 - DENJU',
  description: 'DENJUの利用規約',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-5xl font-black mb-8 text-pink-600 tracking-organic text-center">
          利用規約
        </h1>
        
        <Card className="mb-8">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-charcoal-600 mb-6">最終更新日: 2026年2月13日</p>
            
            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第1条（適用）</h2>
            <p className="text-charcoal-700 leading-relaxed mb-4">
              本規約は、DENJU（以下「当サービス」）の利用に関して、当サービスを提供する運営者（以下「当社」）と利用者との間の権利義務関係を定めるものです。当サービスの利用に際しては、本規約の全文をお読みいただいた上で、本規約に同意いただく必要があります。
            </p>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第2条（定義）</h2>
            <p className="text-charcoal-700 leading-relaxed mb-4">本規約において使用する用語の定義は、以下のとおりとします。</p>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>「利用者」とは、当サービスを利用する全ての方を指します。</li>
              <li>「出品者」とは、当サービスに学習資料を出品する利用者を指します。</li>
              <li>「購入者」とは、当サービスで学習資料を購入する利用者を指します。</li>
              <li>「学習資料」とは、大学の講義・試験対策のために出品者が作成したノート、レポート等の資料を指します。</li>
              <li>「ポイント」とは、当サービス内で使用できる電子的な価値を指します。</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第3条（利用登録）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>利用者は、大学が発行するメールアドレスを使用して利用登録を行う必要があります。</li>
              <li>当社は、以下のいずれかに該当する場合、利用登録を承認しないことがあります。
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>虚偽の情報を登録した場合</li>
                  <li>過去に本規約違反により利用停止処分を受けた者である場合</li>
                  <li>その他、当社が不適切と判断した場合</li>
                </ul>
              </li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第4条（禁止事項）</h2>
            <p className="text-charcoal-700 leading-relaxed mb-4">利用者は、以下の行為を行ってはなりません。</p>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>法令または本規約に違反する行為</li>
              <li>他人の著作権、商標権、その他の知的財産権を侵害する行為</li>
              <li>教科書や参考書等、第三者が著作権を有する資料をそのまま販売する行為</li>
              <li>大学が配布した試験問題や解答をそのまま販売する行為</li>
              <li>虚偽の情報を提供する行為</li>
              <li>不正アクセス、ウイルスの頒布等、当サービスの運営を妨害する行為</li>
              <li>他の利用者への嫌がらせ、誹謗中傷</li>
              <li>反社会的勢力への利益供与</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第5条（知的財産権）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>当サービスに関する知的財産権は全て当社または当社にライセンスを許諾している者に帰属します。</li>
              <li>出品者が出品する学習資料の著作権は、出品者に帰属します。</li>
              <li>購入者は、購入した学習資料を個人的な学習目的でのみ使用することができ、第三者への譲渡、再配布、公衆送信等を行うことはできません。</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第6条（免責事項）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>当社は、学習資料の内容の正確性、完全性、有用性について一切保証しません。</li>
              <li>当社は、学習資料を使用したことによる試験の合否、成績等について一切の責任を負いません。</li>
              <li>当サービスの利用により生じた損害について、当社は故意または重過失がある場合を除き、一切の責任を負いません。</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第7条（利用停止・退会）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>当社は、利用者が本規約に違反した場合、事前の通知なく利用を停止することができます。</li>
              <li>利用者は、いつでも退会手続きを行うことができます。</li>
              <li>退会時に未使用のポイントがある場合、原則として返金は行いません。</li>
            </ol>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第8条（規約の変更）</h2>
            <p className="text-charcoal-700 leading-relaxed mb-4">
              当社は、民法第548条の4の規定に基づき、利用者の一般の利益に適合する場合、または変更の必要性、変更後の内容の相当性、その他の変更に係る事情に照らして合理的なものである場合には、本規約を変更することができます。
            </p>

            <h2 className="text-2xl font-bold text-charcoal-800 mt-6 mb-4">第9条（準拠法・管轄裁判所）</h2>
            <ol className="list-decimal list-inside space-y-2 text-charcoal-700 mb-4">
              <li>本規約の準拠法は日本法とします。</li>
              <li>本規約に関する紛争については、当社の所在地を管轄する裁判所を専属的合意管轄裁判所とします。</li>
            </ol>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/terms/listing" className="block">
            <Card hoverable className="text-center">
              <p className="text-xl font-bold text-pink-600 mb-2">出品規約</p>
              <p className="text-sm text-charcoal-600">資料を出品する前に必読</p>
            </Card>
          </Link>
          <Link href="/terms/points" className="block">
            <Card hoverable className="text-center">
              <p className="text-xl font-bold text-yellow-600 mb-2">ポイント規約</p>
              <p className="text-sm text-charcoal-600">ポイント付与・換金について</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
