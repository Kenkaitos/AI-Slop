"use client"

import { useState } from "react"
import { Search, FileText, FileSpreadsheet, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSharedFiles } from "@/hooks/use-shared-files"
import { WORKGROUPS } from "@/lib/workgroups"

const categories = WORKGROUPS.map(w => ({
    id: w.id,
    icon: w.icon,
    label: `Bidang ${w.id}`,
}))

function getFileIcon(name: string) {
    if (name?.endsWith(".xlsx") || name?.endsWith(".csv"))
        return <FileSpreadsheet className="w-6 h-6 text-green-500" />
    return <FileText className="w-6 h-6 text-blue-500" />
}

export default function SharedDocuments() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const { files, isLoading } = useSharedFiles(selectedCategory)

    const filteredFiles = files.filter((file: any) =>
        file.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Berbagi Dokumen</h1>
                <p className="mt-1 text-slate-600">Dokumen publik dari seluruh bidang</p>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-4 gap-4">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() =>
                            setSelectedCategory(
                                selectedCategory === category.id ? null : category.id
                            )
                        }
                        className={`p-3 rounded-xl border-2 text-left transition-all ${selectedCategory === category.id
                                ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                            }`}
                    >
                        <div className="text-xl mb-1">{category.icon}</div>
                        <div className="text-sm font-semibold">{category.label}</div>
                    </button>
                ))}
            </div>

            {/* Documents Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-900">
                        {selectedCategory ? `Dokumen — ${selectedCategory}` : "Semua Dokumen"}
                    </h2>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Cari dokumen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <ScrollArea className="h-[480px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-5 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-slate-200">
                        <div>Jenis</div>
                        <div className="col-span-2">Dokumen</div>
                        <div>Sumber</div>
                        <div>Aksi</div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-16 text-slate-500">
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Memuat dokumen...
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="py-16 text-center text-slate-500 text-sm">
                            Tidak ada dokumen ditemukan
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filteredFiles.map((file: any) => (
                                <div
                                    key={file.id}
                                    className="grid grid-cols-5 gap-4 px-5 py-4 items-center hover:bg-slate-50 transition-colors"
                                >
                                    <div>{getFileIcon(file.name)}</div>
                                    <div className="col-span-2">
                                        <p className="font-medium text-slate-900 truncate">{file.name}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {new Date(file.created_at).toLocaleDateString("id-ID")}
                                        </p>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        {file.folders?.workgroup ?? file.users?.workgroup ?? "—"}
                                    </div>
                                    <div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => window.open(file.url, "_blank")}
                                            className="gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Unduh
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    )
}