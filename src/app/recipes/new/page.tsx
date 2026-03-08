import Link from "next/link"
import { RecipeForm } from "@/components/recipes/recipe-form"

export default function NewRecipePage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="text-sm text-stone-600 transition hover:text-stone-900"
            >
              ← Dashboard に戻る
            </Link>
            <h1 className="mt-3 text-2xl font-semibold">レシピを追加</h1>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          >
            キャンセル
          </Link>
        </div>

        <RecipeForm />
      </div>
    </main>
  )
}