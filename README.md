# 📚 DENJU（伝授）- 大学試験対策ノート売買プラットフォーム

**全大学・全学部の学生が、GPAという客観的信頼を武器に、講義ノートや試験対策資料を安全かつ刺激的なデザイン環境で売買できるP2Pプラットフォーム。知識を伝授し、共に成長する。**

## 🎯 コンセプト

- **ターゲット**: 留年を回避したい「購入者」と、努力を収益化したい「優秀な出品者（GPA 3.3以上推奨）」
- **差別化**: GPA認証システム、ネオ・ブリュータリズムUI、鉄壁のコンテンツ保護

## ✨ 主要機能

### 🔐 認証・セキュリティ
- **Supabase Auth + Google OAuth**: 大学ドメインメール限定ログイン
- **ドメイン検証**: 選択した大学のドメインと不一致なら登録拒否
- **GPA認証**: 成績証明書の目視確認による金・銀バッジ付与
- **管理者権限**: `ADMIN_EMAIL`環境変数による管理者判定

### 📚 資料管理
- **出品機能**: Supabase StorageによるPDFアップロード（Private）
- **審査システム**: 管理者による資料承認/却下
- **検索機能**: 大学別・学部別・講義別ドリルダウン検索
- **価格設定**: Web閲覧とPDFダウンロードの2プラン

### 💰 決済・換金
- **Stripe Checkout**: 安全なカード決済
- **Webhook**: 購入完了時に自動で出品者残高に80%を加算
- **換金申請**: Amazonギフト券・PayPay対応（最低1,000円）

### 🛡️ コンテンツ保護
- **動的透かし**: pdf-libによる購入者情報の透かし挿入
- **Webビューア保護**: 
  - 右クリック禁止
  - コピー・ドラッグ禁止
  - 印刷禁止（Ctrl+P等のショートカット無効化）
  - 開発者ツール抑制（F12, Ctrl+Shift+I等）
  - PrintScreen抑制

