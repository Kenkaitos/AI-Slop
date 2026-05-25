import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/middleware"

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname.startsWith("/login")) {
        return NextResponse.next()
    }

    const { supabase, supabaseResponse } = createClient(request)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        // For API routes, return 401 instead of redirecting
        if (pathname.startsWith("/api")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!login|_next/static|_next/image|favicon.ico|[^/]*\\.[^/]*$).*)",
  ]
}