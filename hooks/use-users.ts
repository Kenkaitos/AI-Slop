"use client"

import useSWR from "swr"
import * as api from "@/lib/users-api"
import { User } from "@/lib/users-api"

export function useUsers() {
    const { data, isLoading, mutate } = useSWR("users", api.getUsers, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    const users = data ?? []

    async function addUser(payload: Partial<User> & { password?: string }) {
        const temp: User = {
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            auth_id: "",
            nip: payload.nip ?? "",
            email: payload.email ?? "",
            workgroup: payload.workgroup ?? "",
            role: payload.role ?? "user",
        }

        mutate((current = []) => [temp, ...current], false)

        try {
            const created = await api.createUser(payload)
            mutate((current = []) => current.map(u => u.id === temp.id ? created : u), false)
        } catch {
            mutate((current = []) => current.filter(u => u.id !== temp.id), false)
        }
    }

    async function editUser(payload: Partial<User> & { password?: string }) {
        const prev = data

        mutate((current = []) =>
            current.map(u => u.id === payload.id ? { ...u, ...payload } : u),
            false
        )

        try {
            await api.updateUser(payload)
        } catch {
            mutate(prev, false)
        }
    }

    async function removeUser(id: string) {
        const prev = data

        mutate((current = []) => current.filter(u => u.id !== id), false)

        try {
            await api.deleteUser(id)
        } catch {
            mutate(prev, false)
        }
    }

    return {
        users,
        isLoading,
        addUser,
        editUser,
        removeUser,
        mutate,
    }
}