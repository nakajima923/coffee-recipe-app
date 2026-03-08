"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

type Recipe = {
  id: string
  title: string
  bean_name: string | null
  roast_level: string | null
  grind_size: string | null
  bean_amount_g: number
  water_amount_ml: number
  pours_count: number
  total_time_sec: number | null
  memo: string | null
  created_at: string
  is_favorite: boolean
  is_public: boolean
}

type RecipeListProps = {
  recipes: Recipe[]
}

function formatSeconds(seconds: number | null) {
  if (!seconds && seconds !== 0) return "—"
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}:${String(sec).padStart(2, "0")}`
}

export function RecipeList({ recipes }: RecipeListProps) {
  const [search, setSearch] = useState("")
  const [roastFilter, setRoastFilter] = useState("all")

  const roastOptions = useMemo(() => {
    const values = recipes
      .map((recipe) => recipe.roast_level?.trim())
      .filter((value): value is string => Boolean(value))

    return Array.from(new Set(values))
  }, [recipes])

  const filteredRecipes = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return recipes.filter((recipe) => {
      const matchesSearch =
        keyword.length === 0 ||
        recipe.title.toLowerCase().includes(keyword) ||
        recipe.bean_name?.toLowerCase().includes(keyword) ||
        recipe.memo?.toLowerCase().includes(keyword)

      const matchesRoast =
        roastFilter === "all" || recipe.roast_level === roastFilter

      return matchesSearch && matchesRoast
    })
  }, [recipes, roastFilter, search])

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
        <div className="space-y-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              検索
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="レシピ名 / 豆名 / メモ"
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none transition focus:border-stone-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              焙煎度
            </label>
            <select
              value={roastFilter}
              onChange={(e) => setRoastFilter(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none transition focus:border-stone-500"
            >
              <option value="all">すべて</option>
              {roastOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="space-y-3">
          {filteredRecipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="block rounded-3xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-stone-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold tracking-tight text-stone-900">
                    {recipe.title}
                  </h3>
                  <p className="mt-1 text-sm text-stone-500">
                    {recipe.bean_name || "豆名未設定"}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {recipe.is_favorite && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-800">
                      お気に入り
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      recipe.is_public
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {recipe.is_public ? "公開" : "非公開"}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-stone-50 p-3">
                  <p className="text-[11px] text-stone-500">時間</p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    {formatSeconds(recipe.total_time_sec)}
                  </p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-3">
                  <p className="text-[11px] text-stone-500">水量</p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    {recipe.water_amount_ml}ml
                  </p>
                </div>
                <div className="rounded-2xl bg-stone-50 p-3">
                  <p className="text-[11px] text-stone-500">投数</p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    {recipe.pours_count}投
                  </p>
                </div>
              </div>

              {recipe.roast_level && (
                <p className="mt-3 text-sm text-stone-600">{recipe.roast_level}</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center">
          <p className="text-sm text-stone-600">
            条件に合うレシピが見つかりませんでした。
          </p>
        </div>
      )}
    </div>
  )
}