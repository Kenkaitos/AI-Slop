"use client"

import { useState } from "react"
import { Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import DashboardSection from "@/components/dashboard/sections/dashboard-section"
import { useDashboardData } from "@/context/dashboard-data-context"
import { useUserProfile } from "@/context/user-profile-context"
import { AppSidebar } from "@/components/navigation/app-sidebar"

export default function DashboardPage() {
    const {
        uploadedFiles,
        departmentFiles,
        loadingFiles,
        loadingDepartment,
    } = useDashboardData()

    const { profile, loadingProfile, isAdmin } = useUserProfile()
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <div className="flex min-h-screen bg-slate-100">
            <AppSidebar />

            <main className="flex-1 overflow-hidden">
                <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Cari dokumen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white">
                                3
                            </span>
                        </Button>
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="/avatars/profile.png" alt="User" />
                            <AvatarFallback>
                                {profile?.nip?.slice(0, 2).toUpperCase() ?? "UA"}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                <div className="h-[calc(100vh-73px)] overflow-y-auto p-6 space-y-6">
                    <DashboardSection
                        uploadedFiles={uploadedFiles}
                        departmentFiles={departmentFiles}
                        loadingFiles={loadingFiles}
                        loadingDepartment={loadingDepartment}
                    />
                </div>
            </main>
        </div>
    )
}