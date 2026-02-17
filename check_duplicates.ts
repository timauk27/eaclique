
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8')
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=')
        if (key && value) {
            process.env[key.trim()] = value.trim()
        }
    })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    console.log('Checking for duplicate slugs in "noticias"...')

    // Fetch all slugs (this might be large, but for now ok)
    const { data, error } = await supabase
        .from('noticias')
        .select('slug, id')

    if (error) {
        console.error('Error:', error)
        return
    }

    const slugCounts: Record<string, number> = {}

    data.forEach(item => {
        const s = item.slug
        slugCounts[s] = (slugCounts[s] || 0) + 1
    })

    const duplicates = Object.entries(slugCounts).filter(([slug, count]) => count > 1)

    if (duplicates.length > 0) {
        console.log(`Found ${duplicates.length} duplicate slugs!`)
        duplicates.forEach(([slug, count]) => {
            console.log(`${slug}: ${count} occurrences`)
        })
    } else {
        console.log('No duplicate slugs found.')
    }
}

main()
