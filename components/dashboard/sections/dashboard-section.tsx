"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import FileListDialog from "@/components/ui/file-list-dialog"
import {
  Eye,
  Folder,
  FileText,
  MoreVertical,
  Download,
  Pencil,
  Mail,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
  uploadedFiles: any[]
  departmentFiles: any[]
  loadingFiles: boolean
  loadingDepartment: boolean
}

export default function DashboardSection({
  uploadedFiles,
  departmentFiles,
  loadingFiles,
  loadingDepartment,
}: Props) {
  const stats = [
    {
      icon: Mail,
      label: "Surat Masuk",
      value: uploadedFiles.length,
      gradient: "from-slate-300 via-slate-200 to-slate-100",
      textColor: "text-slate-700",
    },
    {
      icon: Users,
      label: "Total View",
      value: uploadedFiles.reduce(
        (total, file) => total + (file.view_count ?? 0),
        0
      ),
      gradient: "from-rose-400 via-rose-300 to-rose-200",
      textColor: "text-white",
    },
    {
      icon: FileText,
      label: "Dokumen Dibagikan",
      value: departmentFiles.length,
      gradient: "from-rose-800 via-rose-700 to-rose-600",
      textColor: "text-white",
    },
  ]

  return (
    <div>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              "flex items-center gap-4 rounded-xl bg-gradient-to-r p-5 shadow-md transition-transform hover:scale-[1.02]",
              stat.gradient
            )}
          >
            <div className={cn("rounded-lg bg-white/20 p-3", stat.textColor)}>
              <stat.icon className="h-6 w-6" />
            </div>

            <div className={stat.textColor}>
              <p className="text-sm font-medium opacity-80">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Kotak Masuk Baru */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Kotak Masuk Baru
            </h2>

            <FileListDialog
              title="File yang Diunggah"
              files={uploadedFiles}
              type="uploaded"
            />
          </div>

          <ScrollArea className="h-72">
            <div className="space-y-3 pr-4">
              {loadingFiles ? (
                <p className="py-4 text-center text-sm text-slate-500">
                  Memuat...
                </p>
              ) : uploadedFiles.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-500">
                  Belum ada surat masuk
                </p>
              ) : (
                uploadedFiles.slice(0, 5).map((file) => (
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
                          {file.description || "Tidak ada deskripsi"}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.url, "_blank")}
                    >
                      Buka
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Uploaded files */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                File yang Diunggah
              </h2>

              <FileListDialog
                title="File yang Diunggah"
                files={uploadedFiles}
                type="uploaded"
              />
            </div>

            <ScrollArea className="h-44">
              <div className="space-y-2 pr-4">
                {loadingFiles ? (
                  <p className="py-4 text-center text-sm text-slate-500">
                    Memuat...
                  </p>
                ) : uploadedFiles.length === 0 ? (
                  <p className="py-4 text-center text-sm text-slate-500">
                    Belum ada file
                  </p>
                ) : (
                  uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                        <Folder className="h-5 w-5 text-amber-600" />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-slate-800">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {file.description || "Tidak ada deskripsi"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Eye className="h-4 w-4" />
                        <span>{file.view_count ?? 0}</span>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => window.open(file.url, "_blank")}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => window.open(file.url, "_blank")}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              const newName = prompt(
                                "Nama baru:",
                                file.name
                              )
                              if (newName)
                                console.log("Rename:", file.id, newName)
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Department files */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                File Baru di Departemen
              </h2>

              <FileListDialog
                title="File Baru di Departemen"
                files={departmentFiles}
                type="department"
              />
            </div>

            <ScrollArea className="h-32">
              <div className="space-y-2 pr-4">
                {loadingDepartment ? (
                  <p className="py-4 text-center text-sm text-slate-500">
                    Memuat...
                  </p>
                ) : departmentFiles.length === 0 ? (
                  <p className="py-4 text-center text-sm text-slate-500">
                    Belum ada file baru
                  </p>
                ) : (
                  departmentFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>

                        <div>
                          <p className="font-medium text-slate-800">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {file.users?.nip} -{" "}
                            {new Date(file.created_at).toLocaleDateString(
                              "id-ID"
                            )}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.url, "_blank")}
                      >
                        Buka
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}