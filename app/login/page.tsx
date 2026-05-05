"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "./actions"

export default function LoginPage() {
  const [nip, setNip] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData()
    formData.append("nip", nip)
    formData.append("password", password)

    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Force full page reload to clear any stale context state
    window.location.href = "/dashboard"
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <img
              src="/Monogov-Icon.png"
              alt="Logo"
              className="w-48 h-30 object-cover"
            />
          </div>
          <CardTitle className="text-2xl font-semibold">Selamat Datang</CardTitle>
          <CardDescription>Masukkan NIP anda untuk masuk</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="nip" className="text-sm font-medium">NIP</label>
              <Input
                id="nip"
                type="text"
                placeholder="Masukkan NIP"
                value={nip}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^\d*$/.test(value)) {
                    setNip(value)
                  }
                }}
                inputMode="numeric"
                maxLength={18}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 text-center">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memuat..." : "Masuk"}
            </Button>
            <div className="text-center text-sm text-black">
              Lupa kata sandi?{" "}
              <a href="/forgot-password" className="text-sm text-red-600 hover:underline">
                Ganti disini
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}