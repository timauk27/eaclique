// @ts-nocheck

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

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function main() {
    console.log('Checking categories in DB...')
    const { data: categories, error } = await supabase.from('categorias').select('*')

    if (error) {
        console.error('Error fetching categories:', error)
    } else {
        console.log(`Found ${categories?.length} categories:`)
        categories?.forEach(c => console.log(`- [${c.id}] ${c.nome} (slug: ${c.slug})`))
    }
}

main()
