'use client'

import { useAdScript } from '@/hooks/useAdScript'

interface AnuncioRealProps {
    posicao: string
    className?: string
}

export default function AnuncioReal({ posicao, className = '' }: AnuncioRealProps) {
    const script = useAdScript(posicao)

    if (!script) {
        return null
    }

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: script }}
        />
    )
}


