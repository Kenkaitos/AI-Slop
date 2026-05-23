"use client"

import {
    FileText,
    Folder,
    Eye,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import FileActionsDropdown from "./file-actions-dropdown"

import { DashboardFile } from "./types"

interface FileCardProps {
    file: DashboardFile
    type?: "uploaded" | "department"
}

export default function FileCard({
    file,
    type = "uploaded",
}: FileCardProps) {
    const isDepartment = type === "department"

    return (
        <div className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50">
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isDepartment
                            ? "bg-blue-100"
                            : "bg-amber-100"
                    }`}
                >
                    {isDepartment ? (
                        <FileText className="h-5 w-5 text-blue-600" />
                    ) : (
                        <Folder className="h-5 w-5 text-amber-600" />
                    )}
                </div>

                <div>
                    <p className="font-medium text-slate-800">
                        {file.name}
                    </p>

                    <p className="text-xs text-slate-500">
                        {isDepartment
                            ? `${file.users?.nip} - ${new Date(
                                  file.created_at
                              ).toLocaleDateString("id-ID")}`
                            : file.description ||
                              "Tidak ada deskripsi"}
                    </p>
                </div>
            </div>

            {!isDepartment && (
                <>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Eye className="h-4 w-4" />

                        <span>
                            {file.view_count ?? 0}
                        </span>
                    </div>

                    <FileActionsDropdown file={file} />
                </>
            )}

            {isDepartment && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        window.open(file.url, "_blank")
                    }
                >
                    Buka
                </Button>
            )}
        </div>
    )
}