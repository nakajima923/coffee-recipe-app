# Coffee Recipe Log

コーヒーの抽出レシピを記録・管理するための Web アプリです。  
主にハンドドリップ用のレシピ（豆量・水量・投数・時間など）を記録し、抽出時には **Brew Mode** を使って実際の抽出ガイドとして利用できます。

モバイルファーストで設計されており、スマートフォンでの利用を前提としています。

---

# Demo

https://your-domain.vercel.app

---

# Features

- Google OAuth によるログイン
- レシピの作成 / 編集 / 削除
- 各投（pour）の時間・湯量・メモの記録
- 抽出時に使用できる **Brew Mode**
- お気に入りレシピ
- 公開 / 非公開設定
- レシピコピー
- モバイルファースト UI

---

# Tech Stack

## Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend / BaaS

- Supabase
  - Auth
  - PostgreSQL
  - Row Level Security (RLS)

## Infrastructure

- Vercel (Hosting)

---

# Architecture

```
User
 │
 │ HTTPS
 ▼
Vercel (Next.js)
 │
 │ supabase-js
 ▼
Supabase
 ├─ Auth (Google OAuth)
 └─ PostgreSQL
```

---

# Infrastructure Architecture

```
           ┌──────────────┐
           │   Browser    │
           └──────┬───────┘
                  │ HTTPS
                  ▼
           ┌──────────────┐
           │    Vercel    │
           │  Next.js App │
           └──────┬───────┘
                  │
                  │ supabase-js
                  ▼
           ┌──────────────┐
           │   Supabase   │
           │              │
           │ Auth (OAuth) │
           │ PostgreSQL   │
           └──────────────┘
```

---

# Authentication

認証には **Supabase Auth + Google OAuth** を使用しています。

## 認証フロー

```
User
 ↓
Google Login
 ↓
Supabase Auth
 ↓
JWT発行
 ↓
Next.js Server Components
 ↓
Supabase DB Access
```

## セッション管理

Supabase の JWT を使用してセッション管理を行っています。

Next.js の Server Components から

```
supabase.auth.getUser()
```

を利用してログイン状態を確認します。

---

# Authorization

データアクセスは **Row Level Security (RLS)** によって制御しています。

ユーザーは自分のレシピのみアクセス可能です。

```
user_id = auth.uid()
```

公開レシピは

```
is_public = true
```

の場合のみ他ユーザーから閲覧可能になります。

---

# Database Schema

## recipes

| column | type |
|------|------|
| id | uuid |
| user_id | uuid |
| title | text |
| bean_name | text |
| bean_amount_g | numeric |
| water_amount_ml | numeric |
| pours_count | integer |
| water_temp_c | integer |
| total_time_sec | integer |
| memo | text |
| is_public | boolean |
| is_favorite | boolean |
| created_at | timestamp |

---

## recipe_pours

| column | type |
|------|------|
| id | uuid |
| recipe_id | uuid |
| pour_index | integer |
| elapsed_time_sec | integer |
| water_ml | integer |
| note | text |

---

## profiles

| column | type |
|------|------|
| id | uuid |
| display_name | text |

---

# Brew Mode

Brew Mode は実際の抽出時に使用する画面です。

機能:

- 抽出タイマー
- 現在の投の表示
- 次の投のガイド
- 各投の時間 / 湯量表示

モバイル利用を想定し、操作ボタンは画面下部に配置しています。

---

# Environment Variables

`.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

# Local Development

```
npm install
npm run dev
```

---

# Deployment

Vercel を使用してデプロイしています。

```
GitHub
 ↓
Vercel
 ↓
Production
```

Vercel 側に環境変数を設定する必要があります。

---

# Future Improvements

- 抽出タイマーの通知機能
- レシピ共有機能の改善
- Brew Mode UI の改善
- PWA 対応
- レシピ検索機能

---

# Disclaimer

このサービスは個人開発のプロジェクトです。

- 予告なくサービスを終了する可能性があります
- データの永続性は保証されません
- 利用は自己責任でお願いします

---

# License

MIT