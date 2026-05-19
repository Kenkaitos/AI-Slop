export interface DashboardFile {
    id: string
    name: string
    description?: string
    url: string
    view_count?: number
    created_at: string

    users?: {
        nip: string
    }
}

export interface DashboardSectionProps {
    uploadedFiles: DashboardFile[]
    departmentFiles: DashboardFile[]
    loadingFiles: boolean
    loadingDepartment: boolean
}