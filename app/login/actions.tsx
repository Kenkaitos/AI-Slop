"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

const authErrors: Record<string, string> = {
  invalid_credentials: "NIP atau password salah",
  user_banned: "Akun Anda telah diblokir",
  email_not_confirmed: "Akun belum dikonfirmasi",
  over_request_rate_limit: "Terlalu banyak percobaan login. Coba lagi nanti",
  too_many_requests: "Terlalu banyak percobaan login. Coba lagi nanti",
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const nip = formData.get("nip") as string
  const password = formData.get("password") as string

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: `${nip}@monogov.local`,
    password,
  })

  if (authError) {
    return {
      error:
        authErrors[authError.code as keyof typeof authErrors] ||
        authError.message ||
        "Login gagal",
    }
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "User tidak ditemukan" }
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", user.id)
    .single()

  if (profileError || !profile) {
    return {
      error: profileError?.message || "Profil pengguna tidak ditemukan",
    }
  }

  // Set session cookie with profile data
  const cookieStore = await cookies()
  cookieStore.set("session", JSON.stringify({
    id: profile.id,
    nip: profile.nip,
    workgroup: profile.workgroup,
    role: profile.role,
    auth_id: profile.auth_id,
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  redirect("/dashboard")
}