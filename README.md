# Oshi Graphy (フロントエンド)

![Vercel](https://vercelbadge.vercel.app/api/ichitaka58/oshi-graphy-frontend)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwindcss&logoColor=white)

## アプリの概要
Oshi-Graphy（推しグラフィー）は、80〜90年代から今も活躍するアーティストの推し活を楽しむ**中高年世代を対象**にした推し活ダイアリー共有アプリです。

ライブ参戦や日常の推し活を日記として残し、同じ世代の仲間と共有・交流できる、落ち着いたクローズドな場を提供します。

本リポジトリは、Oshi-Graphyのフロントエンドです。バックエンドは Laravel 製の REST API として構築されています。

**【バックエンドリポジトリ】:** [https://github.com/ichitaka58/oshi-graphy](https://github.com/ichitaka58/oshi-graphy)

## 技術スタック

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [shadcn/ui](https://ui.shadcn.com/)（Radix UI ベース）
- [Base UI](https://base-ui.com/)（Combobox コンポーネントのみ）
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## 認証設計

- API 通信は Laravel Sanctum のトークン認証を使用。ログイン時に発行される `access_token` は Next.js の Route Handler (`src/app/api/auth/login`) がブラウザに公開せず、httpOnly Cookie（`token`）として保存する。
- ページ側では基本的に `getCurrentUser()`（`src/lib/auth.ts`）を使用し、未ログインなら `/login` にリダイレクトする。`getCurrentUserOrNull()` はヘッダーなど「ログイン状態によって表示を出し分けたいだけ」の箇所でのみ使う。
- **ホームページ（`/`）以外はすべてログイン必須。** `public-diaries` のような "public" という名前のルートも、未ログインでは閲覧できない。

## セットアップ

### 前提条件

- Node.js（`package.json` の `next@16` / `react@19` が動作するバージョン）
- Laravel バックエンド（[oshi-graphy](https://github.com/ichitaka58/oshi-graphy)）が起動していること

### インストール

```bash
npm install
```

### 環境変数

ルートに `.env.local` を作成し、Laravel バックエンドの URL と、画像配信元の Cloudflare R2 の公開URLを設定する。

```bash
LARAVEL_API_URL=http://localhost
R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev
```

`next.config.ts` の rewrites 設定により、アップロード画像（`/storage`、実体はR2）と Laravel 配信アセット（`/images`）は同一オリジン経由でプロキシされる。

### 本番環境

本番は [Vercel](https://vercel.com/) にデプロイされている。`LARAVEL_API_URL` などの環境変数は Vercel のプロジェクト設定で管理しており、本リポジトリには含まれない。

### 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリにアクセスできる。

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番用ビルド |
| `npm run start` | 本番ビルドの起動 |
| `npm run lint` | ESLint によるコード検査 |

## ディレクトリ構成（`src/`）

```
src/
├── app/          # App Router（ページ・Route Handler・Server Actions）
│   ├── admin/          # アーティスト管理などの管理者向けページ
│   ├── api/auth/        # ログイン・登録・ログアウトの Route Handler
│   ├── artists/         # アーティスト一覧・詳細
│   ├── diaries/         # 日記の一覧・詳細・作成
│   ├── login / register # 認証ページ
│   ├── notifications/   # 通知
│   ├── public-diaries/  # 公開ダイアリー（ログイン必須）
│   ├── settings/        # アカウント設定
│   └── users/           # ユーザー詳細
├── components/   # 共通コンポーネント（ui/ は shadcn/ui ベース）
├── contexts/     # React Context（未読通知数など）
├── lib/          # 認証・日付処理・バリデーションスキーマなどの共通ロジック
└── types/        # ドメイン型定義（Diary, Artist, User など）
```
