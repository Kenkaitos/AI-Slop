"use client"

import { createContext, useContext, ReactNode } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface DashboardDataContext {
    uploadedFiles: any[]
    departmentFiles: any[]
    loadingFiles: boolean
    loadingDepartment: boolean
    refetch: () => void
}

const DashboardDataContext = createContext<DashboardDataContext>({
    uploadedFiles: [],
    departmentFiles: [],
    loadingFiles: true,
    loadingDepartment: true,
    refetch: () => {},
})

export function DashboardDataProvider({ children }: { children: ReactNode }) {
    const { data: files, isLoading: loadingFiles, mutate: mutateFiles } = useSWR(
        "/api/files",
        fetcher,
        {
            revalidateOnFocus: false,    // don't refetch on tab switch
            revalidateOnReconnect: false, // don't refetch on reconnect
            dedupingInterval: 60000,      // cache for 60 seconds
        }
    )

    const { data: dept, isLoading: loadingDepartment, mutate: mutateDept } = useSWR(
        "/api/files?type=department",
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 60000,
        }
    )

    return (
        <DashboardDataContext.Provider value={{
            uploadedFiles: Array.isArray(files) ? files : [],
            departmentFiles: Array.isArray(dept) ? dept : [],
            loadingFiles,
            loadingDepartment,
            refetch: () => { mutateFiles(); mutateDept() },
        }}>
            {children}
        </DashboardDataContext.Provider>
    )
}

export function useDashboardData() {
    return useContext(DashboardDataContext)
}