"use client"

import Link from "next/link"
import { User } from "lucide-react"
import { LogoutButton } from "@/components/auth/logout-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type AccountMenuProps = {
  email?: string
}

export function AccountMenu({ email }: AccountMenuProps) {
  const initial = email?.charAt(0).toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 shadow-sm transition hover:bg-stone-50">
          {email ? (
            <span className="text-sm font-medium">{initial}</span>
          ) : (
            <User className="h-4 w-4" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="truncate">
          {email || "ログイン中"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard">ダッシュボード</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
            <Link href="/settings/profile">プロフィール設定</Link>
        </DropdownMenuItem>


        <DropdownMenuItem asChild>
          <Link href="/public">公開レシピ</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/about">このサービスについて</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="p-2">
          <LogoutButton className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-stone-100" />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}