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

const supabase = createClient(supabaseUrl!, supabaseKey!)

async function check() {
    try {
        const { data, error } = await supabase.from('noticias').select('*').limit(1);
        if (error) throw error;
        if (data && data.length > 0) {
            console.log("Columns of 'noticias':", Object.keys(data[0]));
        }

        const { data: catData, error: catError } = await supabase.from('categorias').select('*');
        if (catError) throw catError;
        console.log("Categorias:", catData.map((c: any) => ({ id: c.id, nome: c.nome, parent_id: c.parent_id })));
    } catch (e) {
        console.error(e);
    }
}
check();
