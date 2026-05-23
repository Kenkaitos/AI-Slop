"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Props {
    avatarUrl?: string | null
    initials: string
    size?: "sm" | "md" | "lg"
    className?: string
}

const sizes = {
    sm: "h-9 w-9",
    md: "h-12 w-12",
    lg: "h-32 w-32",
}

const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-3xl",
}

export function ProfileImage({ avatarUrl, initials, size = "md", className }: Props) {
    const [error, setError] = useState(false)

    const showImage = avatarUrl && !error

    return (
        <Avatar className={`${sizes[size]} ${className ?? ""}`}>
            {showImage ? (
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="h-full w-full rounded-full object-cover"
                    decoding="sync"
                    onError={() => setError(true)}
                />
            ) : (
                <AvatarFallback className={`font-semibold ${textSizes[size]}`}>
                    {initials}
                </AvatarFallback>
            )}
        </Avatar>
    )
}