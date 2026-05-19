"use client"

import useSWR from "swr"

export type UserRole = "admin" | "moderator" | "user"

export interface UserProfile {
    id: string
    nip: string
    email: string
    workgroup: string
    role: UserRole
    auth_id: string
    created_at: string
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useProfile() {
    const { data: profile, isLoading: loadingProfile, mutate } = useSWR(
        "/api/profile",
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 60000,
        }
    )

    const role = profile?.role ?? null

    return {
        profile: profile ?? null,
        loadingProfile,
        role,
        isAdmin: role === "admin",
        isModerator: role === "moderator",
        isUser: role === "user",
        revalidate: () => mutate(),
    }
}