
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
    console.log('Fetching CATEGORIAS table...')

    const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('ativo', true)

    if (error) {
        console.error('Error:', error)
        return
    }

    console.log('Categories in DB:')
    data.forEach(c => {
        console.log(`ID: ${c.id} | Nome: ${c.nome} | Slug: ${c.slug}`)
    })
}

main()
