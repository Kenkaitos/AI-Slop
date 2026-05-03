"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
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
}

const UserProfileContext = createContext<UserProfileContext>({
    profile: null,
    loadingProfile: true,
    role: null,
    isAdmin: false,
    isModerator: false,
    isUser: false,
})

export function UserProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loadingProfile, setLoadingProfile] = useState(true)

    useEffect(() => {
        const supabase = createClient()

        async function fetchProfile(userId: string) {
            const { data, error } = await supabase
                .from("users")
                .select("id, nip, workgroup, role, auth_id, created_at")
                .eq("auth_id", userId)
                .single()

            if (!error && data) setProfile(data)
            else setProfile(null)
            
            setLoadingProfile(false)
        }

        // Check current session immediately
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) fetchProfile(user.id)
            else setLoadingProfile(false)
        })

        // Re-run whenever auth state changes (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session?.user) {
                    setLoadingProfile(true)
                    fetchProfile(session.user.id)
                } else {
                    setProfile(null)
                    setLoadingProfile(false)
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const role = profile?.role ?? null

    return (
        <UserProfileContext.Provider value={{
            profile,
            loadingProfile,
            role,
            isAdmin: role === "admin",
            isModerator: role === "moderator",
            isUser: role === "user",
        }}>
            {children}
        </UserProfileContext.Provider>
    )
}

export function useUserProfile() {
    return useContext(UserProfileContext)
}