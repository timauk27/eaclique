
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

async function checkCategorias() {
    console.log("Checking 'categorias' row count...")
    const { count, error } = await supabase
        .from('categorias')
        .select('*', { count: 'exact', head: true })

    if (error) {
        console.error('Error counting categorias:', error)
    } else {
        console.log(`Categorias Count: ${count}`)
    }
}

checkCategorias()
