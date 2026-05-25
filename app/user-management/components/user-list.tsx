"use client"

import { useState } from "react"
import {
    Search, MoreVertical, Edit, Trash2,
    Shield, Clock, UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProfileImage } from "@/components/shared/profile-image"
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useProfile } from "@/hooks/use-profile"
import { useUsers } from "@/hooks/use-users"
import { User } from "@/lib/users-api"
import { TableFilters } from "@/components/shared/table-filters"
import { UserDialog} from "./user-dialog"
import { WORKGROUPS } from "@/lib/workgroups"

// ─── Constants ───────────────────────────────────────────────
const USER_FILTERS = [
    {
        key: "role",
        label: "Role",
        options: [
            { label: "Admin", value: "admin" },
            { label: "Moderator", value: "moderator" },
            { label: "User", value: "user" },
        ],
    },
    {
        key: "workgroup",
        label: "Workgroup",
        options: WORKGROUPS.map(w => ({ label: w.id, value: w.id })),
    },
    {
        key: "joined",
        label: "Bergabung",
        options: [
            { label: "7 hari terakhir", value: "7days" },
            { label: "30 hari terakhir", value: "30days" },
            { label: "3 bulan terakhir", value: "3months" },
            { label: "Tahun ini", value: "thisyear" },
        ],
    },
]

const DEFAULT_FILTERS = { role: "all", workgroup: "all", joined: "all" }

function getRoleColor(role: string) {
    switch (role) {
        case "admin": return "bg-red-100 text-red-800"
        case "moderator": return "bg-blue-100 text-blue-800"
        default: return "bg-slate-100 text-slate-800"
    }
}

function isWithinDays(dateStr: string, days: number) {
    const diff = (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
    return diff <= days
}

function matchesJoinedFilter(createdAt: string, filter: string) {
    switch (filter) {
        case "7days": return isWithinDays(createdAt, 7)
        case "30days": return isWithinDays(createdAt, 30)
        case "3months": return isWithinDays(createdAt, 90)
        case "thisyear": return new Date(createdAt).getFullYear() === new Date().getFullYear()
        default: return true
    }
}

// ─── UserList ─────────────────────────────────────────────────
export function UserList() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterValues, setFilterValues] = useState(DEFAULT_FILTERS)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<"edit" | "add">("add")
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

    const { profile, isAdmin, isModerator } = useProfile()
    const { users, isLoading, addUser, editUser, removeUser } = useUsers()

    async function handleSave(updated: Partial<User> & { password?: string }) {
        if (dialogMode === "add") await addUser(updated)
        else await editUser(updated)
    }

    function canModify(targetUser: User) {
        if (isAdmin) return targetUser.id !== profile?.id
        if (isModerator) return targetUser.role === "user" && targetUser.workgroup === profile?.workgroup
        return false
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.nip?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.workgroup?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = filterValues.role === "all" || user.role === filterValues.role
        const matchesWorkgroup = filterValues.workgroup === "all" || user.workgroup === filterValues.workgroup
        const matchesJoined = matchesJoinedFilter(user.created_at, filterValues.joined)
        return matchesSearch && matchesRole && matchesWorkgroup && matchesJoined
    })

    return (
        <div className="rounded-xl bg-white p-5 shadow-sm">
            <UserDialog
                user={selectedUser}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSave={handleSave}
                mode={dialogMode}
            />

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
                                if (deleteTarget) removeUser(deleteTarget.id)
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

            {/* Search + Filter */}
            <div className="mb-4 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        type="search"
                        placeholder="Cari email, NIP, atau workgroup..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <TableFilters
                    filters={USER_FILTERS}
                    values={filterValues}
                    onChange={(key, value) => setFilterValues(prev => ({ ...prev, [key]: value }))}
                    onReset={() => setFilterValues(DEFAULT_FILTERS)}
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <p className="text-sm text-slate-500">Memuat...</p>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <p className="text-sm text-slate-500">Tidak ada pengguna</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="border-slate-200">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <ProfileImage
                                                avatarUrl={user.avatar_url}
                                                initials={user.email?.slice(0, 2).toUpperCase()}
                                                size="sm"
                                            />
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
                                    <TableCell className="text-sm text-slate-600">{user.workgroup}</TableCell>
                                    <TableCell>
                                        <Badge className={getRoleColor(user.role)}>
                                            {user.role === "admin" && <Shield className="mr-1 h-3 w-3" />}
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
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedUser(user)
                                                        setDialogMode("edit")
                                                        setDialogOpen(true)
                                                    }}>
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
                                        ) : user.id === profile?.id ? (
                                            <span className="text-xs text-slate-400 pr-2">You</span>
                                        ) : null}
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