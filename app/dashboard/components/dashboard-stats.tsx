"use client"

import {
    Mail,
    Users,
    FileText,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { DashboardFile } from "./types"

interface DashboardStatsProps {
    uploadedFiles: DashboardFile[]
    departmentFiles: DashboardFile[]
}

export default function DashboardStats({
    uploadedFiles,
    departmentFiles,
}: DashboardStatsProps) {
    const stats = [
        {
            icon: Mail,
            label: "Surat Masuk",
            value: uploadedFiles.length,
            gradient:
                "from-slate-300 via-slate-200 to-slate-100",
            textColor: "text-slate-700",
        },
        {
            icon: Users,
            label: "Total View",
            value: uploadedFiles.reduce(
                (total, file) =>
                    total + (file.view_count ?? 0),
                0
            ),
            gradient:
                "from-rose-400 via-rose-300 to-rose-200",
            textColor: "text-white",
        },
        {
            icon: FileText,
            label: "Dokumen Dibagikan",
            value: departmentFiles.length,
            gradient:
                "from-rose-800 via-rose-700 to-rose-600",
            textColor: "text-white",
        },
    ]

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className={cn(
                        "flex items-center gap-4 rounded-xl bg-gradient-to-r p-5 shadow-md transition-transform hover:scale-[1.02]",
                        stat.gradient
                    )}
                >
                    <div
                        className={cn(
                            "rounded-lg bg-white/20 p-3",
                            stat.textColor
                        )}
                    >
                        <stat.icon className="h-6 w-6" />
                    </div>

                    <div className={stat.textColor}>
                        <p className="text-sm font-medium opacity-80">
                            {stat.label}
                        </p>

                        <p className="text-2xl font-bold">
                            {stat.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}