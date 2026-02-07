import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCategories() {
    // Get distinct categories
    const { data, error } = await supabase
        .from('Noticias')
        .select('categoria')
        .limit(100)

    if (error) {
        console.error('Error:', error)
        return
    }

    // Get unique categories
    const categories = [...new Set(data.map(n => n.categoria))].filter(Boolean)

    console.log('Categories found in database:')
    categories.forEach(cat => console.log(`- ${cat}`))

    // Count per category
    console.log('\nCount per category:')
    const counts: Record<string, number> = {}
    data.forEach(n => {
        if (n.categoria) {
            counts[n.categoria] = (counts[n.categoria] || 0) + 1
        }
    })

    Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
        console.log(`${cat}: ${count}`)
    })
}

checkCategories()
