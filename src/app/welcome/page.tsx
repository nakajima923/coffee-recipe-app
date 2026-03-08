import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WelcomeForm } from "@/components/auth/welcome-form"

export default async function WelcomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("id", user.id)
    .maybeSingle()

  if (profile) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto max-w-md px-6 py-12">
        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-stone-500">Welcome</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            利用を開始しましょう
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            最初に表示名を設定します。あとから変更できるようにもできます。
          </p>

          <div className="mt-6">
            <WelcomeForm email={user.email ?? ""} />
          </div>
        </div>
      </div>
    </main>
  )
}