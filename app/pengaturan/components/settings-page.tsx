"use client"

import { useEffect, useState } from "react"

import {
    Moon,
    Palette,
    Save,
    Sun,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import { useThemeSettings } from "@/hooks/use-theme"

type ThemeType =
    | "light"
    | "dark"
    | "system"

export default function SettingsPage() {
    const {
        theme,
        setTheme,
        isLoading,
    } = useThemeSettings()

    const [
        selectedTheme,
        setSelectedTheme,
    ] = useState<ThemeType>("system")

    useEffect(() => {
        if (!theme) return

        setSelectedTheme(
            theme as
            | "light"
            | "dark"
            | "system"
        )
    }, [theme])

    const themes = [
        {
            id: "light",
            label: "Light",
            icon: Sun,
        },

        {
            id: "dark",
            label: "Dark",
            icon: Moon,
        },

        {
            id: "system",
            label: "System",
            icon: Palette,
        },
    ] as const

    async function handleSave() {
        await setTheme(selectedTheme)
    }

    return (
        <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
            <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Appearance
                </h2>

                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Customize the appearance of the
                    application
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {themes.map((item) => {
                    const Icon = item.icon

                    const active =
                        selectedTheme === item.id

                    return (
                        <button
                            key={item.id}
                            disabled={isLoading}
                            onClick={() =>
                                setSelectedTheme(item.id)
                            }
                            className={`flex flex-col items-center rounded-lg border-2 p-6 transition-all ${active
                                ? "border-blue-600 bg-blue-50 dark:bg-slate-800"
                                : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                                }`}
                        >
                            <Icon className="mb-3 h-8 w-8 text-slate-900 dark:text-white" />

                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {item.label}
                            </span>
                        </button>
                    )
                })}
            </div>

            <div className="border-t border-slate-200 pt-6 dark:border-slate-700">
                <Button
                    onClick={handleSave}
                    disabled={
                        isLoading ||
                        selectedTheme === theme
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Save className="mr-2 h-4 w-4" />
                    Save Appearance
                </Button>
            </div>
        </div>
    )
}