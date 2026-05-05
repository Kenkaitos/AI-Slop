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
        let isMounted = true

        async function fetchProfile(userId: string) {
            const { data, error } = await supabase
                .from("users")
                .select("id, nip, workgroup, role, auth_id, created_at")
                .eq("auth_id", userId)
                .single()

            if (!isMounted) return
            if (!error && data) setProfile(data)
            else setProfile(null)
            setLoadingProfile(false)
        }

        // Check session on mount only
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!isMounted) return
            if (session?.user) fetchProfile(session.user.id)
            else {
                setProfile(null)
                setLoadingProfile(false)
            }
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (!isMounted) return

                // Only care about actual login/logout, ignore token refreshes
                if (_event === "SIGNED_OUT") {
                    setProfile(null)
                    setLoadingProfile(false)
                    return
                }

                if (_event === "SIGNED_IN") {
                    if (session?.user && session.user.id !== profile?.auth_id) {
                        setLoadingProfile(true)
                        setProfile(null)
                        fetchProfile(session.user.id)
                    }
                }

                // Ignore TOKEN_REFRESHED, INITIAL_SESSION, USER_UPDATED etc.
            }
        )

        return () => {
            isMounted = false
            subscription.unsubscribe()
        }
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