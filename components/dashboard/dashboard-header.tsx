"use client"

import Link from "next/link"
import { useState } from "react"

import { Bell, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { useProfile } from "@/hooks/use-profile"

export function DashboardHeader() {
    const { profile } = useProfile()

    const [searchQuery, setSearchQuery] = useState("")

    return (
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                    type="search"
                    placeholder="Cari dokumen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                >
                    <Bell className="h-5 w-5" />

                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white">
                        3
                    </span>
                </Button>

                <Link href="/profile">
                    <Avatar className="h-9 w-9 cursor-pointer transition-opacity hover:opacity-80">
                        <AvatarImage
                            src="/avatars/profile.png"
                            alt="User"
                        />

                        <AvatarFallback>
                            {profile?.nip?.slice(0, 2).toUpperCase() ?? "UA"}
                        </AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </header>
    )
}