"use client"

import DashboardStats from "./dashboard-stats"
import RecentInbox from "./recent-inbox"
import UploadedFiles from "./uploaded-files"
import DepartmentFiles from "./department-files"

import {
    DashboardSectionProps,
} from "./types"

export default function DashboardSection({
    uploadedFiles,
    departmentFiles,
    loadingFiles,
    loadingDepartment,
}: DashboardSectionProps) {
    return (
        <div className="space-y-6">
            <DashboardStats
                uploadedFiles={uploadedFiles}
                departmentFiles={departmentFiles}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <RecentInbox
                    files={uploadedFiles}
                    loading={loadingFiles}
                />

                <div className="space-y-6">
                    <UploadedFiles
                        files={uploadedFiles}
                        loading={loadingFiles}
                    />

                    <DepartmentFiles
                        files={departmentFiles}
                        loading={loadingDepartment}
                    />
                </div>
            </div>
        </div>
    )
}