import { AppSidebar } from "@/components/navigation/app-sidebar"

export default function SharedLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-100">
            <AppSidebar />
            <main className="flex-1 overflow-hidden">
                <div className="h-screen overflow-y-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}