"use client"

import { ScrollArea } from "@/components/ui/scroll-area"

import FileListDialog from "@/components/ui/file-list-dialog"

import FileCard from "./file-card"

import { DashboardFile } from "./types"

interface DepartmentFilesProps {
    files: DashboardFile[]
    loading: boolean
}

export default function DepartmentFiles({
    files,
    loading,
}: DepartmentFilesProps) {
    return (
        <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                    File Baru di Departemen
                </h2>

                <FileListDialog
                    title="File Baru di Departemen"
                    files={files}
                    type="department"
                />
            </div>

            <ScrollArea className="h-32">
                <div className="space-y-2 pr-4">
                    {loading ? (
                        <p className="py-4 text-center text-sm text-slate-500">
                            Memuat...
                        </p>
                    ) : files.length === 0 ? (
                        <p className="py-4 text-center text-sm text-slate-500">
                            Belum ada file baru
                        </p>
                    ) : (
                        files.map((file) => (
                            <FileCard
                                key={file.id}
                                file={file}
                                type="department"
                            />
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}