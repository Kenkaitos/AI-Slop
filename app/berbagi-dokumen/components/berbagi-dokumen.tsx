"use client"

import { useEffect, useState } from "react"
import {
    Search, FileText, FileSpreadsheet, Download,
    Loader2, Folder, Lock, Plus, MoreVertical,
    Trash2, Pencil, Upload, ChevronRight, FolderOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { WORKGROUPS } from "@/lib/workgroups"
import { useFolders } from "@/hooks/use-folders"
import { useFolderFiles } from "@/hooks/use-folder-files"
import { useProfile } from "@/hooks/use-profile"

const categories = WORKGROUPS.map(w => ({
    id: w.id,
    icon: w.icon,
    label: `Bidang ${w.id}`,
}))

function getFileIcon(name: string) {
    if (name?.match(/\.(xlsx|csv|xls)$/i))
        return <FileSpreadsheet className="w-6 h-6 text-green-500" />
    return <FileText className="w-6 h-6 text-blue-500" />
}

// ─── Password Dialog ──────────────────────────────────────────
function PasswordDialog({
    open,
    onOpenChange,
    onSubmit,
    error,
}: {
    open: boolean
    onOpenChange: (v: boolean) => void
    onSubmit: (password: string) => void
    error?: string
}) {
    const [value, setValue] = useState("")

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) setValue(""); onOpenChange(v) }}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Folder Terkunci</DialogTitle>
                    <DialogDescription>Masukkan password untuk membuka folder ini</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                    <Input
                        type="password"
                        placeholder="Password"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSubmit(value)}
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button onClick={() => onSubmit(value)}>Buka</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── Create Folder Dialog ─────────────────────────────────────
function CreateFolderDialog({
    open,
    onOpenChange,
    onCreate,
}: {
    open: boolean
    onOpenChange: (v: boolean) => void
    onCreate: (name: string, password?: string, isShared?: boolean) => Promise<void>
}) {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [isShared, setIsShared] = useState(false)
    const [saving, setSaving] = useState(false)

    async function handleCreate() {
        if (!name.trim()) return
        setSaving(true)
        await onCreate(name.trim(), password.trim() || undefined, isShared)
        setSaving(false)
        setName("")
        setPassword("")
        setIsShared(false)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Buat Folder Baru</DialogTitle>
                    <DialogDescription>Folder akan dibuat di workgroup Anda</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Nama Folder</label>
                        <Input
                            placeholder="Nama folder"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Password{" "}
                            <span className="text-slate-400 font-normal">(opsional)</span>
                        </label>
                        <Input
                            type="password"
                            placeholder="Kosongkan jika tidak perlu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                        <div>
                            <p className="text-sm font-medium">Bagikan ke semua bidang</p>
                            <p className="text-xs text-slate-400">Folder terlihat oleh semua pengguna</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsShared(!isShared)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isShared ? "bg-slate-900" : "bg-slate-200"
                                }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isShared ? "translate-x-6" : "translate-x-1"
                                }`} />
                        </button>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button onClick={handleCreate} disabled={saving || !name.trim()}>
                            {saving ? "Membuat..." : "Buat Folder"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
// ─── Files View ───────────────────────────────────────────────
function FilesView({ folder }: { folder: any }) {
    const { profile, isAdmin, isModerator } = useProfile()
    const { files, isLoading, addFile, removeFile, renameFile } = useFolderFiles(folder.id)
    const [searchQuery, setSearchQuery] = useState("")
    const [uploading, setUploading] = useState(false)

    const filteredFiles = files.filter((f: any) =>
        f.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    function canDelete(file: any) {
        if (isAdmin) return true
        if (isModerator) return folder.workgroup === profile?.workgroup
        return file.user_id === profile?.id
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file || !profile) return
        setUploading(true)
        try {
            await addFile(file, profile.auth_id)
        } catch (err) {
            console.error("Upload failed:", err)
        } finally {
            setUploading(false)
            e.target.value = ""
        }
    }

    async function handleRename(file: any) {
        const newName = prompt("Nama baru:", file.name)
        if (newName && newName !== file.name) await renameFile(file.id, newName)
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-amber-500" />
                    {folder.name}
                </h2>
                <div className="flex items-center gap-3">
                    <div className="relative w-56">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Cari file..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <label className="cursor-pointer">
                        <Button disabled={uploading} asChild>
                            <span className="gap-2 flex items-center">
                                {uploading
                                    ? <><Loader2 className="w-4 h-4 animate-spin" />Mengunggah...</>
                                    : <><Upload className="w-4 h-4" />Unggah File</>
                                }
                            </span>
                        </Button>
                        <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                    </label>
                </div>
            </div>

            <ScrollArea className="h-[480px]">
                <div className="grid grid-cols-5 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-slate-200">
                    <div>Jenis</div>
                    <div className="col-span-2">Nama File</div>
                    <div>Diunggah</div>
                    <div>Aksi</div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-16 text-slate-500">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Memuat file...
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="py-16 text-center text-slate-500 text-sm">
                        Belum ada file dalam folder ini
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
                                        {file.users?.nip ?? "—"}
                                    </p>
                                </div>
                                <div className="text-sm text-slate-500">
                                    {new Date(file.created_at).toLocaleDateString("id-ID")}
                                </div>
                                <div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => window.open(file.url, "_blank")}>
                                                <Download className="mr-2 h-4 w-4" />
                                                Unduh
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRename(file)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Rename
                                            </DropdownMenuItem>
                                            {canDelete(file) && (
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => removeFile(file.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}

// Folders View
function FoldersView({
    workgroup,
    onOpenFolder,
}: {
    workgroup: string
    onOpenFolder: (folder: any) => void
}) {
    const { profile } = useProfile()
    const { folders, isLoading, removeFolder } = useFolders(workgroup)
    const [passwordFolder, setPasswordFolder] = useState<any>(null)
    const [passwordError, setPasswordError] = useState("")

    function handleFolderClick(folder: any) {
        if (folder.password_protected && folder.password) {
            setPasswordFolder(folder)
            setPasswordError("")
        } else {
            onOpenFolder(folder)
        }
    }

    function handlePasswordSubmit(password: string) {
        if (password === passwordFolder.password) {
            setPasswordFolder(null)
            setPasswordError("")
            onOpenFolder(passwordFolder)
        } else {
            setPasswordError("Password salah")
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">
                    Folder — {workgroup}
                </h2>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-16 text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Memuat folder...
                </div>
            ) : folders.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-sm">
                    Belum ada folder di bidang ini
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {folders.map((folder: any) => (
                        <div
                            key={folder.id}
                            onClick={() => handleFolderClick(folder)}
                            className="flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-slate-300 hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="flex w-full items-center justify-between">
                                {folder.password_protected
                                    ? <Lock className="w-8 h-8 text-amber-400" />
                                    : <Folder className="w-8 h-8 text-amber-400" />
                                }
                                {folder.user_id === profile?.id && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeFolder(folder.id)
                                                }}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hapus Folder
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 text-sm">{folder.name}</p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {new Date(folder.created_at).toLocaleDateString("id-ID")}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <PasswordDialog
                open={!!passwordFolder}
                onOpenChange={(v) => { if (!v) { setPasswordFolder(null); setPasswordError("") } }}
                onSubmit={handlePasswordSubmit}
                error={passwordError}
            />
        </>
    )
}

// ─── Main Component ───────────────────────────────────────────
export default function SharedDocuments() {
    const { profile } = useProfile()
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [openFolder, setOpenFolder] = useState<any>(null)
    const [createOpen, setCreateOpen] = useState(false)
    const { addFolder } = useFolders(profile?.workgroup ?? null)

    // auto-select user's workgroup on mount
    useEffect(() => {
        if (profile?.workgroup) {
            setSelectedCategory(profile.workgroup)
        }
    }, [profile?.workgroup])

    async function handleCreateFolder(name: string, password?: string, isShared?: boolean) {
        if (!profile) return
        const created = await addFolder({ name, password, is_shared: isShared })
        // auto-select user's workgroup and open the new folder
        setSelectedCategory(profile.workgroup)
        setOpenFolder(created)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Berbagi Dokumen</h1>
                    <p className="mt-1 text-slate-600">Dokumen publik dari seluruh bidang</p>
                </div>
                <Button onClick={() => setCreateOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Buat Folder
                </Button>
            </div>

            {/* Breadcrumb */}
            {(selectedCategory || openFolder) && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <button
                        onClick={() => { setSelectedCategory(profile?.workgroup ?? null); setOpenFolder(null) }}
                        className="hover:text-slate-800 transition-colors"
                    >
                        Berbagi Dokumen
                    </button>
                    {selectedCategory && (
                        <>
                            <ChevronRight className="w-4 h-4" />
                            <button
                                onClick={() => setOpenFolder(null)}
                                className={openFolder ? "hover:text-slate-800 transition-colors" : "text-slate-800 font-medium"}
                            >
                                Bidang {selectedCategory}
                            </button>
                        </>
                    )}
                    {openFolder && (
                        <>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-slate-800 font-medium">{openFolder.name}</span>
                        </>
                    )}
                </div>
            )}

            {/* Categories */}
            <div className="grid grid-cols-4 gap-4">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => {
                            setSelectedCategory(selectedCategory === category.id ? null : category.id)
                            setOpenFolder(null)
                        }}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                            selectedCategory === category.id
                                ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                    >
                        <div className="text-xl mb-1">{category.icon}</div>
                        <div className="text-sm font-semibold">{category.label}</div>
                    </button>
                ))}
            </div>

            {/* Content */}
            {selectedCategory && !openFolder && (
                <FoldersView
                    workgroup={selectedCategory}
                    onOpenFolder={setOpenFolder}
                />
            )}

            {openFolder && (
                <FilesView folder={openFolder} />
            )}

            <CreateFolderDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onCreate={handleCreateFolder}
            />
        </div>
    )
}