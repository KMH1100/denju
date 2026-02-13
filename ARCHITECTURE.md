# 🏗️ DENJU（伝授）アーキテクチャドキュメント

## システム概要

DENJUは、Next.js 14のApp Routerをベースとした、フルスタックのP2P試験対策ノート売買プラットフォームです。

## 技術スタック

### フロントエンド
- **Next.js 14**: App Router、Server Components、Server Actions
- **React 18**: クライアントコンポーネント
- **Tailwind CSS**: ネオ・ブリュータリズムデザイン
- **TypeScript**: 型安全性

### バックエンド
- **Next.js API Routes**: RESTful API
- **Prisma**: ORMとデータベース管理
- **PostgreSQL**: メインデータベース（Supabase）

### 認証・ストレージ
- **Supabase Auth**: Google OAuth認証
- **UploadThing**: ファイルアップロード・配信

### 決済
- **Stripe**: Checkout、Webhook

### PDF処理
- **pdf-lib**: 動的透かし挿入

---

## データフロー

### 1. ユーザー登録・ログイン

```
ユーザー
  ↓ 大学選択
LoginForm (Client)
  ↓ Google OAuth
Supabase Auth
  ↓ 認証成功
/api/auth/callback (Server)
  ↓ ドメイン検証
validateUniversityDomain()
  ↓ 一致すればDB登録
Prisma (User.upsert)
  ↓ リダイレクト
トップページ
```

**セキュリティポイント:**
- ドメイン検証に失敗した場合、即座に認証を取り消し
- 管理者判定は`ADMIN_EMAIL`との完全一致

---

### 2. GPA認証フロー

```
ユーザー
  ↓ 成績証明書アップロード
GpaVerificationForm (Client)
  ↓ UploadThing
/api/uploadthing (Server)
  ↓ 画像URL取得
/api/verify-gpa (Server)
  ↓ DB保存
Prisma (IdentityVerification.create)
  ↓ 管理者通知（将来実装）
---
管理者
  ↓ /admin/audit にアクセス
AuditQueue (Client)
  ↓ GPA入力・承認
/api/admin/audit-gpa (Server)
  ↓ トランザクション
Prisma.$transaction([
  IdentityVerification.update,
  User.update (verifiedGpa, isGpaVerified)
])
```

**セキュリティポイント:**
- UploadThingはPrivateモード（署名付きURL）
- 管理者APIは`requireAdmin()`で保護

---

### 3. 資料出品フロー

```
ユーザー（GPA認証済み）
  ↓ 資料情報入力
UploadMaterialForm (Client)
  ↓ PDFアップロード
/api/uploadthing (materialPdf)
  ↓ サムネイルアップロード（任意）
/api/uploadthing (thumbnailImage)
  ↓ 講義選択・新規作成
/api/courses (GET/POST)
  ↓ 資料登録
/api/materials (POST)
  ↓ DB保存（status: PENDING）
Prisma (Material.create)
  ↓ 管理者審査待ち
---
管理者
  ↓ /admin/audit にアクセス
AuditQueue (Client)
  ↓ 承認/却下
/api/admin/audit-material (POST)
  ↓ ステータス更新
Prisma (Material.update → status: APPROVED)
  ↓ 公開（検索可能に）
```

**セキュリティポイント:**
- `requireAuth()`で認証チェック
- `isGpaVerified`でGPA認証済みユーザーのみ出品可能

---

### 4. 決済フロー

```
ユーザー
  ↓ 購入ボタンクリック
PurchaseButton (Client)
  ↓ Checkout Session作成
/api/checkout (POST)
  ↓ 購入済みチェック
Prisma (Purchase.findUnique)
  ↓ Stripe Checkout Session作成
stripe.checkout.sessions.create({
  metadata: { userId, materialId, purchaseType, sellerId, amount }
})
  ↓ リダイレクト
Stripe Checkout画面
  ↓ 決済完了
---
Stripe
  ↓ Webhook送信
/api/webhooks/stripe (POST)
  ↓ Signature検証
stripe.webhooks.constructEvent()
  ↓ checkout.session.completed
Prisma.$transaction([
  Purchase.create,
  User.update (seller balance += amount * 0.8)
])
  ↓ 完了
ユーザーに購入権限付与
```

**セキュリティポイント:**
- Webhook署名検証必須
- トランザクションで購入記録と残高更新を一括実行
- 重複購入防止のユニーク制約

---

### 5. PDF閲覧・ダウンロード

#### Web閲覧

```
ユーザー
  ↓ 閲覧ボタン
/materials/[id]/view (Server)
  ↓ 購入確認
Prisma (Purchase.findFirst)
  ↓ ProtectedPdfViewer表示
ProtectedPdfViewer (Client)
  ↓ iframe表示 + コピーガード
  - 右クリック禁止
  - キーボード無効化
  - 印刷禁止
```

#### PDFダウンロード

```
ユーザー
  ↓ ダウンロードボタン
/api/download/[materialId] (Server)
  ↓ 購入確認（purchaseType: PDF）
Prisma (Purchase.findUnique)
  ↓ PDFフェッチ
fetch(material.pdfUrl)
  ↓ pdf-lib処理
PDFDocument.load(pdfBytes)
  ↓ 透かし挿入
pages.forEach(page => {
  page.drawText("username - university - 転載禁止", {
    opacity: 0.1,
    rotate: 45°
  })
})
  ↓ 生成PDF返却
NextResponse (application/pdf)
```

