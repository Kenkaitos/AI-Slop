import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const session = JSON.parse(sessionCookie.value)
  const supabase = await createClient()

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  // Department files — same workgroup, not uploaded by current user
  if (type === "department") {
    const { data, error } = await supabase
      .from("files")
      .select("*, users(nip), folders(name, workgroup)")
      .eq("folders.workgroup", session.workgroup)
      .neq("user_id", session.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  }

  // Own files
  const { data, error } = await supabase
    .from("files")
    .select("*, folders(name)")
    .eq("user_id", session.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const session = JSON.parse(sessionCookie.value)
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("files")
    .insert({
      ...body,
      user_id: session.id
    })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}