import { createClient } from "@/utils/supabase/client"

export async function uploadAvatar(file: File, userId: string): Promise<string> {
    const supabase = createClient()

    const ext = file.type === "image/png" ? "png" : "jpg"
    const path = `${userId}/avatar.${ext}`

    const { error: storageError } = await supabase.storage
        .from("avatars")
        .upload(path, file, {
            upsert: true,
            contentType: file.type,
        })

    if (storageError) throw new Error(storageError.message)

    const { data } = supabase.storage.from("avatars").getPublicUrl(path)

    const publicUrl = `${data.publicUrl}?t=${Date.now()}`

    const { error: updateError, data: updateData } = await supabase
        .from("users")
        .update({ avatar_url: publicUrl })
        .eq("auth_id", userId)

    console.log("update data:", updateData)
    console.log("update error:", updateError)
    
    if (updateError) throw new Error(updateError.message)

    return publicUrl
}