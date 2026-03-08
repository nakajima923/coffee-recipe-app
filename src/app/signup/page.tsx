import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/auth/logout-button"
import { SignupButton } from "@/components/auth/signup-button"

export default async function SignupPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return (
      <main className="min-h-screen bg-stone-50 text-stone-900">
        <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
          <div className="w-full rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-stone-500">Coffee Recipe Log</p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              すでにログインしています
            </h1>

            <p className="mt-3 text-sm leading-6 text-stone-600">
              このアカウントはすでに利用中です。
              別のアカウントで登録する場合はログアウトしてください。
            </p>

            <div className="mt-5 rounded-2xl bg-stone-50 p-4">
              <p className="text-sm text-stone-500">現在のアカウント</p>
              <p className="mt-1 break-all text-sm font-medium text-stone-800">
                {user.email}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white"
              >
                Dashboard に戻る
              </Link>

              <LogoutButton className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100" />
            </div>

            <div className="mt-6 border-t border-stone-200 pt-6">
              <Link
                href="/login"
                className="text-sm font-medium text-stone-900 underline underline-offset-4"
              >
                ログインへ戻る
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
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
          </p>

          <SignupButton />

          <div className="mt-6 border-t border-stone-200 pt-6">
            <p className="text-sm text-stone-600">
              すでにアカウントをお持ちですか？
            </p>

            <Link
              href="/login"
              className="mt-3 inline-flex text-sm font-medium text-stone-900 underline underline-offset-4"
            >
              ログインへ
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}