**セキュリティポイント:**
- 購入確認必須
- 動的透かしで不正転載抑止
- ダウンロード時にキャッシュ無効化ヘッダー

---

### 6. 換金申請フロー

```
ユーザー
  ↓ 換金申請
PayoutRequestForm (Client)
  ↓ 金額・換金先入力
/api/payout-request (POST)
  ↓ 残高チェック
User.balance >= amount
  ↓ 申請作成
Prisma (PayoutRequest.create → status: PENDING)
---
管理者
  ↓ /admin/payouts にアクセス
PayoutManagement (Client)
  ↓ ギフトコード入力・承認
/api/admin/process-payout (POST)
  ↓ トランザクション
Prisma.$transaction([
  PayoutRequest.update (status: COMPLETED, adminNote: "gift code"),
  User.update (balance -= amount)
])
  ↓ 完了通知（将来実装）
```

**セキュリティポイント:**
- 残高チェック必須
- 重複申請防止（未処理申請がある場合は拒否）
- トランザクションで整合性担保

---

## データベース設計

### 主要エンティティ

```
University (大学)
  ├── departments (1:N)
  └── users (1:N)

Department (学部)
  ├── courses (1:N)
  └── university (N:1)

Course (講義)
  ├── materials (1:N)
  └── department (N:1)

User (ユーザー)
  ├── verifications (1:N)
  ├── materials (1:N - 出品)
  ├── purchases (1:N)
  ├── payoutRequests (1:N)
  └── university (N:1)

Material (資料)
  ├── seller (N:1)
  ├── course (N:1)
  └── purchases (1:N)

Purchase (購入)
  ├── user (N:1)
  └── material (N:1)
```

### インデックス設計

```prisma
@@index([status])               // Material, IdentityVerification, PayoutRequest
@@index([courseId])             // Material
@@index([userId])               // Purchase
@@index([materialId])           // Purchase
@@unique([userId, materialId, purchaseType])  // Purchase（重複防止）
```

---

## セキュリティ対策

### 認証・認可

1. **Supabase Auth**: Session管理
2. **Middleware**: 全リクエストで認証状態をチェック
3. **requireAuth()**: 認証必須API
4. **requireAdmin()**: 管理者専用API
5. **ドメイン検証**: 大学メールドメインと不一致なら拒否

### コンテンツ保護

1. **UploadThing Private**: 署名付きURLのみアクセス可能
2. **動的透かし**: pdf-libで購入者情報を挿入
3. **Webビューアコピーガード**:
   - `contextmenu` 無効化
   - `selectstart` 無効化
   - `copy` 無効化
   - `keydown` フィルタリング（Ctrl+P, Ctrl+S等）
   - `@media print { display: none }` CSS
4. **購入確認**: サーバーサイドで毎回チェック

### データ整合性

1. **Prismaトランザクション**: 決済・換金で残高更新
2. **Zodバリデーション**: 全API入力を検証
3. **ユニーク制約**: 重複購入防止
4. **外部キー制約**: データ参照整合性

---

## パフォーマンス最適化

### クエリ最適化

```typescript
// 不要なデータを除外
include: {
  seller: {
    select: { id: true, username: true } // 必要なフィールドのみ
  }
}

// インデックス活用
where: { status: 'APPROVED' } // @@index([status])
```

### キャッシュ戦略

- Next.js: Server Componentsによる自動キャッシュ
- Prisma: Connection pooling
- PDF: ダウンロード時のキャッシュ無効化（不正転載防止）

---

## スケーラビリティ

### 現状（小〜中規模）

- Vercel: オートスケーリング
- Supabase: マネージドPostgreSQL
- UploadThing: CDN配信

### 拡張時の検討事項

1. **画像最適化**: Next.js Image Optimization
2. **検索強化**: Algolia/Meilisearch統合
3. **非同期処理**: Vercel Cron/Queue（通知、メール送信）
4. **キャッシュ**: Redis（セッション、検索結果）
5. **CDN**: Cloudflare（静的アセット）

---

## 開発ガイドライン

### コーディング規約

1. **Server Components優先**: クライアント状態が必要な場合のみ`'use client'`
2. **型安全性**: Zodスキーマ→Prismaスキーマ→TypeScript型
3. **エラーハンドリング**: try-catchで全APIをラップ
4. **ログ**: `console.error()`で本番環境用ログ

### 新機能追加時のチェックリスト

- [ ] Prismaスキーマ更新
- [ ] API Route作成（Zodバリデーション付き）
- [ ] 認証チェック（requireAuth/requireAdmin）
- [ ] フロントエンドコンポーネント作成
- [ ] エラーハンドリング
- [ ] READMEに機能説明追加

---

## 今後の拡張案

1. **通知機能**: 購入完了、審査完了時のメール通知
2. **レビューシステム**: 資料の評価・レビュー
3. **お気に入り**: 資料のブックマーク
4. **検索強化**: 全文検索、タグ検索
5. **統計ダッシュボード**: 売上分析、人気資料
6. **メッセージ機能**: 購入者と出品者のQ&A
7. **サブスクリプション**: 月額見放題プラン

---

このアーキテクチャは、セキュリティと拡張性を両立させた設計になっています。
