"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/navigation/app-sidebar"
import { UserList } from "@/components/dashboard/sections/user-list"
import { useUserProfile } from "@/context/user-profile-context"

export default function UserManagementPage() {
    const { isAdmin, loadingProfile } = useUserProfile()
    const router = useRouter()

    useEffect(() => {
        if (!loadingProfile && !isAdmin) router.replace("/dashboard")
    }, [loadingProfile, isAdmin])

    return (
        <div className="flex min-h-screen bg-slate-100">
            <AppSidebar />
            <main className="flex-1 overflow-hidden">
                <div className="h-screen overflow-y-auto p-6">
                    {/* Show list immediately, redirect happens in background if not admin */}
                    <UserList />
                </div>
            </main>
        </div>
    )
}