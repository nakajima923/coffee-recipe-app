import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RecipeForm } from "@/components/recipes/recipe-form"

type EditRecipePageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditRecipePage({
  params,
}: EditRecipePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: recipe } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single()

  if (!recipe) {
    notFound()
  }

  const { data: pours } = await supabase
    .from("recipe_pours")
    .select("pour_index, water_ml, elapsed_time_sec, note")
    .eq("recipe_id", id)
    .order("pour_index", { ascending: true })

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <Link
              href={`/recipes/${id}`}
              className="text-sm text-stone-600 transition hover:text-stone-900"
            >
              ← 詳細に戻る
            </Link>
            <h1 className="mt-3 text-2xl font-semibold">レシピを編集</h1>
          </div>

          <Link
            href={`/recipes/${id}`}
            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          >
            キャンセル
          </Link>
        </div>

        <RecipeForm
          mode="edit"
          recipeId={recipe.id}
          initialValues={{
            title: recipe.title,
            bean_name: recipe.bean_name ?? "",
            roast_level: recipe.roast_level ?? "",
            grind_size: recipe.grind_size ?? "",
            bean_amount_g: Number(recipe.bean_amount_g),
            water_amount_ml: recipe.water_amount_ml,
            pours_count: recipe.pours_count,
            water_temp_c: recipe.water_temp_c ?? 90,
            total_time_sec: recipe.total_time_sec ?? 0,
            memo: recipe.memo ?? "",
            is_favorite: recipe.is_favorite ?? false,
            is_public: recipe.is_public ?? false,
          }}
          initialPours={
            pours?.map((pour) => ({
              pour_index: pour.pour_index,
              water_ml: pour.water_ml,
              elapsed_time_sec: pour.elapsed_time_sec ?? 0,
              note: pour.note ?? "",
            })) ?? []
          }
        />
      </div>
    </main>
  )
}