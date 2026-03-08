"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

type PublicRecipe = {
  id: string
  title: string
  bean_name: string | null
  roast_level: string | null
  bean_amount_g: number
  water_amount_ml: number
  pours_count: number
  is_favorite: boolean
  profile_name: string
  profile_id: string
}

type Props = {
  recipes: PublicRecipe[]
}

export function PublicRecipeListClient({ recipes }: Props) {
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
        recipe.profile_name.toLowerCase().includes(keyword)

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
              placeholder="レシピ名 / 豆名 / 投稿者名"
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
            <div
              key={recipe.id}
              className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="block text-lg font-semibold tracking-tight text-stone-900 underline-offset-4 hover:underline"
                  >
                    {recipe.title}
                  </Link>

                  <p className="mt-1 text-sm text-stone-500">
                    by{" "}
                    <Link
                      href={`/users/${recipe.profile_id}`}
                      className="underline underline-offset-4"
                    >
                      {recipe.profile_name}
                    </Link>
                  </p>
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

              <div className="mt-4 flex flex-wrap gap-2">
                {recipe.is_favorite && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs text-amber-800">
                    お気に入り
                  </span>
                )}
                {recipe.roast_level && (
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-700">
                    {recipe.roast_level}
                  </span>
                )}
                {recipe.bean_name && (
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-700">
                    {recipe.bean_name}
                  </span>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <Link
                  href={`/recipes/${recipe.id}`}
                  className="text-sm text-stone-500 underline-offset-4 hover:underline"
                >
                  レシピを見る →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-8 text-center">
          <p className="text-sm text-stone-600">
            条件に合う公開レシピが見つかりませんでした。
          </p>
        </div>
      )}
    </div>
  )
}