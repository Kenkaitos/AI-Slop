import { AppSidebar } from "@/components/navigation/app-sidebar"
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-slate-100">
            <AppSidebar />

            <main className="flex flex-1 flex-col overflow-hidden">
                <DashboardHeader />

                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}