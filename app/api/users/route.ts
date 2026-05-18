import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/utils/supabase/admin"

function unauthorized() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

function forbidden() {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

async function getSessionAndRole() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return { supabase, user: null, role: null, profile: null }

    const { data: profile } = await supabase
        .from("users")
        .select("id, role, workgroup, auth_id")
        .eq("auth_id", user.id)
        .single()

    return { supabase, user, role: profile?.role ?? null, profile }
}

export async function GET() {
    const { supabase, user, role, profile } = await getSessionAndRole()
    if (!user) return unauthorized()
    if (role !== "admin" && role !== "moderator") return forbidden()

    let query = supabase.from("users").select("*")

    // Moderators can only see their own workgroup
    if (role === "moderator") {
        query = query.eq("workgroup", profile!.workgroup)
    }

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(request: Request) {
    const { user, role, profile } = await getSessionAndRole()
    if (!user) return unauthorized()
    if (role !== "admin" && role !== "moderator") return forbidden()

    const { nip, email, workgroup, role: newRole, password } = await request.json()

    if (!email || !password || !workgroup) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Moderators can only create users, not admins or other moderators
    if (role === "moderator" && newRole !== "user") {
        return forbidden()
    }

    // Moderators can only add users to their own workgroup
    if (role === "moderator" && workgroup !== profile!.workgroup) {
        return forbidden()
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    })

    if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    const { data, error: profileError } = await supabaseAdmin
        .from("users")
        .insert({
            nip,
            email,
            workgroup,
            role: newRole ?? "user",
            auth_id: authData.user.id,
        })
        .select()
        .single()

    if (profileError) {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function PATCH(request: Request) {
    const { supabase, user, role, profile } = await getSessionAndRole()
    if (!user) return unauthorized()
    if (role !== "admin" && role !== "moderator") return forbidden()

    const { id, password, ...updates } = await request.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const { data: existingUser } = await supabase
        .from("users")
        .select("auth_id, workgroup, role")
        .eq("id", id)
        .single()

    if (!existingUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    // Moderators can only edit users in their own workgroup
    if (role === "moderator" && existingUser.workgroup !== profile!.workgroup) {
        return forbidden()
    }

    // Moderators can only edit regular users, not admins or other moderators
    if (role === "moderator" && existingUser.role !== "user") {
        return forbidden()
    }

    // Moderators cannot promote anyone to admin or moderator
    if (role === "moderator" && updates.role && updates.role !== "user") {
        return forbidden()
    }

    if (password) {
        const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
            existingUser.auth_id,
            { password }
        )
        if (passwordError) return NextResponse.json({ error: passwordError.message }, { status: 500 })
    }

    if (updates.email) {
        await supabaseAdmin.auth.admin.updateUserById(
            existingUser.auth_id,
            { email: updates.email }
        )
    }

    const { data, error } = await supabaseAdmin
        .from("users")
        .update(updates)
        .eq("id", id)
        .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function DELETE(request: Request) {
    const { supabase, user, role, profile } = await getSessionAndRole()
    if (!user) return unauthorized()
    if (role !== "admin" && role !== "moderator") return forbidden()

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const { data: existingUser } = await supabase
        .from("users")
        .select("auth_id, workgroup, role")
        .eq("id", id)
        .single()

    if (!existingUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    // Moderators can only delete users in their own workgroup
    if (role === "moderator" && existingUser.workgroup !== profile!.workgroup) {
        return forbidden()
    }

    // Moderators cannot delete admins or other moderators
    if (role === "moderator" && existingUser.role !== "user") {
        return forbidden()
    }

    const { error: profileError } = await supabaseAdmin
        .from("users")
        .delete()
        .eq("id", id)

    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 })

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(existingUser.auth_id)
    if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })

    return NextResponse.json({ success: true })
}