'use client'

import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileInfo } from '@/components/profile/profile-info'
import { useProfile } from '@/hooks/use-profile'

export default function ProfilePage() {
    const { profile, loadingProfile } = useProfile()

    if (loadingProfile) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa]">
                <p className="text-sm text-muted-foreground">Memuat profil...</p>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f5f7fa]">
                <p className="text-sm text-destructive">Profil tidak ditemukan.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f5f7fa]">
            <ProfileHeader profile={profile} />
            <div className="mx-auto max-w-6xl px-6 py-8">
                <ProfileInfo profile={profile} />
            </div>
        </div>
    )
}