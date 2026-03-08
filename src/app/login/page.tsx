"use client"

import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const handleLogin = async () => {
    const supabase = createClient()

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
        <div className="w-full rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <Link href="/" className="text-sm text-stone-500">Coffee Recipe Log</Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            ログイン
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            すでに利用中の方はこちらからログインしてください。
          </p>

          <button
            onClick={handleLogin}
            className="mt-6 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Googleでログイン
          </button>

          <div className="mt-6 border-t border-stone-200 pt-6">
            <p className="text-sm text-stone-600">
              はじめて使う方はこちら
            </p>
            <Link
              href="/signup"
              className="mt-3 inline-flex text-sm font-medium text-stone-900 underline underline-offset-4"
            >
              新規登録へ進む
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}