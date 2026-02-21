'use client'

import React, { useEffect, useRef } from 'react'
import { useAdScript } from '@/hooks/useAdScript'

interface AdManagerProps {
    posicao: string
    className?: string
}

export default function AdManager({ posicao, className = '' }: AdManagerProps) {
    const script = useAdScript(posicao)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!script || !containerRef.current) return

        // Limpa o container antes de injetar novamente (útil em navegações client-side)
        containerRef.current.innerHTML = ''

        try {
            // Cria um DocumentFragment contextual a partir da string HTML de anúncio
            // Isso permite que as tags <script> dentro da string sejam de fato compiladas e acionadas na DOM
            const fragment = document.createRange().createContextualFragment(script)
            containerRef.current.appendChild(fragment)
        } catch (error) {
            console.error(`Errou ao injetar anúncio em ${posicao}:`, error)
        }
    }, [script, posicao])

    if (!script) {
        return null
    }

    return (
        <div ref={containerRef} className={`ad-manager ${className}`} />
    )
}
