"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useFiles() {
    const { data: uploadedFiles, isLoading: loadingFiles } = useSWR(
        "/api/files",
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    )

    const { data: departmentFiles, isLoading: loadingDepartment } = useSWR(
        "/api/files?type=department",
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    )

    return {
        uploadedFiles: uploadedFiles ?? [],
        departmentFiles: departmentFiles ?? [],
        loadingFiles,
        loadingDepartment,
    }
}