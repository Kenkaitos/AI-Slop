import {
    LayoutDashboard,
    Mail,
    Share2,
    Settings,
    Users,
} from "lucide-react"

export const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Mail, label: "Kotak Masuk", href: "/kotak-masuk", badge: 15 },
    { icon: Share2, label: "Berbagi Dokumen", href: "/berbagi-dokumen" },
    { icon: Settings, label: "Pengaturan", href: "/pengaturan" },
]

export const adminNavItems = [
    { icon: Users, label: "User Management", href: "/user-management" },
] 