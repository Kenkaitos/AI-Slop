// app/api/debug/route.ts
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    return NextResponse.json({ 
        user: user?.id ?? null, 
        error: error?.message ?? null 
    })
}