export interface User {
    id: string
    nip: string
    email: string
    workgroup: string
    role: "admin" | "user" | "moderator"
    auth_id: string
    created_at: string
    avatar_url?: string | null
}

export async function getUsers(): Promise<User[]> {
    const res = await fetch("/api/users")
    if (!res.ok) throw new Error("Failed to fetch users")
    const data = await res.json()
    return Array.isArray(data) ? data : data.users ?? []
}

export async function createUser(payload: Partial<User> & { password?: string }) {
    const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    if (!res.ok) throw new Error("Failed to create user")
    return res.json()
}

export async function updateUser(payload: Partial<User> & { password?: string }) {
    const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    if (!res.ok) throw new Error("Failed to update user")
    return res.json()
}

export async function deleteUser(id: string) {
    const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    })

    if (!res.ok) throw new Error("Failed to delete user")
}