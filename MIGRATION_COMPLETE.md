# ✅ UploadThing → Supabase Storage 移行完了

## 実施した変更

### 1. 削除したファイル ❌
- `app/api/uploadthing/core.ts`
- `app/api/uploadthing/route.ts`
- `lib/uploadthing.ts`

### 2. 新規作成したファイル ✅
- `app/api/upload/pdf/route.ts` - PDFアップロードAPI
- `app/api/upload/image/route.ts` - 画像アップロードAPI
- `SUPABASE_STORAGE_SETUP.md` - 詳細セットアップガイド

### 3. 修正したファイル 🔧
- `components/materials/UploadMaterialForm.tsx`
- `components/profile/GpaVerificationForm.tsx`
- `package.json` (UploadThing依存関係を削除)
- `.env.example` (UploadThing環境変数を削除)
- `next.config.js` (画像ホスト名を変更)
- `README.md`
- `SETUP_GUIDE.md`

---

## 次のステップ

### 🔥 必須: Supabaseでバケットを作成

1. **Supabaseダッシュボード**にアクセス
2. Storage → **3つのバケットを作成**:
   - `materials` (PDF用)
   - `gpa-proofs` (GPA証明書用)
   - `thumbnails` (サムネイル用)

詳細手順: **`SUPABASE_STORAGE_SETUP.md`** を参照

### 📦 依存関係の更新

```bash
# 古い依存関係を削除
npm uninstall uploadthing @uploadthing/react

# 依存関係を再インストール
npm install
```

### 🧪 動作確認

```bash
# 開発サーバー起動
npm run dev
```

以下をテスト:
1. ✅ GPA認証申請（画像アップロード）
2. ✅ ノート出品（PDFアップロード）
3. ✅ サムネイル画像アップロード

---

## 🎉 メリット

### 完全無料 💰
- ❌ Before: UploadThing Privateモード = 有料
- ✅ After: Supabase Storage = **完全無料**

### 無料プランの内容
```
✅ ストレージ: 1GB
✅ 帯域幅: 2GB/月
✅ Private（署名付きURL）: 無料
```

### 統合の簡素化 🔗
- すべてSupabaseで管理
- 追加の外部サービス不要
- 同じダッシュボードで確認可能

---

## トラブルシューティング

### エラー: "Bucket not found"

**解決策**: `SUPABASE_STORAGE_SETUP.md` に従ってバケットを作成

### エラー: "Policy check violation"

**解決策**: RLSポリシーを設定（`SUPABASE_STORAGE_SETUP.md` 参照）

### エラー: "Module not found: uploadthing"

**解決策**: 
```bash
npm uninstall uploadthing @uploadthing/react
npm install
```

---

## 完了チェックリスト

- [ ] Supabaseでバケット作成（materials, gpa-proofs, thumbnails）
- [ ] RLSポリシー設定
- [ ] `npm uninstall uploadthing @uploadthing/react`
- [ ] `npm install`
- [ ] `.env`から`UPLOADTHING_*`を削除
- [ ] 開発サーバー起動
- [ ] GPA認証申請テスト
- [ ] ノート出品テスト

---

**移行完了！🎊**

質問があれば、`SUPABASE_STORAGE_SETUP.md` を確認してください。