### 🎨 デザインシステム
- **テーマ**: Neobrutalism（ネオ・ブリュータリズム）
- **カラー**: 
  - Neon Pink (#FF007A)
  - Electric Yellow (#FFF500)
  - Deep Black (#000000)
  - Pure White (#FFFFFF)
- **特徴**: 
  - 全要素に `border-4 border-black`
  - 角丸なし（`rounded-none`）
  - ぼかしなしの影 `box-shadow: 8px 8px 0px 0px #000000`
  - Active時の影アニメーション

## 🚀 セットアップ

### 1. 前提条件

- Node.js 18.17以上
- npm または yarn
- PostgreSQLデータベース（Supabase推奨）
- Supabaseアカウント
- UploadThingアカウント
- Stripeアカウント

### 2. インストール

```bash
# リポジトリをクローン
git clone <your-repo-url>
cd denju

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
```

### 3. 環境変数の設定

`.env`ファイルを編集し、以下の値を設定:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/ckm?schema=public"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Admin
ADMIN_EMAIL=admin@university.ac.jp

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. データベースのセットアップ

```bash
# Prismaマイグレーション実行
npx prisma migrate dev

# Prisma Clientを生成
npx prisma generate
```

### 5. 初期データの投入（任意）

管理者用に大学データを手動で投入:

```bash
npx prisma studio
```

または、以下のSQLを実行:

```sql
INSERT INTO "University" (id, name, slug, "allowedDomain") VALUES
  ('univ1', '東京大学', 'tokyo-university', 'u-tokyo.ac.jp'),
  ('univ2', '早稲田大学', 'waseda-university', 'waseda.jp');

INSERT INTO "Department" (id, name, slug, "universityId") VALUES
  ('dept1', '工学部', 'engineering', 'univ1'),
  ('dept2', '経済学部', 'economics', 'univ2');
```

### 6. 開発サーバー起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

### 7. Stripeのローカルテスト

Webhook用にStripe CLIをインストール:

```bash
# Stripe CLIのインストール（Windowsの場合はScoopを使用）
scoop install stripe

# Stripeにログイン
stripe login

# Webhookをローカルにフォワード
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

出力された`whsec_`で始まるWebhook Secretを`.env`の`STRIPE_WEBHOOK_SECRET`に設定。

## 📁 プロジェクト構造

```
denju/
├── app/                      # Next.js App Router
│   ├── api/                  # APIルート
│   │   ├── auth/             # 認証関連
│   │   ├── admin/            # 管理者API
│   │   ├── checkout/         # Stripe決済
│   │   ├── webhooks/         # Webhook処理
│   │   ├── download/         # PDF透かしダウンロード
│   │   ├── uploadthing/      # ファイルアップロード
│   │   └── ...
│   ├── admin/                # 管理者画面
│   │   ├── audit/            # 審査Queue
│   │   ├── payouts/          # 換金管理
│   │   └── universities/     # 大学マスタ
│   ├── materials/            # 資料関連
│   │   ├── [id]/             # 資料詳細・閲覧
│   │   └── upload/           # 資料出品
│   ├── profile/              # ユーザープロフィール
│   │   ├── verify-gpa/       # GPA認証
│   │   └── payout/           # 換金申請
│   ├── auth/                 # 認証画面
│   ├── page.tsx              # トップページ
│   ├── layout.tsx            # ルートレイアウト
│   └── globals.css           # グローバルスタイル
├── components/               # Reactコンポーネント
│   ├── ui/                   # UIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── Textarea.tsx
│   ├── auth/                 # 認証コンポーネント
│   ├── admin/                # 管理者コンポーネント
│   ├── materials/            # 資料コンポーネント
│   └── profile/              # プロフィールコンポーネント
├── lib/                      # ユーティリティ
│   ├── prisma.ts             # Prismaクライアント
│   ├── stripe.ts             # Stripe初期化
│   ├── auth.ts               # 認証ヘルパー
│   ├── uploadthing.ts        # UploadThing設定
│   └── supabase/             # Supabase設定
├── prisma/                   # Prismaスキーマ
│   └── schema.prisma
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔧 運用

### 管理者として初回ログイン

1. `.env`の`ADMIN_EMAIL`に自分の大学メールアドレスを設定
2. 該当する大学をデータベースに登録
3. Googleでログイン
4. 自動的に`ADMIN`ロールが付与される

### 管理者機能

- **審査Queue** (`/admin/audit`): 
  - GPA認証の承認/却下（GPAを入力して承認）
  - 資料の承認/却下
- **換金管理** (`/admin/payouts`):
  - 換金申請にギフトコードを入力して完了
- **大学マスタ** (`/admin/universities`):
  - 大学・学部の追加管理

### ユーザー機能

1. **ログイン**: 大学を選択してGoogleログイン
2. **GPA認証** (出品者のみ): 成績証明書をアップロード
3. **資料購入**: Web閲覧またはPDFダウンロードを購入
4. **資料出品**: GPA認証後、PDFをアップロード
5. **換金申請**: 残高1,000円以上で申請可能

## 🎨 デザインガイドライン

### カラーパレット

```tsx
colors: {
  neonPink: '#FF007A',
  electricYellow: '#FFF500',
  deepBlack: '#000000',
  pureWhite: '#FFFFFF',
}
```

### ボタンスタイル例

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
```

### カードスタイル例

```tsx
<Card hoverable>
  <h3 className="text-xl font-black">タイトル</h3>
  <p>コンテンツ</p>
</Card>
```

## 🛠️ トラブルシューティング

### 1. Prismaエラー

```bash
# スキーマをリセット
npx prisma migrate reset

# 再生成
npx prisma generate
```

### 2. UploadThingエラー

- UploadThingダッシュボードでAPI Keyを確認
- Privateモードが有効になっているか確認

### 3. Stripe Webhookエラー

- Webhook Secretが正しいか確認
- Stripe CLIで`stripe listen`が起動しているか確認

### 4. 認証エラー

- Supabaseダッシュボードで認証プロバイダーが有効か確認
- GoogleのOAuth Consent ScreenでリダイレクトURIが正しいか確認

## 📝 ライセンス

このプロジェクトは個人利用・学習目的のサンプルです。商用利用する場合は、適切なライセンスを適用してください。

## 🤝 コントリビューション

このプロジェクトは指示書に基づいて構築されたものです。改善提案やバグ報告は歓迎します。

---

**開発者向けメモ**:
- すべてのAPI routeはサーバーコンポーネントで認証チェック済み
- Zodによる厳格なバリデーション実装済み
- Prismaトランザクションで整合性担保
- Next.js 14のApp Routerを完全活用
