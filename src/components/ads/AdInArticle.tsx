'use client';

import React, { useEffect, useRef } from 'react';
import { useAdScript } from '@/hooks/useAdScript';

export default function AdInArticle() {
    const script = useAdScript('in_article');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!script || !containerRef.current) return;
        containerRef.current.innerHTML = '';
        try {
            const fragment = document.createRange().createContextualFragment(script);
            containerRef.current.appendChild(fragment);
        } catch (error) {
            console.error('Erro injetando anúncio in_article:', error);
        }
    }, [script]);

    if (!script) {
        return null;
    }

    return (
        <div className="my-8 flex flex-col items-center">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">
                Continua após a publicidade
            </p>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden w-full max-w-[336px] min-h-[280px] flex justify-center items-center">
                <div ref={containerRef} />
            </div>
        </div>
    );
}
