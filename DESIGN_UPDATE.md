# 🎨 デザイン更新履歴

## 2024年版 - ポップで親しみやすいデザインへ

### 変更の背景

以前のネオ・ブリュータリズム（尖った、エッジの効いたデザイン）から、より親しみやすく使いやすいポップなデザインへ全面リニューアルしました。

### デザインコンセプト

**「親しみやすく、わかりやすく、楽しく」**

大学生が気軽に使える、明るくてフレンドリーなプラットフォームを目指します。

---

## 主な変更点

### 1. カラーパレット

#### Before（ネオ・ブリュータリズム）
- Neon Pink (#FF007A) - 強烈なピンク
- Electric Yellow (#FFF500) - 蛍光イエロー
- Deep Black (#000000) - 真っ黒
- Pure White (#FFFFFF) - 真っ白

#### After（ポップ＆フレンドリー）
- **Primary（メインカラー）**: ピンク系グラデーション
  - 50: #fef2f8（薄ピンク）
  - 500: #ee4a9d（優しいピンク）
  - 600: #de2979（濃いピンク）
  
- **Secondary（アクセント）**: イエロー系グラデーション
  - 50: #fffbeb（クリーム色）
  - 400: #fbbf24（ゴールド）
  - 500: #f59e0b（オレンジゴールド）

- **Background**: グレー・ホワイト系
  - 背景: #f9fafb（ライトグレー）
  - カード: #ffffff（ホワイト）

### 2. タイポグラフィ

#### Before
- フォントウェイト: 900（font-black）
- 大文字のみ（UPPERCASE）
- 硬い印象

#### After
- フォントウェイト: 700（font-bold）
- 通常の大文字小文字混在
- 柔らかい印象

### 3. ボタン

#### Before
```css
- 角丸なし（rounded-none）
- 太いボーダー（border-4）
- ハードシャドウ（8px 8px 0px）
- ベタ塗り背景
```

#### After
```css
- 角丸（rounded-xl = 12px）
- ボーダーなし
- ソフトシャドウ（shadow-md）
- グラデーション背景
- ホバー時に影が大きくなる
- クリック時に少し縮む（scale-95）
```

### 4. カード

#### Before
```css
- 角丸なし
- 太いボーダー（border-4）
- ハードシャドウ（8px 8px 0px #000000）
- ホバー時に位置移動
```

#### After
```css
- 角丸（rounded-2xl = 24px）
- ボーダーなし
- ソフトシャドウ（shadow-lg）
- ホバー時に拡大＋影が大きく（scale-105 + shadow-xl）
```

### 5. 入力フィールド

#### Before
```css
- 角丸なし
- 太いボーダー（border-4）
- 大文字ラベル（UPPERCASE）
```

#### After
```css
- 角丸（rounded-lg = 8px）
- 細いボーダー（border-2）
- 通常ラベル（文頭のみ大文字）
- フォーカス時にリング（ring-2）
```

### 6. バッジ

#### Before
```css
- 角丸なし
- ボーダー付き
- ベタ塗り
- 大文字（UPPERCASE）
```

#### After
```css
- 完全な丸型（rounded-full）
- ボーダーなし
- グラデーション
- 通常の文字
- 影付き（shadow-md）
```

---

## 文体の変更

### Before（中二病っぽい硬い表現）
- 「鉄壁の保護」
- 「完全無欠」
- 「徹底防止」
- 「新時代」
- すべて大文字（UPPERCASE）

### After（親しみやすい表現）
- 「安心の保護機能」
- 「しっかり保護」
- 「お小遣い稼ぎに」
- 「かんたん3ステップ」
- 通常の文字

---

## ページ別の変更

### トップページ

#### Before
```
背景: 激しいグラデーション（ピンク→イエロー→ピンク）
タイトル: 巨大な黒シャドウ付き
キャッチ: 「GPAで証明する信頼。知識を売買する新時代。」
```

#### After
```
背景: 優しいグラデーション（薄ピンク→白→薄イエロー）
タイトル: テキストグラデーション（ピンク系）
キャッチ: 「先輩から後輩へ、知識を伝授。」
```

### ログインページ

#### Before
```
背景: 激しいグラデーション
タイトル: 黒シャドウ付き巨大テキスト
ボタン: 太いボーダー、角丸なし
```

#### After
```
背景: 優しいグラデーション
タイトル: テキストグラデーション
ボタン: 丸みのあるグラデーションボタン
```

### 資料検索ページ

#### Before
```
タイトル: 「DENJU MARKETPLACE」（大文字、黒シャドウ）
フィルター: 太いボーダー、角丸なし
カード: ハードシャドウ
```

#### After
```
タイトル: 「ノートを探す」（親しみやすい）
サブタイトル: 「あなたにぴったりの試験対策ノートが見つかる」
フィルター: 丸みのある、柔らかい
カード: ホバーで拡大、ソフトシャドウ
```

---

## シャドウシステム

### Before（ハードシャドウ）
```css
box-shadow: 8px 8px 0px 0px #000000; /* ぼかしなし */
```

### After（ソフトシャドウ）
```css
/* 標準 */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* 大きめ */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
            0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* 特大 */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

## アニメーション

### Before
- ホバー時: 位置移動（translate）
- クリック時: シャドウ縮小＋位置移動

### After
- ホバー時: 拡大（scale-105）＋シャドウ拡大
- クリック時: 縮小（scale-95）
- すべてスムーズ（duration-200〜300）

---

## UIコンポーネント比較

### Button

```tsx
// Before
<button className="border-4 border-black rounded-none font-black 
                   uppercase brutal-shadow bg-neonPink">
  購入する
</button>

// After
<button className="rounded-xl font-bold shadow-md 
                   bg-gradient-to-r from-primary-500 to-primary-600 
                   hover:shadow-lg active:scale-95">
  購入する
</button>
```

### Card

```tsx
// Before
<div className="border-4 border-black rounded-none brutal-shadow">
  コンテンツ
</div>

// After
<div className="rounded-2xl shadow-lg hover:shadow-xl hover:scale-105">
  コンテンツ
</div>
```

### Badge

```tsx
// Before
<span className="border-2 border-black rounded-none px-3 py-1 
                 font-black uppercase bg-yellow-400">
  GPA 3.8
</span>

// After
<span className="rounded-full px-3 py-1 font-bold shadow-md
                 bg-gradient-to-r from-yellow-400 to-amber-500">
  GPA 3.8
</span>
```

---

## ユーザー体験の向上

### 1. 視認性
- 柔らかい色使いで目に優しい
- コントラストを適切に保ちつつ、刺激を抑える

### 2. 親しみやすさ
- 丸みのあるデザインで柔らかい印象
- 親しみやすい言葉遣い

### 3. わかりやすさ
- ラベルやボタンの文言を平易に
- アイコンの使用を増やす（今後追加予定）

### 4. 楽しさ
- ホバーやクリック時のアニメーション
- グラデーションで華やか

---

## 今後の予定

- [ ] アイコンの追加（ノート、検索、ユーザーなど）
- [ ] イラストの追加（エンプティステート、404ページなど）
- [ ] ローディングアニメーション
- [ ] トースト通知のデザイン
- [ ] ダークモード対応（オプション）

---

**デザインポリシー: 親しみやすく、わかりやすく、楽しく使える**
