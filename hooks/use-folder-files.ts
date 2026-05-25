"use client"

import useSWR from "swr"
import * as api from "@/lib/documents-api"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useFolderFiles(folderId: string | null) {
    const { data, isLoading, mutate } = useSWR(
        folderId ? `/api/files?folder_id=${folderId}` : null,
        fetcher,
        { revalidateOnFocus: false }
    )

    async function addFile(file: File, userId: string) {
        if (!folderId) return
        const created = await api.uploadFile(file, folderId, userId)
        mutate((current: any[] = []) => [created, ...current], false)
    }

    async function removeFile(id: string) {
        mutate((current: any[] = []) => current.filter(f => f.id !== id), false)
        try {
            await api.deleteFile(id)
        } catch {
            mutate()
        }
    }

    async function renameFile(id: string, name: string) {
        mutate((current: any[] = []) =>
            current.map(f => f.id === id ? { ...f, name } : f), false)
        try {
            await api.renameFile(id, name)
        } catch {
            mutate()
        }
    }

    return {
        files: data ?? [],
        isLoading,
        addFile,
        removeFile,
        renameFile,
        mutate,
    }
}