"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "./actions"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Email tidak boleh kosong")
      return
    }

    if (!password) {
      setError("Password tidak boleh kosong")
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    window.location.href = "/dashboard"
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <Image
              src="/Monogov-Icon.png"
              alt="Logo"
              width={192}
              height={120}
              className="object-cover"
            />
          </div>
          <CardTitle className="text-2xl font-semibold">Selamat Datang</CardTitle>
          <CardDescription>Masukkan email anda untuk masuk</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
          </form>
        </CardContent>
      </Card>
    </main>
  )
}