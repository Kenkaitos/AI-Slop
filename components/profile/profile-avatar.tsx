'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface Props {
    initials: string
}

export function ProfileAvatar({ initials }: Props) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [previewOpen, setPreviewOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setAvatarUrl(URL.createObjectURL(file))
    }

    return (
        <>
            <div className="relative w-fit">
                <button type="button" onClick={() => setPreviewOpen(true)} className="block">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                        <AvatarImage src={avatarUrl ?? '/avatars/profile.png'} />
                        <AvatarFallback className="text-3xl font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </button>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 rounded-full border bg-white p-2 transition hover:bg-muted"
                >
                    <Camera className="h-4 w-4" />
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