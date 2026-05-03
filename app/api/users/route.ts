import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

async function getSession() {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")
    if (!sessionCookie) return null
    return JSON.parse(sessionCookie.value)
}

function unauthorized() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

function forbidden() {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

export async function GET() {
    const session = await getSession()
    if (!session) return unauthorized()
    if (session.role !== "admin") return forbidden()

    const supabase = await createClient()
    const { data, error } = await supabase.from("users").select("*")

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) return unauthorized()
    if (session.role !== "admin") return forbidden()

    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase.from("users").insert(body).select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function PATCH(request: Request) {
    const session = await getSession()
    if (!session) return unauthorized()
    if (session.role !== "admin") return forbidden()

    const supabase = await createClient()
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
    const session = await getSession()
    if (!session) return unauthorized()
    if (session.role !== "admin") return forbidden()

    const supabase = await createClient()
    const { id } = await request.json()

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const { error } = await supabase.from("users").delete().eq("id", id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}