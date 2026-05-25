"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useSharedFiles(workgroup?: string | null) {
    const url = workgroup
        ? `/api/files?type=shared&workgroup=${encodeURIComponent(workgroup)}`
        : `/api/files?type=shared`

    const { data, isLoading } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
    })

    return {
        files: data ?? [],
        isLoading,
    }
}