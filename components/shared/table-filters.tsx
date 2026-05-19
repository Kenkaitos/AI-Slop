"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface FilterOption {
    label: string
    value: string
}

export interface FilterConfig {
    key: string
    label: string
    options: FilterOption[]
}

interface TableFiltersProps {
    filters: FilterConfig[]
    values: Record<string, string>
    onChange: (key: string, value: string) => void
    onReset: () => void
}

export function TableFilters({ filters, values, onChange, onReset }: TableFiltersProps) {
    const [open, setOpen] = useState(false)
    const hasActive = Object.values(values).some(v => v !== "all")

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2"
            >
                <Filter className="h-4 w-4" />
                Filter
                {hasActive && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[10px] text-white">
                        {Object.values(values).filter(v => v !== "all").length}
                    </span>
                )}
            </Button>

            {open && (
                <div className="absolute right-0 z-10 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-700">Filter</p>
                        {hasActive && (
                            <button
                                onClick={() => { onReset(); setOpen(false) }}
                                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
                            >
                                <X className="h-3 w-3" />
                                Reset
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {filters.map(filter => (
                            <div key={filter.key} className="space-y-1">
                                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    {filter.label}
                                </label>
                                <select
                                    value={values[filter.key] ?? "all"}
                                    onChange={(e) => onChange(filter.key, e.target.value)}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm"
                                >
                                    <option value="all">Semua</option>
                                    {filter.options.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}