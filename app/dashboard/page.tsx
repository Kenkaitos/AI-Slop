"use client"

import DashboardSection from "@/components/dashboard/dashboard-section"
import { useFiles } from "@/hooks/use-files"

export default function DashboardPage() {
    const data = useFiles()
    return <DashboardSection {...data} />
}