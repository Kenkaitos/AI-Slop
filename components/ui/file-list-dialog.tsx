import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, Folder, Eye, MoreVertical, FileText, Download, Pencil } from "lucide-react"

interface File {
  id: string
  name: string
  url?: string
  description?: string
  view_count?: number
  users?: { nip: string }
  created_at?: string
}

interface FileListDialogProps {
  title: string
  files: File[]
  type?: "uploaded" | "department"
}

export default function FileListDialog({ title, files, type = "uploaded" }: FileListDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-500">
          Lihat Semua
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px]">
          <div className="space-y-2 pr-4">
            {files.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">Belum ada file</p>
            ) : (
              files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${type === "uploaded" ? "bg-amber-100" : "bg-blue-100"}`}>
                    {type === "uploaded" ? (
                      <Folder className="h-5 w-5 text-amber-600" />
                    ) : (
                      <FileText className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{file.name}</p>
                    {type === "uploaded" ? (
                      <p className="text-xs text-slate-500">{file.description}</p>
                    ) : (
                      <p className="text-xs text-slate-500">
                        {file.users?.nip} - {file.created_at ? new Date(file.created_at).toLocaleDateString("id-ID") : ""}
                      </p>
                    )}
                  </div>
                  {type === "uploaded" && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Eye className="h-4 w-4" />
                      <span>{file.view_count ?? 0}</span>
                    </div>
                  )}
                  {type === "uploaded" ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(file.url, "_blank")}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(file.url, "_blank")}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          const newName = prompt("Nama baru:", file.name)
                          if (newName) console.log("Rename to:", newName)
                        }}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button variant="outline" size="sm">
                      Buka
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}