# 📦 Supabase Storage セットアップガイド

## 1. Supabaseダッシュボードでバケットを作成

### 手順

1. **Supabaseダッシュボード**にログイン
   - https://supabase.com/dashboard

2. プロジェクトを選択

3. 左メニュー → **「Storage」** をクリック

4. **3つのバケットを作成**:

---

### バケット1: materials（PDF資料用）

1. **「New bucket」** をクリック
2. 設定:
   ```
   Name: materials
   Public bucket: ❌ OFF（重要！）
   File size limit: 50 MB（推奨）
   Allowed MIME types: application/pdf
   ```
3. **「Create bucket」** をクリック

---

### バケット2: gpa-proofs（GPA証明書用）

1. **「New bucket」** をクリック
2. 設定:
   ```
   Name: gpa-proofs
   Public bucket: ❌ OFF（重要！）
   File size limit: 5 MB
   Allowed MIME types: image/jpeg, image/png, image/webp
   ```
3. **「Create bucket」** をクリック

---

### バケット3: thumbnails（サムネイル用）

1. **「New bucket」** をクリック
2. 設定:
   ```
   Name: thumbnails
   Public bucket: ❌ OFF（重要！）
   File size limit: 2 MB
   Allowed MIME types: image/jpeg, image/png, image/webp
   ```
3. **「Create bucket」** をクリック

---

## 2. RLSポリシーの設定（セキュリティ）

各バケットにポリシーを設定します。

### materials バケット

1. `materials` バケットをクリック
2. **「Policies」** タブをクリック
3. **「New Policy」** → **「For full customization」**

#### ポリシー1: アップロード許可（認証済みユーザー）

```sql
CREATE POLICY "Authenticated users can upload materials"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'materials' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### ポリシー2: 読み取り許可（購入者のみ - 後で実装）

```sql
CREATE POLICY "Users can read materials"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'materials');
```

**注**: 購入確認は、アプリケーション側（APIルート）で行います。

---

### gpa-proofs バケット

1. `gpa-proofs` バケットをクリック
2. **「Policies」** タブをクリック
3. **「New Policy」** → **「For full customization」**

#### ポリシー1: アップロード許可

```sql
CREATE POLICY "Users can upload their own GPA proofs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gpa-proofs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### ポリシー2: 読み取り許可（管理者と本人のみ）

```sql
CREATE POLICY "Users and admins can read GPA proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'gpa-proofs'
);
```

---

### thumbnails バケット

1. `thumbnails` バケットをクリック
2. **「Policies」** タブをクリック
3. **「New Policy」** → **「For full customization」**

#### ポリシー1: アップロード許可

```sql
CREATE POLICY "Users can upload thumbnails"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'thumbnails' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### ポリシー2: 読み取り許可（全員）

```sql
CREATE POLICY "Anyone can read thumbnails"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'thumbnails');
```

---

## 3. 環境変数の確認

`.env` ファイルに以下が設定されていることを確認:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 4. 動作確認

### テストアップロード

1. 開発サーバーを起動:
   ```bash
   npm run dev
   ```

2. ブラウザで http://localhost:3000/auth/login にアクセス

3. ログイン後、以下を試す:
   - GPA認証申請（画像アップロード）
   - ノート出品（PDFアップロード）

4. Supabaseダッシュボード → Storage で、ファイルがアップロードされているか確認

---

## 5. トラブルシューティング

### エラー: "Policy check violation"

**原因**: RLSポリシーが正しく設定されていない

**解決策**:
1. Supabaseダッシュボード → Storage → 該当バケット → Policies
2. ポリシーが有効になっているか確認
3. SQLを再実行

### エラー: "Bucket not found"

**原因**: バケット名が間違っている

**解決策**:
1. バケット名を確認: `materials`, `gpa-proofs`, `thumbnails`
2. 大文字小文字を確認

### エラー: "File too large"

**原因**: ファイルサイズ制限を超えている

**解決策**:
1. バケット設定で制限を確認・変更
2. コード内のバリデーションを確認

---

## 6. 本番環境への移行

本番環境では、以下を確認:

1. ✅ Supabase本番プロジェクトで同じバケットを作成
2. ✅ RLSポリシーを設定
3. ✅ 環境変数を本番用に更新
4. ✅ CORS設定を確認（自動設定されるはず）

---

## 7. コスト管理

### Supabase無料プラン

```
✅ ストレージ: 1GB
✅ 帯域幅: 2GB/月
✅ Private（署名付きURL）: 無料
```

### 使用量の確認

Supabaseダッシュボード → Settings → Usage

### コスト削減のヒント

1. 古いファイルを定期的に削除
2. サムネイルは低解像度に
3. PDFは圧縮してからアップロード

---

## 完了！ 🎉

これでSupabase Storageの設定が完了しました。
UploadThingの有料プランが不要になり、完全無料で運用できます！

質問があれば、いつでもお気軽に！
