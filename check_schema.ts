
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

async function checkSchema() {
    const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .limit(1)

    if (error) {
        console.error('Error:', error)
    } else {
        // Get headers/keys from the first row
        const keys = data && data.length > 0 ? Object.keys(data[0]) : []
        console.log('Columns found:', keys)

        // Check for specific columns
        const hasStatus = keys.includes('status')
        const hasPublishAt = keys.includes('publish_at') || keys.includes('agendado_para')

        console.log('Has Status:', hasStatus)
        console.log('Has Publish Date:', hasPublishAt)
    }
}

checkSchema()
