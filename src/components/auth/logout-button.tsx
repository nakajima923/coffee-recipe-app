"use client"

import { createClient } from "@/lib/supabase/client"

type LogoutButtonProps = {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <button
      onClick={handleLogout}
      className={
        className ??
        "rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
      }
    >
      ログアウト
    </button>
  )
}