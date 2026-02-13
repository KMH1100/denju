import { requireAuth } from '@/lib/auth'
import { PayoutRequestForm } from '@/components/profile/PayoutRequestForm'
import { Card } from '@/components/ui/Card'

export default async function PayoutPage() {
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 p-4">
      <div className="container mx-auto max-w-3xl py-8">
        <h1 
          className="text-5xl font-black mb-8 text-center text-white uppercase"
          style={{ textShadow: '4px 4px 0px #000000' }}
        >
          換金申請
        </h1>

        <Card className="mb-6">
          <h2 className="text-2xl font-black mb-4">現在の残高</h2>
          <p className="text-5xl font-black text-neonPink mb-2">
            ¥{user.balance.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            ※ 最低換金額: ¥1,000
          </p>
        </Card>

        <PayoutRequestForm userId={user.id} currentBalance={user.balance} />
      </div>
    </div>
  )
}
