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
    refetch: () => {},
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
            setUploadedFiles(Array.isArray(files) ? files : files.files || [])
            setDepartmentFiles(Array.isArray(dept) ? dept : dept.files || [])
        } catch {
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