"use server"

import { createClient } from "@/utils/supabase/server"

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
    email: `${nip}@gmail.com`,
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

  // No redirect here — let the client handle it
  return { error: null }
}