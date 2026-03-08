import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BrewTimer } from "@/components/recipes/brew-timer"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function BrewPage({ params }: Props) {
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
    .select("*")
    .eq("recipe_id", recipe.id)
    .order("pour_index", { ascending: true })

  return (
    <main className="min-h-screen bg-stone-950 text-stone-50">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-5">
        <div className="mb-5 flex items-center justify-between">
          <Link
            href={`/recipes/${recipe.id}`}
            className="text-sm text-stone-300"
          >
            ← 戻る
          </Link>
          <p className="text-xs text-stone-400">Brew Mode</p>
        </div>

        <div className="mb-5">
          <h1 className="text-2xl font-semibold tracking-tight">
            {recipe.title}
          </h1>
          <p className="mt-2 text-sm text-stone-400">
            {recipe.bean_name || "豆名未設定"} / {recipe.water_amount_ml}ml / {recipe.pours_count}投
          </p>
        </div>

        <BrewTimer
          recipeTitle={recipe.title}
          pours={
            (pours ?? []).map((pour) => ({
              id: pour.id,
              pour_index: pour.pour_index,
              elapsed_time_sec: pour.elapsed_time_sec ?? 0,
              water_ml: pour.water_ml,
              note: pour.note ?? "",
            }))
          }
        />
      </div>
    </main>
  )
}