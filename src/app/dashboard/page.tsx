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
    .select("id, display_name")
    .eq("id", user.id)
    .maybeSingle()

  if (!profile) {
    redirect("/welcome")
  }

  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const displayName = profile.display_name || "ユーザー"

  return (
    <main className="min-h-screen bg-stone-100 text-stone-900">
      <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-8">
        <section className="mb-5 rounded-[1.75rem] border border-stone-200 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-700 p-5 text-stone-50 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-stone-300">Coffee Recipe Log</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                こんにちは、{displayName} さん
              </h1>
              <p className="mt-2 text-sm leading-6 text-stone-300">
                今日の抽出レシピを記録しましょう。
              </p>
            </div>

            <div className="shrink-0">
              <div className="sm:hidden">
                <MobileMenu email={user.email} />
              </div>
              <div className="hidden sm:block">
                <AccountMenu email={user.email} />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Link
              href="/recipes/new"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-medium text-stone-900 transition hover:opacity-90"
            >
              レシピを追加
            </Link>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">My Recipes</h2>
            <p className="mt-1 text-sm text-stone-600">
              自分のレシピを検索・見返しできます。
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