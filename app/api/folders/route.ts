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
    if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const workgroup = searchParams.get("workgroup")

    let query = supabase
        .from("folders")
        .select("*, users(nip, workgroup)")
        .order("created_at", { ascending: false })

    if (profile.role === "admin") {
        // admin sees everything, just filter by selected workgroup if provided
        if (workgroup) {
            query = query.eq("workgroup", workgroup)
        }
    } else if (profile.role === "moderator") {
        // moderator sees all folders in their own workgroup
        // but only shared folders in other workgroups
        if (workgroup && workgroup !== profile.workgroup) {
            query = query.eq("workgroup", workgroup).eq("is_shared", true)
        } else {
            query = query.eq("workgroup", profile.workgroup)
        }
    } else {
        // regular user — own workgroup sees all, other workgroups only shared
        if (workgroup && workgroup !== profile.workgroup) {
            query = query.eq("workgroup", workgroup).eq("is_shared", true)
        } else {
            query = query.eq("workgroup", workgroup ?? profile.workgroup)
        }
    }

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(request: Request) {
    const { supabase, profile } = await getSessionAndProfile()
    if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()

    const { data, error } = await supabase
        .from("folders")
        .insert({
            ...body,
            workgroup: profile.workgroup,
            user_id: profile.id,
        })
        .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function PATCH(request: Request) {
    const { supabase, profile } = await getSessionAndProfile()
    if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const query = supabase.from("folders").update(updates).eq("id", id)

    // Non-admins can only update their own folders
    if (profile.role !== "admin") {
        query.eq("user_id", profile.id)
    }

    const { data, error } = await query.select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function DELETE(request: Request) {
    const { supabase, profile } = await getSessionAndProfile()
    if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const query = supabase.from("folders").delete().eq("id", id)

    // Non-admins can only delete their own folders
    if (profile.role !== "admin") {
        query.eq("user_id", profile.id)
    }

    const { error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}