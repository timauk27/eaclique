import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wgtritvydqrijiziloqy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndHJpdHZ5ZHFyaWppemlsb3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTMyMjIsImV4cCI6MjA4NTEyOTIyMn0.zT4r43gy0K5hI60ESqYPrstnqkVo1QZ841bpQDvmrLs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    const { data, error } = await supabase.from('autores').select('*').limit(1)
    if (error) {
        console.error("Error:", error)
    } else {
        console.log("Autores table exists. Columns:", data.length > 0 ? Object.keys(data[0]) : "Empty table")
    }
}

main()
