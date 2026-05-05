"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { navItems, adminNavItems } from "@/components/navigation/nav-items"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogoutButton } from "@/components/navigation/logout"
import { useUserProfile } from "@/context/user-profile-context"

const roleLabel: Record<string, string> = {
    admin: "Administrator",
    moderator: "Moderator",
    user: "Pengguna",
}

export function AppSidebar() {
    const pathname = usePathname()
    const { profile, loadingProfile: loading, isAdmin } = useUserProfile()

    return (
        <aside className="flex w-64 flex-col bg-slate-800 text-white">

            {/* User Profile */}
            <div className="flex items-center gap-3 border-b border-slate-700 p-5">
                <Avatar className="h-12 w-12 border-2 border-white">
                    <AvatarImage src="/avatars/profile.png" alt="User" />
                    <AvatarFallback className="bg-slate-600 text-white">
                        {profile?.nip?.slice(0, 2).toUpperCase() ?? "UA"}
                    </AvatarFallback>
                </Avatar>

                <div>
                    {loading ? (
                        <>
                            <div className="h-4 w-28 animate-pulse rounded bg-slate-600" />
                            <div className="mt-1 h-3 w-20 animate-pulse rounded bg-slate-700" />
                        </>
                    ) : (
                        <>
                            <p className="font-semibold">{profile?.workgroup ?? "—"}</p>
                            <p className="text-xs text-slate-400">
                                {roleLabel[profile?.role ?? ""] ?? "—"}
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                            pathname === item.href
                                ? "bg-slate-700 text-white"
                                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                        {item.badge && (
                            <Badge className="ml-auto bg-rose-500 text-white hover:bg-rose-600">
                                {item.badge}
                            </Badge>
                        )}
                    </Link>
                ))}

                {/* Admin-only section */}
                {!loading && isAdmin && (
                    <>
                        <div className="my-2 border-t border-slate-700" />
                        <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Admin
                        </p>
                        {adminNavItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                    pathname === item.href
                                        ? "bg-slate-700 text-white"
                                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </>
                )}
            </nav>

            {/* Logout */}
            <LogoutButton />
        </aside>
    )
}