# 🚢 DENJU（伝授）デプロイメントガイド

## Vercelへのデプロイ（推奨）

### 1. GitHubリポジトリの準備

```bash
# Gitリポジトリを初期化
git init

# .gitignoreの確認（既に作成済み）
# .env ファイルがコミットされないことを確認

# 初回コミット
git add .
git commit -m "Initial commit: DENJU platform"

# GitHubにリポジトリ作成後、プッシュ
git remote add origin https://github.com/your-username/denju.git
git branch -M main
git push -u origin main
```

### 2. Vercelプロジェクトの作成

1. https://vercel.com にアクセス
2. 「New Project」をクリック
3. GitHubリポジトリをインポート
4. Framework Preset: **Next.js** が自動選択されることを確認
5. 「Deploy」をクリック（まだ環境変数は設定しない）

### 3. 環境変数の設定

Vercelダッシュボード → Settings → Environment Variables

以下をすべて追加（Production、Preview、Development すべてにチェック）:

```env
DATABASE_URL=your_production_database_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
ADMIN_EMAIL=your_admin_email
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 4. 本番用Webhook設定

#### Stripe

1. Stripe Dashboard → Developers → Webhooks
2. 「Add endpoint」
3. Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
4. Events to send: `checkout.session.completed`
5. Signing secretをコピーして、Vercelの環境変数`STRIPE_WEBHOOK_SECRET`を更新

### 5. 再デプロイ

Vercel Dashboard → Deployments → 最新のDeploymentの右側の「...」→ Redeploy

### 6. 動作確認

```bash
# カスタムドメイン設定（オプション）
# Vercel Dashboard → Settings → Domains
# your-domain.com を追加

# NEXT_PUBLIC_APP_URLを更新
# 再デプロイ
```

---

## Railway（代替デプロイ先）

### 1. Railwayアカウント作成

https://railway.app にアクセスし、GitHubでログイン

### 2. プロジェクト作成

1. 「New Project」
2. 「Deploy from GitHub repo」
3. リポジトリを選択
4. 環境変数を設定（Vercelと同様）

### 3. カスタムドメイン設定

Settings → Domains → Generate Domain

---

## セルフホスティング（VPS/Docker）

### Dockerを使用したデプロイ

#### 1. Dockerfileの作成

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - UPLOADTHING_SECRET=${UPLOADTHING_SECRET}
      - UPLOADTHING_APP_ID=${UPLOADTHING_APP_ID}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
    restart: unless-stopped
```

#### 3. デプロイ

```bash
# イメージをビルド
docker-compose build

# コンテナ起動
docker-compose up -d

# ログ確認
docker-compose logs -f
```

---

## データベースマイグレーション（本番環境）

### 注意事項

⚠️ 本番環境では`migrate dev`を使用しないでください。

### 本番環境でのマイグレーション

```bash
# Vercel/Railway/Docker内で実行
npx prisma migrate deploy
```

### Vercelの場合（自動実行）

`package.json`に以下を追加:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

---

## モニタリング・ログ

### Vercel

- Vercel Dashboard → Logs でリアルタイムログ確認
- Vercel Analytics 有効化（無料プランでも利用可能）

### Sentry（エラートラッキング）

```bash
npm install @sentry/nextjs

# 初期化
npx @sentry/wizard -i nextjs
```

---

## パフォーマンス最適化

### 1. 画像最適化

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['utfs.io', 'lh3.googleusercontent.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
```

### 2. キャッシュ設定

```typescript
// app/api/materials/route.ts
export const revalidate = 60 // 60秒ごとに再検証
```

### 3. バンドルサイズ分析

```bash
npm install @next/bundle-analyzer

# next.config.js に追加
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // your config
})

# 実行
ANALYZE=true npm run build
```

---

## セキュリティチェックリスト

- [ ] `.env`ファイルがGitにコミットされていないことを確認
- [ ] Supabase RLSポリシーを設定（オプション）
- [ ] Stripe本番環境のAPI Keyを使用
- [ ] Webhook署名検証が有効
- [ ] HTTPS強制（Vercelは自動）
- [ ] CSPヘッダー設定（next.config.js）
- [ ] Rate Limiting実装（オプション）

---

## バックアップ戦略

### データベース

Supabaseの場合:
- 自動バックアップが有効（7日間保持）
- 手動バックアップ: Dashboard → Database → Backups

### ファイル

UploadThingの場合:
- S3にファイルが保存されるため、永続的に保持

---

## ロールバック手順

### Vercel

1. Dashboard → Deployments
2. 前のデプロイメントを選択
3. 「Promote to Production」

### データベース

```bash
# マイグレーションのロールバック（注意して実行）
npx prisma migrate resolve --rolled-back <migration-name>
```

---

これでDENJUプラットフォームのデプロイが完了します！
