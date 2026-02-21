// @ts-nocheck

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

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
    console.log('Fetching most recent items...')

    const { data, error } = await supabase
        .from('noticias')
        .select('categoria, slug, titulo_viral, conteudo_html')
        .limit(3)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error:', error)
        return
    }

    let out = ''
    data.forEach(item => {
        out += `\n\n=== Title: ${item.titulo_viral} ===\n`
        out += item.conteudo_html
    })
    fs.writeFileSync('db_output.txt', out)
}

main()
