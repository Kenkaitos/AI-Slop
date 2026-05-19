"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserList } from "@/components/users/user-list"
import { useProfile } from "@/hooks/use-profile"

export default function UserManagementPage() {
    const { isAdmin, isModerator, loadingProfile } = useProfile()
    const router = useRouter()

    useEffect(() => {
        if (!loadingProfile && !isAdmin && !isModerator) {
            router.replace("/dashboard")
        }
    }, [loadingProfile, isAdmin, isModerator, router])

    if (loadingProfile) return null
    if (!isAdmin && !isModerator) return null

    return <UserList />
}