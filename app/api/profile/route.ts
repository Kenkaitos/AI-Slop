import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json(null, { status: 401 })

    const { data: profile } = await supabase
        .from("users")
        .select("id, nip, email, workgroup, role, auth_id, created_at")
        .eq("auth_id", user.id)
        .single()

    return NextResponse.json(profile)
}