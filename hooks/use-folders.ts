"use client"

import useSWR from "swr"
import * as api from "@/lib/documents-api"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useFolders(workgroup: string | null) {
    const { data, isLoading, mutate } = useSWR(
        workgroup ? `/api/folders?workgroup=${encodeURIComponent(workgroup)}` : null,
        fetcher,
        { revalidateOnFocus: false }
    )

    async function addFolder(payload: {
        name: string
        password?: string
        is_shared?: boolean
        workgroup?: string
    }) {
        const targetWorkgroup = payload.workgroup ?? workgroup
        if (!targetWorkgroup) return
        const created = await api.createFolder({
            ...payload,
            workgroup: targetWorkgroup,
        })
        mutate((current: any[] = []) => [created, ...current], false)
        return created
    }

    async function removeFolder(id: string) {
        mutate((current: any[] = []) => current.filter(f => f.id !== id), false)
        try {
            await api.deleteFolder(id)
        } catch {
            mutate()
        }
    }

    return {
        folders: data ?? [],
        isLoading,
        addFolder,
        removeFolder,
        mutate,
    }
}