"use client"

import { FileText } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

import FileListDialog from "@/components/ui/file-list-dialog"

import { DashboardFile } from "./types"

interface RecentInboxProps {
    files: DashboardFile[]
    loading: boolean
}

export default function RecentInbox({
    files,
    loading,
}: RecentInboxProps) {
    return (
        <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">
                    Kotak Masuk Baru
                </h2>

                <FileListDialog
                    title="File yang Diunggah"
                    files={files}
                    type="uploaded"
                />
            </div>

            <ScrollArea className="h-72">
                <div className="space-y-3 pr-4">
                    {loading ? (
                        <p className="py-4 text-center text-sm text-slate-500">
                            Memuat...
                        </p>
                    ) : files.length === 0 ? (
                        <p className="py-4 text-center text-sm text-slate-500">
                            Belum ada surat masuk
                        </p>
                    ) : (
                        files
                            .slice(0, 5)
                            .map((file) => (
                                <div
                                    key={file.id}
                                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                            <FileText className="h-5 w-5 text-slate-600" />
                                        </div>

                                        <div>
                                            <p className="font-medium text-slate-800">
                                                {file.name}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {file.description ||
                                                    "Tidak ada deskripsi"}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            window.open(
                                                file.url,
                                                "_blank"
                                            )
                                        }
                                    >
                                        Buka
                                    </Button>
                                </div>
                            ))
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}