import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DeleteRecipeButton } from "@/components/recipes/delete-recipe-button"
import { CopyRecipeButton } from "@/components/recipes/copy-recipe-button"
import { ShareRecipeButton } from "@/components/recipes/share-recipe-button"
import type { Metadata } from "next"
import { secondsToMMSS } from "@/lib/time"

type RecipePageProps = {
  params: Promise<{
    id: string
  }>
}

function formatSeconds(seconds: number | null) {
  if (!seconds && seconds !== 0) return "—"
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}:${String(sec).padStart(2, "0")}`
}

function formatDiff(current: number | null, previous: number | null, unit = "") {
  if (current == null || previous == null) return "—"
  const diff = Number(current) - Number(previous)
  if (diff === 0) return `±0${unit}`
  return `${diff > 0 ? "+" : ""}${diff}${unit}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: recipe } = await supabase
    .from("recipes")
    .select("title, bean_name, is_public")
    .eq("id", id)
    .maybeSingle()

  if (!recipe) {
    return {
      title: "Recipe not found | Coffee Recipe Log",
    }
  }

  return {
    title: `${recipe.title} | Coffee Recipe Log`,
    description: recipe.bean_name
      ? `${recipe.bean_name} の抽出レシピ`
      : "公開されたコーヒーレシピ",
  }
}

export default async function RecipeDetailPage({
  params,
}: RecipePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: recipe } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single()

  if (!recipe) {
    notFound()
  }

  const isOwner = user?.id === recipe.user_id
  const backHref = isOwner ? "/dashboard" : "/public"
  const backLabel = isOwner ? "← Dashboard に戻る" : "← 公開レシピに戻る"

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", recipe.user_id)
    .maybeSingle()

  const { data: pours } = await supabase
    .from("recipe_pours")
    .select("*")
    .eq("recipe_id", recipe.id)
    .order("pour_index", { ascending: true })

  const { data: previousRecipe } = await supabase
    .from("recipes")
    .select("*")
    .lt("created_at", recipe.created_at)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <Link
            href={backHref}
            className="text-sm text-stone-600 transition hover:text-stone-900"
        >
            {backLabel}
        </Link>

        <div className="w-full sm:w-auto">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <Link
                href={`/brew/${recipe.id}`}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto"
            >
                抽出モード
            </Link>

            <div className="inline-flex w-full items-center justify-center rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 sm:w-auto">
                <ShareRecipeButton
                recipeId={recipe.id}
                recipeTitle={recipe.title}
                />

                {isOwner ? (
                <Link
                    href={`/recipes/${recipe.id}/edit`}
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 sm:w-auto"
                >
                    編集
                </Link>
                ) : (
                <CopyRecipeButton
                    recipe={{
                    id: recipe.id,
                    title: recipe.title,
                    bean_name: recipe.bean_name,
                    roast_level: recipe.roast_level,
                    grind_size: recipe.grind_size,
                    bean_amount_g: Number(recipe.bean_amount_g),
                    water_amount_ml: recipe.water_amount_ml,
                    pours_count: recipe.pours_count,
                    bloom_time_sec: recipe.bloom_time_sec,
                    total_time_sec: recipe.total_time_sec,
                    memo: recipe.memo,
                    }}
                    pours={(pours ?? []).map((pour) => ({
                    pour_index: pour.pour_index,
                    water_ml: pour.water_ml,
                    elapsed_time_sec: pour.elapsed_time_sec,
                    note: pour.note,
                    }))}
                />
                )}
            </div>

            {isOwner && (
                <div className="inline-flex w-full items-center justify-center rounded-2xl border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-100 hover:text-red-800 sm:w-auto">
                <DeleteRecipeButton recipeId={recipe.id} />
                </div>
            )}
            </div>
        </div>
        </div>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {recipe.is_favorite && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                  お気に入り
                </span>
              )}
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  recipe.is_public
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-stone-100 text-stone-700"
                }`}
              >
                {recipe.is_public ? "公開" : "非公開"}
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              {recipe.title}
            </h1>

            <div className="mt-2 space-y-1 text-stone-600">
              {recipe.bean_name && <p>{recipe.bean_name}</p>}
              <p className="text-sm">
                by {profile?.display_name || "ユーザー"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-sm text-stone-500">豆量</p>
              <p className="mt-1 text-lg font-semibold">
                {recipe.bean_amount_g}g
              </p>
            </div>

            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-sm text-stone-500">水量</p>
              <p className="mt-1 text-lg font-semibold">
                {recipe.water_amount_ml}ml
              </p>
            </div>

            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-sm text-stone-500">投数</p>
              <p className="mt-1 text-lg font-semibold">
                {recipe.pours_count}投
              </p>
            </div>

            <div className="rounded-2xl bg-stone-50 p-4">
            <p className="text-sm text-stone-500">湯温 / 総抽出</p>
            <p className="mt-1 text-lg font-semibold">
                {recipe.water_temp_c ? `${recipe.water_temp_c}℃` : "—"} /{" "}
                {formatSeconds(recipe.total_time_sec)}
            </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 p-4">
              <p className="text-sm text-stone-500">焙煎度</p>
              <p className="mt-1">{recipe.roast_level || "—"}</p>
            </div>

            <div className="rounded-2xl border border-stone-200 p-4">
              <p className="text-sm text-stone-500">挽き目</p>
              <p className="mt-1">{recipe.grind_size || "—"}</p>
            </div>
          </div>

        
        <div className="mt-4">
        <h2 className="text-lg font-semibold">各投の記録</h2>

        <div className="mt-4 space-y-3">
            {pours && pours.length > 0 ? (
            pours.map((pour) => (
                <div
                key={pour.id}
                className="rounded-3xl border border-stone-200 bg-stone-50 p-4"
                >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white text-sm font-medium text-stone-700">
                    {pour.pour_index}
                    </div>

                    <div className="grid flex-1 grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white p-4">
                        <p className="text-[11px] text-stone-500">時間</p>
                        <p className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                        {formatSeconds(pour.elapsed_time_sec)}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                        <p className="text-[11px] text-stone-500">湯量</p>
                        <p className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                        {pour.water_ml}
                        <span className="ml-1 text-base font-medium text-stone-500 sm:text-lg">
                            ml
                        </span>
                        </p>
                    </div>
                    </div>
                </div>

                {pour.note && (
                    <div className="mt-3 rounded-2xl bg-white p-4">
                    <p className="text-[11px] text-stone-500">メモ</p>
                    <p className="mt-2 text-sm leading-6 text-stone-700">
                        {pour.note}
                    </p>
                    </div>
                )}
                </div>
            ))
            ) : (
            <p className="text-sm text-stone-600">投数データはありません。</p>
            )}
        </div>
        </div>

          <div className="mt-6 rounded-2xl border border-stone-200 p-4">
            <p className="text-sm text-stone-500">メモ</p>
            <p className="mt-2 whitespace-pre-wrap text-stone-700">
              {recipe.memo || "メモなし"}
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}