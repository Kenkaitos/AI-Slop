import { Mail, Shield, Building2, Calendar } from 'lucide-react'
import { UserProfile } from '@/hooks/use-profile'

interface Props {
    profile: UserProfile
}

export function ProfileInfo({ profile }: Props) {
    return (
        <div className="rounded-lg border bg-white px-8 py-7">
            <div className="mb-8">
                <h2 className="text-xl font-semibold tracking-tight">Informasi Akun</h2>
                <p className="mt-1 text-sm text-muted-foreground">Detail akun internal Monogov</p>
            </div>

            <div className="space-y-6">
                {[
                    { icon: Mail, label: "Email", value: profile.email },
                    { icon: Shield, label: "Role", value: profile.role, className: "capitalize" },
                    { icon: Building2, label: "Workgroup", value: profile.workgroup },
                    {
                        icon: Calendar,
                        label: "Dibuat Pada",
                        value: new Date(profile.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })
                    },
                ].map(({ icon: Icon, label, value, className }) => (
                    <div key={label} className="border-t pt-6">
                        <div className="flex items-start gap-4">
                            <Icon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                    {label}
                                </p>
                                <p className={`mt-2 text-sm font-medium text-zinc-900 ${className ?? ''}`}>
                                    {value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}