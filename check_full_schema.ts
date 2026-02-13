
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

async function checkTables() {
    console.log("Checking 'noticias' columns...")
    const { data: noticiasData, error: noticiasError } = await supabase
        .from('noticias')
        .select('*')
        .limit(1)

    if (noticiasError) console.error('Error Noticias:', noticiasError)
    else console.log('Noticias Columns:', noticiasData && noticiasData.length > 0 ? Object.keys(noticiasData[0]) : 'No rows found to infer columns')

    console.log("\nChecking 'categorias' columns...")
    const { data: categoriasData, error: categoriasError } = await supabase
        .from('categorias')
        .select('*')
        .limit(1)

    if (categoriasError) console.error('Error Categorias:', categoriasError)
    else console.log('Categorias Columns:', categoriasData && categoriasData.length > 0 ? Object.keys(categoriasData[0]) : 'No rows found to infer columns')
}

checkTables()
