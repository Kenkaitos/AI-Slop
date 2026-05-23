'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Camera, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { uploadAvatar } from '@/lib/avatar-api'
import { createClient } from '@/utils/supabase/client'
import { useProfile } from "@/hooks/use-profile"

interface Props {
    initials: string
    avatarUrl?: string | null
    onAvatarChange?: (url: string) => void
}

export function ProfileAvatar({ initials, avatarUrl: initialAvatarUrl, onAvatarChange }: Props) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl ?? null)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const { revalidate, updateProfile } = useProfile()

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        const localUrl = URL.createObjectURL(file)
        setAvatarUrl(localUrl)
        setUploading(true)

        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            const publicUrl = await uploadAvatar(file, user.id)
            onAvatarChange?.(publicUrl)

            // Preload image before updating cache
            await new Promise<void>((resolve) => {
                const img = new window.Image()
                img.src = publicUrl
                img.onload = () => resolve()
                img.onerror = () => resolve() // resolve anyway on error
            })
            updateProfile({ avatar_url: publicUrl })
            revalidate()
        } catch (err) {
            console.error("Upload failed:", err)
            setAvatarUrl(initialAvatarUrl ?? null)
        } finally {
            setUploading(false)
        }
    }

    return (
        <>
            <div className="relative w-fit">
                <button type="button" onClick={() => setPreviewOpen(true)} className="block">
                    {avatarUrl ? (
                        <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="h-full w-full object-cover"
                                decoding="sync"
                            />
                        </div>
                    ) : (
                        <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                            <AvatarFallback className="text-3xl font-semibold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-1 right-1 rounded-full border bg-white p-2 transition hover:bg-muted disabled:opacity-50"
                >
                    {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Camera className="h-4 w-4" />
                    )}
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                />
            </div>

            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
                    <VisuallyHidden>
                        <DialogTitle>Avatar Preview</DialogTitle>
                        <DialogDescription>Preview foto profil anda</DialogDescription>
                    </VisuallyHidden>
                    <div className="overflow-hidden rounded-lg">
                        <Image
                            src={avatarUrl ?? '/avatars/profile.png'}
                            alt="Avatar Preview"
                            width={1200}
                            height={1200}
                            className="h-auto w-full object-cover"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}