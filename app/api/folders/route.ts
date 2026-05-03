import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const session = JSON.parse(sessionCookie.value)
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("folders")
    .select("*")
    .or(`workgroup.eq.${session.workgroup},is_shared.eq.true`)

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
    .from("folders")
    .insert({
      ...body,
      workgroup: session.workgroup,
      user_id: session.id
    })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}