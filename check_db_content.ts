
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
    console.log('Fetching distinct categories from "noticias"...')

    const { data, error } = await supabase
        .from('noticias')
        .select('categoria, slug, titulo_viral')
        .limit(100)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error:', error)
        return
    }

    const categories = new Set()
    const samples = []

    data.forEach(item => {
        categories.add(item.categoria)
        if (samples.length < 5) samples.push(item)
    })

    console.log('Unique Categories found in DB:')
    console.log(Array.from(categories))

    console.log('\nSample Items (Slug validation):')
    samples.forEach(s => {
        console.log(`Title: ${s.titulo_viral}`)
        console.log(`Cat: ${s.categoria}`)
        console.log(`Slug: ${s.slug}`)
        console.log('---')
    })
}

main()
