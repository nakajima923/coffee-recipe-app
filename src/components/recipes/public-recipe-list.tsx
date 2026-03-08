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
}

type PublicRecipeListProps = {
  recipes: PublicRecipe[]
}

export function PublicRecipeList({ recipes }: PublicRecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-8 text-center">
        <p className="text-sm text-stone-600">
          まだ公開されているレシピはありません。
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {recipes.map((recipe) => (
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
                by {recipe.profile_name}
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

          <div className="mt-4 flex items-center justify-end text-sm text-stone-500">
            <span className="transition group-hover:translate-x-0.5">→</span>
          </div>
        </Link>
      ))}
    </div>
  )
}