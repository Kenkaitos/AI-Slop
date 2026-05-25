"use client"

import { useEffect, useRef } from "react"
import useSWR from "swr"
import { useTheme } from "next-themes"

import { createClient } from "@/utils/supabase/client"


const supabase = createClient()

async function getTheme() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return "system"

  const { data } = await supabase
    .from("users")
    .select("theme")
    .eq("auth_id", user.id)
    .single()

  return data?.theme ?? "system"
}

export function useThemeSettings() {
  const { theme, setTheme } = useTheme()
  const initialized = useRef(false)

  const { data, isLoading, mutate } = useSWR("theme", getTheme)

  useEffect(() => {
    if (data && !initialized.current) {
      setTheme(data)
      initialized.current = true
    }
  }, [data, setTheme])


  async function saveTheme(newTheme: "light" | "dark" | "system") {
    setTheme(newTheme)
    mutate(newTheme, false)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from("users")
      .update({ theme: newTheme })
      .eq("auth_id", user.id)  // was: .eq("id", user.id) ← this was the bug

    mutate()
  }

  return {
    theme,
    setTheme: saveTheme,
    isLoading,
  }
}