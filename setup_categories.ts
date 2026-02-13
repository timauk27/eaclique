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

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const CATEGORIES = [
    { nome: 'Brasil', slug: 'brasil', cor: '#16a34a' }, // green-600
    { nome: 'Mundo', slug: 'mundo', cor: '#2563eb' }, // blue-600
    { nome: 'Tech', slug: 'tech', cor: '#9333ea' }, // purple-600
    { nome: 'Games', slug: 'games', cor: '#ea580c' }, // orange-600
    { nome: 'Entretenimento', slug: 'entretenimento', cor: '#db2777' }, // pink-600
    { nome: 'Ciência', slug: 'ciencia', cor: '#0d9488' }, // teal-600
    { nome: 'Economia', slug: 'economia', cor: '#475569' }, // slate-600
    { nome: 'Esportes', slug: 'esportes', cor: '#dc2626' }, // red-600
    { nome: 'Saúde', slug: 'saude', cor: '#059669' }, // emerald-600
]

async function main() {
    console.log('Starting category setup...')

    for (const cat of CATEGORIES) {
        // Check if category exists by slug
        const { data: existing, error: checkError } = await supabase
            .from('categorias')
            .select('id')
            .eq('slug', cat.slug)
            .single()

        // If checking failed (other than not found), log it
        if (checkError && checkError.code !== 'PGRST116') {
            console.error(`Error checking category ${cat.nome}:`, checkError.message)
            continue
        }

        if (existing) {
            console.log(`Category ${cat.nome} already exists.`)
        } else {
            console.log(`Creating category ${cat.nome}...`)
            const { error: insertError } = await supabase
                .from('categorias')
                .insert({
                    nome: cat.nome,
                    slug: cat.slug,
                    cor: cat.cor,
                    ativo: true
                })

            if (insertError) {
                console.error(`Error creating category ${cat.nome}:`, insertError.message)
            } else {
                console.log(`Category ${cat.nome} created successfully.`)
            }
        }
    }

    console.log('Category setup complete.')
}

main().catch(console.error)
