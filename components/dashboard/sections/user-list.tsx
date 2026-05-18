"use client"

import { useEffect, useState } from "react"
import {
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Shield,
    Clock,
    UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useUserProfile } from "@/context/user-profile-context"
import { FieldError } from "@/components/ui/field-error"

interface User {
    id: string
    nip: string
    email: string
    workgroup: string
    role: "admin" | "user" | "moderator"
    auth_id: string
    created_at: string
}

function getRoleColor(role: string) {
    switch (role) {
        case "admin":
            return "bg-red-100 text-red-800"
        case "moderator":
            return "bg-blue-100 text-blue-800"
        default:
            return "bg-slate-100 text-slate-800"
    }
}

interface UserDialogProps {
    user: User | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (updated: Partial<User> & { password?: string }) => Promise<void>
    mode: "edit" | "add"
}

function UserDialog({ user, open, onOpenChange, onSave, mode }: UserDialogProps) {
    const [nip, setNip] = useState("")
    const [email, setEmail] = useState("")
    const [workgroup, setWorkgroup] = useState("")
    const [role, setRole] = useState<User["role"]>("user")
    const [password, setPassword] = useState("")
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { profile, isAdmin, isModerator } = useUserProfile()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

        if (!nip) {
            newErrors.nip = "NIP tidak boleh kosong"
        } else if (nip.length < 1) {
            newErrors.nip = "NIP harus 18 digit"
        }

        if (!email) {
            newErrors.email = "Email tidak boleh kosong"
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Format email tidak valid"
        }

        if (mode === "add" && password.length < 6) newErrors.password = "Password minimal 6 karakter"
        if (mode === "edit" && password && password.length < 6) newErrors.password = "Password minimal 6 karakter"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setSaving(true)
        if (mode === "edit") {
            await onSave({
                id: user!.id,
                nip,
                email,
                workgroup,
                role,
                ...(password ? { password } : {})
            })
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
                                    if (value && value.length === 1) setErrors((prev) => ({ ...prev, nip: "" }))
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
                                if (emailRegex.test(e.target.value)) {
                                    setErrors((prev) => ({ ...prev, email: "" }))
                                }
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
                            disabled={isModerator} // moderators can't change workgroup
                            className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Pilih workgroup</option>
                            <option value="Perumahan">Perumahan</option>
                            <option value="Keuangan">Keuangan</option>
                            <option value="Tata Ruang">Tata Ruang</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as User["role"])}
                            className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                        >
                            {/* Moderators can only assign user role */}
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
                                    setErrors((prev) => ({ ...prev, password: "" }))
                                }
                            }}
                            placeholder="Masukkan password"
                            className={errors.password ? "border-red-400 focus-visible:ring-red-400" : ""}
                        />
                        <FieldError message={errors.password} />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Add User"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function UserList() {
    const [searchQuery, setSearchQuery] = useState("")
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<"edit" | "add">("add")
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

    const { profile, isAdmin, isModerator } = useUserProfile()

    async function fetchUsers() {
        setLoading(true)
        try {
            const res = await fetch("/api/users")
            const data = await res.json()
            setUsers(Array.isArray(data) ? data : data.users || [])
        } catch {
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    async function handleSave(updated: Partial<User> & { password?: string }) {
        if (dialogMode === "add") {
            const tempUser: User = {
                id: crypto.randomUUID(),
                nip: updated.nip ?? "",
                email: updated.email ?? "",
                workgroup: updated.workgroup ?? "",
                role: (updated.role as User["role"]) ?? "user",
                auth_id: "",
                created_at: new Date().toISOString(),
            }

            const previousUsers = users

            // Instant UI update
            setUsers((prev) => [tempUser, ...prev])

            try {
                const res = await fetch("/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updated),
                })

                if (!res.ok) {
                    throw new Error("Failed")
                }

                const createdUser = await res.json()

                // Replace temp user with real one
                setUsers((prev) =>
                    prev.map((u) =>
                        u.id === tempUser.id
                            ? createdUser
                            : u
                    )
                )
            } catch {
                // Rollback
                setUsers(previousUsers)
            }

            return
        }

        // EDIT MODE

        const previousUsers = users

        // Instant UI update
        setUsers((prev) =>
            prev.map((u) =>
                u.id === updated.id
                    ? {
                        ...u,
                        ...updated,
                    }
                    : u
            )
        )

        try {
            const res = await fetch("/api/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            })

            if (!res.ok) {
                throw new Error("Failed")
            }
        } catch {
            // Rollback on failure
            setUsers(previousUsers)
        }
    }

    async function handleDelete(id: string) {
        // Save current state for rollback
        const previousUsers = users

        // Optimistically remove user instantly
        setUsers((prev) => prev.filter((u) => u.id !== id))

        try {
            const res = await fetch("/api/users", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })

            if (!res.ok) {
                throw new Error("Delete failed")
            }
        } catch {
            // Rollback if failed
            setUsers(previousUsers)
        }
    }

    const filteredUsers = users.filter(
        (user) =>
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.nip?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.workgroup?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Check if a user can be edited/deleted by the current user
    function canModify(targetUser: User) {
        if (isAdmin) return targetUser.id !== profile?.id
        if (isModerator) return targetUser.role === "user" && targetUser.workgroup === profile?.workgroup
        return false
    }

    return (
        <div className="rounded-xl bg-white p-5 shadow-sm">
            <UserDialog
                user={selectedUser}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSave={handleSave}
                mode={dialogMode}
            />

            {/* Delete confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus user ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. User{" "}
                            <span className="font-semibold">{deleteTarget?.email}</span> akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => {
                                if (deleteTarget) handleDelete(deleteTarget.id)
                                setDeleteTarget(null)
                            }}
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Manajemen User</h2>
                <Button
                    onClick={() => {
                        setSelectedUser(null)
                        setDialogMode("add")
                        setDialogOpen(true)
                    }}
                    className="flex items-center gap-2"
                >
                    <UserPlus className="h-4 w-4" />
                    Tambah Pengguna
                </Button>
            </div>

            {/* Search */}
            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                    type="search"
                    placeholder="Search by email, NIP or workgroup..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-200 hover:bg-transparent">
                            <TableHead className="text-slate-700">User</TableHead>
                            <TableHead className="text-slate-700">Workgroup</TableHead>
                            <TableHead className="text-slate-700">Role</TableHead>
                            <TableHead className="text-slate-700">Joined</TableHead>
                            <TableHead className="text-right text-slate-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <p className="text-sm text-slate-500">Memuat...</p>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <p className="text-sm text-slate-500">No users found</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="border-slate-200">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className="bg-slate-200 text-slate-700">
                                                    {user.email?.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-slate-800">{user.email}</p>
                                                {user.nip && (
                                                    <p className="text-xs text-slate-400">NIP: {user.nip}</p>
                                                )}
                                                {user.id === profile?.id && (
                                                    <p className="text-xs text-blue-400">You</p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600">
                                        {user.workgroup}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getRoleColor(user.role)}>
                                            {user.role === "admin" && (
                                                <Shield className="mr-1 h-3 w-3" />
                                            )}
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4 text-slate-400" />
                                            {new Date(user.created_at).toLocaleDateString("id-ID", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {canModify(user) ? (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedUser(user)
                                                            setDialogMode("edit")
                                                            setDialogOpen(true)
                                                        }}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => setDeleteTarget(user)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        ) : (
                                            // Show nothing for users that can't be modified
                                            user.id === profile?.id ? (
                                                <span className="text-xs text-slate-400 pr-2">You</span>
                                            ) : null
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
                <p>
                    Showing <span className="font-semibold">{filteredUsers.length}</span> of{" "}
                    <span className="font-semibold">{users.length}</span> users
                </p>
            </div>
        </div>
    )
}