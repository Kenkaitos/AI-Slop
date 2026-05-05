import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

function unauthorized() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

function forbidden() {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

async function getSessionAndRole() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return { supabase, user: null, role: null }

    const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("auth_id", user.id)
        .single()

    return { supabase, user, role: profile?.role ?? null }
}

export async function GET() {
    const { supabase, user, role } = await getSessionAndRole()
    if (!user) return unauthorized()
    if (role !== "admin") return forbidden()

    const { data, error } = await supabase.from("users").select("*")

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(request: Request) {
    const { supabase, user, role } = await getSessionAndRole()
    if (!user) return unauthorized()
    if (role !== "admin") return forbidden()

    const body = await request.json()
    const { data, error } = await supabase.from("users").insert(body).select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function PATCH(request: Request) {
    const { supabase, user, role } = await getSessionAndRole()
    if (!user) return unauthorized()
    if (role !== "admin") return forbidden()

    const { id, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", id)
        .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function DELETE(request: Request) {
    const { supabase, user, role } = await getSessionAndRole()
    if (!user) return unauthorized()
    if (role !== "admin") return forbidden()

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const { error } = await supabase.from("users").delete().eq("id", id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}