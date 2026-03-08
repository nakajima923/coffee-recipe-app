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
  bloom_time_sec: number | null
  total_time_sec: number | null
  memo: string | null
  created_at: string
  is_favorite: boolean
  is_public: boolean
  
}

type RecipeListProps = {
  recipes: Recipe[]
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
    <div className="space-y-5">
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              検索
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="レシピ名 / 豆名 / メモで検索"
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="group block rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-stone-900">
                    {recipe.title}
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">
                    {recipe.bean_name || "豆名未設定"}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
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

                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-600">
                  {recipe.pours_count}投
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-stone-50 p-3">
                  <p className="text-xs text-stone-500">豆量</p>
                  <p className="mt-1 text-sm font-medium text-stone-800">
                    {recipe.bean_amount_g}g
                  </p>
                </div>

                <div className="rounded-2xl bg-stone-50 p-3">
                  <p className="text-xs text-stone-500">水量</p>
                  <p className="mt-1 text-sm font-medium text-stone-800">
                    {recipe.water_amount_ml}ml
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-stone-500">
                <span>{recipe.roast_level || "焙煎度未設定"}</span>
                <span className="transition group-hover:translate-x-0.5">
                  →
                </span>
              </div>
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