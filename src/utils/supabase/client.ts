import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // Use fallbacks to prevent crashes during build or if env vars maintainence
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

    return createBrowserClient(
        supabaseUrl,
        supabaseAnonKey
    )
}
