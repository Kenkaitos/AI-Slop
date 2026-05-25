"use client"

import { useState } from "react"
import { logout } from "@/app/actions/logout"
import { LogOut } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useProfile } from "@/hooks/use-profile"

export function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const { revalidate } = useProfile()

  const handleLogout = async () => {
    setLoading(true)
    await logout()
    // no need for window.location.href anymore
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white">
          <LogOut className="h-5 w-5" />
          <span>Log out</span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm logout</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin akan logout?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleLogout}
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-700"
          >
            {loading ? "Logging out..." : "Logout"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}