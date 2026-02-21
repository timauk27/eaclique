'use client'

import React, { useEffect, useRef } from 'react'
import { useAdScript } from '@/hooks/useAdScript'

interface AnuncioRealProps {
    posicao: string
    className?: string
}

export default function AnuncioReal({ posicao, className = '' }: AnuncioRealProps) {
    const script = useAdScript(posicao)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!script || !containerRef.current) return;
        containerRef.current.innerHTML = '';
        try {
            const fragment = document.createRange().createContextualFragment(script);
            containerRef.current.appendChild(fragment);
        } catch (error) {
            console.error(`Erro injetando anúncio em ${posicao}:`, error);
        }
    }, [script, posicao])

    if (!script) {
        return null
    }

    return (
        <div ref={containerRef} className={className} />
    )
}

