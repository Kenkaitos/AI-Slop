import { AppSidebar } from "@/components/navigation/app-sidebar"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AppSidebar />

      <main className="flex-1 overflow-hidden">
        <div className="h-screen overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Settings
              </h1>

              <p className="mt-2 text-slate-600">
                Manage your account,
                preferences, and security
              </p>
            </div>

            {children}
          </div>
        </div>
      </main>
    </div>
  )
}