import { AlertCircle } from "lucide-react"

interface FieldErrorProps {
    message?: string
}

export function FieldError({ message }: FieldErrorProps) {
    if (!message) return null
    return (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {message}
        </p>
    )
}