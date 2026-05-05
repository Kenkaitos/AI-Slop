"use client"

import { createContext, useContext, ReactNode } from "react"
import useSWR from "swr"
import { createClient } from "@/utils/supabase/client"

export type UserRole = "admin" | "moderator" | "user"

export interface UserProfile {
    id: string
    nip: string
    workgroup: string
    role: UserRole
    auth_id: string
    created_at: string
}

interface UserProfileContext {
    profile: UserProfile | null
    loadingProfile: boolean
    role: UserRole | null
    isAdmin: boolean
    isModerator: boolean
    isUser: boolean
    revalidate: () => void  // add this
}

const UserProfileContext = createContext<UserProfileContext>({
    profile: null,
    loadingProfile: true,
    role: null,
    isAdmin: false,
    isModerator: false,
    isUser: false,
    revalidate: () => {},
})

async function fetchProfile() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from("users")
        .select("id, nip, workgroup, role, auth_id, created_at")
        .eq("auth_id", user.id)
        .single()

    if (error) return null
    return data
}

export function UserProfileProvider({ children }: { children: ReactNode }) {
    const { data: profile, isLoading: loadingProfile, mutate } = useSWR(
        "user-profile",
        fetchProfile,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 60000,
        }
    )

    const role = profile?.role ?? null

    return (
    <UserProfileContext.Provider value={{
        profile: profile ?? null,
        loadingProfile,
        role,
        isAdmin: role === "admin",
        isModerator: role === "moderator",
        isUser: role === "user",
        revalidate: () => mutate(),  // add this
    }}>
        {children}
    </UserProfileContext.Provider>
)
}

export function useUserProfile() {
    return useContext(UserProfileContext)
}