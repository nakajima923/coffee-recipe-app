import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", id)
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  if (!profile) {
    return (
      <main className="min-h-screen bg-stone-50 text-stone-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          <p className="text-sm text-stone-600">ユーザーが見つかりませんでした。</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6">
          <Link
            href="/public"
            className="text-sm text-stone-600 transition hover:text-stone-900"
          >
            ← 公開レシピに戻る
          </Link>
        </div>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-2xl">
              {profile.avatar_emoji || "☕"}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">
                {profile.display_name || "ユーザー"}
              </h1>
              <p className="mt-1 text-sm text-stone-600">
                公開レシピ数: {recipes?.length ?? 0}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-stone-50 p-4">
            <p className="text-sm text-stone-500">自己紹介</p>
            <p className="mt-2 whitespace-pre-wrap text-stone-700">
              {profile.bio || "まだ自己紹介はありません。"}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">公開レシピ</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(recipes ?? []).map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="rounded-2xl border border-stone-200 p-4 transition hover:bg-stone-50"
              >
                <h3 className="font-medium text-stone-900">{recipe.title}</h3>
                <p className="mt-2 text-sm text-stone-600">
                  豆量 {recipe.bean_amount_g}g / 水量 {recipe.water_amount_ml}ml / {recipe.pours_count}投
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}