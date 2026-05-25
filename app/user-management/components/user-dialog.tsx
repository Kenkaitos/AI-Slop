"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { FieldError } from "@/components/ui/field-error"
import { useProfile } from "@/hooks/use-profile"
import { User } from "@/lib/users-api"
import { WORKGROUPS } from "@/lib/workgroups"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface UserDialogProps {
    user: User | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (updated: Partial<User> & { password?: string }) => Promise<void>
    mode: "edit" | "add"
}

export function UserDialog({ user, open, onOpenChange, onSave, mode }: UserDialogProps) {
    const [nip, setNip] = useState("")
    const [email, setEmail] = useState("")
    const [workgroup, setWorkgroup] = useState("")
    const [role, setRole] = useState<User["role"]>("user")
    const [password, setPassword] = useState("")
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { profile, isAdmin, isModerator } = useProfile()

    useEffect(() => {
        if (mode === "edit" && user) {
            setNip(user.nip)
            setEmail(user.email)
            setWorkgroup(user.workgroup)
            setRole(user.role)
            setPassword("")
        } else {
            setNip("")
            setEmail("")
            setWorkgroup(profile?.workgroup ?? "")
            setRole("user")
            setPassword("")
        }
        setErrors({})
    }, [user, mode, open, profile])

    async function handleSave() {
        const newErrors: Record<string, string> = {}

        if (!nip) newErrors.nip = "NIP tidak boleh kosong"
        else if (nip.length < 18) newErrors.nip = "NIP harus 18 digit"

        if (!email) newErrors.email = "Email tidak boleh kosong"
        else if (!emailRegex.test(email)) newErrors.email = "Format email tidak valid"

        if (mode === "add" && password.length < 6) newErrors.password = "Password minimal 6 karakter"
        if (mode === "edit" && password && password.length < 6) newErrors.password = "Password minimal 6 karakter"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setSaving(true)
        if (mode === "edit") {
            await onSave({ id: user!.id, nip, email, workgroup, role, ...(password ? { password } : {}) })
        } else {
            await onSave({ nip, email, workgroup, role, password })
        }
        setSaving(false)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Edit User" : "Tambah Pengguna"}</DialogTitle>
                    <DialogDescription>
                        {mode === "edit" ? "Ubah informasi dan hak akses pengguna" : "Buat akun pengguna baru"}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">NIP</label>
                        <Input
                            value={nip}
                            onChange={(e) => {
                                const value = e.target.value
                                if (/^\d*$/.test(value)) {
                                    setNip(value)
                                    if (value.length === 18) setErrors(p => ({ ...p, nip: "" }))
                                }
                            }}
                            inputMode="numeric"
                            maxLength={18}
                            placeholder="Masukkan NIP"
                            className={errors.nip ? "border-red-400 focus-visible:ring-red-400" : ""}
                        />
                        <FieldError message={errors.nip} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <Input
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                if (emailRegex.test(e.target.value)) setErrors(p => ({ ...p, email: "" }))
                            }}
                            type="email"
                            placeholder="Masukkan email"
                            className={errors.email ? "border-red-400 focus-visible:ring-red-400" : ""}
                        />
                        <FieldError message={errors.email} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Workgroup</label>
                        <select
                            value={workgroup}
                            onChange={(e) => setWorkgroup(e.target.value)}
                            disabled={isModerator}
                            className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Pilih workgroup</option>
                            {WORKGROUPS.map(w => (
                                <option key={w.id} value={w.id}>{w.id}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as User["role"])}
                            className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                        >
                            {isAdmin && <option value="admin">Admin</option>}
                            {isAdmin && <option value="moderator">Moderator</option>}
                            <option value="user">User</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Password{" "}
                            {mode === "edit" && (
                                <span className="text-slate-400 font-normal">(leave empty to keep current)</span>
                            )}
                        </label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if (e.target.value.length >= 6 || e.target.value.length === 0) {
                                    setErrors(p => ({ ...p, password: "" }))
                                }
                            }}
                            placeholder="Masukkan password"
                            className={errors.password ? "border-red-400 focus-visible:ring-red-400" : ""}
                        />
                        <FieldError message={errors.password} />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Tambah Pengguna"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}