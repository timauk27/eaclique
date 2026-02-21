import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-url.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    // list columns
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
