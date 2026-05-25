import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

async function getSessionAndProfile() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return { supabase, profile: null }

    const { data: profile } = await supabase
        .from("users")
        .select("id, workgroup, role")
        .eq("auth_id", user.id)
        .single()

    return { supabase, profile }
}

export async function GET(request: Request) {
    const { supabase, profile } = await getSessionAndProfile()
    console.log("profile:", profile) // add this

    if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    const folderId = searchParams.get("folder_id")

    if (folderId) {
        const { data, error } = await supabase
            .from("files")
            .select("*, users(nip, workgroup)")
            .eq("folder_id", folderId)
            .order("created_at", { ascending: false })

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json(data)
    }

    if (type === "department") {
        const { data, error } = await supabase
            .from("files")
            .select("*, users(nip), folders(name, workgroup)")
            .eq("folders.workgroup", profile.workgroup)
            .neq("user_id", profile.id)
            .order("created_at", { ascending: false })
            .limit(10)

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json(data)
    }

    if (type === "shared") {
        const workgroup = searchParams.get("workgroup")

        let query = supabase
            .from("files")
            .select("*, users(nip, workgroup), folders!inner(name, workgroup)")
            .order("created_at", { ascending: false })

        if (workgroup) {
            query = query.filter("folders.workgroup", "eq", workgroup)
        }


        const { data, error } = await query
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json(data)
    }

    const { data, error } = await supabase
        .from("files")
        .select("*, folders(name)")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(request: Request) {
    const { supabase, profile } = await getSessionAndProfile()
    if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()

    const { data, error } = await supabase
        .from("files")
        .insert({ ...body, user_id: profile.id })
        .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function PATCH(request: Request) {
    const { supabase, profile } = await getSessionAndProfile()
    if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    // Only allow editing own files, unless admin
    const { data, error } = await supabase
        .from("files")
        .update(updates)
        .eq("id", id)
        .eq(profile.role === "admin" ? "id" : "user_id", profile.role === "admin" ? id : profile.id)
        .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function DELETE(request: Request) {
    const { supabase, profile } = await getSessionAndProfile()
    if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    let query = supabase.from("files").delete().eq("id", id)

    if (profile.role !== "admin") {
        query = query.eq("user_id", profile.id)
    }

    const { error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}