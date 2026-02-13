# 🚀 DENJU（伝授）セットアップガイド

## 1. Supabaseのセットアップ

### 1.1 プロジェクト作成

1. https://supabase.com にアクセス
2. 「New Project」をクリック
3. プロジェクト名を入力（例: ckm-production）
4. データベースパスワードを設定
5. リージョンを選択（日本の場合は「Northeast Asia (Tokyo)」推奨）

### 1.2 認証設定

1. Supabaseダッシュボード → 「Authentication」→「Providers」
2. Googleプロバイダーを有効化
3. Google Cloud ConsoleでOAuth 2.0クライアントIDを作成:
   - https://console.cloud.google.com
   - 「APIs & Services」→「Credentials」
   - 「+ CREATE CREDENTIALS」→「OAuth client ID」
   - Application type: Web application
   - Authorized redirect URIs: 
     - `https://<your-project-id>.supabase.co/auth/v1/callback`
4. Client IDとClient SecretをSupabaseに貼り付け

### 1.3 環境変数を取得

1. Settings → API
2. 以下をコピー:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`（⚠️秘密厳守）

### 1.4 データベース接続

1. Settings → Database
2. Connection string → URI を確認
3. パスワード部分を実際のパスワードに置換
4. `DATABASE_URL`に設定

---

## 2. Supabase Storageのセットアップ

### 2.1 バケットの作成

Supabaseダッシュボード → Storage → 以下の3つのバケットを作成:

1. **materials** (PDF資料用):
   - Public: ❌ OFF
   - File size limit: 50MB

2. **gpa-proofs** (GPA証明書用):
   - Public: ❌ OFF
   - File size limit: 5MB

3. **thumbnails** (サムネイル用):
   - Public: ❌ OFF
   - File size limit: 2MB

### 2.2 RLSポリシーの設定

詳細は `SUPABASE_STORAGE_SETUP.md` を参照してください。

---

## 3. Stripeのセットアップ

### 3.1 アカウント作成

1. https://stripe.com にアクセス
2. アカウント作成（テストモード推奨）

### 3.2 API Keys取得

1. Developers → API keys
2. 以下をコピー:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`（⚠️秘密厳守）

### 3.3 Webhook設定

#### 開発環境（Stripe CLI）

```bash
# Stripe CLIインストール（Windows）
scoop install stripe

# ログイン
stripe login

# Webhookをローカルにフォワード
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

出力された`whsec_`で始まるシークレットを`STRIPE_WEBHOOK_SECRET`に設定。

#### 本番環境

1. Developers → Webhooks
2. 「Add endpoint」をクリック
3. Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
4. Events to send: `checkout.session.completed`を選択
5. Signing secretをコピー → `STRIPE_WEBHOOK_SECRET`

---

## 4. 環境変数の最終確認

`.env`ファイルをプロジェクトルートに作成:

```env
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/denju?schema=public"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Admin（あなたの大学メールアドレス）
ADMIN_EMAIL=your-email@university.ac.jp

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 5. データベースマイグレーション

```bash
# 依存関係インストール
npm install

# Prismaマイグレーション
npx prisma migrate dev --name init

# Prisma Clientを生成
npx prisma generate

# Prisma Studioで確認（オプション）
npx prisma studio
```

---

## 6. 初期データの投入

### 方法1: Prisma Studio（GUI）

```bash
npx prisma studio
```

ブラウザで開き、以下を手動で入力:

#### University（大学）

| name | slug | allowedDomain |
|------|------|---------------|
| 東京大学 | tokyo-university | u-tokyo.ac.jp |
| 早稲田大学 | waseda-university | waseda.jp |

#### Department（学部）

| name | slug | universityId |
|------|------|--------------|
| 工学部 | engineering | [東京大学のID] |
| 経済学部 | economics | [早稲田大学のID] |

### 方法2: SQLを直接実行

Supabase Dashboard → SQL Editor で実行:

```sql
-- 大学を追加
INSERT INTO "University" (id, name, slug, "allowedDomain", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), '東京大学', 'tokyo-university', 'u-tokyo.ac.jp', NOW(), NOW()),
  (gen_random_uuid(), '早稲田大学', 'waseda-university', 'waseda.jp', NOW(), NOW());

-- 学部を追加（universityIdは上で生成されたIDに置き換え）
INSERT INTO "Department" (id, name, slug, "universityId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '工学部', 'engineering', id, NOW(), NOW()
FROM "University" WHERE slug = 'tokyo-university';

INSERT INTO "Department" (id, name, slug, "universityId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '経済学部', 'economics', id, NOW(), NOW()
FROM "University" WHERE slug = 'waseda-university';
```

---

## 7. 開発サーバー起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

---

## 8. 管理者として初回ログイン

1. `.env`の`ADMIN_EMAIL`を確認
2. ブラウザで http://localhost:3000/auth/login にアクセス
3. `ADMIN_EMAIL`に対応する大学を選択
4. Googleでログイン
5. 自動的に管理者権限が付与される

---

## 9. 動作確認

### ✅ チェックリスト

- [ ] トップページが表示される
- [ ] ログイン画面で大学一覧が表示される
- [ ] Googleログインが成功する
- [ ] `/admin/audit`にアクセスできる（管理者のみ）
- [ ] GPA認証申請ができる
- [ ] 資料のアップロードができる（GPA認証後）
- [ ] Stripe決済フローが動作する
- [ ] PDFダウンロードで透かしが入る

---

## 10. デプロイ（Vercel推奨）

### 10.1 Vercelにデプロイ

```bash
# Vercel CLIインストール
npm i -g vercel

# ログイン
vercel login

# デプロイ
vercel
```

### 10.2 環境変数をVercelに設定

Vercelダッシュボード → Settings → Environment Variables で、すべての環境変数を設定。

### 10.3 本番用Webhook設定

1. Stripe Dashboard → Webhooks
2. Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
3. Signing secretを環境変数に追加

### 10.4 ドメイン設定

1. Vercel Dashboard → Settings → Domains
2. カスタムドメインを追加（オプション）
3. `NEXT_PUBLIC_APP_URL`を更新

---

## 🎉 完了！

これでDENJUプラットフォームが稼働します。

**次のステップ:**
- 管理者ダッシュボードで大学・学部を追加
- ユーザーを招待してテスト
- 資料の審査フローを確認
- 決済・換金フローを検証

---

## トラブルシューティング

### エラー: "Invalid `prisma.xxx.findMany()` invocation"

→ `npx prisma generate`を実行

### エラー: "Supabase auth error"

→ SupabaseダッシュボードでGoogleプロバイダーが有効か確認

### エラー: "UploadThing upload failed"

→ UploadThingでPrivateモードが有効か確認

### 質問がある場合

1. README.mdを再確認
2. 各サービスの公式ドキュメントを参照
3. `.env`ファイルの設定を再確認
