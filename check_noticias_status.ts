
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

async function checkNoticias() {
    console.log("📊 Verificando tabela 'noticias'...")

    // 1. Count total rows
    const { count, error: countError } = await supabase
        .from('noticias')
        .select('*', { count: 'exact', head: true })

    if (countError) {
        console.error('❌ Erro ao contar notícias:', countError.message)
    } else {
        console.log(`✅ Total de Notícias: ${count}`)
    }

    // 2. Fetch recent news to inspect structure
    const { data: recent, error: fetchError } = await supabase
        .from('noticias')
        .select('id, titulo_viral, categoria, status, agendado_para, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    if (fetchError) {
        console.error('❌ Erro ao buscar notícias recentes:', fetchError.message)
    } else {
        console.log('\n📝 Últimas 5 Notícias:')
        console.table(recent)
    }

    // 3. Inspect one full row to check for new columns
    const { data: fullRow, error: rowError } = await supabase
        .from('noticias')
        .select('*')
        .limit(1)

    if (fullRow && fullRow.length > 0) {
        console.log('\n🔍 Colunas encontradas na tabela:')
        console.log(Object.keys(fullRow[0]).join(', '))
    }
}

checkNoticias()
