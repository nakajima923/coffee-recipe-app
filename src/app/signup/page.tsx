"use client"

import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const handleSignup = async () => {
    const supabase = createClient()

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/welcome`,
      },
    })
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
        <div className="w-full rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-stone-500">Coffee Recipe Log</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            はじめて使う
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Googleアカウントで利用を開始します。
            初回利用時は、このサービス用のアカウント情報が作成されます。
          </p>

          <button
            onClick={handleSignup}
            className="mt-6 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Googleで登録してはじめる
          </button>

          <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">
            <p>
              すでにアカウントをお持ちの場合は、
              「ログイン」から利用してください。
            </p>
          </div>

          <div className="mt-6 border-t border-stone-200 pt-6">
            <Link
              href="/login"
              className="inline-flex text-sm font-medium text-stone-900 underline underline-offset-4"
            >
              ログインへ戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}