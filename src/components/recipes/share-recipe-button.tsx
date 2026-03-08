"use client"

import { toast } from "sonner"

type Props = {
  recipeId: string
  recipeTitle: string
}

export function ShareRecipeButton({ recipeId, recipeTitle }: Props) {
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
      className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
      aria-label={`${recipeTitle} の共有URLをコピー`}
    >
      URLをコピー
    </button>
  )
}