"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

type Pour = {
  pour_index: number
  water_ml: number
  elapsed_time_sec: number | null
  note: string | null
}

type Recipe = {
  id: string
  title: string
  bean_name: string | null
  roast_level: string | null
  grind_size: string | null
  bean_amount_g: number
  water_amount_ml: number
  pours_count: number
  bloom_time_sec: number | null
  total_time_sec: number | null
  memo: string | null
}

type Props = {
  recipe: Recipe
  pours: Pour[]
  compact?: boolean
}

export function CopyRecipeButton({ recipe, pours, compact = false }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [isCopying, setIsCopying] = useState(false)

  const handleCopy = async () => {
    setIsCopying(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("コピーするにはログインが必要です。")
        router.push("/login")
        return
      }

      const { data: insertedRecipe, error: recipeError } = await supabase
        .from("recipes")
        .insert({
          user_id: user.id,
          title: `${recipe.title} (copy)`,
          bean_name: recipe.bean_name,
          roast_level: recipe.roast_level,
          grind_size: recipe.grind_size,
          bean_amount_g: recipe.bean_amount_g,
          water_amount_ml: recipe.water_amount_ml,
          pours_count: recipe.pours_count,
          bloom_time_sec: recipe.bloom_time_sec,
          total_time_sec: recipe.total_time_sec,
          memo: recipe.memo,
          is_favorite: false,
          is_public: false,
        })
        .select("id")
        .single()

      if (recipeError || !insertedRecipe) {
        toast.error("レシピのコピーに失敗しました。")
        return
      }

      if (pours.length > 0) {
        const { error: poursError } = await supabase.from("recipe_pours").insert(
          pours.map((pour) => ({
            recipe_id: insertedRecipe.id,
            pour_index: pour.pour_index,
            water_ml: pour.water_ml,
            elapsed_time_sec: pour.elapsed_time_sec,
            note: pour.note,
          }))
        )

        if (poursError) {
          toast.error("投数データのコピーに失敗しました。")
          return
        }
      }

      toast.success("自分のレシピとしてコピーしました。")
      router.push(`/recipes/${insertedRecipe.id}`)
      router.refresh()
    } catch {
      toast.error("予期しないエラーが発生しました。")
    } finally {
      setIsCopying(false)
    }
  }

  return (
      <button
    type="button"
    onClick={handleCopy}
    disabled={isCopying}
    className={
      compact
        ? "inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:opacity-60"
        : "rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:opacity-60"
      }
    >
      {isCopying ? "コピー中..." : "レシピをコピー"}
    </button>
  )
}