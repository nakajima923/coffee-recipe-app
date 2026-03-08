import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PublicRecipeListClient } from "@/components/recipes/public-recipe-list-client"

export default async function PublicRecipesPage() {
  const supabase = await createClient()

  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <main className="min-h-screen bg-stone-50 text-stone-900">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-sm text-stone-600 transition hover:text-stone-900"
            >
              ← Dashboard に戻る
            </Link>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-red-600">
              公開レシピの取得に失敗しました。
            </p>
          </div>
        </div>
      </main>
    )
  }

  const userIds = Array.from(new Set((recipes ?? []).map((recipe) => recipe.user_id)))

  const { data: profiles } = userIds.length
    ? await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", userIds)
    : { data: [] as { id: string; display_name: string | null }[] }

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [
      profile.id,
      profile.display_name || "ユーザー",
    ])
  )

  const mappedRecipes =
    recipes?.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      bean_name: recipe.bean_name,
      roast_level: recipe.roast_level,
      bean_amount_g: Number(recipe.bean_amount_g),
      water_amount_ml: recipe.water_amount_ml,
      pours_count: recipe.pours_count,
      is_favorite: recipe.is_favorite ?? false,
      profile_name: profileMap.get(recipe.user_id) ?? "ユーザー",
      profile_id: recipe.user_id,
    })) ?? []

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-stone-600 transition hover:text-stone-900"
          >
            ← Dashboard に戻る
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            公開レシピ
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            みんなが公開している抽出レシピを見られます。
          </p>
        </div>

        <PublicRecipeListClient recipes={mappedRecipes} />
      </div>
    </main>
  )
}