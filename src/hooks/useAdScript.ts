import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useAdScript(position: string) {
    const [script, setScript] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        async function fetchAd() {
            try {
                const { data, error } = await supabase
                    .from('Config_Ads')
                    .select('codigo_script')
                    .eq('posicao', position)
                    .eq('ativo', true)
                    .order('updated_at', { ascending: false })
                    .limit(1)
                    .single()

                if (!error && data) {
                    setScript(data.codigo_script)
                } else {
                    setScript(null)
                }
            } catch (error) {
                console.error(`Error fetching ad for position ${position}:`, error)
                setScript(null)
            }
        }

        fetchAd()
    }, [position])

    return script
}
