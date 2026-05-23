'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ProfileAvatar } from './profile-avatar'
import { UserProfile } from '@/hooks/use-profile'

interface Props {
    profile: UserProfile
}

export function ProfileHeader({ profile }: Props) {
    const initials = profile.email?.slice(0, 2).toUpperCase() || 'US'
    const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? null)

    return (
        <div className="border-b bg-white">
            <div className="mx-auto max-w-6xl px-6 pt-6">
                <div className="h-44 rounded-lg border bg-[#e9edf2]" />

                <div className="relative px-2 pb-8">
                    <div className="-mt-16 flex flex-col gap-6 lg:flex-row lg:items-end">
                        <ProfileAvatar
                            initials={initials}
                            avatarUrl={avatarUrl}
                            onAvatarChange={setAvatarUrl}
                        />

                        <div className="flex-1 space-y-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Monogov Account
                                </p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
                                    {profile.email}
                                </h1>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    NIP {profile.nip}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="rounded-md capitalize">
                                    {profile.role}
                                </Badge>
                                <Badge variant="outline" className="rounded-md">
                                    {profile.workgroup}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}