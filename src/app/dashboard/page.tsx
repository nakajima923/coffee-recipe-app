import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RecipeList } from "@/components/recipes/recipe-list"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { AccountMenu } from "@/components/layout/account-menu"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle()

  if (!profile) {
    redirect("/welcome")
  }

  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id",user.id)
    .order("created_at", { ascending: false })

  return (
    <main className="min-h-screen bg-stone-100 text-stone-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <section className="mb-6 overflow-hidden rounded-[2rem] border border-stone-200 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-700 p-5 text-stone-50 shadow-sm sm:mb-8 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-stone-300">Coffee Recipe Log</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                あなたの抽出レシピを、
                <br />
                きれいに残す。
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300">
                豆量、水量、投数、各投のメモまで。毎回の抽出を記録して、
                自分だけのベストレシピを育てていくためのアプリです。
              </p>
            </div>

            <div className="shrink-0">
              <div className="sm:hidden">
                <MobileMenu email={user?.email} />
              </div>
              <div className="hidden sm:block">
                <AccountMenu email={user?.email} />
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            <Link
              href="/recipes/new"
              className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-medium text-stone-900 transition hover:opacity-90 sm:w-auto"
            >
              レシピを追加
            </Link>
            <Link
              href="/public"
              className="inline-flex w-full items-center justify-center rounded-xl border border-stone-500/40 bg-stone-800 px-4 py-3 text-sm font-medium text-stone-100 transition hover:bg-stone-700 sm:w-auto"
            >
              公開レシピを見る
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold tracking-tight">
              My Recipes
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              検索や焙煎度で絞り込みながら、レシピを見返せます。
            </p>
          </div>

          {error ? (
            <p className="text-sm text-red-600">レシピの取得に失敗しました。</p>
          ) : recipes ? (
            <RecipeList recipes={recipes} />
          ) : (
            <p className="text-sm text-stone-600">レシピを取得できませんでした。</p>
          )}
        </section>
      </div>
    </main>
  )
}