"use client"

import DashboardSection from "@/app/dashboard/components/dashboard-section"
import { useFiles } from "@/hooks/use-files"

export default function DashboardPage() {
    const data = useFiles()
    return <DashboardSection {...data} />
}