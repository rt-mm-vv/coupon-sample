# Coupon Sample

## 概要

このプロジェクトは、住宅展示会でのアンケート管理のためのサンプルアプリケーションです。LINE の LIFF SDK を使用したユーザー認証と、Google Apps Script (GAS) バックエンドとのデータ連携を行います。

## 特徴

- **LIFF 統合**: LINE を通じたユーザー認証。
- **レスポンシブデザイン**: デスクトップとモバイルデバイスの両方に最適化。
- **アンケートフォーム**: 年齢、性別、興味などのユーザーデータを収集。
- **デモモード**: LINE ログインを必要とせずにアプリをシミュレート。

## はじめに

### 前提条件

- Node.js (v18 以上)
- npm, yarn, pnpm, または bun (いずれかのパッケージマネージャーを選択)
- 有効な LIFF ID と GAS URL (環境変数に設定)

### インストール

1. リポジトリをクローン:

   ```bash
   git clone https://github.com/your-repo/coupon-sample.git
   cd coupon-sample
   ```

2. 依存関係をインストール:

   ```bash
   npm install
   # または
   yarn install
   # または
   pnpm install
   ```

3. ルートディレクトリに `.env.local` ファイルを作成し、以下の環境変数を追加:

   ```env
   NEXT_PUBLIC_LIFF_ID=your-liff-id
   NEXT_PUBLIC_GAS_URL=your-gas-url
   NEXT_PUBLIC_IS_DEMO_MODE=true
   ```

### 開発サーバーの起動

開発サーバーを起動:

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリを確認してください。

## スクリプト

- `npm run dev`: 開発サーバーを起動。
- `npm run build`: 本番環境用にアプリケーションをビルド。
- `npm run start`: 本番環境サーバーを起動。
- `npm run lint`: ESLint を実行してコードの問題をチェック。

## プロジェクト構成

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── page.module.css
│   │   └── seminar.css
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── .env.local
├── package.json
├── tsconfig.json
└── next.config.ts
```
