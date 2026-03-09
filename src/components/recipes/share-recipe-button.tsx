"use client"

import { toast } from "sonner"

type Props = {
  recipeId: string
  recipeTitle: string
  compact?: boolean
}

export function ShareRecipeButton({
  recipeId,
  recipeTitle,
  compact = false,
}: Props) {
  const handleShare = async () => {
    const url = `${window.location.origin}/recipes/${recipeId}`

    try {
      await navigator.clipboard.writeText(url)
      toast.success("共有URLをコピーしました。")
    } catch {
      toast.error("URLのコピーに失敗しました。")
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={
        compact
          ? "inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white px-4 py-4 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          : "inline-flex w-full items-center justify-center rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 sm:w-auto"
      }
      aria-label={`${recipeTitle} の共有URLをコピー`}
    >
      URLをコピー
    </button>
  )
}