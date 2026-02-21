'use client';

import React, { useEffect, useRef } from 'react';
import { useAdScript } from '@/hooks/useAdScript';

export default function AdBillboard() {
    const script = useAdScript('billboard');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!script || !containerRef.current) return;
        containerRef.current.innerHTML = '';
        try {
            const fragment = document.createRange().createContextualFragment(script);
            containerRef.current.appendChild(fragment);
        } catch (error) {
            console.error('Erro ao injetar anúncio billboard:', error);
        }
    }, [script]);

    if (!script) {
        return null;
    }

    return (
        <div className="w-full flex justify-center my-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden" style={{ minWidth: '300px', minHeight: '50px' }}>
                <div className="text-xs text-slate-400 text-center py-1 border-b border-slate-200 dark:border-slate-700">
                    PUBLICIDADE
                </div>
                <div ref={containerRef} className="flex justify-center" />
            </div>
        </div>
    );
}
