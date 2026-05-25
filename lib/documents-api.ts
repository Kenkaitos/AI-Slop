import { createClient } from "@/utils/supabase/client"

const supabase = createClient()

// ─── Folders ─────────────────────────────────────────────────

export async function getFolders(workgroup: string) {
    const res = await fetch(`/api/folders?workgroup=${encodeURIComponent(workgroup)}`)
    if (!res.ok) throw new Error("Failed to fetch folders")
    return res.json()
}

export async function createFolder(payload: {
    name: string
    workgroup: string
    password?: string
    is_shared?: boolean
}) {
    const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...payload,
            password_protected: !!payload.password,
        }),
    })
    if (!res.ok) throw new Error("Failed to create folder")
    return res.json()
}

export async function deleteFolder(id: string) {
    const res = await fetch("/api/folders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    })
    if (!res.ok) throw new Error("Failed to delete folder")
}

// ─── Files ───────────────────────────────────────────────────

export async function uploadFile(file: File, folderId: string, userId: string) {
    const ext = file.name.split(".").pop()
    const path = `${userId}/${folderId}/${Date.now()}.${ext}`

    const { error: storageError } = await supabase.storage
        .from("documents")
        .upload(path, file, { upsert: false, contentType: file.type })

    if (storageError) throw new Error(storageError.message)

    const { data } = supabase.storage.from("documents").getPublicUrl(path)

    const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: file.name,
            url: data.publicUrl,
            folder_id: folderId,
            description: "",
        }),
    })

    if (!res.ok) throw new Error("Failed to save file record")
    return res.json()
}

export async function deleteFile(id: string) {
    const res = await fetch("/api/files", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    })
    if (!res.ok) throw new Error("Failed to delete file")
}

export async function renameFile(id: string, name: string) {
    const res = await fetch("/api/files", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
    })
    if (!res.ok) throw new Error("Failed to rename file")
    return res.json()
}