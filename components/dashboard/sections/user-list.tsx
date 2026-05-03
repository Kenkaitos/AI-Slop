"use client"

import { useEffect, useState } from "react"
import {
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Shield,
    Clock,
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

interface User {
    id: string
    nip: string
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

interface EditUserDialogProps {
    user: User | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (updated: Partial<User>) => Promise<void>
}

function EditUserDialog({ user, open, onOpenChange, onSave }: EditUserDialogProps) {
    const [nip, setNip] = useState("")
    const [workgroup, setWorkgroup] = useState("")
    const [role, setRole] = useState<User["role"]>("user")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (user) {
            setNip(user.nip)
            setWorkgroup(user.workgroup)
            setRole(user.role)
        }
    }, [user])

    if (!user) return null

    async function handleSave() {
        setSaving(true)
        await onSave({ id: user!.id, nip, workgroup, role })
        setSaving(false)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update user information and permissions
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">NIP</label>
                        <Input value={nip} onChange={(e) => setNip(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Workgroup</label>
                        <Input value={workgroup} onChange={(e) => setWorkgroup(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as User["role"])}
                            className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                        >
                            <option value="admin">Admin</option>
                            <option value="moderator">Moderator</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
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

    async function handleSave(updated: Partial<User>) {
        await fetch(`/api/users`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
        })
        await fetchUsers()
    }

    async function handleDelete(id: string) {
        await fetch(`/api/users`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        })
        await fetchUsers()
    }

    const filteredUsers = users.filter(
        (user) =>
            user.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.workgroup.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="rounded-xl bg-white p-5 shadow-sm">
            <EditUserDialog
                user={selectedUser}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSave={handleSave}
            />

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-lg font-semibold text-slate-800">User Management</h2>
            </div>

            {/* Search */}
            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                    type="search"
                    placeholder="Search by NIP or workgroup..."
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
                                                    {user.nip.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <p className="font-medium text-slate-800">{user.nip}</p>
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
                                                        setDialogOpen(true)
                                                    }}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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