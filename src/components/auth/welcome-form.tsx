"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

type WelcomeFormProps = {
  email: string
}

export function WelcomeForm({ email }: WelcomeFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [displayName, setDisplayName] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("ログイン情報が取得できませんでした。")
        return
      }

      if (!displayName.trim()) {
        toast.error("表示名を入力してください。")
        return
      }

      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        display_name: displayName.trim(),
      })

      if (error) {
        toast.error("プロフィールの保存に失敗しました。")
        return
      }

      toast.success("登録が完了しました。")
      router.push("/dashboard")
      router.refresh()
    } catch {
      toast.error("予期しないエラーが発生しました。")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-2xl bg-stone-50 p-4">
        <p className="text-sm text-stone-500">ログイン中のアカウント</p>
        <p className="mt-1 break-all text-sm font-medium text-stone-800">
          {email}
        </p>
      </div>

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

      <button
        type="submit"
        disabled={isSaving}
        className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "保存中..." : "利用を開始する"}
      </button>
    </form>
  )
}