"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

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
    refetch: () => { },
})

export function DashboardDataProvider({ children }: { children: ReactNode }) {
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
    const [departmentFiles, setDepartmentFiles] = useState<any[]>([])
    const [loadingFiles, setLoadingFiles] = useState(true)
    const [loadingDepartment, setLoadingDepartment] = useState(true)

    async function fetchFiles() {
        setLoadingFiles(true)
        setLoadingDepartment(true)
        try {
            const [filesRes, deptRes] = await Promise.all([
                fetch("/api/files"),
                fetch("/api/files?type=department"),
            ])

            const files = await filesRes.json()
            const dept = await deptRes.json()

            // Log so you can see errors in the browser console
            if (files.error) console.error("files error:", files.error)
            if (dept.error) console.error("dept error:", dept.error)

            setUploadedFiles(Array.isArray(files) ? files : [])
            setDepartmentFiles(Array.isArray(dept) ? dept : [])
        } catch (e) {
            console.error("fetch error:", e)
            setUploadedFiles([])
            setDepartmentFiles([])
        } finally {
            setLoadingFiles(false)
            setLoadingDepartment(false)
        }
    }

    useEffect(() => {
        fetchFiles()
    }, [])

    return (
        <DashboardDataContext.Provider value={{
            uploadedFiles,
            departmentFiles,
            loadingFiles,
            loadingDepartment,
            refetch: fetchFiles,
        }}>
            {children}
        </DashboardDataContext.Provider>
    )
}

export function useDashboardData() {
    return useContext(DashboardDataContext)
}