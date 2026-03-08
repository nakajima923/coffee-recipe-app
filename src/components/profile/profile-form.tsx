"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

type ProfileFormProps = {
  userId: string
  initialDisplayName: string
  initialBio: string
  initialAvatarEmoji: string
}

export function ProfileForm({
  userId,
  initialDisplayName,
  initialBio,
  initialAvatarEmoji,
}: ProfileFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [displayName, setDisplayName] = useState(initialDisplayName)
  const [bio, setBio] = useState(initialBio)
  const [avatarEmoji, setAvatarEmoji] = useState(initialAvatarEmoji)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim(),
          bio: bio.trim() || null,
          avatar_emoji: avatarEmoji.trim() || "☕",
        })
        .eq("id", userId)

      if (error) {
        toast.error("プロフィールの更新に失敗しました。")
        return
      }

      toast.success("プロフィールを更新しました。")
      router.push("/dashboard")
      router.refresh()
    } catch {
      toast.error("予期しないエラーが発生しました。")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">
          表示名
        </label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="たとえば Tatsuya"
          className="w-full rounded-xl border border-stone-300 px-3 py-2 outline-none transition focus:border-stone-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">
          アイコン絵文字
        </label>
        <input
          value={avatarEmoji}
          onChange={(e) => setAvatarEmoji(e.target.value)}
          placeholder="☕"
          className="w-full rounded-xl border border-stone-300 px-3 py-2 outline-none transition focus:border-stone-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">
          自己紹介
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="浅煎りが好きです"
          className="min-h-28 w-full rounded-xl border border-stone-300 px-3 py-2 outline-none transition focus:border-stone-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {isSaving ? "保存中..." : "保存する"}
      </button>
    </form>
  )
}