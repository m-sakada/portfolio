# Portfolio Site

Next.js 16.0.10 + microCMS + Vercelで構築されたポートフォリオサイトです。

## 特徴

- **Next.js 16.0.10** - 最新のApp Routerを使用
- **microCMS** - ヘッドレスCMSでコンテンツ管理
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - モダンなスタイリング
- **Swiper.js** - レスポンシブなカルーセル
- **Vercel** - 高速なデプロイメント
- **Property-Based Testing** - 堅牢なテスト戦略

## 構成

### ページ構成
- **TOPページ** (`/`) - ビジネス情報（実績・経歴・スキル）
- **Aboutページ** (`/about`) - プライベート情報

### コンテンツ管理
- **Works** - 実績情報（プロジェクト、技術スタック、期間など）
- **Experiences** - 経歴情報（会社、職種、期間など）
- **Skills** - スキル情報（技術、経験年数、カテゴリなど）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成し、microCMSの設定を追加：

```env
MICROCMS_SERVICE_DOMAIN=your-service-name
MICROCMS_API_KEY=your-api-key
```

**Basic認証について:**
- 下記が設定されている場合のみ認証が有効

```env
BASIC_AUTH_USER=user-name
BASIC_AUTH_PASSWORD=user-password
```


### 3. microCMSの設定

#### Settings API
- API名: `settings`
- 形式: オブジェクト形式

| フィールドID | フィールド名 | タイプ | 必須 | 説明 |
|-------------|-------------|--------|------|------|
| mvImage | MV画像 | 画像 | - | OGP画像にも使用 |
| favicon | ファビコン | 画像 | - | サイトのファビコン |
| profileImage | 顔写真 | 画像 | - | 自己紹介セクション |
| name | 名前 | テキストフィールド | - | サイトタイトルやメタデータにも使用 |
| nameEn | 名前（英字） | テキストフィールド | - | 自己紹介セクション|
| introductionMessage | 自己紹介メッセージ | テキストエリア | - | 自己紹介セクション |
| detailMessage | 詳細メッセージ | リッチエディタ | - | TOPページのスキルセクション下の詳細エリア |
| aboutContent | aboutページコンテンツ | リッチエディタ | - | Aboutページ用 |

**設定値の使用箇所:**
- `name`: サイトタイトル「{名前} | ポートフォリオサイト」、メタデータ
- `nameEn`: TOPページの自己紹介セクションで名前の下に併記
- `mvImage`: OGP画像（Twitter Card、Facebook等のシェア時に表示）
- `favicon`: ブラウザタブのアイコン
- `profileImage`: TOPページの自己紹介セクションの顔写真
- `introductionMessage`: TOPページの自己紹介文
- `detailMessage`: TOPページのスキルセクション下の詳細エリア（リッチテキスト）
- `aboutContent`: Aboutページのコンテンツ全体

**メタデータ:**
- Title: `{名前} | ポートフォリオサイト`
- Description: `{現在の年}年現在の{名前}のポートフォリオサイトです。経験サイト、経歴、スキルを記載しています。`

#### Works API
- API名: `works`
- 形式: リスト形式

| フィールドID | フィールド名 | タイプ | 必須 | 選択肢 |
|-------------|-------------|--------|------|--------|
| title | タイトル | テキストフィールド | ✓ | - |
| url | URL | テキストフィールド | ✓ | - |
| eyecatch | アイキャッチ画像 | 画像 | ✓ | - |
| introductionUrl | 実績紹介URL | テキストフィールド | - | - |
| category | 種別 | セレクトフィールド | ✓ | 保守運用, Webシステム構築, WordPressサイト構築, LP制作, 静的サイト構築 |
| duration | 期間 | テキストフィールド | ✓ | - |
| technologies | 技術 | 複数選択フィールド | ✓ | Next.js, TypeScript, microCMS, Vercel, AWS, WordPress, XServer, Kinsta, PHP, VanillaJS, Sass |
| details | 詳細 | リッチエディタ | ✓ | - |

#### Experiences API
- API名: `experiences`
- 形式: リスト形式

| フィールドID | フィールド名 | タイプ | 必須 | 選択肢 |
|-------------|-------------|--------|------|--------|
| companyName | 会社名 | テキストフィールド | ✓ | - |
| companyLogo | 会社ロゴ | 画像 | ✓ | - |
| jobTitle | 職種 | テキストフィールド | ✓ | - |
| workExperiences | 経験業務 | 複数選択フィールド | ✓ | ※任意の業務内容を設定 |
| duration | 期間 | テキストフィールド | ✓ | - |
| url | URL | テキストフィールド | ✓ | - |
| companyType | 会社タイプ | セレクトフィールド | ✓ | Web制作会社, 事業会社, フリーランス |
| details | 詳細 | リッチエディタ | ✓ | - |

#### Skills API
- API名: `skills`
- 形式: リスト形式

| フィールドID | フィールド名 | タイプ | 必須 | 選択肢 |
|-------------|-------------|--------|------|--------|
| name | 名称 | テキストフィールド | ✓ | - |
| icon | アイコン | 画像 | ✓ | - |
| category | カテゴリ | セレクトフィールド | ✓ | 言語, OS, ツール, インフラ |
| yearsOfExperience | 経験年数 | テキストフィールド | ✓ | - |
| details | 詳細 | リッチエディタ | ✓ | - |

詳細な設定方法は[microCMS公式ドキュメント](https://microcms.io/)を参照してください。

## 開発

### 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)でサイトを確認できます。

### テストの実行

```bash
# 全テストの実行
npm test

# テストの監視モード
npm run test:watch
```

### ビルド

```bash
npm run build
```

## デプロイ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com)にアカウントを作成
2. GitHubリポジトリを連携
3. 環境変数を設定：
   - `MICROCMS_SERVICE_DOMAIN`
   - `MICROCMS_API_KEY`
   - `BASIC_AUTH_USER` (Basic認証を有効にする場合)
   - `BASIC_AUTH_PASSWORD` (Basic認証を有効にする場合)
4. 自動デプロイが開始されます

## 技術スタック

- **フレームワーク**: Next.js 16.0.10
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **CMS**: microCMS
- **UI**: Swiper.js (カルーセル)
- **テスト**: Vitest + fast-check (Property-Based Testing)
- **デプロイ**: Vercel

## プロジェクト構造

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # TOPページ
│   ├── about/page.tsx     # Aboutページ
│   └── layout.tsx         # ルートレイアウト
├── components/            # Reactコンポーネント
│   ├── cards/            # カードコンポーネント
│   ├── layout/           # レイアウトコンポーネント
│   ├── sections/         # セクションコンポーネント
│   └── ui/               # UIコンポーネント
├── lib/                  # ユーティリティ
│   ├── microcms.ts       # microCMSクライアント
│   └── types.ts          # 型定義
└── public/               # 静的ファイル
```

## ライセンス

MIT License
