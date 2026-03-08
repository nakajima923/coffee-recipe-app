import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"

export default async function ProfileSettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, bio, avatar_emoji")
    .eq("id", user.id)
    .maybeSingle()

  if (!profile) {
    redirect("/welcome")
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-stone-600 transition hover:text-stone-900"
          >
            ← Dashboard に戻る
          </Link>
          <h1 className="mt-3 text-2xl font-semibold">プロフィール設定</h1>
        </div>

        <ProfileForm
          userId={user.id}
          initialDisplayName={profile.display_name ?? ""}
          initialBio={profile.bio ?? ""}
          initialAvatarEmoji={profile.avatar_emoji ?? "☕"}
        />
      </div>
    </main>
  )
}