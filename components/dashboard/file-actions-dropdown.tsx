"use client"

import {
    Eye,
    Download,
    Pencil,
    MoreVertical,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DashboardFile } from "./types"

interface FileActionsDropdownProps {
    file: DashboardFile
}

export default function FileActionsDropdown({
    file,
}: FileActionsDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                >
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() =>
                        window.open(file.url, "_blank")
                    }
                >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() =>
                        window.open(file.url, "_blank")
                    }
                >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => {
                        const newName = prompt(
                            "Nama baru:",
                            file.name
                        )

                        if (newName) {
                            console.log(
                                "Rename:",
                                file.id,
                                newName
                            )
                        }
                    }}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Rename
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}