'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface AnuncioRealProps {
    posicao: string
    className?: string
}

export default function AnuncioReal({ posicao, className = '' }: AnuncioRealProps) {
    const [adScript, setAdScript] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadAd() {
            try {
                // Busca anúncio ATIVO para a posição especificada
                const { data, error } = await supabase
                    .from('Config_Ads')
                    .select('codigo_script')
                    .eq('posicao', posicao)
                    .eq('ativo', true)
                    .order('updated_at', { ascending: false })
                    .limit(1)
                    .single()

                if (!error && data) {
                    setAdScript(data.codigo_script)
                }
            } catch (err) {
                console.error('Erro ao carregar anúncio:', err)
            } finally {
                setLoading(false)
            }
        }

        loadAd()
    }, [posicao])

    // Se não houver ad configurado, não renderiza nada
    if (loading || !adScript) {
        return null
    }

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: adScript }}
        />
    )
}
