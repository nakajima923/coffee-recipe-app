import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-12">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-500">Coffee Recipe Log</p>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  はじめて使う
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                >
                  ログイン
                </Link>
              </>
            )}
          </div>
        </header>

        <section className="flex flex-1 items-center py-12 sm:py-20">
          <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-medium text-stone-500">
                Brew beautifully, remember clearly.
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
                コーヒーの淹れ方を、
                <br />
                きれいに残す。
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600">
                豆量、水量、投数、時間、メモまで。
                毎回の抽出レシピを記録して、自分のベストレシピを育てていくためのサービスです。
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Dashboardへ
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      はじめて使う
                    </Link>
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                    >
                      ログイン
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-stone-900">記録する</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    時間・湯量・メモを投数ごとに整理できます。
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-stone-900">見返す</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    あとからレシピを検索して、自分の抽出を振り返れます。
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-stone-900">共有できる</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    将来的に友人同士でレシピを見せ合うこともできます。
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-stone-900 via-stone-800 to-stone-700 p-5 text-stone-50">
                <p className="text-sm text-stone-300">Sample Recipe</p>
                <h2 className="mt-2 text-2xl font-semibold">Ethiopia / V60</h2>
                <p className="mt-2 text-sm text-stone-300">
                  Light Roast / 92℃
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-stone-300">豆量</p>
                    <p className="mt-1 text-2xl font-semibold">15g</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-stone-300">水量</p>
                    <p className="mt-1 text-2xl font-semibold">240ml</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-300">1投目</span>
                      <span className="text-lg font-semibold">0:00</span>
                    </div>
                    <p className="mt-2 text-sm text-stone-200">40ml</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-300">2投目</span>
                      <span className="text-lg font-semibold">0:45</span>
                    </div>
                    <p className="mt-2 text-sm text-stone-200">120ml</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-300">3投目</span>
                      <span className="text-lg font-semibold">1:30</span>
                    </div>
                    <p className="mt-2 text-sm text-stone-200">240ml</p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs leading-6 text-stone-500">
                ※ このサービスは個人開発中のため、予告なく仕様変更・停止・終了する場合があります。
                必要なレシピはご自身でも控えを残してください。
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}