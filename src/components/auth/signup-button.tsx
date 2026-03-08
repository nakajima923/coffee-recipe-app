"use client"

import { createClient } from "@/lib/supabase/client"

export function SignupButton() {
  const handleSignup = async () => {
    const supabase = createClient()

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/welcome`,
      },
    })
  }

  return (
    <button
      onClick={handleSignup}
      className="mt-6 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
    >
      Googleで登録してはじめる
    </button>
  )
}